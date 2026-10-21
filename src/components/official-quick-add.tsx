"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useOfficialCart } from "@/components/official-cart-provider";
import { getOfficialVariantId } from "@/lib/official-cart";
import { publicInventoryBySlug } from "@/lib/public-inventory";

export function OfficialQuickAdd({ productSlug }: { productSlug: string }) {
  const { cart, ready, addItem } = useOfficialCart();
  const inventory = publicInventoryBySlug[productSlug];
  if (!inventory) return null;

  if (inventory.variants.length !== 1) {
    return <Link href={`/producto/${productSlug}`} className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#B6633A] px-3 text-sm font-black text-[#B6633A] transition hover:bg-[#B6633A] hover:text-white">Elegir talla o diseño <ArrowRight size={16} /></Link>;
  }

  const variant = inventory.variants[0];
  const variantId = getOfficialVariantId(productSlug, variant);
  const inCart = cart.find((item) => item.variantId === variantId)?.quantity ?? 0;
  if (ready && inCart >= variant.units) {
    return <Link href="/carrito" className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#B6633A] px-3 text-sm font-black text-[#B6633A]">Ver en carrito <ArrowRight size={16} /></Link>;
  }

  return (
    <button type="button" disabled={!ready} onClick={() => addItem(productSlug, variantId)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#B6633A] px-3 text-sm font-black text-white transition hover:bg-[#96502E] disabled:opacity-50">
      <ShoppingBag size={17} /> Agregar al carrito
    </button>
  );
}
