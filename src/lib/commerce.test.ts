import { describe, expect, it } from "vitest";
import { enrichCart, getCartTotals, getStockLabel } from "@/lib/commerce";

describe("commerce rules", () => {
  it("labels variants with no stock as sold out", () => {
    expect(getStockLabel(0)).toBe("Agotado");
    expect(getStockLabel(2, 3)).toBe("Ultimas unidades");
    expect(getStockLabel(4, 3)).toBe("Disponible");
  });

  it("calculates cart totals from variant snapshots", () => {
    const items = enrichCart([
      { productSlug: "parka-impermeable-mostaza", variantId: "parka-mostaza-xs", quantity: 2 },
    ]);

    expect(items).toHaveLength(1);
    expect(getCartTotals(items, 3990)).toEqual({
      subtotal: 39980,
      deliveryFee: 3990,
      total: 43970,
      units: 2,
    });
  });
});
