import { InfoPage } from "@/components/info-page";

export default function ShippingPage() {
  return (
    <InfoPage eyebrow="Logistica" title="Envios y retiro">
      <p>
        El MVP contempla retiro en Vina del Mar y despacho nacional con tarifa configurable.
        Los tiempos de preparacion, transportista y codigo de seguimiento se administraran desde
        el panel cuando el pedido este pagado.
      </p>
    </InfoPage>
  );
}
