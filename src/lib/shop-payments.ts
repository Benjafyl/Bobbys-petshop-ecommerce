import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { getOfficialProduct } from "@/lib/official-catalog";
import { createPreference, searchOrderPayments, type MpPayment } from "@/lib/mercadopago";
import { deliveryFeeClp, PICKUP_ADDRESS, PICKUP_CITY, PICKUP_REGION, type DeliveryMethod } from "@/lib/shipping";
import { sendPendingOrderNotifications } from "@/lib/shop-mail";

export class CheckoutRejected extends Error {}

type CheckoutInput = {
  givenName: string;
  familyName: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  address: string;
  addressExtra: string;
  city: string;
  region: string;
  couponCode: string;
  cart: { variantId: string; quantity: number }[];
  userId?: string | null;
};

const clean = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";

export function parseCheckoutInput(value: unknown): CheckoutInput {
  if (!value || typeof value !== "object") throw new CheckoutRejected("Revisa los datos de entrega.");
  const body = value as Record<string, unknown>;
  if (body.deliveryMethod !== "shipping" && body.deliveryMethod !== "pickup") throw new CheckoutRejected("Elige envío o retiro antes de pagar.");
  const input: CheckoutInput = {
    givenName: clean(body.givenName, 80), familyName: clean(body.familyName, 80),
    email: clean(body.email, 254).toLowerCase(), phone: clean(body.phone, 40),
    deliveryMethod: body.deliveryMethod,
    address: clean(body.address, 180), addressExtra: clean(body.addressExtra, 180),
    city: clean(body.city, 100), region: clean(body.region, 100),
    couponCode: clean(body.couponCode, 32).toUpperCase(), cart: [],
  };
  if (!input.givenName || !input.familyName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) || !input.phone) throw new CheckoutRejected("Completa nombre, correo y teléfono.");
  if (input.deliveryMethod === "shipping" && (!input.address || !input.city || !input.region)) throw new CheckoutRejected("Completa la dirección para el envío.");
  if (input.deliveryMethod === "pickup") {
    input.address = PICKUP_ADDRESS;
    input.addressExtra = "";
    input.city = PICKUP_CITY;
    input.region = PICKUP_REGION;
  }
  if (!Array.isArray(body.cart) || body.cart.length < 1 || body.cart.length > 30) throw new CheckoutRejected("Revisa tu carrito.");
  const seen = new Set<string>();
  for (const entry of body.cart) {
    if (!entry || typeof entry !== "object") throw new CheckoutRejected("Revisa tu carrito.");
    const item = entry as Record<string, unknown>;
    if (typeof item.variantId !== "string" || item.variantId.length > 200 || !Number.isInteger(item.quantity) || Number(item.quantity) < 1 || Number(item.quantity) > 20 || seen.has(item.variantId)) throw new CheckoutRejected("Revisa las cantidades del carrito.");
    seen.add(item.variantId);
    input.cart.push({ variantId: item.variantId, quantity: Number(item.quantity) });
  }
  if (input.couponCode && !/^[A-Z0-9_-]{3,32}$/.test(input.couponCode)) throw new CheckoutRejected("El código de descuento no es válido.");
  return input;
}

export async function createCheckout(input: CheckoutInput) {
  const client = await db().connect();
  const orderId = randomUUID();
  const orderNumber = `BPS-${Date.now().toString(36).toUpperCase()}-${orderId.slice(0, 6).toUpperCase()}`;
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  try {
    await client.query("begin");
    const inventory = await client.query<{ variant_key: string; product_slug: string; size: string; design: string; price_clp: number; stock_on_hand: number }>(
      "select variant_key,product_slug,size,design,price_clp,stock_on_hand from shop_inventory where active=true and variant_key=any($1::text[]) order by variant_key for update",
      [input.cart.map((item) => item.variantId)],
    );
    if (inventory.rows.length !== input.cart.length) throw new CheckoutRejected("Una prenda ya no está disponible. Actualiza el carrito.");
    const quantities = new Map(input.cart.map((item) => [item.variantId, item.quantity]));
    for (const item of inventory.rows) {
      if (!getOfficialProduct(item.product_slug) || item.stock_on_hand < quantities.get(item.variant_key)!) throw new CheckoutRejected("No quedan suficientes unidades de una prenda. Actualiza el carrito.");
    }
    const subtotal = inventory.rows.reduce((sum, item) => sum + item.price_clp * quantities.get(item.variant_key)!, 0);
    let discount = 0;
    if (input.couponCode) {
      const result = await client.query<{ kind: string; amount: number; minimum_clp: number; usage_limit: number | null; used_count: number }>(
        "select kind,amount,minimum_clp,usage_limit,used_count from shop_coupons where code=$1 and active=true and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now()) for update", [input.couponCode],
      );
      const coupon = result.rows[0];
      if (!coupon || subtotal < coupon.minimum_clp || (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit)) throw new CheckoutRejected("Ese descuento ya no está disponible.");
      if (coupon.usage_limit !== null) {
        const held = await client.query<{ count: string }>("select count(*)::text as count from shop_orders where discount_code=$1 and payment_status='PENDING' and reservation_released_at is null and reservation_expires_at > now()", [input.couponCode]);
        if (coupon.used_count + Number(held.rows[0].count) >= coupon.usage_limit) throw new CheckoutRejected("Ese descuento ya no está disponible.");
      }
      discount = Math.min(subtotal, coupon.kind === "PERCENT" ? Math.floor(subtotal * coupon.amount / 100) : coupon.amount);
    }
    const shippingClp = deliveryFeeClp(input.deliveryMethod);
    const total = subtotal + shippingClp - discount;
    await client.query(`insert into shop_orders(id,order_number,user_id,customer_name,customer_email,customer_phone,delivery_address,delivery_city,delivery_region,delivery_method,subtotal_clp,shipping_clp,discount_clp,discount_code,reservation_expires_at,payment_method,stock_reserved_at_checkout)
      values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'Mercado Pago',false)`,
      [orderId, orderNumber, input.userId ?? null, `${input.givenName} ${input.familyName}`, input.email, input.phone,
        [input.address, input.addressExtra].filter(Boolean).join(", "), input.city, input.region, input.deliveryMethod, subtotal, shippingClp, discount, input.couponCode || null, expiresAt]);
    for (const item of inventory.rows) {
      const quantity = quantities.get(item.variant_key)!;
      const name = getOfficialProduct(item.product_slug)!.name;
      await client.query("insert into shop_order_items(order_id,variant_key,product_name,size,design,quantity,unit_price_clp) values($1,$2,$3,$4,$5,$6,$7)", [orderId, item.variant_key, name, item.size, item.design, quantity, item.price_clp]);
    }
    const preference = await createPreference({ orderId, orderNumber, givenName: input.givenName, familyName: input.familyName, email: input.email, total, expiresAt });
    await client.query("update shop_orders set payment_preference_id=$2 where id=$1", [orderId, preference.id]);
    await client.query("commit");
    return { orderId, orderNumber, checkoutUrl: preference.url };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally { client.release(); }
}

export async function recordVerifiedPayment(payment: MpPayment) {
  if (!payment.external_reference || !/^[0-9a-f-]{36}$/i.test(payment.external_reference)) return false;
  const client = await db().connect();
  try {
    await client.query("begin");
    const result = await client.query<{ id: string; order_number: string; total_clp: number; payment_status: string; reservation_released_at: Date | null; stock_reserved_at_checkout: boolean; discount_code: string | null }>(
      "select id,order_number,total_clp,payment_status,reservation_released_at,stock_reserved_at_checkout,discount_code from shop_orders where id=$1 for update", [payment.external_reference],
    );
    const order = result.rows[0];
    if (!order || payment.currency_id !== "CLP" || Number(payment.transaction_amount) !== order.total_clp) { await client.query("rollback"); return false; }
    if (payment.status === "approved" && (order.payment_status === "PENDING" || order.payment_status === "FAILED")) {
      let stockIssue = false;
      if (!order.stock_reserved_at_checkout || order.reservation_released_at) {
        const items = await client.query<{ variant_key: string; quantity: number }>(
          "select variant_key,sum(quantity)::integer as quantity from shop_order_items where order_id=$1 group by variant_key order by variant_key", [order.id],
        );
        for (const item of items.rows) {
          const inventory = await client.query<{ stock_on_hand: number }>("select stock_on_hand from shop_inventory where variant_key=$1 for update", [item.variant_key]);
          const before = inventory.rows[0]?.stock_on_hand;
          if (before === undefined || before < item.quantity) { stockIssue = true; continue; }
          await client.query("update shop_inventory set stock_on_hand=stock_on_hand-$2,updated_at=now() where variant_key=$1", [item.variant_key, item.quantity]);
          await client.query("insert into shop_stock_movements(variant_key,before_units,after_units,reason) values($1,$2,$3,$4)", [item.variant_key, before, before - item.quantity, `Pago confirmado ${order.order_number}`]);
        }
      }
      await client.query(`update shop_orders set payment_status='PAID',status='PAID',payment_reference=$2,payment_method=$3,paid_at=now(),updated_at=now(),stock_issue=$4,notes=case when $4 then notes || ' Stock insuficiente al confirmar el pago: resolver en administración.' else notes end where id=$1`,
        [order.id, String(payment.id), `Mercado Pago${payment.payment_method_id ? ` · ${payment.payment_method_id}` : ""}`, stockIssue]);
      if (order.discount_code) await client.query("update shop_coupons set used_count=used_count+1,updated_at=now() where code=$1", [order.discount_code]);
      await client.query("insert into shop_audit_logs(action,entity_id,after_data) values('payment.approved',$1,$2)", [order.id, { paymentId: String(payment.id) }]);
      await client.query("insert into shop_order_notifications(order_id) values($1) on conflict do nothing", [order.id]);
    } else if (payment.status === "refunded" && order.payment_status === "PAID") {
      await client.query("update shop_orders set payment_status='REFUNDED',status='REFUNDED',updated_at=now() where id=$1", [order.id]);
    }
    await client.query("commit");
    try { await sendPendingOrderNotifications(); } catch { /* El pago ya quedó registrado; el correo puede reintentarse. */ }
    return true;
  } catch (error) { await client.query("rollback"); throw error; }
  finally { client.release(); }
}

export async function releaseExpiredReservations() {
  const expired = await db().query<{ id: string }>("select id from shop_orders where payment_status='PENDING' and reservation_released_at is null and reservation_expires_at < now() - interval '24 hours' order by reservation_expires_at limit 5");
  for (const { id } of expired.rows) {
    const payments = await searchOrderPayments(id);
    for (const payment of payments) await recordVerifiedPayment(payment);
    if (payments.some((payment) => ["approved", "pending", "in_process", "authorized"].includes(payment.status))) continue;
    const client = await db().connect();
    try {
      await client.query("begin");
      const order = await client.query<{ id: string; order_number: string; stock_reserved_at_checkout: boolean }>("select id,order_number,stock_reserved_at_checkout from shop_orders where id=$1 and payment_status='PENDING' and reservation_released_at is null and reservation_expires_at < now() - interval '24 hours' for update", [id]);
      if (order.rows[0]) {
        if (order.rows[0].stock_reserved_at_checkout) {
          const items = await client.query<{ variant_key: string; quantity: number }>("select variant_key,quantity from shop_order_items where order_id=$1", [id]);
          for (const item of items.rows) {
            const restored = await client.query<{ stock_on_hand: number }>("update shop_inventory set stock_on_hand=stock_on_hand+$2,updated_at=now() where variant_key=$1 returning stock_on_hand", [item.variant_key, item.quantity]);
            if (restored.rows[0]) {
              const after = restored.rows[0].stock_on_hand;
              await client.query("insert into shop_stock_movements(variant_key,before_units,after_units,reason) values($1,$2,$3,$4)", [item.variant_key, after - item.quantity, after, `Reserva vencida ${order.rows[0].order_number}`]);
            }
          }
        }
        await client.query("update shop_orders set reservation_released_at=now(),payment_status='FAILED',status='CANCELLED',updated_at=now() where id=$1", [id]);
        await client.query("insert into shop_audit_logs(action,entity_id) values('order.reservation.expired',$1)", [id]);
      }
      await client.query("commit");
    } catch (error) { await client.query("rollback"); throw error; }
    finally { client.release(); }
  }
}
