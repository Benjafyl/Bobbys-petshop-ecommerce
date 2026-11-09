import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { PICKUP_LOCATION } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Términos de compra",
  description: "Información sobre compras, pagos, entrega y postventa en Bobby's Pet Shop.",
  alternates: { canonical: "https://bobbyspetshop.cl/terminos" },
};

export default function TermsPage() {
  return (
    <InfoPage eyebrow="Legal" title="Términos de compra">
      <div className="space-y-5">
        <p>Los precios, tallas y disponibilidad aparecen en cada producto. Antes de pagar, revisa el resumen del pedido y elige envío a Chile por $5.000 o retiro sin costo en {PICKUP_LOCATION}. Coordinaremos contigo el retiro después de confirmar el pago.</p>
        <p>El pago se completa de forma segura en Mercado Pago con las opciones que muestre al momento de comprar. El pedido queda confirmado cuando Mercado Pago aprueba el cobro y te mostramos la confirmación. Te enviaremos el detalle de la compra al correo que indiques.</p>
        <p>Si un producto presenta una falla de origen, contáctanos para gestionar la garantía. En compras por internet también tienes derecho a retracto dentro de los 10 días desde que recibes el producto, en las condiciones que establece la ley. Conoce las opciones y cómo escribirnos en <Link className="underline" href="/cambios-y-devoluciones">Cambios y devoluciones</Link>.</p>
        <p>¿Necesitas ayuda con tu pedido? Escríbenos a <a className="underline" href="mailto:antonelarodil@gmail.com">antonelarodil@gmail.com</a> o usa el botón de WhatsApp del sitio.</p>
      </div>
    </InfoPage>
  );
}
