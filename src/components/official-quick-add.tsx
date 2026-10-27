"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useOfficialCart } from "@/components/official-cart-provider";

export function OfficialQuickAdd({ productSlug }: { productSlug: string }) {
  const { inventory, ready } = useOfficialCart();
  const product = inventory[productSlug];
  const available = product?.variants.some((variant) => variant.units > 0);

  if (!ready) {
    return <span className="flex min-h-11 w-full items-center justify-center rounded-md bg-[#B6633A] px-2 text-xs font-black text-white opacity-50 sm:text-sm">Cargando…</span>;
  }

  if (!product || !available) {
    return <span className="flex min-h-11 w-full items-center justify-center rounded-md bg-[#B6633A] px-2 text-xs font-black text-white opacity-50 sm:text-sm">Agotado</span>;
  }

  return (
    <Link href={`/producto/${productSlug}#comprar`} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#B6633A] px-2 text-xs font-black text-white transition hover:bg-[#96502E] sm:text-sm">
      <ShoppingBag size={16} aria-hidden="true" /> Agregar al carrito
    </Link>
  );
}
