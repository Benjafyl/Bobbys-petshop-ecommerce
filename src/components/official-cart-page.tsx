"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useOfficialCart } from "@/components/official-cart-provider";
import { getOfficialCartLines } from "@/lib/official-cart";
import { formatClp, inventoryAsOf } from "@/lib/public-inventory";
import { SHIPPING_FEE_CLP } from "@/lib/shipping";

export function OfficialCartPage() {
  const { cart, ready, inventory, inventoryError, setQuantity, removeItem, clearCart } = useOfficialCart();
  const lines = getOfficialCartLines(cart, inventory);
  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
  const total = subtotal + (lines.length > 0 ? SHIPPING_FEE_CLP : 0);

  if (!ready) {
    return <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"><h1 className="text-4xl font-black">Tu carrito</h1><p className="mt-4 text-[#52615D]">Cargando tu selección…</p></section>;
  }

  if (inventoryError) return <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"><h1 className="text-4xl font-black">Tu carrito</h1><p className="mt-4 text-[#52615D]">No pudimos consultar el stock actual. Tu selección sigue guardada; recarga la página en unos minutos.</p></section>;

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4E8D8] text-[#B6633A]"><ShoppingBag size={28} /></span>
        <h1 className="mt-6 text-4xl font-black text-[#243C3A]">Tu carrito está vacío</h1>
        <p className="mt-4 leading-7 text-[#52615D]">Elige tus prendas favoritas y agrégalas con su talla o diseño.</p>
        <Link href="/#coleccion" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#B6633A] px-6 text-sm font-black text-white"><ShoppingBag size={18} /> Explorar la colección</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/#coleccion" className="inline-flex items-center gap-2 text-sm font-black text-[#B6633A]"><ArrowLeft size={17} /> Seguir explorando</Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm font-black uppercase tracking-[0.16em] text-[#B6633A]">Tu selección</p><h1 className="mt-2 text-4xl font-black text-[#243C3A]">Tu carrito</h1></div>
        <button type="button" onClick={clearCart} className="text-sm font-bold text-[#52615D] underline underline-offset-4 hover:text-[#B6633A]">Vaciar carrito</button>
      </div>
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {lines.map((line) => {
            const photo = line.variant.imageSrc ?? line.product.images[0]?.src;
            return (
              <article key={line.variantId} className="grid grid-cols-[94px_minmax(0,1fr)] gap-4 rounded-lg border border-[#E5DED4] bg-white p-3 sm:grid-cols-[132px_minmax(0,1fr)] sm:p-4">
                <Link href={`/producto/${line.productSlug}`} className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#F4E8D8]">
                  {photo && <Image src={photo} alt={line.product.name} fill sizes="(min-width: 640px) 132px, 94px" className="object-cover" />}
                </Link>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0"><Link href={`/producto/${line.productSlug}`} className="text-base font-black text-[#243C3A] hover:text-[#B6633A] sm:text-lg">{line.product.name}</Link><p className="mt-1 text-sm text-[#52615D]">{line.variant.design ? `${line.variant.design} · ` : ""}Talla {line.variant.size}</p></div>
                    <strong className="text-base text-[#243C3A] sm:text-lg">{formatClp(line.lineTotal)}</strong>
                  </div>
                  <p className="mt-2 text-xs text-[#52615D]">{formatClp(line.variant.priceClp)} cada uno · máximo {line.variant.units} {line.variant.units === 1 ? "unidad" : "unidades"}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex h-10 items-center overflow-hidden rounded-md border border-[#D8CEC1]" aria-label={`Cantidad de ${line.product.name}, talla ${line.variant.size}`}>
                      <button type="button" onClick={() => setQuantity(line.variantId, line.quantity - 1)} className="flex h-10 w-10 items-center justify-center hover:bg-[#F4E8D8]" aria-label={`Restar una unidad de ${line.product.name}`}><Minus size={16} /></button>
                      <span className="w-9 text-center text-sm font-black" aria-live="polite">{line.quantity}</span>
                      <button type="button" disabled={line.quantity >= line.variant.units} onClick={() => setQuantity(line.variantId, line.quantity + 1)} className="flex h-10 w-10 items-center justify-center hover:bg-[#F4E8D8] disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Sumar una unidad de ${line.product.name}`}><Plus size={16} /></button>
                    </div>
                    <button type="button" onClick={() => removeItem(line.variantId)} className="inline-flex items-center gap-1 text-sm font-bold text-[#B6633A] hover:underline"><Trash2 size={16} /> Quitar</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <aside className="rounded-lg border border-[#E5DED4] bg-white p-5 lg:sticky lg:top-32">
          <h2 className="text-xl font-black text-[#243C3A]">Resumen</h2>
          <div className="mt-5 flex justify-between gap-3 text-sm"><span>Productos ({lines.reduce((count, line) => count + line.quantity, 0)})</span><strong>{formatClp(subtotal)}</strong></div>
          <div className="mt-3 flex justify-between gap-3 border-b border-[#E5DED4] pb-4 text-sm"><span>Envío a todo Chile</span><strong>{formatClp(SHIPPING_FEE_CLP)}</strong></div>
          <div className="mt-4 flex items-center justify-between text-lg font-black"><span>Total</span><span>{formatClp(total)}</span></div>
          <p className="mt-4 text-sm leading-6 text-[#52615D]">El envío cuesta {formatClp(SHIPPING_FEE_CLP)} por pedido, sin importar el destino dentro de Chile. Agregar al carrito no reserva stock.</p>
          <button type="button" disabled className="mt-6 flex min-h-12 w-full items-center justify-center rounded-md bg-[#D8CEC1] px-4 text-sm font-black text-[#52615D]">Pago en línea próximamente</button>
          <p className="mt-3 text-xs leading-5 text-[#52615D]">Disponibilidad informada el {inventoryAsOf}. Confirma disponibilidad antes de comprar.</p>
          <Link href="/#coleccion" className="mt-5 flex min-h-11 items-center justify-center rounded-md border border-[#D8CEC1] text-sm font-black text-[#243C3A]">Seguir comprando</Link>
        </aside>
      </div>
    </section>
  );
}
