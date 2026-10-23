"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireShopAdmin } from "@/lib/shop-session";
import { getOfficialProduct } from "@/lib/official-catalog";

function value(form: FormData, key: string) { return String(form.get(key) ?? "").trim(); }
function number(form: FormData, key: string) { return Number(value(form, key)); }
function message(text: string) { redirect(`/admin?mensaje=${encodeURIComponent(text)}`); }
class ActionRejected extends Error {}

export async function updateInventory(form: FormData) {
  const session = await requireShopAdmin();
  const variantKey = value(form, "variantKey");
  const units = number(form, "units");
  const price = number(form, "price");
  if (!variantKey || !Number.isInteger(units) || units < 0 || units > 9999 || !Number.isInteger(price) || price < 1 || price > 1000000) message("Revisa las unidades y el precio.");
  const client = await db().connect();
  let rejection = "";
  try {
    await client.query("begin");
    const previous = await client.query<{ stock_on_hand: number; price_clp: number }>("select stock_on_hand,price_clp from shop_inventory where variant_key=$1 for update", [variantKey]);
    if (!previous.rowCount) throw new ActionRejected("Esa talla ya no existe.");
    await client.query("update shop_inventory set stock_on_hand=$2,price_clp=$3,updated_at=now() where variant_key=$1", [variantKey, units, price]);
    await client.query("insert into shop_stock_movements(variant_key,before_units,after_units,actor_id) values($1,$2,$3,$4)", [variantKey, previous.rows[0].stock_on_hand, units, session.user.id]);
    await client.query("insert into shop_audit_logs(actor_id,action,entity_id,before_data,after_data) values($1,'inventory.update',$2,$3,$4)", [session.user.id, variantKey, previous.rows[0], { stock_on_hand: units, price_clp: price }]);
    await client.query("commit");
  } catch (error) { await client.query("rollback"); if (error instanceof ActionRejected) rejection = error.message; else throw error; }
  finally { client.release(); }
  if (rejection) message(rejection);
  revalidatePath("/admin"); revalidatePath("/", "layout");
  message("Stock y precio actualizados.");
}

export async function addInventoryVariant(form: FormData) {
  const session = await requireShopAdmin();
  const slug = value(form, "slug");
  const size = value(form, "size");
  const design = value(form, "design");
  const units = number(form, "units");
  const price = number(form, "price");
  if (!getOfficialProduct(slug) || !size || size.length > 20 || design.length > 80 || !Number.isInteger(units) || units < 0 || units > 9999 || !Number.isInteger(price) || price < 1 || price > 1000000) message("Revisa el producto, talla, stock y precio.");
  const variantKey = JSON.stringify([slug, size, design]);
  try {
    await db().query("insert into shop_inventory(variant_key,product_slug,size,design,price_clp,stock_on_hand) values($1,$2,$3,$4,$5,$6)", [variantKey, slug, size, design, price, units]);
    await db().query("insert into shop_audit_logs(actor_id,action,entity_id,after_data) values($1,'inventory.create',$2,$3)", [session.user.id, variantKey, { stock_on_hand: units, price_clp: price }]);
  } catch { message("Esa combinación de producto, talla y diseño ya existe."); }
  revalidatePath("/admin"); revalidatePath("/", "layout");
  message("Nueva talla agregada.");
}

export async function updateOrderStatus(form: FormData) {
  const session = await requireShopAdmin();
  const orderId = value(form, "orderId");
  const status = value(form, "status");
  if (!/^[0-9a-f-]{36}$/i.test(orderId) || !["PREPARING", "READY", "SHIPPED", "DELIVERED", "CANCELLED"].includes(status)) message("Estado no permitido.");
  const client = await db().connect();
  let rejection = "";
  try {
    await client.query("begin");
    const previous = await client.query<{ status: string; payment_status: string }>("select status,payment_status from shop_orders where id=$1 for update", [orderId]);
    if (!previous.rowCount) throw new ActionRejected("Pedido no encontrado.");
    if (status !== "CANCELLED" && previous.rows[0].payment_status !== "PAID") throw new ActionRejected("Solo se puede preparar o enviar un pedido con pago confirmado.");
    if (status === "CANCELLED" && previous.rows[0].payment_status === "PAID") throw new ActionRejected("Reembolsa el cobro en Mercado Pago antes de cancelar el pedido.");
    if (status === "CANCELLED" && previous.rows[0].payment_status === "PENDING") throw new ActionRejected("El pago aún puede confirmarse. Espera a que venza la reserva.");
    await client.query("update shop_orders set status=$2,updated_at=now() where id=$1", [orderId, status]);
    await client.query("insert into shop_audit_logs(actor_id,action,entity_id,before_data,after_data) values($1,'order.status',$2,$3,$4)", [session.user.id, orderId, previous.rows[0], { status }]);
    await client.query("commit");
  } catch (error) { await client.query("rollback"); if (error instanceof ActionRejected) rejection = error.message; else throw error; }
  finally { client.release(); }
  if (rejection) message(rejection);
  revalidatePath("/admin");
  message("Estado del pedido actualizado.");
}

export async function createCoupon(form: FormData) {
  const session = await requireShopAdmin();
  const code = value(form, "code").toUpperCase();
  const kind = value(form, "kind");
  const amount = number(form, "amount");
  const minimum = number(form, "minimum");
  const limit = value(form, "limit") ? number(form, "limit") : null;
  if (!/^[A-Z0-9_-]{3,32}$/.test(code) || !["PERCENT", "FIXED"].includes(kind) || !Number.isInteger(amount) || amount < 1 || (kind === "PERCENT" && amount > 100) || !Number.isInteger(minimum) || minimum < 0 || (limit !== null && (!Number.isInteger(limit) || limit < 1))) message("Revisa los datos del cupón.");
  try {
    await db().query("insert into shop_coupons(code,kind,amount,minimum_clp,usage_limit,active) values($1,$2,$3,$4,$5,false)", [code, kind, amount, minimum, limit]);
    await db().query("insert into shop_audit_logs(actor_id,action,entity_id,after_data) values($1,'coupon.create',$2,$3)", [session.user.id, code, { kind, amount, minimum, limit }]);
  } catch { message("Ese código ya existe."); }
  revalidatePath("/admin");
  message("Cupón creado desactivado. Puedes activarlo cuando el pago esté disponible.");
}

export async function toggleCoupon(form: FormData) {
  const session = await requireShopAdmin();
  const code = value(form, "code");
  const active = value(form, "active") === "true";
  if (!/^[A-Z0-9_-]{3,32}$/.test(code)) message("Código inválido.");
  // Activation waits for real checkout so a discount cannot be advertised without a payment flow.
  if (active && process.env.ENABLE_PAID_CHECKOUT !== "true") message("Activa primero el pago real para habilitar descuentos.");
  await db().query("update shop_coupons set active=$2,updated_at=now() where code=$1", [code, active]);
  await db().query("insert into shop_audit_logs(actor_id,action,entity_id,after_data) values($1,'coupon.toggle',$2,$3)", [session.user.id, code, { active }]);
  revalidatePath("/admin");
  message(active ? "Cupón activado." : "Cupón desactivado.");
}
