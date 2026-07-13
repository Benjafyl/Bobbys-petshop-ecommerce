import { InfoPage } from "@/components/info-page";

export default function FaqPage() {
  return (
    <InfoPage eyebrow="Ayuda" title="Preguntas frecuentes">
      <div className="grid gap-5">
        <p>
          <strong>Como se paga?</strong> En el MVP, por transferencia bancaria con revision
          manual del equipo.
        </p>
        <p>
          <strong>Como elijo talla?</strong> Mide cuello, pecho y espalda, luego compara con la
          guia de cada producto.
        </p>
        <p>
          <strong>Que pasa si se agota?</strong> La variante queda visible, pero bloqueada para
          compra.
        </p>
      </div>
    </InfoPage>
  );
}
