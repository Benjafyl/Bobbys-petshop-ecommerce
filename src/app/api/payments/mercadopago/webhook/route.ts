import { NextResponse } from "next/server";
import { getPayment, paidCheckoutEnabled, validWebhook } from "@/lib/mercadopago";
import { recordVerifiedPayment } from "@/lib/shop-payments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!paidCheckoutEnabled()) return NextResponse.json({ error: "No disponible" }, { status: 503 });
  const url = new URL(request.url);
  const body = await request.json().catch(() => null) as { type?: unknown; data?: { id?: unknown } } | null;
  const queryPaymentId = url.searchParams.get("data.id") ?? "";
  const bodyPaymentId = typeof body?.data?.id === "string" ? body.data.id : "";
  const paymentId = queryPaymentId || bodyPaymentId;
  const queryType = url.searchParams.get("type");
  const bodyType = typeof body?.type === "string" ? body.type : null;
  if ((queryType && bodyType && queryType !== bodyType) ||
      (queryPaymentId && bodyPaymentId && queryPaymentId !== bodyPaymentId) ||
      (queryType || bodyType) !== "payment" ||
      !validWebhook(request, paymentId)) {
    console.warn("Mercado Pago webhook rechazado", {
      queryKeys: [...url.searchParams.keys()],
      queryType: Boolean(queryType), bodyType: Boolean(bodyType),
      queryPaymentId: Boolean(queryPaymentId), bodyPaymentId: Boolean(bodyPaymentId),
      signature: Boolean(request.headers.get("x-signature")), requestId: Boolean(request.headers.get("x-request-id")),
    });
    return NextResponse.json({ error: "Notificación inválida" }, { status: 401 });
  }
  try {
    const payment = await getPayment(paymentId);
    const accepted = await recordVerifiedPayment(payment);
    return NextResponse.json({ accepted });
  } catch (error) {
    console.error("No se pudo confirmar el pago", error instanceof Error ? error.message : "error desconocido");
    return NextResponse.json({ error: "Verificación pendiente" }, { status: 503 });
  }
}
