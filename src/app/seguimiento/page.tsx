import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function TrackingPage() {
  return (
    <InfoPage eyebrow="Pedido" title="Seguimiento">
      <p>El seguimiento estará disponible cuando habilitemos los pedidos en línea.</p>
    </InfoPage>
  );
}
