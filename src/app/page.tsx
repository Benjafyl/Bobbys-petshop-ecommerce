import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Heart, Ruler, Sparkles } from "lucide-react";
import { OfficialProductCard } from "@/components/official-product-card";
import {
  officialCategoryLabels,
  officialProducts,
  type OfficialCategory,
} from "@/lib/official-catalog";

const categorySections: {
  id: OfficialCategory;
  image: string;
  alt: string;
  caption: string;
  intro: string;
}[] = [
  {
    id: "abrigos",
    image: "/images/official/parka-gris-modelo-cerca.jpg",
    alt: "Perro con parka gris y negra",
    caption: "Para salir abrigados",
    intro: "Parkas para paseos con personalidad.",
  },
  {
    id: "polerones",
    image: "/images/official/poleron-ositos-producto.jpg",
    alt: "Polerón de ositos para perro",
    caption: "Para días de regaloneo",
    intro: "Diseños suaves, estampados y llenos de color.",
  },
  {
    id: "halloween",
    image: "/images/official/vestido-esqueleto-modelo.jpg",
    alt: "Perro con vestido de esqueleto",
    caption: "Para celebrar",
    intro: "Looks de Halloween que no pasan desapercibidos.",
  },
  {
    id: "accesorios",
    image: "/images/official/bandana-halloween-modelo.jpg",
    alt: "Perro con bandana rosa de Halloween",
    caption: "Para el detalle final",
    intro: "Bandanas y collares para completar el look.",
  },
];

export default function Home() {
  return (
    <>
      <section className="bg-[#FBF7F1]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#E5DED4] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#B6633A]">
              <Sparkles size={15} /> Bobby&apos;s Pet Shop
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.02] text-[#243C3A] sm:text-6xl">
              Que cada paseo tenga su propio look.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#52615D]">
              Abrigos, polerones y accesorios para perros con mucha personalidad. Mira toda la colección aquí mismo, con fotografías oficiales.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#coleccion" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#B6633A] px-5 text-sm font-black text-white transition hover:bg-[#96502E]">
                Ver toda la colección <ArrowDown size={18} />
              </Link>
              <Link href="#explora" className="inline-flex h-12 items-center justify-center rounded-md border border-[#C9B8A8] bg-white px-5 text-sm font-black text-[#243C3A] transition hover:border-[#B6633A]">
                Explorar por categoría
              </Link>
            </div>
            <p className="mt-6 text-sm leading-6 text-[#52615D]">Precios, tallas y disponibilidad por confirmar. Compras aún no habilitadas.</p>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-[#F4E8D8]">
            <Image src="/images/official/parka-beige-modelo.jpg" alt="Perro con parka beige y negra de Bobby's Pet Shop" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#243C3A]/90 to-transparent p-6 pt-20 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F9D36B]">La colección</p>
              <p className="mt-2 max-w-sm text-2xl font-black leading-tight">Prendas que se ven tan bien como se sienten.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5DED4] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-3 px-4 py-5 text-sm font-bold text-[#243C3A] sm:px-6 lg:px-8">
          <span className="text-[#B6633A]">Explora:</span>
          {categorySections.map((category) => <Link key={category.id} href={`#${category.id}`} className="hover:text-[#B6633A]">{officialCategoryLabels[category.id]}</Link>)}
        </div>
      </section>

      <section id="explora" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">Encuentra su estilo</p>
          <h2 className="mt-2 text-3xl font-black text-[#243C3A] sm:text-4xl">¿Qué le gustaría usar hoy?</h2>
          <p className="mt-3 leading-7 text-[#52615D]">Entra por una categoría o sigue bajando para ver cada producto.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categorySections.map((category) => (
            <Link key={category.id} href={`#${category.id}`} className="group overflow-hidden rounded-lg border border-[#E5DED4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F4E8D8]">
                <Image src={category.image} alt={category.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div><h3 className="text-xl font-black">{officialCategoryLabels[category.id]}</h3><p className="mt-1 text-sm text-[#52615D]">{category.caption}</p></div>
                <ArrowRight className="shrink-0 text-[#B6633A]" size={19} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#243C3A] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F9D36B]">Inspírate</p>
            <h2 className="mt-3 max-w-lg text-3xl font-black leading-tight sm:text-4xl">Un look para cada momento.</h2>
            <p className="mt-4 max-w-lg leading-7 text-[#DDE5DF]">Del abrigo para el paseo a los detalles de una celebración. Descubre las prendas puestas y mira sus fotos de cerca antes de elegir.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/producto/parka-bicolor-gris" className="rounded-md bg-white px-4 py-3 text-sm font-black text-[#243C3A]">Ver la parka gris</Link>
              <Link href="/producto/vestido-esqueleto" className="rounded-md border border-white/50 px-4 py-3 text-sm font-black text-white">Ver el vestido esqueleto</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#F4E8D8]"><Image src="/images/official/parka-gris-modelo-lateral.jpg" alt="Perro con parka bicolor gris" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" /></div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#F4E8D8]"><Image src="/images/official/vestido-esqueleto-modelo.jpg" alt="Perro con vestido de esqueleto" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" /></div>
          </div>
        </div>
      </section>

      <section id="coleccion" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">Todos los productos</p>
          <h2 className="mt-2 text-3xl font-black text-[#243C3A] sm:text-4xl">Toda la colección, aquí mismo.</h2>
          <p className="mt-3 leading-7 text-[#52615D]">Explora los {officialProducts.length} productos sin salir del inicio. Abre cualquier ficha para ver más fotografías.</p>
        </div>
        <div className="space-y-14">
          {categorySections.map((category) => {
            const products = officialProducts.filter((product) => product.category === category.id);
            return (
              <div key={category.id} id={category.id} className="scroll-mt-28">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[#D8CEC1] pb-4">
                  <div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#B6633A]">{category.caption}</p><h3 className="mt-1 text-2xl font-black text-[#243C3A]">{officialCategoryLabels[category.id]}</h3><p className="mt-1 text-sm text-[#52615D]">{category.intro}</p></div>
                  <span className="text-sm font-semibold text-[#52615D]">{products.length} productos</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => <OfficialProductCard key={product.slug} product={product} headingLevel="h4" />)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[#E5DED4] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="relative min-h-[370px] overflow-hidden rounded-lg bg-[#F4E8D8]"><Image src="/images/official/parka-gris-modelo-superior.jpg" alt="Vista superior de un perro con parka gris" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></div>
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F9D36B]"><Ruler size={21} /></span>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">Antes de elegir</p>
            <h2 className="mt-2 text-3xl font-black text-[#243C3A]">La talla empieza con una buena medida.</h2>
            <p className="mt-4 leading-7 text-[#52615D]">Mide cuello, pecho y espalda con tu perro de pie. Publicaremos las medidas de cada prenda cuando estén confirmadas para ayudarte a escoger con confianza.</p>
            <Link href="/guia-de-tallas" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#B6633A]">Aprende cómo medir <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5DED4] bg-[#F4E8D8]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div className="flex items-start gap-3"><Heart className="mt-1 shrink-0 text-[#B6633A]" size={24} /><div><h2 className="text-xl font-black">La colección sigue creciendo</h2><p className="mt-1 max-w-xl text-sm leading-6 text-[#52615D]">Ya puedes conocer los diseños oficiales. Confirmaremos precios, tallas y disponibilidad antes de habilitar compras.</p></div></div>
          <Link href="/tienda" className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#243C3A] px-5 py-3 text-sm font-black text-white">Explorar con filtros <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}
