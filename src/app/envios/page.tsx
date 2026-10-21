import { InfoPage } from "@/components/info-page";
import { formatClp } from "@/lib/public-inventory";
import { SHIPPING_FEE_CLP } from "@/lib/shipping";

export default function ShippingPage() {
  return (
    <InfoPage eyebrow="Logística" title="Envíos a todo Chile">
      <p>
        Tarifa única de {formatClp(SHIPPING_FEE_CLP)} por pedido para cualquier destino dentro de Chile.
        Verás este costo sumado a los productos en tu carrito.
      </p>
      <p>Los plazos y el transportista se informarán cuando habilitemos el pago en línea.</p>
    </InfoPage>
  );
}
