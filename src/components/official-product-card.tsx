"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OfficialQuickAdd } from "@/components/official-quick-add";
import { officialCategoryLabels, type OfficialProduct } from "@/lib/official-catalog";
import { formatClp, getMinimumPrice, hasMultiplePrices } from "@/lib/public-inventory";
import { useOfficialCart } from "@/components/official-cart-provider";

export function OfficialProductCard({ product, headingLevel = "h3" }: { product: OfficialProduct; headingLevel?: "h3" | "h4" }) {
  const Heading = headingLevel;
  const { inventory: liveInventory, inventoryError } = useOfficialCart();
  const inventory = liveInventory[product.slug];
  const primaryImage = product.images[0];
  const alternateImage = product.images[1];
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-[#E5DED4] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <Link href={`/producto/${product.slug}`} className={`${alternateImage ? "catalog-photo " : ""}flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6633A]`} aria-label={`Ver ${product.name} y sus fotos`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F4E8D8]">
          {primaryImage ? (
            <>
              <Image src={primaryImage.src} alt={primaryImage.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw" className="catalog-photo-primary object-cover" />
              {alternateImage && <Image src={alternateImage.src} alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw" className="catalog-photo-secondary object-cover" />}
            </>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm font-bold uppercase tracking-[0.16em] text-[#52615D]">Foto pendiente</div>
          )}
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#243C3A] sm:left-3 sm:top-3 sm:px-3 sm:text-xs sm:tracking-[0.12em]">
            {officialCategoryLabels[product.category]}
          </span>
          {alternateImage && <span className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-[#243C3A] sm:bottom-3 sm:right-3 sm:px-3 sm:text-xs">+ fotos</span>}
        </div>
        <div className="flex flex-1 items-start justify-between gap-1.5 p-2.5 sm:gap-3 sm:p-4">
          <div className="min-w-0">
            <Heading className="line-clamp-2 min-h-[2.25rem] text-sm font-black leading-[1.125rem] text-[#243C3A] sm:min-h-[2.75rem] sm:text-lg sm:leading-tight">{product.name}</Heading>
            {inventory ? (
              <>
                <p className="mt-1 text-sm font-black text-[#B6633A] sm:text-base">{hasMultiplePrices(inventory) ? "Desde " : ""}{formatClp(getMinimumPrice(inventory))}</p>
              </>
            ) : <p className="mt-1 text-xs text-[#52615D] sm:text-sm">{inventoryError ? "Disponibilidad temporalmente no disponible" : "Sin unidades disponibles"}</p>}
          </div>
          <ArrowUpRight className="hidden shrink-0 text-[#B6633A] sm:block" size={20} />
        </div>
      </Link>
      <div className="mt-auto border-t border-[#E5DED4] p-2 sm:p-3"><OfficialQuickAdd productSlug={product.slug} /></div>
    </article>
  );
}
