"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { enrichCart, formatPrice, getCartTotals } from "@/lib/commerce";

export function CartPage() {
  const { cart, updateQuantity, removeItem } = useStore();
  const lines = enrichCart(cart);
  const totals = getCartTotals(lines);

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-[#243C3A]">Tu carrito esta vacio</h1>
        <p className="mt-3 text-[#52615D]">Agrega una parka o chaleco para continuar al checkout.</p>
        <Link
          href="/tienda"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-[#B6633A] px-5 text-sm font-black text-white"
        >
          Ir a la tienda
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-[#243C3A]">Carrito</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {lines.map((line) => (
            <article key={line.variantId} className="grid gap-4 rounded-lg border border-[#E5DED4] bg-white p-4 sm:grid-cols-[130px_1fr]">
              <div className="relative aspect-square overflow-hidden rounded-md bg-[#F4E8D8]">
                <Image src={line.product.image} alt={line.product.alt} fill sizes="130px" className="object-cover" />
              </div>
              <div className="grid gap-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <Link href={`/producto/${line.product.slug}`} className="text-lg font-black text-[#243C3A]">
                      {line.product.name}
                    </Link>
                    <p className="mt-1 text-sm text-[#52615D]">
                      {line.variant.size} · {line.variant.colorName} · {line.variant.sku}
                    </p>
                  </div>
                  <p className="text-lg font-black">{formatPrice(line.lineTotal)}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex h-10 items-center overflow-hidden rounded-md border border-[#E5DED4] bg-[#FBF7F1]">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center"
                      aria-label="Restar unidad"
                      onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center text-sm font-black">{line.quantity}</span>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center"
                      aria-label="Sumar unidad"
                      onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-black text-[#B6633A]"
                    onClick={() => removeItem(line.variantId)}
                  >
                    <Trash2 size={16} />
                    Quitar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-lg border border-[#E5DED4] bg-white p-5">
          <p className="text-lg font-black">Resumen</p>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{formatPrice(totals.subtotal)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Despacho</span>
              <strong>Se calcula en checkout</strong>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-md bg-[#B6633A] px-5 text-sm font-black text-white"
          >
            Continuar al checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}
