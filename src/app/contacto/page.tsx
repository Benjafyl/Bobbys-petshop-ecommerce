import { InfoPage } from "@/components/info-page";

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Contacto" title="Hablemos">
      <p>
        WhatsApp y correo operativo quedan como configuracion editable para produccion. En esta
        base se evita dejar datos sensibles o bancarios escritos directamente en el codigo.
      </p>
    </InfoPage>
  );
}
