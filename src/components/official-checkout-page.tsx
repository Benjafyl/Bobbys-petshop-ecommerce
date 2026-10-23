"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, LockKeyhole, Truck } from "lucide-react";
import { useOfficialCart } from "@/components/official-cart-provider";
import { getOfficialCartLines } from "@/lib/official-cart";
import { formatClp } from "@/lib/public-inventory";
import { SHIPPING_FEE_CLP } from "@/lib/shipping";

const regions = ["Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", "Metropolitana de Santiago", "Libertador General Bernardo O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes y de la Antártica Chilena"];
const field = "mt-2 min-h-12 w-full rounded-lg border border-[#D8CEC1] bg-white px-3 text-sm text-[#243C3A] outline-none focus:border-[#B6633A] focus:ring-2 focus:ring-[#B6633A]/20";
const label = "block text-sm font-bold text-[#243C3A]";

export function OfficialCheckoutPage({ checkoutEnabled, initialCoupon }: { checkoutEnabled: boolean; initialCoupon: string }) {
  const { cart, ready, inventory, inventoryError } = useOfficialCart();
  const [couponCode, setCouponCode] = useState(initialCoupon);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountClp: number; signature: string } | null>(null);
  const [startingPayment, setStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const lines = getOfficialCartLines(cart, inventory);
  const signature = JSON.stringify(cart);
  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
  const discount = appliedCoupon?.signature === signature ? appliedCoupon.discountClp : 0;
  const total = subtotal + (lines.length ? SHIPPING_FEE_CLP : 0) - discount;

  async function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckingCoupon(true);
    setCouponMessage("");
    setAppliedCoupon(null);
    try {
      const response = await fetch("/api/storefront/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cart: cart.map(({ variantId, quantity }) => ({ variantId, quantity })) }),
      });
      const result = await response.json() as { valid: boolean; code?: string; discountClp?: number; message?: string };
      if (result.valid && result.code && typeof result.discountClp === "number") {
        setAppliedCoupon({ code: result.code, discountClp: result.discountClp, signature });
        setCouponMessage("Código " + result.code + " aplicado al resumen.");
      } else setCouponMessage(result.message ?? "No pudimos aplicar el código.");
    } catch { setCouponMessage("No pudimos revisar el código. Inténtalo más tarde."); }
    setCheckingCoupon(false);
  }

  async function startPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checkoutEnabled || startingPayment) return;
    setStartingPayment(true);
    setPaymentError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/payments/mercadopago/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(["givenName", "familyName", "email", "phone", "address", "addressExtra", "city", "region"].map((key) => [key, String(data.get(key) ?? "")])),
          couponCode: appliedCoupon?.signature === signature ? appliedCoupon.code : "",
          cart: cart.map(({ variantId, quantity }) => ({ variantId, quantity })),
        }),
      });
      const result = await response.json() as { checkoutUrl?: string; message?: string };
      if (!response.ok || !result.checkoutUrl) throw new Error(result.message ?? "No pudimos iniciar el pago.");
      const target = new URL(result.checkoutUrl);
      if (target.protocol !== "https:" || !["mercadopago.cl", "mercadopago.com"].some((domain) => target.hostname === domain || target.hostname.endsWith(`.${domain}`))) throw new Error("El enlace de pago no es válido.");
      window.location.assign(target.toString());
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "No pudimos iniciar el pago.");
      setStartingPayment(false);
    }
  }

  if (!ready) return <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><h1 className="text-4xl font-black">Finalizar compra</h1><p className="mt-4">Cargando tu selección…</p></section>;
  if (inventoryError) return <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><h1 className="text-4xl font-black">Finalizar compra</h1><p className="mt-4">No pudimos consultar el stock. Tu carrito sigue guardado; vuelve a intentarlo en unos minutos.</p></section>;
  if (lines.length === 0) return <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6"><h1 className="text-4xl font-black text-[#243C3A]">Tu carrito está vacío</h1><Link href="/#coleccion" className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-[#B6633A] px-6 text-sm font-black text-white">Explorar la colección</Link></section>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/carrito" className="inline-flex items-center gap-2 text-sm font-bold text-[#B6633A]"><ArrowLeft size={17} /> Volver al carrito</Link>
      <div className="mt-5"><p className="text-sm font-black uppercase tracking-[0.16em] text-[#B6633A]">Tu pedido</p><h1 className="mt-2 text-4xl font-black text-[#243C3A]">Finalizar compra</h1></div>
      {!checkoutEnabled && <div className="mt-6 rounded-lg border border-[#E8D8BD] bg-[#FFF8E9] p-4 text-sm leading-6 text-[#684D2B]" role="status"><LockKeyhole size={18} className="mr-2 inline align-text-bottom" /> Estamos preparando el pago seguro. Puedes revisar el formulario, pero aún no se reciben pedidos ni pagos.</div>}
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-6">
          <form id="delivery-form" onSubmit={startPayment} className="rounded-xl border border-[#E5DED4] bg-white p-5 sm:p-7">
            <h2 className="text-2xl font-black text-[#243C3A]">Contacto y entrega</h2>
            <p className="mt-2 text-sm text-[#52615D]">Podrás comprar como invitado. Usaremos estos datos para coordinar tu pedido y envío.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className={label}>Nombre<input className={field} name="givenName" autoComplete="given-name" placeholder="Tu nombre" required /></label>
              <label className={label}>Apellido<input className={field} name="familyName" autoComplete="family-name" placeholder="Tu apellido" required /></label>
              <label className={label + " sm:col-span-2"}>Correo electrónico<input className={field} type="email" name="email" autoComplete="email" placeholder="tu@correo.cl" required /></label>
              <label className={label + " sm:col-span-2"}>Teléfono<input className={field} type="tel" name="phone" autoComplete="tel" placeholder="+56 9 1234 5678" required /></label>
              <label className={label + " sm:col-span-2"}>Dirección<input className={field} name="address" autoComplete="street-address" placeholder="Calle y número" required /></label>
              <label className={label + " sm:col-span-2"}>Casa, departamento o referencia (opcional)<input className={field} name="addressExtra" placeholder="Información adicional para la entrega" /></label>
              <label className={label}>Comuna<input className={field} name="city" autoComplete="address-level2" placeholder="Tu comuna" required /></label>
              <label className={label}>Región<select className={field} name="region" autoComplete="address-level1" defaultValue="" required><option value="" disabled>Selecciona una región</option>{regions.map((region) => <option key={region} value={region}>{region}</option>)}</select></label>
            </div>
          </form>
          <div className="rounded-xl border border-[#E5DED4] bg-white p-5 sm:p-7">
            <h2 className="text-2xl font-black text-[#243C3A]">Envío y pago</h2>
            <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-[#D8CEC1] p-4 text-sm"><span className="flex items-center gap-3 font-bold"><Truck size={20} className="text-[#B6633A]" /> Envío a todo Chile</span><strong>{formatClp(SHIPPING_FEE_CLP)}</strong></div>
            <p className="mt-4 text-sm leading-6 text-[#52615D]">{checkoutEnabled ? "Al continuar, elegirás tu medio de pago en Mercado Pago." : "Los medios de pago aparecerán aquí cuando la cuenta de comercio esté conectada y probada."}</p>
          </div>
        </div>
        <aside className="rounded-xl border border-[#E5DED4] bg-white p-5 lg:sticky lg:top-32">
          <h2 className="text-2xl font-black text-[#243C3A]">Resumen</h2>
          <div className="mt-5 space-y-4">{lines.map((line) => {
            const photo = line.variant.imageSrc ?? line.product.images[0]?.src;
            return <div key={line.variantId} className="flex gap-3 border-b border-[#EEE7DF] pb-4"><div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-[#F4E8D8]">{photo && <Image src={photo} alt="" fill sizes="64px" className="object-cover" />}</div><div className="min-w-0 flex-1"><p className="text-sm font-black text-[#243C3A]">{line.product.name}</p><p className="mt-1 text-xs text-[#52615D]">{line.variant.design ? line.variant.design + " · " : ""}Talla {line.variant.size} · {line.quantity} {line.quantity === 1 ? "unidad" : "unidades"}</p><strong className="mt-2 block text-sm">{formatClp(line.lineTotal)}</strong></div></div>;
          })}</div>
          <form onSubmit={applyCoupon} className="mt-5"><label htmlFor="checkout-coupon" className={label}>Código de descuento</label><div className="mt-2 flex gap-2"><input id="checkout-coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} maxLength={32} placeholder="Tu código" className="min-w-0 flex-1 rounded-lg border border-[#D8CEC1] px-3 py-2 text-sm" /><button disabled={checkingCoupon || !couponCode.trim()} className="rounded-lg border border-[#B6633A] px-3 py-2 text-sm font-black text-[#B6633A] disabled:opacity-50">Aplicar</button></div><p role="status" className="mt-2 text-xs text-[#52615D]">{couponMessage}</p></form>
          <div className="mt-5 space-y-3 border-t border-[#E5DED4] pt-4 text-sm"><div className="flex justify-between"><span>Productos</span><strong>{formatClp(subtotal)}</strong></div><div className="flex justify-between"><span>Envío</span><strong>{formatClp(SHIPPING_FEE_CLP)}</strong></div>{discount > 0 && <div className="flex justify-between text-[#245C43]"><span>Descuento {appliedCoupon?.code}</span><strong>−{formatClp(discount)}</strong></div>}</div>
          <div className="mt-4 flex justify-between border-t border-[#E5DED4] pt-4 text-lg font-black"><span>Total</span><span>{formatClp(total)}</span></div>
          <button type="submit" form="delivery-form" disabled={!checkoutEnabled || startingPayment} className={`mt-6 min-h-12 w-full rounded-lg px-4 text-sm font-black ${checkoutEnabled ? "bg-[#B6633A] text-white hover:bg-[#9F542F] disabled:opacity-60" : "bg-[#D8CEC1] text-[#52615D]"}`}>{checkoutEnabled ? (startingPayment ? "Abriendo Mercado Pago…" : "Pagar con Mercado Pago") : "Pago en línea próximamente"}</button>
          {paymentError && <p role="alert" className="mt-3 text-sm font-bold text-red-700">{paymentError}</p>}
          <p className="mt-3 text-xs leading-5 text-[#52615D]">{checkoutEnabled ? "El pago se realiza de forma segura en Mercado Pago." : "No se enviarán tus datos hasta que habilitemos la compra segura."}</p>
        </aside>
      </div>
    </section>
  );
}
