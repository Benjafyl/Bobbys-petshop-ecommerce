import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";
import { InstagramIcon } from "@/components/instagram-icon";
import { instagramProfileUrl } from "@/lib/social";

export const metadata: Metadata = {
  title: "Conoce a Bobby",
  description:
    "Conoce a Bobby, el perro salchicha que inspiró Bobby's Pet Shop, una marca creada en 2021 que hoy vive una nueva etapa.",
};

const bobbyMoments = [
  {
    src: "/images/official/parka-azul-modelo.jpg",
    alt: "Bobby descansando con una parka negra y turquesa",
    caption: "Siempre listo para modelar",
  },
  {
    src: "/images/official/parka-beige-en-casa.jpg",
    alt: "Bobby descansando en casa con una parka beige",
    caption: "Un rato en casa",
  },
  {
    src: "/images/official/parka-gris-paseo-nieve.jpg",
    alt: "Bobby paseando en la nieve con su parka gris",
    caption: "Y también de paseo",
  },
];

export default function BossPage() {
  return (
    <>
      <section className="border-b border-[#E5DED4] bg-[#F4E8D8]/55">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8 lg:py-16">
          <div>
            <p className="text-sm font-bold text-[#B6633A]">Conoce al protagonista</p>
            <h1 className="mt-3 max-w-xl text-balance text-5xl font-black leading-[1.05] text-[#243C3A] sm:text-6xl">Esta tienda nació por Bobby.</h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#354642]">Bobby es nuestro perro salchicha y el modelo principal de Bobby&apos;s Pet Shop. Su cuerpo alargado y lo friolento que es nos hicieron buscar ropa que realmente le quedara bien.</p>
            <Link href="#su-historia" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md bg-[#243C3A] px-5 text-sm font-black text-white transition-colors duration-200 hover:bg-[#35544F]">Conoce su historia <ArrowRight size={17} /></Link>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border-[6px] border-white bg-[#F4E8D8] shadow-lg">
            <Image src="/images/official/parka-gris-modelo-cerca.jpg" alt="Bobby mirando a la cámara con su parka gris" fill loading="eager" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[center_48%]" />
          </div>
        </div>
      </section>

      <section id="su-historia" className="scroll-mt-28 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F9D36B] text-[#243C3A]"><Ruler size={21} /></span>
            <h2 className="mt-5 text-balance text-3xl font-black leading-tight text-[#243C3A] sm:text-4xl">Desde 2021, con Bobby a nuestro lado.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[#52615D]">
            <p>Bobby&apos;s Pet Shop nació en 2021 con otros productos y otro logo. Esta nueva etapa renueva su imagen y colección, sobre la trayectoria de una marca que hemos consolidado desde entonces.</p>
            <p>Los salchichas tienen una contextura muy particular: cuerpo largo y patas cortas. Con Bobby descubrimos que no siempre era fácil encontrar ropa que lo abrigara y le quedara bien de largo.</p>
            <p>Al probar nuestras parkas, vimos que su largo le sentaba muy bien. Esa búsqueda nos animó a compartir la colección con otros perros, de distintas razas, que también necesitan abrigo.</p>
            <p className="text-base">Cada perro es diferente. Antes de elegir una prenda, mide su cuello, pecho y espalda para comparar con las tallas disponibles.</p>
            <Link href="/guia-de-tallas" className="inline-flex items-center gap-2 text-sm font-black text-[#B6633A] underline decoration-2 underline-offset-4">Aprende a medir a tu perro <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5DED4] bg-[var(--feature-peach)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="text-balance text-3xl font-black text-[#243C3A] sm:text-4xl">Bobby, tal como es.</h2>
              <p className="mt-3 text-base leading-7 text-[#354642]">Nuestro modelo principal, compañero de paseos y una cara muy querida por quienes nos siguen en redes.</p>
            </div>
            <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-black text-[#243C3A] underline decoration-2 underline-offset-4"><InstagramIcon size={18} /> Ver a Bobby en Instagram <ArrowRight size={17} /></a>
          </div>
          <div className="grid grid-flow-col auto-cols-[minmax(240px,78vw)] gap-4 overflow-x-auto pb-3 snap-x snap-mandatory sm:auto-cols-[minmax(280px,40vw)] lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {bobbyMoments.map((moment) => (
              <figure key={moment.src} className="min-w-0 snap-start overflow-hidden rounded-xl border-[5px] border-white bg-white shadow-sm">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F4E8D8]"><Image src={moment.src} alt={moment.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 40vw, 78vw" className="object-cover" /></div>
                <figcaption className="px-4 py-3 text-sm font-black text-[#243C3A]">{moment.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div><h2 className="text-2xl font-black text-[#243C3A]">De Bobby para todos los perros.</h2><p className="mt-2 text-[#52615D]">Explora la ropa y los accesorios que dieron vida a esta historia.</p></div>
        <Link href="/tienda" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-md bg-[#B6633A] px-5 text-sm font-black text-white transition-colors duration-200 hover:bg-[#96502E]">Explorar la tienda <ArrowRight size={17} /></Link>
      </section>
    </>
  );
}
