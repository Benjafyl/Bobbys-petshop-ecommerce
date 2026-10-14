"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Ruler } from "lucide-react";
import { officialCategoryLabels, type OfficialProduct } from "@/lib/official-catalog";

export function OfficialProductDetail({ product }: { product: OfficialProduct }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = product.images[activeIndex];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/tienda" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#B6633A]">
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#F4E8D8]">
            <Image src={active.src} alt={active.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ver foto ${index + 1} de ${product.name}`}
                  aria-pressed={activeIndex === index}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 bg-[#F4E8D8] ${activeIndex === index ? "border-[#B6633A]" : "border-transparent"}`}
                >
                  <Image src={image.src} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="self-start lg:sticky lg:top-32">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">{officialCategoryLabels[product.category]}</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-[#243C3A]">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-[#52615D]">{product.description}</p>
          <div className="mt-8 rounded-lg border border-[#E5DED4] bg-white p-6">
            <h2 className="text-lg font-black">Colección en preparación</h2>
            <p className="mt-2 leading-7 text-[#52615D]">Precio, tallas y disponibilidad por confirmar. Por ahora puedes explorar las fotografías oficiales de este producto; todavía no recibimos compras en el sitio.</p>
          </div>
          <Link href="/guia-de-tallas" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#B6633A]">
            <Ruler size={17} /> Cómo medir a tu perro
          </Link>
        </div>
      </div>
    </section>
  );
}
