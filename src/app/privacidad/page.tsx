import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Conoce cómo Bobby's Pet Shop usa tus datos para preparar pedidos y cómo eliges la medición del sitio.",
  alternates: { canonical: "https://bobbyspetshop.cl/privacidad" },
};

export default function PrivacyPage() {
  return (
    <InfoPage eyebrow="Legal" title="Privacidad">
      <div className="space-y-5">
        <p>En Bobby&apos;s Pet Shop usamos los datos que entregas al comprar o crear una cuenta —nombre, contacto, dirección y pedido— para procesar el pago, preparar la entrega y atender consultas. Puedes escribirnos a <a className="underline" href="mailto:antonelarodil@gmail.com">antonelarodil@gmail.com</a> para consultar, corregir o solicitar la eliminación de tus datos cuando corresponda.</p>
        <p>El pago se realiza en Mercado Pago. Compartimos con ese servicio los datos necesarios para iniciar y confirmar la compra. No recibimos los datos completos de tu tarjeta. Conservamos los registros de pedidos y pagos necesarios para atención, gestión del negocio y obligaciones legales.</p>
        <p>Solo si pulsas <strong>Aceptar</strong> activamos Google Analytics y la herramienta de medición de Meta. Registran visitas, productos vistos, carritos y compras, junto con identificadores del navegador. Google Analytics también mide la procedencia de las visitas cuando usas un enlace de campaña. Usamos estos datos para mejorar la tienda y evaluar nuestros anuncios. No enviamos tu nombre, correo, teléfono ni dirección a estas herramientas. Puedes rechazar la medición o cambiar tu decisión en cualquier momento desde <strong>Preferencias de privacidad</strong>, al pie de la página. Al rechazarla, dejamos de enviar nuevos eventos.</p>
        <p>El sitio también utiliza almacenamiento necesario para mantener tu carrito y tu sesión. Para consultas sobre esta política, escríbenos al correo indicado arriba.</p>
      </div>
    </InfoPage>
  );
}
