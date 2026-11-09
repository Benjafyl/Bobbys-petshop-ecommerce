import { catalogProducts } from "@/lib/official-catalog";
import { getOfficialVariantId } from "@/lib/official-cart";
import type { PublicInventory } from "@/lib/public-inventory";
import { absoluteSiteUrl } from "@/lib/site-url";

type FeedInventory = Record<string, PublicInventory>;

const columns = [
  "id", "item_group_id", "title", "description", "availability", "inventory",
  "condition", "price", "link", "image_link", "brand", "size", "product_type",
] as const;

function csvCell(value: string | number) {
  const text = String(value).replaceAll(/\r?\n/g, " ");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildMetaCatalogFeed(inventory: FeedInventory) {
  const rows: (string | number)[][] = [Array.from(columns)];

  for (const product of catalogProducts) {
    for (const variant of inventory[product.slug]?.variants ?? []) {
      if (!Number.isInteger(variant.priceClp) || variant.priceClp <= 0 || !Number.isInteger(variant.units) || variant.units < 0) continue;
      const label = [variant.design, `talla ${variant.size}`].filter(Boolean).join(" · ");
      rows.push([
        getOfficialVariantId(product.slug, variant),
        product.slug,
        `${product.name} · ${label}`,
        product.description,
        variant.units > 0 ? "in stock" : "out of stock",
        variant.units,
        "new",
        `${variant.priceClp} CLP`,
        absoluteSiteUrl(`/producto/${product.slug}`),
        absoluteSiteUrl(variant.imageSrc || product.images[0].src),
        "Bobby's Pet Shop",
        variant.size,
        product.category,
      ]);
    }
  }

  return `${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}
