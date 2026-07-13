import type { Metadata } from "next";
import { ShopClient } from "@/components/shop-client";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Catalogo de parkas impermeables y chalecos con filtros por talla, tipo y disponibilidad.",
};

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">
          Catalogo
        </p>
        <h1 className="mt-2 text-4xl font-black text-[#243C3A]">Parkas y chalecos</h1>
        <p className="mt-3 text-base leading-7 text-[#52615D]">
          Cada producto mantiene variantes independientes por talla y color. Los agotados se
          muestran, pero no se pueden agregar al carrito.
        </p>
      </div>
      <ShopClient />
    </section>
  );
}
