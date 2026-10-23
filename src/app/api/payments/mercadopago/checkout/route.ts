import { NextResponse } from "next/server";
import { currentShopSession } from "@/lib/shop-session";
import { paidCheckoutEnabled } from "@/lib/mercadopago";
import { CheckoutRejected, createCheckout, parseCheckoutInput, releaseExpiredReservations } from "@/lib/shop-payments";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!paidCheckoutEnabled()) return NextResponse.json({ message: "El pago en línea aún no está disponible." }, { status: 503 });
  try {
    const body = await request.json();
    const input = parseCheckoutInput(body);
    const session = await currentShopSession();
    await releaseExpiredReservations();
    const result = await createCheckout({ ...input, userId: session?.user.id });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof CheckoutRejected) return NextResponse.json({ message: error.message }, { status: 400 });
    console.error("No se pudo crear el pago de Mercado Pago", error instanceof Error ? error.message : "error desconocido");
    return NextResponse.json({ message: "No pudimos iniciar el pago. No se realizó ningún cobro; intenta de nuevo." }, { status: 503 });
  }
}
