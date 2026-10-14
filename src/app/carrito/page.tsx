import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Carrito", description: "Las compras de Bobby's Pet Shop estarán disponibles próximamente." };

export default function CartPage() {
  return <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6"><h1 className="text-4xl font-black">Compras próximamente</h1><p className="mt-4 leading-7 text-[#52615D]">El catálogo visual ya está disponible. Activaremos el carrito cuando confirmemos precios, tallas y existencias.</p><Link href="/tienda" className="mt-8 inline-flex rounded-md bg-[#B6633A] px-5 py-3 text-sm font-black text-white">Explorar catálogo</Link></section>;
}
