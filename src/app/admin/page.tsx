import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { addInventoryVariant, createCoupon, toggleCoupon, updateInventory, updateOrderStatus } from "@/app/admin/actions";
import { db, dbConfigured } from "@/lib/db";
import { currentShopAdmin } from "@/lib/shop-session";
import { getOfficialProduct, officialProducts } from "@/lib/official-catalog";
import { formatClp } from "@/lib/public-inventory";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Administración", robots: { index: false, follow: false } };

type InventoryRow = { variant_key: string; product_slug: string; size: string; design: string; price_clp: number; stock_on_hand: number };
type OrderRow = { id: string; order_number: string; customer_name: string; customer_email: string; delivery_address: string; delivery_city: string; delivery_region: string; delivery_method: "shipping" | "pickup"; status: string; payment_status: string; payment_method: string | null; total_clp: number; created_at: Date };
type CouponRow = { code: string; kind: string; amount: number; minimum_clp: number; usage_limit: number | null; used_count: number; active: boolean };
type CustomerRow = { id: string; name: string; email: string; createdAt: Date; orders: string };
type AuditRow = { action: string; entity_id: string; created_at: Date };

const card = "rounded-xl border border-[#E5DED4] bg-white p-5 shadow-sm";
const field = "w-full rounded-md border border-[#D8CEC1] px-3 py-2 text-sm";
const button = "rounded-md bg-[#243C3A] px-4 py-2 text-sm font-bold text-white hover:bg-[#31514E]";
const statusLabel: Record<string, string> = { PENDING: "Pendiente", PAID: "Pagado", PREPARING: "Preparando", READY: "Listo", SHIPPED: "Enviado", DELIVERED: "Entregado", CANCELLED: "Cancelado", REFUNDED: "Reembolsado" };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ mensaje?: string }> }) {
  if (!dbConfigured() || !process.env.BETTER_AUTH_SECRET) notFound();
  const admin = await currentShopAdmin();
  if (!admin) notFound();
  const [inventoryResult, ordersResult, couponResult, customerResult, auditResult, statsResult] = await Promise.all([
    db().query<InventoryRow>("select variant_key,product_slug,size,design,price_clp,stock_on_hand from shop_inventory order by product_slug,size,design"),
    db().query<OrderRow>("select id,order_number,customer_name,customer_email,delivery_address,delivery_city,delivery_region,delivery_method,status,payment_status,payment_method,total_clp,created_at from shop_orders order by created_at desc limit 100"),
    db().query<CouponRow>("select code,kind,amount,minimum_clp,usage_limit,used_count,active from shop_coupons order by created_at desc limit 100"),
    db().query<CustomerRow>(`select u.id,u.name,u.email,u."createdAt",count(o.id)::text as orders from "user" u left join shop_orders o on o.user_id=u.id group by u.id order by u."createdAt" desc limit 100`),
    db().query<AuditRow>("select action,entity_id,created_at from shop_audit_logs order by created_at desc limit 20"),
    db().query<{ orders: string; pending: string; paid: string; units: string }>("select (select count(*) from shop_orders)::text orders,(select count(*) from shop_orders where status='PENDING')::text pending,(select count(*) from shop_orders where payment_status='PAID')::text paid,(select coalesce(sum(stock_on_hand),0) from shop_inventory)::text units"),
  ]);
  const inventory = inventoryResult.rows;
  const orders = ordersResult.rows;
  const coupons = couponResult.rows;
  const customers = customerResult.rows;
  const audits = auditResult.rows;
  const stats = statsResult.rows[0];
  const { mensaje } = await searchParams;

  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B6633A]">Acceso de Antonela Rodil</p>
    <h1 className="mt-2 text-4xl font-black">Panel de administración</h1>
    <p className="mt-2 text-[#52615D]">Pedidos, tallas, stock y promociones de Bobby&apos;s Pet Shop.</p>
    {mensaje && <p role="status" className="mt-5 rounded-md bg-[#EAF3EB] p-4 text-sm font-bold text-[#245C43]">{mensaje}</p>}
    <nav aria-label="Secciones del panel" className="mt-7 flex flex-wrap gap-2 text-sm font-bold">{[["pedidos","Pedidos"],["inventario","Inventario"],["cupones","Cupones"],["clientes","Clientes"],["actividad","Actividad"]].map(([id,label]) => <a key={id} href={`#${id}`} className="rounded-full border border-[#D8CEC1] bg-white px-4 py-2 hover:border-[#B6633A]">{label}</a>)}</nav>
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Pedidos",stats.orders],["Pendientes",stats.pending],["Pagos confirmados",stats.paid],["Unidades en stock",stats.units]].map(([label,number]) => <article key={label} className={card}><p className="text-sm text-[#52615D]">{label}</p><p className="mt-1 text-3xl font-black">{number}</p></article>)}</div>

    <section id="pedidos" className="scroll-mt-28 pt-12"><h2 className="text-3xl font-black">Pedidos</h2><p className="mt-2 text-sm text-[#52615D]">El estado de pago solo lo podrá confirmar la integración del proveedor. Aquí puedes gestionar la preparación, el envío o el retiro.</p>
      {orders.length ? <div className="mt-5 space-y-4">{orders.map((order) => <article key={order.id} className={card}><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-black">#{order.order_number} · {order.customer_name}</h3><p className="text-sm text-[#52615D]">{order.customer_email} · {new Date(order.created_at).toLocaleString("es-CL")}</p><p className="mt-2 text-sm"><strong>{order.delivery_method === "pickup" ? "Retiro" : "Envío"}:</strong> {order.delivery_address}, {order.delivery_city}, {order.delivery_region}</p></div><div className="text-right"><strong>{formatClp(order.total_clp)}</strong><p className="text-sm">{statusLabel[order.status] ?? order.status} · Pago: {order.payment_status}</p></div></div><form action={updateOrderStatus} className="mt-4 flex flex-wrap items-center gap-2"><input type="hidden" name="orderId" value={order.id} /><label className="text-sm font-bold" htmlFor={`status-${order.id}`}>Cambiar estado</label><select id={`status-${order.id}`} name="status" className={field + " max-w-56"} defaultValue="PREPARING"><option value="PREPARING">Preparando</option><option value="READY">Listo</option>{order.delivery_method === "shipping" && <option value="SHIPPED">Enviado</option>}<option value="DELIVERED">{order.delivery_method === "pickup" ? "Retirado" : "Entregado"}</option><option value="CANCELLED">Cancelado</option></select><button className={button}>Guardar</button></form></article>)}</div> : <p className={card + " mt-5 text-[#52615D]"}>Todavía no hay pedidos.</p>}
    </section>

    <section id="inventario" className="scroll-mt-28 pt-12"><h2 className="text-3xl font-black">Inventario</h2><p className="mt-2 text-sm text-[#52615D]">Ajusta las unidades reales de cada talla. Cero unidades marca la opción como agotada.</p><div className="mt-5 grid gap-3 lg:grid-cols-2">{inventory.map((item) => <form key={item.variant_key} action={updateInventory} className={card + " flex flex-wrap items-end gap-3"}><input type="hidden" name="variantKey" value={item.variant_key} /><div className="min-w-48 flex-1"><strong>{getOfficialProduct(item.product_slug)?.name ?? item.product_slug}</strong><p className="text-sm text-[#52615D]">Talla {item.size}{item.design ? ` · ${item.design}` : ""}</p></div><label className="w-24 text-xs font-bold">Unidades<input name="units" type="number" min="0" max="9999" defaultValue={item.stock_on_hand} className={field + " mt-1"} required /></label><label className="w-28 text-xs font-bold">Precio CLP<input name="price" type="number" min="1" max="1000000" defaultValue={item.price_clp} className={field + " mt-1"} required /></label><button className={button}>Guardar</button></form>)}</div>
      <form action={addInventoryVariant} className={card + " mt-6 grid gap-3 md:grid-cols-5"}><div className="md:col-span-5"><h3 className="text-xl font-black">Agregar otra talla o diseño</h3><p className="text-sm text-[#52615D]">Para un producto que ya aparece en la tienda.</p></div><label className="text-xs font-bold">Producto<select name="slug" className={field + " mt-1"}>{officialProducts.map((product) => <option key={product.slug} value={product.slug}>{product.name}</option>)}</select></label><label className="text-xs font-bold">Talla<input name="size" className={field + " mt-1"} maxLength={20} required /></label><label className="text-xs font-bold">Diseño (opcional)<input name="design" className={field + " mt-1"} maxLength={80} /></label><label className="text-xs font-bold">Unidades<input name="units" type="number" min="0" max="9999" className={field + " mt-1"} required /></label><label className="text-xs font-bold">Precio CLP<input name="price" type="number" min="1" max="1000000" className={field + " mt-1"} required /></label><button className={button + " md:col-span-5 md:justify-self-start"}>Agregar talla</button></form>
    </section>

    <section id="cupones" className="scroll-mt-28 pt-12"><h2 className="text-3xl font-black">Códigos de descuento</h2><p className="mt-2 text-sm text-[#52615D]">Puedes prepararlos ahora. Su activación espera al pago real.</p><form action={createCoupon} className={card + " mt-5 grid gap-3 md:grid-cols-5"}><label className="text-xs font-bold">Código<input name="code" pattern="[A-Za-z0-9_-]{3,32}" className={field + " mt-1"} required /></label><label className="text-xs font-bold">Tipo<select name="kind" className={field + " mt-1"}><option value="PERCENT">Porcentaje</option><option value="FIXED">Monto fijo</option></select></label><label className="text-xs font-bold">Valor<input name="amount" type="number" min="1" className={field + " mt-1"} required /></label><label className="text-xs font-bold">Compra mínima CLP<input name="minimum" type="number" min="0" defaultValue="0" className={field + " mt-1"} required /></label><label className="text-xs font-bold">Usos máximos<input name="limit" type="number" min="1" className={field + " mt-1"} /></label><button className={button + " md:col-span-5 md:justify-self-start"}>Crear cupón</button></form><div className="mt-4 grid gap-3 md:grid-cols-2">{coupons.map((coupon) => <article key={coupon.code} className={card}><div className="flex items-center justify-between gap-3"><div><strong>{coupon.code}</strong><p className="text-sm text-[#52615D]">{coupon.kind === "PERCENT" ? `${coupon.amount}%` : formatClp(coupon.amount)} · mínimo {formatClp(coupon.minimum_clp)} · {coupon.used_count}{coupon.usage_limit ? `/${coupon.usage_limit}` : ""} usos</p></div><span className="text-sm font-bold">{coupon.active ? "Activo" : "Inactivo"}</span></div><form action={toggleCoupon} className="mt-3"><input type="hidden" name="code" value={coupon.code} /><input type="hidden" name="active" value={String(!coupon.active)} /><button className="text-sm font-bold text-[#B6633A] underline">{coupon.active ? "Desactivar" : "Activar"}</button></form></article>)}</div></section>

    <section id="clientes" className="scroll-mt-28 pt-12"><h2 className="text-3xl font-black">Clientes registrados</h2><div className={card + " mt-5 overflow-x-auto"}><table className="w-full min-w-[500px] text-left text-sm"><thead><tr className="border-b"><th className="pb-3">Nombre</th><th className="pb-3">Correo</th><th className="pb-3">Pedidos</th><th className="pb-3">Registro</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id} className="border-b last:border-0"><td className="py-3">{customer.name}</td><td>{customer.email}</td><td>{customer.orders}</td><td>{new Date(customer.createdAt).toLocaleDateString("es-CL")}</td></tr>)}</tbody></table>{!customers.length && <p className="py-5 text-[#52615D]">Aún no hay cuentas de clientes.</p>}</div></section>
    <section id="actividad" className="scroll-mt-28 pt-12"><h2 className="text-3xl font-black">Actividad reciente</h2><div className={card + " mt-5"}>{audits.length ? <ul className="space-y-3 text-sm">{audits.map((audit, index) => <li key={`${audit.entity_id}-${index}`} className="flex flex-wrap justify-between gap-2 border-b pb-3 last:border-0"><span><strong>{audit.action}</strong> · {audit.entity_id}</span><time className="text-[#52615D]">{new Date(audit.created_at).toLocaleString("es-CL")}</time></li>)}</ul> : <p className="text-[#52615D]">Aún no hay cambios registrados.</p>}</div></section>
  </section>;
}
