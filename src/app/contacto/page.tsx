import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";
import { whatsappProfileUrl } from "@/lib/social";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Habla con Bobby's Pet Shop por WhatsApp sobre ropa para mascotas, tallas, pedidos o envíos en Chile.",
  alternates: { canonical: "https://bobbyspetshop.cl/contacto" },
};

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Contacto" title="Hablemos">
      <p>¿Tienes una duda sobre tallas, productos o tu pedido? Hablemos por WhatsApp.</p>
      {whatsappProfileUrl && <a href={whatsappProfileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-lg bg-[#25D366] px-5 py-3 font-bold text-[#163B27] hover:bg-[#20BD5C]">Escríbenos por WhatsApp</a>}
    </InfoPage>
  );
}
