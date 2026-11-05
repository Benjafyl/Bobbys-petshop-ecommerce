import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function TermsPage() {
  return (
    <InfoPage eyebrow="Legal" title="Terminos y condiciones">
      <p>
        Texto legal pendiente de revision antes de produccion. Esta pagina queda disponible para
        cargar la version aprobada.
      </p>
    </InfoPage>
  );
}
