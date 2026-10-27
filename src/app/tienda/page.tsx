import type { Metadata } from "next";
import { OfficialShopClient } from "@/components/official-shop-client";

export const metadata: Metadata = { title: "Tienda", description: "Ropa para mascotas y accesorios con la personalidad de Bobby's Pet Shop." };

export default function ShopPage() {
  return <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"><div className="mb-6 max-w-3xl sm:mb-8"><p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">La colección</p><h1 className="mt-2 text-3xl font-black text-[#243C3A] sm:text-4xl">Ropa para mascotas</h1></div><OfficialShopClient /></section>;
}
