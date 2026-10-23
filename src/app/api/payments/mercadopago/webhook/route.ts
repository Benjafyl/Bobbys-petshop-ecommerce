import { NextResponse } from "next/server";
import { getPayment, paidCheckoutEnabled, validWebhook } from "@/lib/mercadopago";
import { recordVerifiedPayment } from "@/lib/shop-payments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!paidCheckoutEnabled()) return NextResponse.json({ error: "No disponible" }, { status: 503 });
  const url = new URL(request.url);
  const paymentId = url.searchParams.get("data.id") ?? "";
  const type = url.searchParams.get("type");
  if (type !== "payment" || !validWebhook(request, paymentId)) return NextResponse.json({ error: "Notificación inválida" }, { status: 401 });
  try {
    const payment = await getPayment(paymentId);
    const accepted = await recordVerifiedPayment(payment);
    return NextResponse.json({ accepted });
  } catch (error) {
    console.error("No se pudo confirmar el pago", error instanceof Error ? error.message : "error desconocido");
    return NextResponse.json({ error: "Verificación pendiente" }, { status: 503 });
  }
}
