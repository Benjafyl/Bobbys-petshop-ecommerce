import { NextResponse } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { publicInventoryBySlug, type PublicInventory } from "@/lib/public-inventory";

export const dynamic = "force-dynamic";
export async function GET() {
  if (!dbConfigured()) return NextResponse.json({ error: "Inventory unavailable" }, { status: 503 });
  try {
    const result = await db().query<{ product_slug: string; size: string; design: string; price_clp: number; stock_on_hand: number }>("select product_slug,size,design,price_clp,stock_on_hand from shop_inventory where active=true order by product_slug,size,design");
    const inventory: Record<string, PublicInventory> = {};
    for (const row of result.rows) {
      const imageSrc = publicInventoryBySlug[row.product_slug]?.variants.find((v) => v.size === row.size && (v.design ?? "") === row.design)?.imageSrc;
      (inventory[row.product_slug] ??= { variants: [] }).variants.push({ size: row.size, design: row.design || undefined, priceClp: row.price_clp, units: row.stock_on_hand, imageSrc });
    }
    return NextResponse.json({ inventory }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Inventory unavailable" }, { status: 503 });
  }
}
