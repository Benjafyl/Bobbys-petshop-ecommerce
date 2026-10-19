import Image from "next/image";

export default function BossPage() {
  return <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"><div className="relative min-h-[420px] overflow-hidden rounded-lg bg-[#F4E8D8]"><Image src="/images/official/parka-militar-modelo.jpg" alt="Perro junto a una parka de la colección" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" /></div><div className="self-center"><p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">La marca</p><h1 className="mt-2 text-5xl font-black text-[#243C3A]">Bobby&apos;s Pet Shop</h1><p className="mt-5 text-lg leading-8 text-[#52615D]">Ropa para perros con mucho carácter y collares para gatos. Esta colección reúne abrigos, chalecos y detalles para celebrar cada paseo.</p></div></section>;
}
