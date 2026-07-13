import { products, type Product, type ProductVariant } from "@/lib/catalog";

export type CartItem = {
  productSlug: string;
  variantId: string;
  quantity: number;
};

export type EnrichedCartItem = CartItem & {
  product: Product;
  variant: ProductVariant;
  lineTotal: number;
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getVariant(productSlug: string, variantId: string) {
  const product = getProduct(productSlug);
  const variant = product?.variants.find((item) => item.id === variantId);

  if (!product || !variant) {
    return null;
  }

  return { product, variant };
}

export function getProductStock(product: Product) {
  return product.variants.reduce((total, variant) => total + variant.stock, 0);
}

export function getStockLabel(stock: number, lowStockThreshold = 3) {
  if (stock <= 0) {
    return "Agotado";
  }

  if (stock <= lowStockThreshold) {
    return "Ultimas unidades";
  }

  return "Disponible";
}

export function enrichCart(items: CartItem[]): EnrichedCartItem[] {
  return items.flatMap((item) => {
    const match = getVariant(item.productSlug, item.variantId);

    if (!match) {
      return [];
    }

    return [
      {
        ...item,
        product: match.product,
        variant: match.variant,
        lineTotal: match.product.price * item.quantity,
      },
    ];
  });
}

export function getCartTotals(items: EnrichedCartItem[], deliveryFee = 0) {
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    units: items.reduce((total, item) => total + item.quantity, 0),
  };
}

export function getRecommendedVariant(product: Product) {
  return product.variants.find((variant) => variant.stock > 0) ?? product.variants[0];
}
