import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { officialProducts } from "@/lib/official-catalog";
import { getTotalUnits, publicInventoryBySlug } from "@/lib/public-inventory";

describe("inventario público del 19 de octubre", () => {
  it("publica exactamente las 27 unidades informadas y todas tienen ficha", () => {
    const published = officialProducts.map((product) => product.slug);
    const recorded = Object.keys(publicInventoryBySlug);

    expect(published).toHaveLength(18);
    expect(new Set(published)).toEqual(new Set(recorded));
    expect(recorded.reduce((total, slug) => total + getTotalUnits(publicInventoryBySlug[slug]), 0)).toBe(27);
  });

  it("cada variante tiene talla, precio y stock positivos", () => {
    for (const inventory of Object.values(publicInventoryBySlug)) {
      expect(inventory.variants.length).toBeGreaterThan(0);
      for (const variant of inventory.variants) {
        expect(variant.size.length).toBeGreaterThan(0);
        expect(variant.priceClp).toBeGreaterThan(0);
        expect(variant.units).toBeGreaterThan(0);
        if (variant.imageSrc) {
          expect(existsSync(join(process.cwd(), "public", variant.imageSrc.slice(1))), variant.imageSrc).toBe(true);
        }
      }
    }
  });

  it("las fotos vinculadas al catálogo existen en el repositorio", () => {
    for (const product of officialProducts) {
      for (const image of product.images) {
        expect(existsSync(join(process.cwd(), "public", image.src.slice(1))), image.src).toBe(true);
      }
      if (product.video) {
        expect(existsSync(join(process.cwd(), "public", product.video.src.slice(1))), product.video.src).toBe(true);
      }
    }
  });
});
