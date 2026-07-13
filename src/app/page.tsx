import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, Ruler, Truck } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";
import { formatPrice, getProductStock } from "@/lib/commerce";

const benefits = [
  {
    icon: Ruler,
    title: "Tallas claras",
    copy: "Medidas de cuello, pecho y espalda antes de elegir cada variante.",
  },
  {
    icon: PackageCheck,
    title: "Stock real",
    copy: "Disponibilidad por SKU para evitar vender tallas agotadas.",
  },
  {
    icon: Truck,
    title: "Retiro o despacho",
    copy: "Preparado para retiro en Vina del Mar y envio nacional configurable.",
  },
];

export default function Home() {
  const featuredProducts = products.filter((product) => product.featured);
  const totalStock = products.reduce((total, product) => total + getProductStock(product), 0);

  return (
    <>
      <section className="bg-[#FBF7F1]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5DED4] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#B6633A]">
              <BadgeCheck size={15} />
              Approved by the Boss
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.02] text-[#243C3A] sm:text-6xl">
              Bobby&apos;s Pet Shop
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#52615D]">
              Parkas impermeables y chalecos para perros, con tallas faciles de comparar,
              stock visible y compra por transferencia para operar desde Chile.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tienda"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#B6633A] px-5 text-sm font-black text-white transition hover:bg-[#96502E]"
              >
                Ver tienda
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/guia-de-tallas"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[#C9B8A8] bg-white px-5 text-sm font-black text-[#243C3A] transition hover:border-[#B6633A]"
              >
                Guia de tallas
              </Link>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-lg border border-[#E5DED4] bg-white p-4">
                <p className="text-2xl font-black">{products.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#52615D]">
                  Productos
                </p>
              </div>
              <div className="rounded-lg border border-[#E5DED4] bg-white p-4">
                <p className="text-2xl font-black">{totalStock}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#52615D]">
                  Unidades
                </p>
              </div>
              <div className="rounded-lg border border-[#E5DED4] bg-white p-4">
                <p className="text-2xl font-black">CL</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#52615D]">
                  Operacion
                </p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-[#243C3A]">
            <Image
              src="/images/hero-raincoat.jpg"
              alt="Perro usando parka impermeable amarilla"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#243C3A] via-[#243C3A]/80 to-transparent p-6 text-white">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F9D36B]">
                Primer drop invierno
              </p>
              <p className="mt-2 max-w-sm text-2xl font-black leading-tight">
                Parkas desde {formatPrice(19990)} con stock por talla y color.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E5DED4] bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#F9D36B] text-[#243C3A]">
                <benefit.icon size={20} />
              </span>
              <div>
                <h2 className="font-black">{benefit.title}</h2>
                <p className="mt-1 text-sm leading-6 text-[#52615D]">{benefit.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">
              Destacados
            </p>
            <h2 className="mt-2 text-3xl font-black text-[#243C3A]">Listos para salir</h2>
          </div>
          <Link href="/tienda" className="text-sm font-black text-[#B6633A]">
            Ver catalogo completo
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
