// Curated public snapshot from the Inventario sheet, 13 October 2026.
// Do not commit the source workbook: it also contains costs, sales and margins.
export type PublicInventory = {
  priceClp: number;
  sizes: string[];
};

export const inventoryAsOf = "13 de octubre de 2026";

export const publicInventoryBySlug: Record<string, PublicInventory> = {
  "parka-bicolor-gris": {
    priceClp: 16000,
    sizes: ["XL", "3XL"],
  },
  "parka-bicolor-beige": {
    priceClp: 16000,
    sizes: ["S", "XL", "XXL", "3XL"],
  },
  "parka-rosa-metalizada": {
    priceClp: 14000,
    sizes: ["S", "M"],
  },
  "poleron-corazones-rosa": {
    priceClp: 6500,
    sizes: ["S"],
  },
  "poleron-flores-rosa": {
    priceClp: 6500,
    sizes: ["S"],
  },
  "poleron-leopardo-gris": {
    priceClp: 6500,
    sizes: ["L"],
  },
  "poleron-dinosaurios": {
    priceClp: 6500,
    sizes: ["L"],
  },
};

export function formatClp(amount: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(amount);
}
