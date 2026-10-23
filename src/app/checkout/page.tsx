import type { Metadata } from "next";
import { OfficialCheckoutPage } from "@/components/official-checkout-page";
import { paidCheckoutEnabled } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finalizar compra",
  description: "Datos de entrega y resumen de compra en Bobby's Pet Shop.",
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ cupon?: string }> }) {
  const { cupon } = await searchParams;
  return <OfficialCheckoutPage checkoutEnabled={paidCheckoutEnabled()} initialCoupon={cupon?.slice(0, 32) ?? ""} />;
}
