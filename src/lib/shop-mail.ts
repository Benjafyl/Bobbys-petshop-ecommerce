import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { formatClp } from "@/lib/public-inventory";
import { PICKUP_LOCATION } from "@/lib/shipping";

export async function sendPendingOrderNotifications() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, ORDER_NOTIFICATION_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM || !ORDER_NOTIFICATION_EMAIL) return;
  const client = await db().connect();
  try {
    await client.query("begin");
    const found = await client.query<{ order_id: string; order_number: string; customer_name: string; customer_email: string; customer_phone: string; delivery_address: string; delivery_city: string; delivery_region: string; delivery_method: "shipping" | "pickup"; payment_method: string | null; shipping_clp: number; total_clp: number; stock_issue: boolean }>(
      `select n.order_id,o.order_number,o.customer_name,o.customer_email,o.customer_phone,o.delivery_address,o.delivery_city,o.delivery_region,o.delivery_method,o.payment_method,o.shipping_clp,o.total_clp,o.stock_issue
       from shop_order_notifications n join shop_orders o on o.id=n.order_id
       where n.sent_at is null and o.payment_status='PAID' order by n.created_at limit 1 for update of n skip locked`,
    );
    const order = found.rows[0];
    if (!order) { await client.query("commit"); return; }
    const items = await client.query<{ product_name: string; size: string; design: string; quantity: number }>("select product_name,size,design,quantity from shop_order_items where order_id=$1", [order.order_id]);
    const text = [
      `Pedido pagado ${order.order_number}`,
      ...(order.stock_issue ? ["ATENCIÓN: falta stock para una o más prendas. Revisar el pedido antes de prepararlo."] : []),
      `Cliente: ${order.customer_name} (${order.customer_email})`,
      `Teléfono: ${order.customer_phone}`,
      order.delivery_method === "pickup" ? `Retiro sin costo: ${PICKUP_LOCATION}` : `Envío: ${order.delivery_address}, ${order.delivery_city}, ${order.delivery_region}`,
      `Costo de envío: ${formatClp(order.shipping_clp)}`,
      `Pago: ${order.payment_method ?? "Mercado Pago"}`,
      `Total: ${formatClp(order.total_clp)}`,
      "Prendas:",
      ...items.rows.map((item) => `${item.quantity} × ${item.product_name} · ${item.design ? item.design + " · " : ""}Talla ${item.size}`),
      "", "Revisa el panel de administración para preparar y actualizar el pedido.",
    ].join("\n");
    try {
      const transport = nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT) || 587, secure: Number(SMTP_PORT) === 465, auth: { user: SMTP_USER, pass: SMTP_PASSWORD } });
      await transport.sendMail({ from: SMTP_FROM, to: ORDER_NOTIFICATION_EMAIL, subject: `Bobby's: pedido pagado ${order.order_number}`, text });
      await client.query("update shop_order_notifications set sent_at=now(),attempts=attempts+1,last_error=null where order_id=$1", [order.order_id]);
    } catch (error) {
      await client.query("update shop_order_notifications set attempts=attempts+1,last_error=$2 where order_id=$1", [order.order_id, error instanceof Error ? error.message.slice(0, 250) : "error SMTP"]);
    }
    await client.query("commit");
  } catch (error) { await client.query("rollback"); throw error; }
  finally { client.release(); }
}
