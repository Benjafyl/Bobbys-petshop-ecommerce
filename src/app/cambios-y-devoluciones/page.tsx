import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { whatsappProfileUrl } from "@/lib/social";

export const metadata: Metadata = {
  title: "Cambios y devoluciones",
  description: "Conoce las opciones de garantía, cambios y devoluciones de Bobby's Pet Shop y contáctanos por WhatsApp para revisar tu caso.",
  alternates: { canonical: "https://bobbyspetshop.cl/cambios-y-devoluciones" },
};

export default function ReturnsPage() {
  return (
    <InfoPage eyebrow="Postventa" title="Cambios y devoluciones">
      <div className="space-y-4">
        <p>Si tu prenda presenta una falla, como una costura descosida o un cierre defectuoso, escríbenos. Revisaremos contigo lo ocurrido y cómo resolverlo.</p>
        <p>Durante los seis meses siguientes a la entrega, la garantía legal te permite elegir entre reparación gratuita, cambio o devolución del dinero cuando corresponde. Los daños causados por uso indebido no están cubiertos por esta garantía.</p>
        <p>En compras por internet también puedes solicitar el retracto dentro de los 10 días desde que recibes el producto, siempre que no lo hayas usado.</p>
        <a href={whatsappProfileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-md bg-[#25D366] px-5 py-3 text-sm font-black text-[#163B27]">Consultar por WhatsApp</a>
      </div>
    </InfoPage>
  );
}
