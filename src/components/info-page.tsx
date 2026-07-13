import Link from "next/link";

export function InfoPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-black text-[#243C3A]">{title}</h1>
      <div className="mt-6 rounded-lg border border-[#E5DED4] bg-white p-6 text-base leading-8 text-[#52615D]">
        {children}
      </div>
      <Link className="mt-6 inline-flex rounded-md bg-[#243C3A] px-5 py-3 text-sm font-black text-white" href="/tienda">
        Volver a la tienda
      </Link>
    </section>
  );
}
