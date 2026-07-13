"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Ruler, ShoppingBag, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { useStore } from "@/components/store-provider";
import { type Product } from "@/lib/catalog";
import { formatPrice, getStockLabel } from "@/lib/commerce";

const QUICK_BUY_KEY = "bobbys-quick-buy-v1";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useStore();
  const [variantId, setVariantId] = useState(product.variants[0]?.id);

  const selectedVariant = useMemo(
    () => product.variants.find((variant) => variant.id === variantId) ?? product.variants[0],
    [product.variants, variantId],
  );

  const addSelectedItem = () => {
    addItem({ productSlug: product.slug, variantId: selectedVariant.id, quantity: 1 });
  };

  const buyNow = () => {
    window.sessionStorage.setItem(
      QUICK_BUY_KEY,
      JSON.stringify({ productSlug: product.slug, variantId: selectedVariant.id, quantity: 1 }),
    );
    router.push("/checkout?modo=rapida");
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#F4E8D8]">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          priority
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover"
        />
      </div>

      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">
          {product.category === "parka-impermeable" ? "Parka impermeable" : "Chaleco"}
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-[#243C3A]">{product.name}</h1>
        <p className="mt-3 text-lg leading-8 text-[#52615D]">{product.description}</p>
        <p className="mt-5 text-3xl font-black text-[#243C3A]">{formatPrice(product.price)}</p>

        <div className="mt-8 rounded-lg border border-[#E5DED4] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-black">Selecciona talla y color</p>
            <Link href="/guia-de-tallas" className="inline-flex items-center gap-2 text-sm font-black text-[#B6633A]">
              <Ruler size={16} />
              Guia
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {product.variants.map((variant) => {
              const selected = variant.id === selectedVariant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={variant.stock <= 0}
                  onClick={() => setVariantId(variant.id)}
                  className={`rounded-md border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    selected ? "border-[#B6633A] bg-[#FFF8E6]" : "border-[#E5DED4] bg-white hover:border-[#C9B8A8]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-black">
                      {variant.size} · {variant.colorName}
                    </span>
                    <span
                      className="h-5 w-5 rounded-full border border-black/10"
                      style={{ background: variant.colorHex }}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-2 block text-xs font-bold text-[#52615D]">
                    {getStockLabel(variant.stock, variant.lowStockThreshold)} · SKU {variant.sku}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={selectedVariant.stock <= 0}
            onClick={addSelectedItem}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#243C3A] px-5 text-sm font-black text-white transition hover:bg-[#315955] disabled:cursor-not-allowed disabled:bg-[#C9B8A8]"
          >
            <ShoppingBag size={18} />
            Agregar al carrito
          </button>
          <button
            type="button"
            disabled={selectedVariant.stock <= 0}
            onClick={buyNow}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#B6633A] px-5 text-sm font-black text-white transition hover:bg-[#96502E] disabled:cursor-not-allowed disabled:bg-[#C9B8A8]"
          >
            <Zap size={18} />
            Comprar ahora
          </button>
        </div>

        <div className="mt-8 grid gap-4 rounded-lg border border-[#E5DED4] bg-white p-5">
          <div>
            <p className="font-black">Medidas de la variante</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <span className="rounded-md bg-[#F4E8D8] p-3">
                Cuello <strong className="block">{selectedVariant.neckCm} cm</strong>
              </span>
              <span className="rounded-md bg-[#F4E8D8] p-3">
                Pecho <strong className="block">{selectedVariant.chestCm} cm</strong>
              </span>
              <span className="rounded-md bg-[#F4E8D8] p-3">
                Espalda <strong className="block">{selectedVariant.backCm} cm</strong>
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm leading-6 text-[#52615D]">
            <Heart className="mt-1 shrink-0 text-[#B6633A]" size={18} />
            <p>{product.care}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
