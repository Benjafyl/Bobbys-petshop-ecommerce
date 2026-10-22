import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cómo medir a tu perro | Guía de tallas",
  description: "Aprende dónde medir el cuello, pecho y espalda de tu perro para elegir su ropa. Consulta también las medidas disponibles de parkas Bobby's Pet Shop.",
};

const measures = [
  { number: "01", title: "Cuello", copy: "Mide alrededor de la base del cuello, dejando espacio para que la prenda no apriete." },
  { number: "02", title: "Pecho", copy: "Rodea la parte más ancha del pecho, justo detrás de las patas delanteras." },
  { number: "03", title: "Espalda", copy: "Mide desde la base del cuello hasta el inicio de la cola con tu perro de pie." },
];

const parkaSizes = [
  { size: "M", back: 39, neck: 36, chest: 48 },
  { size: "L", back: 50, neck: 44, chest: 56 },
  { size: "XL", back: 52, neck: 48, chest: 64 },
  { size: "XXL", back: 58, neck: 52, chest: 72 },
];

export default function SizeGuidePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">Guía de tallas</p>
        <h1 className="mt-2 text-4xl font-black text-[#243C3A]">Cómo medir a tu perro</h1>
        <p className="mt-3 text-base leading-7 text-[#52615D]">Con una huincha flexible y tu perro de pie, mide cuello, pecho y espalda antes de elegir su ropa.</p>
      </div>

      <figure className="mt-8 overflow-hidden rounded-lg border border-[#E5DED4] bg-[#F4E8D8]">
        <Image src="/images/official/guia-medidas-perro.jpeg" alt="Bobby muestra con flechas los puntos para medir cuello, pecho y espalda" width={1536} height={1024} sizes="(min-width: 1152px) 1080px, 100vw" className="h-auto w-full" priority />
      </figure>

      <div className="mt-10">
        <h2 className="text-2xl font-black text-[#243C3A]">Las tres medidas de cada prenda</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {measures.map((measure) => <article key={measure.number} className="rounded-lg border border-[#E5DED4] bg-white p-6"><p className="text-sm font-black text-[#B6633A]">{measure.number}</p><h3 className="mt-3 text-xl font-black">{measure.title}</h3><p className="mt-2 text-sm leading-6 text-[#52615D]">{measure.copy}</p></article>)}
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-lg border border-[#E5DED4] bg-white">
        <div className="border-b border-[#E5DED4] px-5 py-5 sm:px-6">
          <h2 className="text-2xl font-black text-[#243C3A]">Tabla de medidas de parkas</h2>
          <p className="mt-1 text-sm text-[#52615D]">Todas las medidas están en centímetros.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-left text-sm">
            <thead className="bg-[#F4E8D8] text-[#243C3A]">
              <tr>
                <th scope="col" className="px-5 py-4 font-black sm:px-6">Talla</th>
                <th scope="col" className="px-5 py-4 font-black">Espalda</th>
                <th scope="col" className="px-5 py-4 font-black">Cuello</th>
                <th scope="col" className="px-5 py-4 font-black">Pecho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DED4]">
              {parkaSizes.map((row) => (
                <tr key={row.size}>
                  <th scope="row" className="px-5 py-4 font-black text-[#243C3A] sm:px-6">{row.size}</th>
                  <td className="px-5 py-4">{row.back} cm</td>
                  <td className="px-5 py-4">{row.neck} cm</td>
                  <td className="px-5 py-4">{row.chest} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 rounded-lg bg-[#F4E8D8] p-5 text-sm leading-7 text-[#52615D]">Esta tabla es una referencia de medidas de parkas, no una lista de stock. Revisa las tallas disponibles en la ficha de cada modelo. No tenemos una medida confirmada para la talla S; la tabla también incluye XXL aunque no hay unidades XXL informadas en el inventario actual.</p>

      <Link href="/#abrigos" className="mt-8 inline-flex rounded-md bg-[#B6633A] px-5 py-3 text-sm font-black text-white">Ver parkas disponibles</Link>
    </section>
  );
}
