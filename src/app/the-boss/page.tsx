import Image from "next/image";

export default function BossPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-[#F4E8D8]">
        <Image src="/images/hero-raincoat.jpg" alt="Bobby usando parka" fill sizes="50vw" className="object-cover" />
      </div>
      <div className="self-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">
          The Boss
        </p>
        <h1 className="mt-2 text-5xl font-black text-[#243C3A]">Approved by Bobby</h1>
        <p className="mt-5 text-lg leading-8 text-[#52615D]">
          Bobby representa la exigencia simple de la marca: prendas comodas, utiles para el clima
          y suficientemente lindas para que el paseo tambien sea una foto.
        </p>
      </div>
    </section>
  );
}
