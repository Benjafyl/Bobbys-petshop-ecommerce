import { db, dbConfigured } from "@/lib/db";
import { buildMetaCatalogFeed } from "@/lib/meta-catalog-feed";
import { publicInventoryBySlug, type PublicInventory } from "@/lib/public-inventory";

export const dynamic = "force-dynamic";

type InventoryRow = {
  product_slug: string;
  size: string;
  design: string;
  price_clp: number;
  stock_on_hand: number;
};

export async function GET() {
  if (!dbConfigured()) return new Response("Inventario no disponible", { status: 503 });

  try {
    const result = await db().query<InventoryRow>(
      "select product_slug,size,design,price_clp,stock_on_hand from shop_inventory where active=true order by product_slug,size,design",
    );
    const inventory: Record<string, PublicInventory> = {};
    for (const row of result.rows) {
      const imageSrc = publicInventoryBySlug[row.product_slug]?.variants.find(
        (variant) => variant.size === row.size && (variant.design ?? "") === row.design,
      )?.imageSrc;
      (inventory[row.product_slug] ??= { variants: [] }).variants.push({
        size: row.size,
        design: row.design || undefined,
        priceClp: row.price_clp,
        units: row.stock_on_hand,
        imageSrc,
      });
    }
    return new Response(buildMetaCatalogFeed(inventory), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "inline; filename=bobbys-meta-catalog.csv",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("Inventario no disponible", { status: 503 });
  }
}
