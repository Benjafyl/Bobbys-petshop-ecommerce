import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutPage } from "@/components/checkout-page";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout de Bobby's Pet Shop con entrega y transferencia bancaria.",
};

export default function CheckoutRoute() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}
