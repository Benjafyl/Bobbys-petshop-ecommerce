"use client";

import { useState } from "react";
import { OfficialProductCard } from "@/components/official-product-card";
import { officialCategoryLabels, officialProducts, type OfficialCategory } from "@/lib/official-catalog";

type Filter = "todos" | OfficialCategory;
const filters: Filter[] = ["todos", "abrigos", "polerones", "halloween", "accesorios"];

export function OfficialShopClient() {
  const [filter, setFilter] = useState<Filter>("todos");
  const visible = filter === "todos" ? officialProducts : officialProducts.filter((product) => product.category === filter);

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2" aria-label="Filtrar productos por categoría">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition ${filter === item ? "border-[#243C3A] bg-[#243C3A] text-white" : "border-[#D8CEC1] bg-white text-[#243C3A] hover:border-[#B6633A]"}`}
          >
            {item === "todos" ? "Todos" : officialCategoryLabels[item]}
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm text-[#52615D]">{visible.length} productos</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => <OfficialProductCard key={product.slug} product={product} />)}
      </div>
    </>
  );
}
