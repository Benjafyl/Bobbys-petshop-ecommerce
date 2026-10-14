import { InfoPage } from "@/components/info-page";

export default function FaqPage() {
  return (
    <InfoPage eyebrow="Ayuda" title="Preguntas frecuentes">
      <div className="grid gap-5">
        <p>
          <strong>¿Cómo se paga?</strong> Los medios de pago se informarán cuando habilitemos las compras.
        </p>
        <p>
          <strong>¿Cómo elijo talla?</strong> Mide cuello, pecho y espalda. Publicaremos las medidas
          específicas de cada prenda cuando estén confirmadas.
        </p>
        <p>
          <strong>¿Ya hay precios y stock?</strong> Todavía no. El catálogo muestra fotos oficiales;
          publicaremos precios, tallas y disponibilidad antes de recibir pedidos.
        </p>
      </div>
    </InfoPage>
  );
}
