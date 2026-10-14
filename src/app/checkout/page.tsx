import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutPage } from "@/components/checkout-page";

export const metadata: Metadata = {
  title: "Resumen de selección",
  description: "Resumen referencial de productos seleccionados en Bobby's Pet Shop.",
};

export default function CheckoutRoute() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
