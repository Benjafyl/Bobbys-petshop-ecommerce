import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Cómo medir a tu perro", description: "Consejos para medir cuello, pecho y espalda antes de elegir ropa para perros." };

const measures = [
  { number: "01", title: "Cuello", copy: "Mide alrededor de la base del cuello, dejando espacio para que la prenda no apriete." },
  { number: "02", title: "Pecho", copy: "Rodea la parte más ancha del pecho, justo detrás de las patas delanteras." },
  { number: "03", title: "Espalda", copy: "Mide desde la base del cuello hasta el inicio de la cola con tu perro de pie." },
];

export default function SizeGuidePage() {
  return <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">Guía de tallas</p><h1 className="mt-2 text-4xl font-black text-[#243C3A]">Mide antes de elegir</h1><p className="mt-3 text-base leading-7 text-[#52615D]">Usa una huincha flexible y mide a tu perro de pie. Publicaremos la tabla de medidas de cada prenda cuando estén confirmadas.</p></div><div className="mt-8 grid gap-4 md:grid-cols-3">{measures.map((measure) => <article key={measure.number} className="rounded-lg border border-[#E5DED4] bg-white p-6"><p className="text-sm font-black text-[#B6633A]">{measure.number}</p><h2 className="mt-3 text-xl font-black">{measure.title}</h2><p className="mt-2 text-sm leading-6 text-[#52615D]">{measure.copy}</p></article>)}</div><p className="mt-8 rounded-lg bg-[#F4E8D8] p-5 text-sm leading-7 text-[#52615D]">Las tallas exactas varían entre modelos. Confirma la tabla específica antes de comprar; todavía no hay venta habilitada.</p><Link href="/tienda" className="mt-6 inline-flex rounded-md bg-[#B6633A] px-5 py-3 text-sm font-black text-white">Ver catálogo</Link></section>;
}
