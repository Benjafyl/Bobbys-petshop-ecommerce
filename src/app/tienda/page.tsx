import type { Metadata } from "next";
import { OfficialShopClient } from "@/components/official-shop-client";

export const metadata: Metadata = { title: "Tienda", description: "Compra ropa para perros y collares para gatos de Bobby's Pet Shop. Explora cada prenda, elige talla y arma tu carrito." };

export default function ShopPage() {
  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-8 max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">La colección</p><h1 className="mt-2 text-4xl font-black text-[#243C3A]">Ropa y accesorios</h1><p className="mt-3 text-base leading-7 text-[#52615D]">Encuentra el look para tu mascota, mira cómo luce puesto y elige la talla que necesita. Ya puedes armar tu carrito; el pago en línea estará disponible más adelante.</p></div><OfficialShopClient /></section>;
}
