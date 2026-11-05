import { db, dbConfigured } from "@/lib/db";
import { publicInventoryBySlug, type PublicInventory } from "@/lib/public-inventory";

type InventoryRow = { size: string; design: string; price_clp: number; stock_on_hand: number };

export async function getLiveProductInventory(slug: string): Promise<PublicInventory | undefined> {
  if (!dbConfigured()) return undefined;
  try {
    const result = await db().query<InventoryRow>(
      "select size,design,price_clp,stock_on_hand from shop_inventory where active=true and product_slug=$1 order by size,design",
      [slug],
    );
    if (!result.rows.length) return undefined;
    return {
      variants: result.rows.map((row) => ({
        size: row.size,
        design: row.design || undefined,
        priceClp: row.price_clp,
        units: row.stock_on_hand,
        imageSrc: publicInventoryBySlug[slug]?.variants.find((variant) => variant.size === row.size && (variant.design ?? "") === row.design)?.imageSrc,
      })),
    };
  } catch {
    return undefined;
  }
}
