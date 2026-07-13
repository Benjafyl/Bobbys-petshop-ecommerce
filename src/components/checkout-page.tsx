"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CreditCard, PackageCheck } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useStore } from "@/components/store-provider";
import { type CartItem, enrichCart, formatPrice, getCartTotals } from "@/lib/commerce";

const QUICK_BUY_KEY = "bobbys-quick-buy-v1";

export function CheckoutPage() {
  const searchParams = useSearchParams();
  const { cart, clearCart } = useStore();
  const [quickBuy, setQuickBuy] = useState<CartItem | null>(null);
  const [delivery, setDelivery] = useState<"pickup" | "shipping">("shipping");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("modo") !== "rapida") {
      return;
    }

    const timer = window.setTimeout(() => {
      const stored = window.sessionStorage.getItem(QUICK_BUY_KEY);
      if (stored) {
        setQuickBuy(JSON.parse(stored) as CartItem);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [searchParams]);

  const items = useMemo(() => enrichCart(quickBuy ? [quickBuy] : cart), [cart, quickBuy]);
  const totals = getCartTotals(items, delivery === "shipping" ? 3990 : 0);

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const number = `BPS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
    setOrderNumber(number);
    window.sessionStorage.removeItem(QUICK_BUY_KEY);
    if (!quickBuy) {
      clearCart();
    }
  };

  if (orderNumber) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#E5DED4] bg-white p-6 text-center">
          <CheckCircle2 className="mx-auto text-[#2F6849]" size={44} />
          <h1 className="mt-4 text-3xl font-black text-[#243C3A]">Pedido creado</h1>
          <p className="mt-3 text-[#52615D]">
            Tu numero de pedido es <strong>{orderNumber}</strong>. El stock queda reservado
            mientras se revisa la transferencia.
          </p>
          <div className="mt-6 rounded-md bg-[#FFF8E6] p-4 text-left text-sm leading-6 text-[#243C3A]">
            <strong>Transferencia bancaria:</strong> los datos de pago se cargan desde
            configuracion segura del ambiente. Cuando esten definidos, se mostraran aqui y en
            el correo de confirmacion, sin quedar escritos en el repositorio.
          </div>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="rounded-md bg-[#B6633A] px-5 py-3 text-sm font-black text-white" href="/seguimiento">
              Ver seguimiento
            </Link>
            <Link className="rounded-md border border-[#C9B8A8] px-5 py-3 text-sm font-black" href="/tienda">
              Seguir comprando
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">
          Checkout
        </p>
        <h1 className="mt-2 text-4xl font-black text-[#243C3A]">
          {quickBuy ? "Compra rapida" : "Finalizar compra"}
        </h1>
      </div>

      <form className="grid gap-6 lg:grid-cols-[1fr_380px]" onSubmit={submitOrder}>
        <div className="grid gap-5">
          <section className="rounded-lg border border-[#E5DED4] bg-white p-5">
            <h2 className="text-xl font-black">Datos de contacto</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                Nombre completo
                <input required name="name" placeholder="Nombre y apellido" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Telefono
                <input required name="phone" placeholder="+56 9 ..." />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Correo
                <input required name="email" type="email" placeholder="correo@ejemplo.cl" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Region
                <input required name="region" placeholder="Region" />
              </label>
              <label className="grid gap-2 text-sm font-bold sm:col-span-2">
                Direccion
                <input required name="address" placeholder="Calle, numero, comuna" />
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-[#E5DED4] bg-white p-5">
            <h2 className="text-xl font-black">Entrega</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDelivery("shipping")}
                className={`rounded-md border p-4 text-left ${
                  delivery === "shipping" ? "border-[#B6633A] bg-[#FFF8E6]" : "border-[#E5DED4]"
                }`}
              >
                <PackageCheck size={20} />
                <span className="mt-3 block font-black">Despacho nacional</span>
                <span className="mt-1 block text-sm text-[#52615D]">Tarifa inicial configurable.</span>
              </button>
              <button
                type="button"
                onClick={() => setDelivery("pickup")}
                className={`rounded-md border p-4 text-left ${
                  delivery === "pickup" ? "border-[#B6633A] bg-[#FFF8E6]" : "border-[#E5DED4]"
                }`}
              >
                <PackageCheck size={20} />
                <span className="mt-3 block font-black">Retiro en Vina del Mar</span>
                <span className="mt-1 block text-sm text-[#52615D]">Direccion configurable en admin.</span>
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-[#E5DED4] bg-white p-5">
            <h2 className="flex items-center gap-2 text-xl font-black">
              <CreditCard size={20} />
              Pago
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#52615D]">
              MVP configurado para transferencia bancaria con revision manual. El comprobante se
              puede recibir por canal operativo mientras se habilita carga de archivo.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-[#E5DED4] bg-white p-5">
          <p className="text-xl font-black">Resumen</p>
          <div className="mt-4 grid gap-4">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between gap-3 text-sm">
                <span>
                  {item.quantity} x {item.product.name} {item.variant.size}
                </span>
                <strong>{formatPrice(item.lineTotal)}</strong>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 border-t border-[#E5DED4] pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{formatPrice(totals.subtotal)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Entrega</span>
              <strong>{formatPrice(totals.deliveryFee)}</strong>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-black">Total</span>
              <strong>{formatPrice(totals.total)}</strong>
            </div>
          </div>
          <button
            type="submit"
            disabled={items.length === 0}
            className="mt-5 h-12 w-full rounded-md bg-[#B6633A] px-5 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-[#C9B8A8]"
          >
            Crear pedido
          </button>
        </aside>
      </form>
    </section>
  );
}
