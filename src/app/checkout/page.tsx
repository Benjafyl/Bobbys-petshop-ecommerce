import type { Metadata } from "next";
import { OfficialCheckoutPage } from "@/components/official-checkout-page";

export const metadata: Metadata = {
  title: "Finalizar compra",
  description: "Datos de entrega y resumen de compra en Bobby's Pet Shop.",
};

export default function CheckoutPage() { return <OfficialCheckoutPage />; }
