import type { Metadata } from "next";
import { OfficialCartPage } from "@/components/official-cart-page";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisa las prendas, tallas y subtotal de tu carrito en Bobby's Pet Shop.",
};

export default function CartPage() {
  return <OfficialCartPage />;
}
