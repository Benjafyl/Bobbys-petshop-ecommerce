import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Heart, Ruler, Star } from "lucide-react";
import { InstagramIcon } from "@/components/instagram-icon";
import { OfficialProductCard } from "@/components/official-product-card";
import {
  officialCategoryLabels,
  officialProducts,
  type OfficialCategory,
} from "@/lib/official-catalog";
import { instagramProfileUrl, instagramReels } from "@/lib/social";

const categorySections: {
  id: OfficialCategory;
  image: string;
  alt: string;
  caption: string;
  intro: string;
}[] = [
  {
    id: "abrigos",
    image: "/images/official/parka-gris-producto.jpg",
    alt: "Parka gris y negra, vista de producto",
    caption: "Para salir abrigados",
    intro: "Parkas para paseos con personalidad.",
  },
  {
    id: "polerones",
    image: "/images/official/poleron-ositos-producto.jpg",
    alt: "Chaleco de ositos para perro",
    caption: "Para días de regaloneo",
    intro: "Diseños suaves, estampados y llenos de color.",
  },
  {
    id: "halloween",
    image: "/images/official/traje-calabaza-producto.jpg",
    alt: "Traje naranja de calabaza, vista de producto",
    caption: "Para celebrar",
    intro: "Looks de Halloween que no pasan desapercibidos.",
  },
  {
    id: "accesorios",
    image: "/images/official/bandanas-halloween-tres-disenos.jpg",
    alt: "Los tres pañuelos de Halloween disponibles",
    caption: "Para el detalle final",
    intro: "Bandanas y collares para completar el look.",
  },
];

const heroPhotos = [
  { src: "/images/official/parka-azul-modelo.jpg", alt: "Bobby modelando una parka negra y azul", position: "object-right" },
  { src: "/images/official/parka-gris-modelo-cerca.jpg", alt: "Bobby modelando la parka bicolor gris", position: "object-center" },
  { src: "/images/official/parka-militar-modelo.jpg", alt: "Bobby junto a la parka militar de colores", position: "object-center" },
];

const customerReviews = [
  {
    id: "tati-parka-azul",
    kind: "image",
    src: "/images/community/cliente-parka-azul.jpeg",
    alt: "Una perrita de la Abuela Tati con una parka negra y turquesa de Bobby's",
    petLabel: "Una de las perritas de la Abuela Tati",
    name: "La Abuela Tati",
    handle: "@laabuelatati",
    comment: "Siiii! Son las mejores. Mis perritas felices con sus parkas. Gracias 👏👏👏",
    source: "Instagram",
  },
  {
    id: "tati-parka-rosa",
    kind: "image",
    src: "/images/community/cliente-parka-rosa.jpeg",
    alt: "La otra perrita de la Abuela Tati con una parka negra y rosada de Bobby's",
    petLabel: "La otra perrita de la Abuela Tati",
    name: "La Abuela Tati",
    handle: "@laabuelatati",
    comment: "Todo hermoso y de la mejor calidad 👏👏",
    source: "Instagram",
  },
  {
    id: "ivana-yorkshire",
    kind: "video",
    src: "/videos/community/perrito-ivana.mp4",
    alt: "Yorkshire de Ivana usando una parka de Bobby's",
    petLabel: "El Yorkshire de Ivana",
    name: "Ivana",
    handle: "",
    comment: "Perfecta calidad, mi perrito quedó muy abrigado para este frío.",
    source: "",
  },
  {
    id: "valeria-galga",
    kind: "image",
    src: "/images/community/galga-valeria.jpeg",
    alt: "Galga de Valeria Rodil con un chaleco verde",
    petLabel: "La galga de Valeria",
    name: "Valeria Rodil",
    handle: "@valeriarodil",
    comment: "Excelente !!!! Muy práctico",
    source: "Instagram",
  },
];

function FiveStars() {
  return (
    <span role="img" aria-label="5 estrellas" className="inline-flex items-center gap-0.5 text-[#B6633A]">
      {Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill="currentColor" aria-hidden="true" />)}
    </span>
  );
}

export default function Home() {
  return (
    <>
      <section className="bg-[#FBF7F1]">
        <div className="mx-auto max-w-[1600px] px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-12 lg:pt-6">
          <div className="relative overflow-hidden rounded-xl bg-[#F4E8D8]">
            <div className="grid h-[420px] grid-cols-[1.15fr_1fr] grid-rows-2 gap-1 sm:h-[520px] lg:h-[610px] lg:grid-cols-3 lg:grid-rows-1">
              {heroPhotos.map((photo, index) => (
                <div key={photo.src} className={`relative overflow-hidden ${index === 0 ? "row-span-2 lg:row-span-1" : ""}`}>
                  <Image src={photo.src} alt={photo.alt} fill loading="eager" sizes="(min-width: 1024px) 33vw, 55vw" className={`object-cover ${photo.position}`} />
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-[#182E2C]/90 via-[#182E2C]/30 to-transparent lg:block" />
            <div className="hidden lg:absolute lg:inset-x-0 lg:bottom-0 lg:z-10 lg:block lg:px-12 lg:pb-12">
              <h1 className="max-w-3xl text-5xl font-black leading-[1.04] text-white xl:text-6xl">Ropa para perros con estilo.</h1>
              <p className="mt-4 max-w-2xl text-lg leading-7 text-white/90">Parkas, chalecos y accesorios para mascotas en Chile.</p>
              <Link href="#coleccion" className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#B6633A] px-5 text-sm font-black text-white transition hover:bg-[#96502E]">Ver colección <ArrowDown size={18} /></Link>
            </div>
          </div>
          <div className="pt-7 lg:hidden">
            <h1 className="max-w-xl text-4xl font-black leading-[1.05] text-[#243C3A] sm:text-5xl">Ropa para perros con estilo.</h1>
            <p className="mt-4 max-w-xl leading-7 text-[#52615D]">Parkas, chalecos y accesorios para mascotas en Chile.</p>
            <Link href="#coleccion" className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#B6633A] px-5 text-sm font-black text-white">Ver colección <ArrowDown size={18} /></Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="instagram-heading" className="border-y border-[#E5DED4] bg-[#F4E8D8]/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]"><InstagramIcon size={19} /> En Instagram</p>
              <h2 id="instagram-heading" className="mt-3 text-3xl font-black leading-tight text-[#243C3A] sm:text-4xl">Bobby&apos;s también se vive en redes.</h2>
              <p className="mt-3 leading-7 text-[#52615D]">Un vistazo a nuestra comunidad. Mira los reels aquí mismo y encuentra más en Instagram.</p>
            </div>
            <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#243C3A] px-5 py-3 text-sm font-black text-white transition hover:bg-[#35544F]">
              <InstagramIcon size={18} /> Seguir a @bobbys.cl <ArrowRight size={17} />
            </a>
          </div>
          <div className="grid grid-flow-col auto-cols-[minmax(260px,82vw)] gap-4 overflow-x-auto pb-3 snap-x snap-mandatory sm:auto-cols-[minmax(300px,48vw)] lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {instagramReels.map((reel) => (
              <article key={reel.id} className="min-w-0 snap-start overflow-hidden rounded-lg border border-[#E5DED4] bg-white shadow-sm">
                <div className="relative aspect-[9/16] overflow-hidden bg-[#F4E8D8]">
                  <video autoPlay muted loop playsInline controls preload="metadata" poster={reel.cover} aria-label={reel.label} className="h-full w-full object-cover">
                    <source src={reel.video} type="video/mp4" />
                    Tu navegador no puede reproducir este video.
                  </video>
                  <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#243C3A]">@bobbys.cl</span>
                </div>
                <a href={reel.url} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${reel.label} en Instagram`} className="flex min-h-14 items-center justify-between gap-2 px-4 text-sm font-black text-[#B6633A] transition hover:text-[#96502E]"><span className="inline-flex items-center gap-2"><InstagramIcon size={17} /> Ver reel en Instagram</span><ArrowRight size={16} /></a>
              </article>
            ))}
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
              <Link href="/producto/traje-calabaza" className="rounded-md border border-white/50 px-4 py-3 text-sm font-black text-white">Ver el traje calabaza</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#F4E8D8]"><video autoPlay muted loop playsInline controls preload="metadata" poster="/images/official/parka-gris-modelo-lateral.jpg" aria-label="Parka gris puesta en movimiento" className="h-full w-full object-cover"><source src="/videos/official/parka-gris-en-movimiento.mp4" type="video/mp4" />Tu navegador no puede reproducir este video.</video></div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#F4E8D8]"><Image src="/images/official/traje-calabaza-producto.jpg" alt="Traje naranja de calabaza" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" /></div>
          </div>
        </div>
      </section>

      <section id="coleccion" aria-label="Productos disponibles" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
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

      <section aria-labelledby="community-heading" className="border-t border-[#E5DED4] bg-[#F4E8D8]/45">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B6633A]">Nuestra comunidad</p>
              <h2 id="community-heading" className="mt-2 text-3xl font-black leading-tight text-[#243C3A] sm:text-4xl">Lo que dicen de Bobby&apos;s.</h2>
              <p className="mt-3 leading-7 text-[#52615D]">Sus fotos, sus paseos y sus palabras.</p>
            </div>
            <a href={instagramProfileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-black text-[#B6633A] hover:text-[#96502E]"><InstagramIcon size={18} /> Conoce @bobbys.cl <ArrowRight size={17} /></a>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {customerReviews.map((review) => (
              <figure key={review.id} className="grid overflow-hidden rounded-lg border border-[#E5DED4] bg-white shadow-sm sm:grid-cols-[0.9fr_1.1fr]">
                <div className={`relative overflow-hidden bg-[#F4E8D8] sm:aspect-auto ${review.kind === "video" ? "aspect-[9/16] sm:min-h-[440px]" : "aspect-[3/4] sm:min-h-[350px]"}`}>
                  {review.kind === "video" ? (
                    <video autoPlay muted loop playsInline controls preload="metadata" poster="/images/community/ivana-video-poster.png" aria-label={review.alt} className="absolute inset-0 h-full w-full object-cover">
                      <source src={review.src} type="video/mp4" />
                      Tu navegador no puede reproducir este video.
                    </video>
                  ) : (
                    <Image src={review.src} alt={review.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw" className="object-cover object-[center_60%]" />
                  )}
                </div>
                <figcaption className="flex flex-col justify-between gap-6 p-5">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#B6633A]">{review.petLabel}</p>
                    <div className="mt-4"><FiveStars /></div>
                    <blockquote className="mt-4 text-lg font-semibold leading-7 text-[#243C3A]">“{review.comment}”</blockquote>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E5DED4] pt-4 text-sm">
                    <span className="font-black text-[#B6633A]">{review.name}{review.handle && <span className="ml-1 font-semibold text-[#52615D]">· {review.handle}</span>}</span>
                    {review.source && <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#52615D]"><InstagramIcon size={14} /> {review.source}</span>}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5DED4] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="relative min-h-[370px] overflow-hidden rounded-lg bg-[#F4E8D8]"><Image src="/images/official/parka-gris-modelo-lateral.jpg" alt="Perro de cuerpo entero con la parka gris" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" /></div>
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F9D36B]"><Ruler size={21} /></span>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">Antes de elegir</p>
            <h2 className="mt-2 text-3xl font-black text-[#243C3A]">La talla empieza con una buena medida.</h2>
            <p className="mt-4 leading-7 text-[#52615D]">Mide cuello, pecho y espalda con tu perro de pie. Ya puedes consultar la tabla de medidas de parkas M a XXL y revisar qué tallas hay en cada ficha.</p>
            <Link href="/guia-de-tallas" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#B6633A]">Ver tabla de parkas <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5DED4] bg-[#F4E8D8]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div className="flex items-start gap-3"><Heart className="mt-1 shrink-0 text-[#B6633A]" size={24} /><div><h2 className="text-xl font-black">¿Ya encontraste su próximo look?</h2><p className="mt-1 max-w-xl text-sm leading-6 text-[#52615D]">Explora las fotos, elige la talla y agrega tus favoritos al carrito. El pago en línea llegará en una próxima etapa.</p></div></div>
          <Link href="/tienda" className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#243C3A] px-5 py-3 text-sm font-black text-white">Explorar con filtros <ArrowRight size={17} /></Link>
        </div>
      </section>
    </>
  );
}
