import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Area de cliente para pedidos, mascotas, direcciones y favoritos.",
};

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-[#243C3A]">Mi cuenta</h1>
      <p className="mt-3 max-w-2xl text-[#52615D]">
        Esta primera version deja preparada la experiencia de cliente. La autenticacion se
        conectara en la fase de base de datos y roles.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {["Pedidos", "Mascotas", "Favoritos"].map((item) => (
          <article key={item} className="rounded-lg border border-[#E5DED4] bg-white p-5">
            <h2 className="text-xl font-black">{item}</h2>
            <p className="mt-2 text-sm leading-6 text-[#52615D]">
              Modulo preparado para guardar informacion del cliente registrado.
            </p>
          </article>
        ))}
      </div>
      <Link className="mt-6 inline-flex rounded-md bg-[#B6633A] px-5 py-3 text-sm font-black text-white" href="/tienda">
        Comprar como invitado
      </Link>
    </section>
  );
}
