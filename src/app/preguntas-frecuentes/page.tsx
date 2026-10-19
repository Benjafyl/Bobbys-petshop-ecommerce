import { InfoPage } from "@/components/info-page";

export default function FaqPage() {
  return (
    <InfoPage eyebrow="Ayuda" title="Preguntas frecuentes">
      <div className="grid gap-5">
        <p>
          <strong>¿Cómo se paga?</strong> Los medios de pago se informarán cuando habilitemos las compras.
        </p>
        <p>
          <strong>¿Cómo elijo talla?</strong> Mide cuello, pecho y espalda. La guía incluye una tabla
          de medidas de parkas M a XXL; revisa qué tallas están disponibles en la ficha de cada producto.
        </p>
        <p>
          <strong>¿Ya hay precios y tallas?</strong> Cada producto del catálogo muestra precio,
          talla y unidades informadas el 19 de octubre de 2026. Confirma disponibilidad antes de comprar.
        </p>
      </div>
    </InfoPage>
  );
}
