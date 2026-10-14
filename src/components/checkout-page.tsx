"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Info, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/components/store-provider";
import { type CartItem, enrichCart, formatPrice, getCartTotals } from "@/lib/commerce";

const QUICK_BUY_KEY = "bobbys-quick-buy-v1";

export function CheckoutPage() {
  const searchParams = useSearchParams();
  const { cart } = useStore();
  const [quickBuy, setQuickBuy] = useState<CartItem | null>(null);

  useEffect(() => {
    if (searchParams.get("modo") !== "rapida") return;
    const timer = window.setTimeout(() => {
      const stored = window.sessionStorage.getItem(QUICK_BUY_KEY);
      if (!stored) return;
      try {
        setQuickBuy(JSON.parse(stored) as CartItem);
      } catch {
        window.sessionStorage.removeItem(QUICK_BUY_KEY);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [searchParams]);

  const items = useMemo(() => enrichCart(quickBuy ? [quickBuy] : cart), [cart, quickBuy]);
  const totals = getCartTotals(items);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">Resumen</p>
      <h1 className="mt-2 text-4xl font-black text-[#243C3A]">Tu selección</h1>
      <div className="mt-6 rounded-lg border border-[#E5DED4] bg-white p-6">
        {items.length === 0 ? (
          <p className="text-[#52615D]">Aún no hay productos en tu selección.</p>
        ) : (
          <>
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex justify-between gap-4 border-b border-[#E5DED4] pb-4 text-sm">
                  <span>{item.quantity} × {item.product.name} · {item.variant.size}</span>
                  <strong>{formatPrice(item.lineTotal)}</strong>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between text-lg font-black">
              <span>Subtotal referencial</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
          </>
        )}
      </div>
      <div className="mt-6 flex gap-3 rounded-lg border border-[#E5DED4] bg-[#FFF8E6] p-5 text-sm leading-6 text-[#6F4B22]">
        <Info className="mt-1 shrink-0" size={20} />
        <p>
          La tienda está en preparación. Este resumen no crea un pedido ni reserva stock.
          Confirmaremos productos, precios, medios de pago y entrega antes de habilitar compras.
        </p>
      </div>
      <Link href="/tienda" className="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-[#243C3A] px-5 text-sm font-black text-white">
        <ShoppingBag size={18} /> Volver a la tienda
      </Link>
    </section>
  );
}
