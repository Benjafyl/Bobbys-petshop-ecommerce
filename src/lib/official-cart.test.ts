import { describe, expect, it } from "vitest";
import { addToOfficialCart, getOfficialCartSubtotal, getOfficialVariantId, normalizeOfficialCart, setOfficialCartQuantity } from "@/lib/official-cart";
import { publicInventoryBySlug } from "@/lib/public-inventory";

describe("carrito del inventario publicado", () => {
  const greyM = getOfficialVariantId("parka-bicolor-gris", publicInventoryBySlug["parka-bicolor-gris"].variants[0]);
  const greyXL = getOfficialVariantId("parka-bicolor-gris", publicInventoryBySlug["parka-bicolor-gris"].variants[2]);

  it("suma cantidades por talla y respeta el máximo publicado", () => {
    const first = addToOfficialCart([], "parka-bicolor-gris", greyM);
    const second = addToOfficialCart(first, "parka-bicolor-gris", greyM, 4);
    expect(second).toEqual([{ productSlug: "parka-bicolor-gris", variantId: greyM, quantity: 2 }]);
    expect(getOfficialCartSubtotal(second)).toBe(32000);
  });

  it("calcula precios distintos por talla y permite quitar artículos", () => {
    const withM = addToOfficialCart([], "parka-bicolor-gris", greyM);
    const withXL = addToOfficialCart(withM, "parka-bicolor-gris", greyXL);
    expect(getOfficialCartSubtotal(withXL)).toBe(34000);
    expect(setOfficialCartQuantity(withXL, greyM, 0)).toEqual([{ productSlug: "parka-bicolor-gris", variantId: greyXL, quantity: 1 }]);
  });

  it("descarta datos guardados inválidos y acota cantidades antiguas", () => {
    const saved = normalizeOfficialCart([
      { productSlug: "parka-bicolor-gris", variantId: greyM, quantity: 50 },
      { productSlug: "producto-inexistente", variantId: "x", quantity: 1 },
      { productSlug: "parka-bicolor-gris", variantId: greyM, quantity: -1 },
    ]);
    expect(saved).toEqual([{ productSlug: "parka-bicolor-gris", variantId: greyM, quantity: 2 }]);
  });
});
