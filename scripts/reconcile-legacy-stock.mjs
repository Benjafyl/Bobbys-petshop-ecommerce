import { Pool } from "pg";

// Run once after deploying the paid-only stock change. Existing pending orders
// were created by the old flow, which reduced stock before payment.
if (!process.env.DATABASE_URL || !process.env.MERCADOPAGO_ACCESS_TOKEN) throw new Error("Database and Mercado Pago credentials are required");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const dryRun = !process.argv.includes("--apply");

async function paymentsFor(orderId) {
  const query = new URLSearchParams({ external_reference: orderId, limit: "50" });
  const response = await fetch(`https://api.mercadopago.com/v1/payments/search?${query}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Mercado Pago respondió ${response.status}`);
  const result = await response.json();
  return (result.results ?? []).filter((payment) => payment.external_reference === orderId);
}

try {
  const pending = await pool.query(`select id,order_number from shop_orders
    where payment_status='PENDING' and stock_reserved_at_checkout=true and reservation_released_at is null
    order by created_at`);
  for (const order of pending.rows) {
    const payments = await paymentsFor(order.id);
    if (payments.some((payment) => payment.status === "approved")) {
      console.log(`${order.order_number}: pago aprobado; verificarlo en el panel antes de reconciliar`);
      continue;
    }
    if (dryRun) {
      console.log(`${order.order_number}: pendiente sin pago aprobado; stock se restauraría`);
      continue;
    }
    const client = await pool.connect();
    try {
      await client.query("begin");
      const current = await client.query(`select order_number from shop_orders where id=$1 and payment_status='PENDING'
        and stock_reserved_at_checkout=true and reservation_released_at is null for update`, [order.id]);
      if (current.rowCount) {
        const items = await client.query(`select variant_key,sum(quantity)::integer as quantity from shop_order_items
          where order_id=$1 group by variant_key order by variant_key`, [order.id]);
        for (const item of items.rows) {
          const updated = await client.query(`update shop_inventory set stock_on_hand=stock_on_hand+$2,updated_at=now()
            where variant_key=$1 returning stock_on_hand`, [item.variant_key, item.quantity]);
          if (updated.rowCount !== 1) throw new Error(`Variante no encontrada: ${item.variant_key}`);
          const after = updated.rows[0].stock_on_hand;
          await client.query(`insert into shop_stock_movements(variant_key,before_units,after_units,reason)
            values($1,$2,$3,$4)`, [item.variant_key, after - item.quantity, after, `Reserva anterior liberada ${order.order_number}`]);
        }
        await client.query("update shop_orders set stock_reserved_at_checkout=false,updated_at=now() where id=$1", [order.id]);
        await client.query("insert into shop_audit_logs(action,entity_id) values('order.legacy-stock.released',$1)", [order.id]);
      }
      await client.query("commit");
      console.log(`${order.order_number}: stock restaurado`);
    } catch (error) { await client.query("rollback"); throw error; }
    finally { client.release(); }
  }
} finally { await pool.end(); }
