import type { Metadata } from "next";
import { OfficialShopClient } from "@/components/official-shop-client";

export const metadata: Metadata = { title: "Tienda", description: "Compra ropa para perros y collares para gatos de Bobby's Pet Shop. Explora cada prenda, elige talla y arma tu carrito." };

export default function ShopPage() {
  return <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"><div className="mb-6 max-w-3xl sm:mb-8"><p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">La colección</p><h1 className="mt-2 text-3xl font-black text-[#243C3A] sm:text-4xl">Ropa y accesorios</h1><p className="mt-3 text-sm leading-6 text-[#52615D] sm:text-base sm:leading-7">Encuentra el look para tu mascota, mira cómo luce puesto y elige la talla que necesita. Ya puedes armar tu carrito; el pago en línea estará disponible más adelante.</p></div><OfficialShopClient /></section>;
}
