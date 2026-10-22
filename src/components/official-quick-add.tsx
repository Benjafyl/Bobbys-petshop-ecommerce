"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ShoppingBag, X } from "lucide-react";
import { useOfficialCart } from "@/components/official-cart-provider";
import { getOfficialVariantId } from "@/lib/official-cart";
import { formatClp } from "@/lib/public-inventory";

export function OfficialQuickAdd({ productSlug }: { productSlug: string }) {
  const { cart, ready, addItem, inventory: liveInventory } = useOfficialCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [notice, setNotice] = useState("");
  const inventory = liveInventory[productSlug];
  if (!inventory) return <button type="button" disabled className="flex min-h-11 w-full items-center justify-center rounded-md bg-[#B6633A] px-2 text-xs font-black text-white opacity-50 sm:px-3 sm:text-sm">No disponible</button>;

  if (inventory.variants.length !== 1) {
    const hasDesignChoices = inventory.variants.some((variant) => Boolean(variant.design));
    const canAdd = inventory.variants.some((variant) => {
      const variantId = getOfficialVariantId(productSlug, variant);
      return variant.units > (cart.find((item) => item.variantId === variantId)?.quantity ?? 0);
    });
    if (!canAdd) {
      return inventory.variants.some((variant) => variant.units > 0)
        ? <Link href="/carrito" className="flex min-h-11 items-center justify-center gap-1 rounded-md border border-[#B6633A] px-2 text-xs font-black text-[#B6633A] sm:gap-2 sm:px-3 sm:text-sm">Ver en carrito <ArrowRight size={16} /></Link>
        : <button type="button" disabled className="flex min-h-11 w-full items-center justify-center rounded-md bg-[#B6633A] px-2 text-xs font-black text-white opacity-50 sm:px-3 sm:text-sm">Agotado</button>;
    }
    return (
      <>
        <button type="button" disabled={!ready} onClick={() => dialogRef.current?.showModal()} className="flex min-h-11 w-full items-center justify-center gap-1 rounded-md bg-[#B6633A] px-2 text-[11px] font-black text-white transition hover:bg-[#96502E] disabled:opacity-50 sm:gap-2 sm:px-3 sm:text-sm">
          <ShoppingBag size={15} className="shrink-0 sm:h-[17px] sm:w-[17px]" /> Agregar al carrito
        </button>
        <span className="sr-only" aria-live="polite">{notice}</span>
        <dialog ref={dialogRef} aria-label={hasDesignChoices ? "Elige un diseño para agregar al carrito" : "Elige una talla para agregar al carrito"} className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-[#E5DED4] bg-white p-0 text-[#243C3A] shadow-2xl backdrop:bg-[#243C3A]/65">
          <div className="flex items-start justify-between gap-4 border-b border-[#E5DED4] px-5 py-4">
            <div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#B6633A]">Agregar al carrito</p><h2 className="mt-1 text-xl font-black">{hasDesignChoices ? "Elige un diseño" : "Elige una talla"}</h2></div>
            <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-full p-2 hover:bg-[#F4E8D8]" aria-label="Cerrar selector"><X size={19} /></button>
          </div>
          <div className="grid gap-2 p-5">
            {inventory.variants.map((variant) => {
              const variantId = getOfficialVariantId(productSlug, variant);
              const inCart = cart.find((item) => item.variantId === variantId)?.quantity ?? 0;
              const available = Math.max(0, variant.units - inCart);
              return (
                <button key={variantId} type="button" disabled={!ready || available === 0} onClick={() => { addItem(productSlug, variantId); setNotice(`${variant.design ?? `Talla ${variant.size}`} agregada al carrito`); dialogRef.current?.close(); }} className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-[#E5DED4] px-4 py-2 text-left transition hover:border-[#B6633A] hover:bg-[#FCF3EA] disabled:cursor-not-allowed disabled:opacity-50">
                  <span><strong className="block text-sm">{variant.design ?? `Talla ${variant.size}`}</strong><small className="block text-xs text-[#52615D]">{hasDesignChoices ? `Talla ${variant.size.toLocaleLowerCase("es-CL")} · ` : ""}{available === 0 ? "Agotado o en tu carrito" : available === 1 ? "Última unidad" : `${available} disponibles`}</small></span>
                  <span className="text-sm font-black text-[#B6633A]">{formatClp(variant.priceClp)}</span>
                </button>
              );
            })}
            <Link href={`/producto/${productSlug}`} className="mt-2 text-center text-sm font-bold text-[#B6633A] underline underline-offset-4">Ver fotos y detalles del producto</Link>
          </div>
        </dialog>
      </>
    );
  }

  const variant = inventory.variants[0];
  if (variant.units <= 0) return <button type="button" disabled className="flex min-h-11 w-full items-center justify-center rounded-md bg-[#B6633A] px-2 text-xs font-black text-white opacity-50 sm:px-3 sm:text-sm">Agotado</button>;
  const variantId = getOfficialVariantId(productSlug, variant);
  const inCart = cart.find((item) => item.variantId === variantId)?.quantity ?? 0;
  if (ready && inCart >= variant.units) {
    return <Link href="/carrito" className="flex min-h-11 items-center justify-center gap-1 rounded-md border border-[#B6633A] px-2 text-xs font-black text-[#B6633A] sm:gap-2 sm:px-3 sm:text-sm">Ver en carrito <ArrowRight size={16} /></Link>;
  }

  return (
    <button type="button" disabled={!ready} onClick={() => addItem(productSlug, variantId)} className="flex min-h-11 w-full items-center justify-center gap-1 rounded-md bg-[#B6633A] px-2 text-[11px] font-black text-white transition hover:bg-[#96502E] disabled:opacity-50 sm:gap-2 sm:px-3 sm:text-sm">
      <ShoppingBag size={15} className="shrink-0 sm:h-[17px] sm:w-[17px]" /> Agregar al carrito
    </button>
  );
}
