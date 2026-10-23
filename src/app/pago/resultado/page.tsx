import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getPayment, paidCheckoutEnabled, searchOrderPayments } from "@/lib/mercadopago";
import { recordVerifiedPayment } from "@/lib/shop-payments";
import { ClearPaidCart } from "@/components/clear-paid-cart";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Estado del pedido", robots: { index: false, follow: false } };

export default async function PaymentResult({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const orderId = typeof params.pedido === "string" ? params.pedido : "";
  const paymentId = typeof params.payment_id === "string" ? params.payment_id : typeof params.collection_id === "string" ? params.collection_id : "";
  if (!paidCheckoutEnabled() || !/^[0-9a-f-]{36}$/i.test(orderId)) return <section className="mx-auto max-w-2xl px-4 py-20"><h1 className="text-3xl font-black">No encontramos ese pedido</h1><Link href="/carrito" className="mt-6 inline-block underline">Volver al carrito</Link></section>;
  try {
    if (/^\d{1,24}$/.test(paymentId)) {
      const payment = await getPayment(paymentId);
      if (payment.external_reference === orderId) await recordVerifiedPayment(payment);
    } else {
      const payments = await searchOrderPayments(orderId);
      for (const payment of payments) await recordVerifiedPayment(payment);
    }
  } catch { /* El webhook puede confirmar el pago después. */ }
  const result = await db().query<{ order_number: string; payment_status: string }>("select order_number,payment_status from shop_orders where id=$1", [orderId]);
  const order = result.rows[0];
  if (!order) return <section className="mx-auto max-w-2xl px-4 py-20"><h1 className="text-3xl font-black">No encontramos ese pedido</h1></section>;
  const paid = order.payment_status === "PAID";
  return <section className="mx-auto max-w-2xl px-4 py-20 text-center">
    {paid && <ClearPaidCart />}
    <p className="text-sm font-black uppercase tracking-widest text-[#B6633A]">Pedido {order.order_number}</p>
    <h1 className="mt-4 text-4xl font-black">{paid ? "¡Pago confirmado!" : "Estamos verificando tu pago"}</h1>
    <p className="mt-5 text-[#52615D]">{paid ? "Recibimos el pago. Prepararemos tu pedido para el envío." : "Mercado Pago todavía no confirma este cobro. Si acabas de pagar, vuelve a consultar en unos minutos. No repitas el pago mientras esté pendiente."}</p>
    <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className="rounded-lg bg-[#B6633A] px-5 py-3 font-bold text-white">Volver a la tienda</Link>{!paid && <Link href={`/pago/resultado?pedido=${orderId}`} className="rounded-lg border border-[#B6633A] px-5 py-3 font-bold text-[#B6633A]">Consultar de nuevo</Link>}</div>
  </section>;
}
