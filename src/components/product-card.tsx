"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { categoryLabels, type Product } from "@/lib/catalog";
import { formatPrice, getProductStock, getRecommendedVariant, getStockLabel } from "@/lib/commerce";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useStore();
  const stock = getProductStock(product);
  const variant = getRecommendedVariant(product);

  return (
    <article className="group overflow-hidden rounded-lg border border-[#E5DED4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F4E8D8]">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-[#243C3A] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#F9D36B]">
            {product.badge}
          </span>
        </div>
      </Link>
      <div className="grid gap-4 p-4">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#B6633A]">
              {categoryLabels[product.category]}
            </p>
            <p className="text-xs font-bold text-[#52615D]">
              Stock referencial: {getStockLabel(stock)}
            </p>
          </div>
          <Link href={`/producto/${product.slug}`}>
            <h3 className="text-lg font-black leading-tight text-[#243C3A]">{product.name}</h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#52615D]">{product.tagline}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-black text-[#243C3A]">{formatPrice(product.price)}</p>
          <button
            className="flex h-10 items-center gap-2 rounded-md bg-[#B6633A] px-3 text-sm font-black text-white transition hover:bg-[#96502E] disabled:cursor-not-allowed disabled:bg-[#C9B8A8]"
            type="button"
            disabled={stock <= 0}
            onClick={() => addItem({ productSlug: product.slug, variantId: variant.id, quantity: 1 })}
          >
            <ShoppingBag size={16} />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
