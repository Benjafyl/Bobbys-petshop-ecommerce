import type { Metadata } from "next";
import { AlertTriangle, Banknote, Package, TrendingUp } from "lucide-react";
import { products } from "@/lib/catalog";
import { formatPrice, getProductStock } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Administracion",
  description: "Panel administrativo inicial para inventario, pedidos y metricas.",
};

const orders = [
  { id: "BPS-2026-18432", customer: "Camila Torres", status: "PENDING_PAYMENT", total: 39980 },
  { id: "BPS-2026-18418", customer: "Javiera Rojas", status: "PAID", total: 19990 },
  { id: "BPS-2026-18397", customer: "Martin Silva", status: "PREPARING", total: 25980 },
];

export default function AdminPage() {
  const stock = products.reduce((total, product) => total + getProductStock(product), 0);
  const lowStock = products.flatMap((product) =>
    product.variants
      .filter((variant) => variant.stock > 0 && variant.stock <= variant.lowStockThreshold)
      .map((variant) => ({ product, variant })),
  );
  const inventoryCost = products.reduce(
    (total, product) => total + product.variants.reduce((sum, variant) => sum + variant.stock * product.cost, 0),
    0,
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">
            Admin MVP
          </p>
          <h1 className="mt-2 text-4xl font-black text-[#243C3A]">Operacion diaria</h1>
        </div>
        <p className="rounded-md bg-[#FFF8E6] px-4 py-3 text-sm font-bold text-[#6F4B22]">
          Proteccion por rol pendiente de conectar a autenticacion.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric icon={TrendingUp} label="Ventas simuladas" value={formatPrice(85950)} />
        <Metric icon={Banknote} label="Margen bruto" value={formatPrice(48900)} />
        <Metric icon={Package} label="Unidades stock" value={`${stock}`} />
        <Metric icon={AlertTriangle} label="Bajo stock" value={`${lowStock.length}`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-lg border border-[#E5DED4] bg-white p-5">
          <h2 className="text-xl font-black">Pedidos recientes</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-[#52615D]">
                <tr>
                  <th className="py-3">Pedido</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-[#E5DED4]">
                    <td className="py-3 font-black">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>
                      <span className="rounded-full bg-[#F4E8D8] px-3 py-1 text-xs font-black">
                        {order.status}
                      </span>
                    </td>
                    <td className="text-right font-black">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-[#E5DED4] bg-white p-5">
          <h2 className="text-xl font-black">Alertas de inventario</h2>
          <div className="mt-4 grid gap-3">
            {lowStock.map(({ product, variant }) => (
              <div key={variant.id} className="rounded-md border border-[#E5DED4] bg-[#FBF7F1] p-4">
                <p className="font-black">{product.name}</p>
                <p className="mt-1 text-sm text-[#52615D]">
                  {variant.size} · {variant.colorName} · {variant.stock} unidades · {variant.sku}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-[#52615D]">
            Costo de inventario actual: <strong>{formatPrice(inventoryCost)}</strong>.
          </p>
        </article>
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-[#E5DED4] bg-white p-5">
      <Icon className="text-[#B6633A]" size={22} />
      <p className="mt-4 text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#52615D]">{label}</p>
    </div>
  );
}
