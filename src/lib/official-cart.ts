import { getOfficialProduct, type OfficialProduct } from "@/lib/official-catalog";
import { publicInventoryBySlug, type StockedVariant } from "@/lib/public-inventory";

export type OfficialCartItem = {
  productSlug: string;
  variantId: string;
  quantity: number;
};

export type OfficialCartLine = OfficialCartItem & {
  product: OfficialProduct;
  variant: StockedVariant;
  lineTotal: number;
};

export const OFFICIAL_CART_KEY = "bobbys-official-cart-v1";

export function getOfficialVariantId(productSlug: string, variant: StockedVariant) {
  return JSON.stringify([productSlug, variant.size, variant.design ?? ""]);
}

export function getOfficialCartVariant(productSlug: string, variantId: string) {
  const product = getOfficialProduct(productSlug);
  const variant = publicInventoryBySlug[productSlug]?.variants.find(
    (item) => getOfficialVariantId(productSlug, item) === variantId,
  );

  return product && variant?.units ? { product, variant } : null;
}

export function normalizeOfficialCart(value: unknown): OfficialCartItem[] {
  if (!Array.isArray(value)) return [];

  const items = new Map<string, OfficialCartItem>();
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object") continue;
    const { productSlug, variantId, quantity } = candidate as Record<string, unknown>;
    if (typeof productSlug !== "string" || typeof variantId !== "string" || typeof quantity !== "number") continue;
    if (!Number.isFinite(quantity) || quantity < 1) continue;

    const match = getOfficialCartVariant(productSlug, variantId);
    if (!match) continue;

    const previous = items.get(variantId)?.quantity ?? 0;
    items.set(variantId, {
      productSlug,
      variantId,
      quantity: Math.min(previous + Math.floor(quantity), match.variant.units),
    });
  }

  return [...items.values()];
}

export function addToOfficialCart(cart: OfficialCartItem[], productSlug: string, variantId: string, quantity = 1) {
  const match = getOfficialCartVariant(productSlug, variantId);
  const current = normalizeOfficialCart(cart);
  if (!match || !Number.isFinite(quantity) || quantity < 1) return current;

  const existing = current.find((item) => item.variantId === variantId);
  const nextQuantity = Math.min((existing?.quantity ?? 0) + Math.floor(quantity), match.variant.units);
  if (existing) {
    return current.map((item) => item.variantId === variantId ? { ...item, quantity: nextQuantity } : item);
  }

  return [...current, { productSlug, variantId, quantity: nextQuantity }];
}

export function setOfficialCartQuantity(cart: OfficialCartItem[], variantId: string, quantity: number) {
  const current = normalizeOfficialCart(cart);
  if (!Number.isFinite(quantity)) return current;
  if (quantity <= 0) return current.filter((item) => item.variantId !== variantId);

  return current.map((item) => {
    if (item.variantId !== variantId) return item;
    const match = getOfficialCartVariant(item.productSlug, variantId);
    return { ...item, quantity: Math.min(Math.floor(quantity), match?.variant.units ?? 0) };
  }).filter((item) => item.quantity > 0);
}

export function getOfficialCartLines(cart: OfficialCartItem[]): OfficialCartLine[] {
  return normalizeOfficialCart(cart).flatMap((item) => {
    const match = getOfficialCartVariant(item.productSlug, item.variantId);
    return match ? [{ ...item, ...match, lineTotal: match.variant.priceClp * item.quantity }] : [];
  });
}

export function getOfficialCartSubtotal(cart: OfficialCartItem[]) {
  return getOfficialCartLines(cart).reduce((total, line) => total + line.lineTotal, 0);
}
