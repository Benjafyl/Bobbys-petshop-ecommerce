import { NextResponse } from "next/server";
import { db, dbConfigured } from "@/lib/db";
import { SHIPPING_FEE_CLP } from "@/lib/shipping";

type CartCandidate = { variantId?: unknown; quantity?: unknown };
export async function POST(request: Request) {
  if (!dbConfigured()) return NextResponse.json({ valid: false, message: "Códigos disponibles al habilitar el pago." }, { status: 503 });
  let body: { code?: unknown; cart?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ valid: false, message: "Solicitud inválida." }, { status: 400 }); }
  const code = String(body.code ?? "").trim().toUpperCase();
  const cart = body.cart as CartCandidate[];
  if (!/^[A-Z0-9_-]{3,32}$/.test(code) || !Array.isArray(cart) || cart.length < 1 || cart.length > 50) return NextResponse.json({ valid: false, message: "Revisa el código y el carrito." }, { status: 400 });
  const quantityByVariant = new Map<string, number>();
  for (const line of cart) {
    if (!line || typeof line.variantId !== "string" || line.variantId.length > 200 || !Number.isInteger(line.quantity) || Number(line.quantity) < 1) return NextResponse.json({ valid: false, message: "Carrito inválido." }, { status: 400 });
    quantityByVariant.set(line.variantId, (quantityByVariant.get(line.variantId) ?? 0) + Number(line.quantity));
  }
  try {
    const variants = await db().query<{ variant_key: string; price_clp: number; stock_on_hand: number }>("select variant_key,price_clp,stock_on_hand from shop_inventory where active=true and variant_key = any($1::text[])", [[...quantityByVariant.keys()]]);
    if (variants.rows.length !== quantityByVariant.size || variants.rows.some((variant) => quantityByVariant.get(variant.variant_key)! > variant.stock_on_hand)) return NextResponse.json({ valid: false, message: "Algunas unidades del carrito ya no están disponibles." }, { status: 409 });
    const subtotal = variants.rows.reduce((sum, variant) => sum + variant.price_clp * quantityByVariant.get(variant.variant_key)!, 0);
    const result = await db().query<{ code: string; kind: string; amount: number; minimum_clp: number; usage_limit: number | null; used_count: number }>("select code,kind,amount,minimum_clp,usage_limit,used_count from shop_coupons where code=$1 and active=true and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now())", [code]);
    const coupon = result.rows[0];
    if (!coupon || subtotal < coupon.minimum_clp || (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit)) return NextResponse.json({ valid: false, message: "Código no disponible para este carrito." });
    const discount = Math.min(subtotal, coupon.kind === "PERCENT" ? Math.floor(subtotal * coupon.amount / 100) : coupon.amount);
    return NextResponse.json({ valid: true, code, discountClp: discount, subtotalClp: subtotal, shippingClp: SHIPPING_FEE_CLP, totalClp: subtotal + SHIPPING_FEE_CLP - discount }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ valid: false, message: "No pudimos revisar el código. Inténtalo más tarde." }, { status: 503 }); }
}
