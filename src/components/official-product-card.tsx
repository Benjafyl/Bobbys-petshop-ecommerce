import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OfficialQuickAdd } from "@/components/official-quick-add";
import { officialCategoryLabels, type OfficialProduct } from "@/lib/official-catalog";
import { formatClp, getMinimumPrice, getTotalUnits, hasMultiplePrices, publicInventoryBySlug } from "@/lib/public-inventory";

export function OfficialProductCard({ product, headingLevel = "h3" }: { product: OfficialProduct; headingLevel?: "h3" | "h4" }) {
  const Heading = headingLevel;
  const inventory = publicInventoryBySlug[product.slug];
  return (
    <article className="group overflow-hidden rounded-lg border border-[#E5DED4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/producto/${product.slug}`} className="block" aria-label={`Ver ${product.name}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F4E8D8]">
          {product.images[0] ? (
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm font-bold uppercase tracking-[0.16em] text-[#52615D]">Foto pendiente</div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#243C3A]">
            {officialCategoryLabels[product.category]}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 p-4">
          <div>
            <Heading className="text-lg font-black leading-tight text-[#243C3A]">{product.name}</Heading>
            {inventory ? (
              <>
                <p className="mt-1 text-base font-black text-[#B6633A]">{hasMultiplePrices(inventory) ? "Desde " : ""}{formatClp(getMinimumPrice(inventory))}</p>
                <p className="mt-1 text-xs text-[#52615D]">Tallas: {[...new Set(inventory.variants.map((variant) => variant.size))].join(" · ")}</p>
                {product.fit && <p className="mt-1 text-xs font-semibold text-[#243C3A]">{product.fit}</p>}
                <p className="mt-1 text-xs font-semibold text-[#52615D]">{getTotalUnits(inventory)} {getTotalUnits(inventory) === 1 ? "unidad" : "unidades"} en inventario</p>
              </>
            ) : <p className="mt-1 text-sm text-[#52615D]">Precio y tallas por confirmar</p>}
          </div>
          <ArrowUpRight className="shrink-0 text-[#B6633A]" size={20} />
        </div>
      </Link>
      {inventory && <div className="border-t border-[#E5DED4] p-3"><OfficialQuickAdd productSlug={product.slug} /></div>}
    </article>
  );
}
