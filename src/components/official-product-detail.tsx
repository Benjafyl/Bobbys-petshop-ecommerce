"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, Ruler, ShoppingBag, Truck } from "lucide-react";
import { useOfficialCart } from "@/components/official-cart-provider";
import { officialCategoryLabels, type OfficialProduct } from "@/lib/official-catalog";
import { getOfficialVariantId } from "@/lib/official-cart";
import { formatClp, inventoryAsOf, publicInventoryBySlug } from "@/lib/public-inventory";
import { SHIPPING_FEE_CLP } from "@/lib/shipping";

function galleryImageClassName(image: OfficialProduct["images"][number]) {
  if (image.crop === "left") return "object-cover object-left";
  if (image.crop === "right") return "object-cover object-right";
  return "object-contain";
}

export function OfficialProductDetail({ product }: { product: OfficialProduct }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = product.images[activeIndex];
  const inventory = publicInventoryBySlug[product.slug];
  const { cart, ready, addItem } = useOfficialCart();
  const [selectedVariantId, setSelectedVariantId] = useState(() => inventory?.variants[0] ? getOfficialVariantId(product.slug, inventory.variants[0]) : "");
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const selectedVariant = inventory?.variants.find((variant) => getOfficialVariantId(product.slug, variant) === selectedVariantId);
  const inCart = cart.find((item) => item.variantId === selectedVariantId)?.quantity ?? 0;
  const availableToAdd = Math.max(0, (selectedVariant?.units ?? 0) - inCart);
  const hasDesignChoices = inventory?.variants.some((variant) => Boolean(variant.design)) ?? false;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link href="/tienda" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#B6633A] hover:underline hover:underline-offset-4">
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
        <div className="min-w-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F4E8D8]">
            {active ? <Image src={active.src} alt={active.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className={galleryImageClassName(active)} /> : <div className="flex h-full items-center justify-center px-8 text-center text-base font-bold uppercase tracking-[0.16em] text-[#52615D]">Fotografía del producto pendiente</div>}
            {product.images.length > 1 && <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#243C3A]">{activeIndex + 1} / {product.images.length}</span>}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2" aria-label={`Galería de ${product.name}`}>
              {product.images.map((image, index) => (
                <button key={`${image.src}-${index}`} type="button" onClick={() => setActiveIndex(index)} aria-label={`Ver foto ${index + 1} de ${product.name}`} aria-pressed={activeIndex === index} className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border-2 bg-[#F4E8D8] transition-colors duration-200 sm:w-24 ${activeIndex === index ? "border-[#B6633A]" : "border-transparent hover:border-[#C6B9A9]"}`}>
                  <Image src={image.src} alt="" fill sizes="96px" className={galleryImageClassName(image)} />
                </button>
              ))}
            </div>
          )}
          {product.video && <div className="mt-8"><h2 className="mb-3 text-lg font-black text-[#243C3A]">Mírala en movimiento</h2><video controls playsInline loop preload="none" poster={product.video.poster} aria-label={product.video.label} className="max-h-[520px] w-full rounded-lg bg-[#243C3A] object-contain"><source src={product.video.src} type="video/mp4" />Tu navegador no puede reproducir este video.</video></div>}
        </div>
        <div className="min-w-0 self-start lg:sticky lg:top-28">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B6633A]">{officialCategoryLabels[product.category]}</p>
          <h1 className="mt-2 text-3xl font-black leading-tight text-[#243C3A] sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-base leading-7 text-[#52615D]">{product.description}</p>
          {inventory ? (
            <div className="mt-6 rounded-xl border border-[#E5DED4] bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#E5DED4] pb-5">
                <div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#52615D]">Precio</p><p className="mt-1 text-3xl font-black text-[#243C3A]" aria-live="polite">{selectedVariant ? formatClp(selectedVariant.priceClp) : "—"}</p></div>
                <span className="rounded-full bg-[#EAF3EB] px-3 py-1.5 text-xs font-bold text-[#245C43]">{ready && availableToAdd === 0 ? "En tu carrito" : "Disponible"}</span>
              </div>
              <div className="mt-6">
                <h2 className="text-base font-black text-[#243C3A]">{hasDesignChoices ? "Elige tu diseño" : "Elige tu talla"}</h2>
                <div className={`mt-3 grid gap-2 ${hasDesignChoices ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-3 sm:grid-cols-4"}`} aria-label={hasDesignChoices ? "Diseños disponibles" : "Tallas disponibles"}>
                  {inventory.variants.map((variant) => {
                    const variantId = getOfficialVariantId(product.slug, variant);
                    const selected = selectedVariantId === variantId;
                    const variantInCart = cart.find((item) => item.variantId === variantId)?.quantity ?? 0;
                    const remaining = Math.max(0, variant.units - variantInCart);
                    return (
                      <button key={variantId} type="button" aria-pressed={selected} onClick={() => { setSelectedVariantId(variantId); setQuantity(1); setNotice(""); if (variant.imageSrc) { const photoIndex = product.images.findIndex((image) => image.src === variant.imageSrc); if (photoIndex >= 0) setActiveIndex(photoIndex); } }} className={`min-h-16 rounded-lg border-2 px-3 py-2 text-left transition-colors duration-200 ${selected ? "border-[#B6633A] bg-[#FCF3EA]" : "border-[#E5DED4] bg-white hover:border-[#B6633A]"}`}>
                        <span className="flex items-center gap-3">
                          {variant.imageSrc && <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[#F4E8D8]"><Image src={variant.imageSrc} alt="" fill sizes="48px" className="object-cover" /></span>}
                          <span className="min-w-0"><span className="block text-sm font-black text-[#243C3A]">{variant.design ?? variant.size}</span><span className="block text-xs font-semibold text-[#52615D]">{hasDesignChoices ? `Talla ${variant.size} · ` : ""}{formatClp(variant.priceClp)}</span><span className="block text-[11px] text-[#52615D]">{remaining === 0 ? "En tu carrito" : remaining === 1 ? "Última unidad" : `${remaining} disponibles`}</span></span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                {product.category !== "accesorios" && <Link href="/guia-de-tallas" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#B6633A] hover:underline hover:underline-offset-4"><Ruler size={16} />{product.category === "abrigos" ? "Ver medidas de las parkas" : "¿Qué talla necesita mi perro?"}</Link>}
              </div>
              <div className="mt-6 border-t border-[#E5DED4] pt-5">
                {availableToAdd > 0 ? <div className="flex flex-wrap gap-3">
                  <div className="inline-flex h-12 items-center overflow-hidden rounded-lg border border-[#D8CEC1]" aria-label="Cantidad a agregar">
                    <button type="button" className="flex h-12 w-11 items-center justify-center disabled:opacity-40" aria-label="Restar unidad" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={17} /></button>
                    <span className="w-9 text-center text-sm font-black" aria-live="polite">{Math.min(quantity, availableToAdd)}</span>
                    <button type="button" className="flex h-12 w-11 items-center justify-center disabled:opacity-40" aria-label="Sumar unidad" disabled={!ready || quantity >= availableToAdd} onClick={() => setQuantity((value) => Math.min(value + 1, availableToAdd))}><Plus size={17} /></button>
                  </div>
                  <button type="button" disabled={!ready} onClick={() => { if (!selectedVariant) return; const amount = Math.min(quantity, availableToAdd); addItem(product.slug, selectedVariantId, amount); setQuantity(1); setNotice(`${amount} ${amount === 1 ? "unidad agregada" : "unidades agregadas"} al carrito`); }} className="inline-flex h-12 min-w-48 flex-1 items-center justify-center gap-2 rounded-lg bg-[#B6633A] px-5 text-sm font-black text-white transition-colors duration-200 hover:bg-[#96502E] disabled:cursor-not-allowed disabled:opacity-50"><ShoppingBag size={18} /> Agregar al carrito</button>
                </div> : <Link href="/carrito" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#243C3A] px-5 text-sm font-black text-white hover:bg-[#31514E]"><ShoppingBag size={18} /> Ver en mi carrito</Link>}
                <p className="mt-3 text-sm text-[#52615D]" aria-live="polite">{notice || (availableToAdd === 0 ? "Ya agregaste todas las unidades disponibles de esta opción." : hasDesignChoices ? "Selecciona tu diseño y agrégalo al carrito." : "Selecciona tu talla y agrégala al carrito.")}</p>
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-lg bg-[#F6F3EC] px-4 py-3 text-sm text-[#243C3A]"><Truck size={18} className="mt-0.5 shrink-0 text-[#B6633A]" /><p><strong>Envío a todo Chile por {formatClp(SHIPPING_FEE_CLP)}.</strong> <Link href="/envios" className="underline underline-offset-2">Ver información de envíos</Link></p></div>
              <p className="mt-4 text-xs leading-5 text-[#697873]">Stock informado el {inventoryAsOf}. Agregar al carrito no reserva la prenda. El pago en línea estará disponible próximamente.</p>
            </div>
          ) : <div className="mt-8 rounded-lg border border-[#E5DED4] bg-white p-6"><h2 className="text-lg font-black">Colección en preparación</h2><p className="mt-2 leading-7 text-[#52615D]">Precio, tallas y disponibilidad por confirmar. Por ahora puedes explorar las fotografías oficiales de este producto; todavía no recibimos compras en el sitio.</p></div>}
        </div>
      </div>
    </section>
  );
}
