import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Ruler, Sparkles } from "lucide-react";
import { OfficialProductCard } from "@/components/official-product-card";
import { officialProducts } from "@/lib/official-catalog";

const benefits = [
  { icon: Sparkles, title: "Fotos oficiales", copy: "Conoce cada diseño con imágenes de la colección." },
  { icon: Ruler, title: "Elige con calma", copy: "Pronto publicaremos tallas y medidas verificadas." },
  { icon: Heart, title: "Hecho para su estilo", copy: "Abrigos, polerones y accesorios para cada personalidad." },
];

export default function Home() {
  const featuredProducts = officialProducts.filter((product) => product.featured);
  return (
    <>
      <section className="bg-[#FBF7F1]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#E5DED4] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#B6633A]"><Sparkles size={15} /> Nuestra colección</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.02] text-[#243C3A] sm:text-6xl">Mucho estilo.<br />Cuatro patitas.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#52615D]">Descubre la ropa y los accesorios de Bobby&apos;s Pet Shop. Ya puedes explorar nuestra colección con fotografías oficiales.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/tienda" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#B6633A] px-5 text-sm font-black text-white transition hover:bg-[#96502E]">Explorar catálogo <ArrowRight size={18} /></Link>
              <Link href="/guia-de-tallas" className="inline-flex h-12 items-center justify-center rounded-md border border-[#C9B8A8] bg-white px-5 text-sm font-black text-[#243C3A] transition hover:border-[#B6633A]">Cómo medir a tu perro</Link>
            </div>
            <p className="mt-6 text-sm leading-6 text-[#52615D]">Precios, tallas y disponibilidad por confirmar. Compras aún no habilitadas.</p>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-[#F4E8D8]">
            <Image src="/images/official/parka-beige-modelo.jpg" alt="Perro con parka beige y negra de la colección Bobby's Pet Shop" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#243C3A]/90 to-transparent p-6 pt-20 text-white"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#F9D36B]">Bobby&apos;s Pet Shop</p><p className="mt-2 max-w-sm text-2xl font-black leading-tight">Una colección para salir con personalidad.</p></div>
          </div>
        </div>
      </section>
      <section className="border-y border-[#E5DED4] bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
          {benefits.map((benefit) => <div key={benefit.title} className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#F9D36B] text-[#243C3A]"><benefit.icon size={20} /></span><div><h2 className="font-black">{benefit.title}</h2><p className="mt-1 text-sm leading-6 text-[#52615D]">{benefit.copy}</p></div></div>)}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">Destacados</p><h2 className="mt-2 text-3xl font-black text-[#243C3A]">Conoce la colección</h2></div><Link href="/tienda" className="text-sm font-black text-[#B6633A]">Ver catálogo completo</Link></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featuredProducts.map((product) => <OfficialProductCard key={product.slug} product={product} />)}</div>
      </section>
    </>
  );
}
