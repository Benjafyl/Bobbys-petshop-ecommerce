import { InfoPage } from "@/components/info-page";

export default function TrackingPage() {
  return (
    <InfoPage eyebrow="Pedido" title="Seguimiento">
      <form className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold">
          Numero de pedido
          <input placeholder="BPS-2026-12345" />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          Correo usado en la compra
          <input type="email" placeholder="correo@ejemplo.cl" />
        </label>
        <button className="h-12 rounded-md bg-[#B6633A] px-5 text-sm font-black text-white" type="button">
          Consultar estado
        </button>
      </form>
    </InfoPage>
  );
}
