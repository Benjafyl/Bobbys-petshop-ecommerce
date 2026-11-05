import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function PrivacyPage() {
  return (
    <InfoPage eyebrow="Legal" title="Politica de privacidad">
      <p>
        Politica pendiente de revision legal. La implementacion final debe cubrir datos de
        clientes, pedidos, mascotas, analitica y consentimiento.
      </p>
    </InfoPage>
  );
}
