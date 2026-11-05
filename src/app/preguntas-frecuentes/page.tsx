import { InfoPage } from "@/components/info-page";
import { formatClp } from "@/lib/public-inventory";
import { SHIPPING_FEE_CLP } from "@/lib/shipping";

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
      </div>
    </InfoPage>
  );
}
