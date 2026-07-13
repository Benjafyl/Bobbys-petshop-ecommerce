"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products, type ProductCategory } from "@/lib/catalog";
import { getProductStock } from "@/lib/commerce";

type SortOption = "recommended" | "price-asc" | "price-desc" | "newest";

export function ShopClient() {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [size, setSize] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState<SortOption>("recommended");

  const filtered = useMemo(() => {
    return products
      .filter((product) => category === "all" || product.category === category)
      .filter((product) => size === "all" || product.variants.some((variant) => variant.size === size))
      .filter((product) => {
        const stock = getProductStock(product);
        if (availability === "available") {
          return stock > 0;
        }
        if (availability === "low") {
          return product.variants.some(
            (variant) => variant.stock > 0 && variant.stock <= variant.lowStockThreshold,
          );
        }
        if (availability === "soldout") {
          return stock <= 0;
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === "price-asc") {
          return a.price - b.price;
        }
        if (sort === "price-desc") {
          return b.price - a.price;
        }
        if (sort === "newest") {
          return b.createdAt.localeCompare(a.createdAt);
        }
        return Number(b.featured) - Number(a.featured);
      });
  }, [availability, category, size, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border border-[#E5DED4] bg-white p-4">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B6633A]">
          Filtros
        </p>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-[#243C3A]">
            Tipo de prenda
            <select value={category} onChange={(event) => setCategory(event.target.value as ProductCategory | "all")}>
              <option value="all">Todas</option>
              <option value="parka-impermeable">Parkas impermeables</option>
              <option value="chaleco">Chalecos</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-[#243C3A]">
            Talla
            <select value={size} onChange={(event) => setSize(event.target.value)}>
              <option value="all">Todas</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-[#243C3A]">
            Disponibilidad
            <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="low">Ultimas unidades</option>
              <option value="soldout">Agotado</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-[#243C3A]">
            Orden
            <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
              <option value="recommended">Recomendados</option>
              <option value="price-asc">Precio menor a mayor</option>
              <option value="price-desc">Precio mayor a menor</option>
              <option value="newest">Mas recientes</option>
            </select>
          </label>
        </div>
      </aside>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-[#52615D]">{filtered.length} productos encontrados</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
