import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/info-page";
import { formatClp } from "@/lib/public-inventory";
import { SHIPPING_FEE_CLP } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Preguntas frecuentes sobre ropa para mascotas",
  description: "Cómo comprar ropa para tu perro, elegir la talla, pagar con Mercado Pago y recibir tu pedido en Chile.",
  alternates: { canonical: "https://bobbyspetshop.cl/preguntas-frecuentes" },
};

export default function FaqPage() {
  return (
    <InfoPage eyebrow="Ayuda" title="Preguntas frecuentes">
      <div className="grid gap-5">
        <p>
          <strong>¿Cómo se paga?</strong> Al finalizar tu compra, pagas de forma segura con Mercado Pago. Puedes elegir entre los medios disponibles, como tarjeta de crédito, débito o saldo de Mercado Pago.
        </p>
        <p>
          <strong>¿Cómo elijo talla?</strong> Mide cuello, pecho y espalda. La guía incluye una tabla
          de medidas de parkas M a XXL; revisa qué tallas están disponibles en la ficha de cada producto.
        </p>
        <p>
          <strong>¿Cuánto cuesta el envío?</strong> {formatClp(SHIPPING_FEE_CLP)} por pedido a cualquier destino dentro de Chile.
        </p>
        <p>
          <strong>¿Cómo elijo ropa para un perro salchicha?</strong> Mide su espalda, pecho y cuello antes de comprar. Bobby es salchicha y nos inspiró a buscar prendas que le queden cómodas. Consulta nuestra <Link href="/guia-de-tallas" className="font-bold text-[#B6633A] underline">guía de tallas</Link> y compara esas medidas con cada prenda.
        </p>
      </div>
    </InfoPage>
  );
}
