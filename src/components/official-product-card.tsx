"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OfficialQuickAdd } from "@/components/official-quick-add";
import { officialCategoryLabels, type OfficialProduct } from "@/lib/official-catalog";
import { formatClp, getMinimumPrice, getTotalUnits, hasMultiplePrices } from "@/lib/public-inventory";
import { useOfficialCart } from "@/components/official-cart-provider";

export function OfficialProductCard({ product, headingLevel = "h3" }: { product: OfficialProduct; headingLevel?: "h3" | "h4" }) {
  const Heading = headingLevel;
  const { inventory: liveInventory, inventoryError } = useOfficialCart();
  const inventory = liveInventory[product.slug];
  const primaryImage = product.images[0];
  const alternateImage = product.images[1];
  return (
    <article className="overflow-hidden rounded-lg border border-[#E5DED4] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <Link href={`/producto/${product.slug}`} className={`${alternateImage ? "catalog-photo " : ""}block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B6633A]`} aria-label={`Ver ${product.name} y sus fotos`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F4E8D8]">
          {primaryImage ? (
            <>
              <Image src={primaryImage.src} alt={primaryImage.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="catalog-photo-primary object-cover" />
              {alternateImage && <Image src={alternateImage.src} alt="" aria-hidden="true" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="catalog-photo-secondary object-cover" />}
            </>
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm font-bold uppercase tracking-[0.16em] text-[#52615D]">Foto pendiente</div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#243C3A]">
            {officialCategoryLabels[product.category]}
          </span>
          {alternateImage && <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#243C3A]">+ fotos</span>}
        </div>
        <div className="flex items-center justify-between gap-3 p-4">
          <div>
            <Heading className="text-lg font-black leading-tight text-[#243C3A]">{product.name}</Heading>
            {inventory ? (
              <>
                <p className="mt-1 text-base font-black text-[#B6633A]">{hasMultiplePrices(inventory) ? "Desde " : ""}{formatClp(getMinimumPrice(inventory))}</p>
                <p className="mt-1 text-xs text-[#52615D]">Tallas: {[...new Set(inventory.variants.map((variant) => variant.size))].join(" · ")}</p>
                {product.fit && <p className="mt-1 text-xs font-semibold text-[#243C3A]">{product.fit}</p>}
                <p className="mt-1 text-xs font-semibold text-[#52615D]">{getTotalUnits(inventory) === 0 ? "Agotado" : getTotalUnits(inventory) === 1 ? "Última unidad disponible" : "Disponible"}</p>
              </>
            ) : <p className="mt-1 text-sm text-[#52615D]">{inventoryError ? "Disponibilidad temporalmente no disponible" : "Sin unidades disponibles"}</p>}
          </div>
          <ArrowUpRight className="shrink-0 text-[#B6633A]" size={20} />
        </div>
      </Link>
      {inventory && <div className="border-t border-[#E5DED4] p-3"><OfficialQuickAdd productSlug={product.slug} /></div>}
    </article>
  );
}
