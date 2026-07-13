import type { Metadata } from "next";
import { CartPage } from "@/components/cart-page";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Resumen editable del carrito de Bobby's Pet Shop.",
};

export default function CartRoute() {
  return <CartPage />;
}
