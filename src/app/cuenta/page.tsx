import type { Metadata } from "next";
import Link from "next/link";
import { AccountForms, AccountSignOut } from "@/components/account-forms";
import { currentShopAdmin, currentShopSession } from "@/lib/shop-session";
import { db, dbConfigured } from "@/lib/db";
import { formatClp } from "@/lib/public-inventory";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mi cuenta" };

export default async function AccountPage() {
  const ready = dbConfigured() && Boolean(process.env.BETTER_AUTH_SECRET);
  const session = ready ? await currentShopSession() : null;
  const admin = session ? await currentShopAdmin() : null;
  const orders = session ? (await db().query<{
    id: string; order_number: string; status: string; total_clp: number; created_at: Date;
  }>(`select id,order_number,status,total_clp,created_at from shop_orders where user_id=$1 order by created_at desc limit 30`, [session.user.id])).rows : [];

  return <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#B6633A]">Bobby&apos;s Pet Shop</p>
    <h1 className="mt-2 text-4xl font-black">Mi cuenta</h1>
    {!ready ? <div className="mt-7 max-w-2xl rounded-xl border border-[#E5DED4] bg-white p-6">
      <h2 className="text-xl font-black">Cuentas en preparación</h2>
      <p className="mt-2 leading-7 text-[#52615D]">Puedes seguir explorando la tienda y armar tu carrito sin iniciar sesión. Activaremos las cuentas cuando la base de datos del servidor esté conectada.</p>
      <Link href="/tienda" className="mt-5 inline-block font-bold text-[#B6633A] underline">Ir a la tienda</Link>
    </div> : session ? <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <div className="rounded-xl border border-[#E5DED4] bg-white p-6"><h2 className="text-2xl font-black">Hola, {session.user.name}</h2><p className="mt-1 text-[#52615D]">{session.user.email}</p></div>
        <h2 className="mt-8 text-2xl font-black">Mis pedidos</h2>
        {orders.length ? <div className="mt-4 space-y-3">{orders.map((order) => <article key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E5DED4] bg-white p-4"><div><strong>Pedido {order.order_number}</strong><p className="text-sm text-[#52615D]">{new Date(order.created_at).toLocaleDateString("es-CL")} · {order.status}</p></div><strong>{formatClp(order.total_clp)}</strong></article>)}</div>
          : <p className="mt-4 rounded-lg bg-white p-5 text-[#52615D]">Aún no tienes pedidos asociados a esta cuenta. El carrito funciona también sin iniciar sesión.</p>}
      </div>
      <aside className="self-start rounded-xl border border-[#E5DED4] bg-white p-5">{admin && <Link href="/admin" className="mb-4 block rounded-md bg-[#243C3A] px-4 py-3 text-center font-bold text-white">Panel de Antonela</Link>}<AccountSignOut /></aside>
    </div> : <AccountForms signUpEnabled={process.env.ENABLE_CUSTOMER_SIGNUP === "true"} />}
  </section>;
}
