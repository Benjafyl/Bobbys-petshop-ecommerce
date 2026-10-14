import type { Metadata } from "next";
import { sizeGuides } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Guia de tallas",
  description: "Medidas de cuello, pecho y espalda para elegir parkas y chalecos.",
};

export default function SizeGuidePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">
          Guia de tallas
        </p>
        <h1 className="mt-2 text-4xl font-black text-[#243C3A]">Mide antes de comprar</h1>
        <p className="mt-3 text-base leading-7 text-[#52615D]">
          Usa una huincha flexible y mide con tu perro de pie. Si queda entre dos tallas,
          prioriza pecho y espalda, y revisa el calce de cada prenda.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {Object.entries(sizeGuides).map(([category, rows]) => (
          <article key={category} className="overflow-hidden rounded-lg border border-[#E5DED4] bg-white">
            <div className="border-b border-[#E5DED4] bg-[#243C3A] px-5 py-4 text-white">
              <h2 className="text-xl font-black">
                {category === "parka-impermeable" ? "Parkas impermeables" : category === "chaleco" ? "Chalecos" : "Accesorios (referencial)"}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-[#F4E8D8] text-[#243C3A]">
                  <tr>
                    <th className="px-4 py-3">Talla</th>
                    <th className="px-4 py-3">Cuello</th>
                    <th className="px-4 py-3">Pecho</th>
                    <th className="px-4 py-3">Espalda</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.size} className="border-t border-[#E5DED4]">
                      <td className="px-4 py-3 font-black">{row.size}</td>
                      <td className="px-4 py-3">{row.neck === "—" ? "—" : `${row.neck} cm`}</td>
                      <td className="px-4 py-3">{row.chest === "—" ? "—" : `${row.chest} cm`}</td>
                      <td className="px-4 py-3">{row.back === "—" ? "—" : `${row.back} cm`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
