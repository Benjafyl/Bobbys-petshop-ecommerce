// Public catalog snapshot confirmed by the shop on 19 October 2026.
// Historical spreadsheet values are superseded. Update this file after every stock change.
export type StockedVariant = {
  size: string;
  units: number;
  priceClp: number;
  design?: string;
};

export type PublicInventory = {
  variants: StockedVariant[];
};

export const inventoryAsOf = "19 de octubre de 2026";

export const publicInventoryBySlug: Record<string, PublicInventory> = {
  "parka-bicolor-gris": {
    variants: [
      { size: "M", units: 2, priceClp: 16000 },
      { size: "L", units: 1, priceClp: 16000 },
      { size: "XL", units: 1, priceClp: 18000 },
    ],
  },
  "parka-bicolor-beige": {
    variants: [
      { size: "M", units: 2, priceClp: 16000 },
      { size: "L", units: 1, priceClp: 16000 },
      { size: "XL", units: 2, priceClp: 18000 },
    ],
  },
  "parka-rosa-metalizada": {
    variants: [{ size: "S", units: 1, priceClp: 12000 }],
  },
  "parka-militar": {
    variants: [{ size: "M", units: 1, priceClp: 12000 }],
  },
  "parka-azul": {
    variants: [{ size: "L", units: 1, priceClp: 12000 }],
  },
  "poleron-corazones-rosa": {
    variants: [{ size: "S", units: 1, priceClp: 5500 }],
  },
  "poleron-flores-rosa": {
    variants: [{ size: "S", units: 1, priceClp: 5500 }],
  },
  "poleron-ositos": {
    variants: [{ size: "M", units: 1, priceClp: 5500 }],
  },
  "poleron-leopardo-gris": {
    variants: [{ size: "M", units: 1, priceClp: 5500 }],
  },
  "poleron-dinosaurios": {
    variants: [{ size: "M", units: 1, priceClp: 5500 }],
  },
  "poleron-gris-jaspeado": {
    variants: [{ size: "M", units: 1, priceClp: 5500 }],
  },
  "vestido-vampirita": {
    variants: [{ size: "M-L", units: 1, priceClp: 5990 }],
  },
  "vestido-esqueleto": {
    variants: [{ size: "M-L", units: 1, priceClp: 5990 }],
  },
  "polera-esqueleto": {
    variants: [{ size: "M-L", units: 1, priceClp: 4000 }],
  },
  "traje-calabaza": {
    variants: [{ size: "M-L", units: 1, priceClp: 4000 }],
  },
  "bandana-halloween": {
    variants: [
      { design: "Halloween rosado", size: "Única", units: 1, priceClp: 4000 },
      { design: "Diseño 2 · foto pendiente", size: "Única", units: 1, priceClp: 4000 },
      { design: "Diseño 3 · foto pendiente", size: "Única", units: 1, priceClp: 4000 },
    ],
  },
  "collar-murcielago": {
    variants: [{ size: "XS", units: 1, priceClp: 3500 }],
  },
  "collar-calabaza": {
    variants: [{ size: "XS", units: 1, priceClp: 3500 }],
  },
};

export function getTotalUnits(inventory: PublicInventory) {
  return inventory.variants.reduce((total, variant) => total + variant.units, 0);
}

export function getMinimumPrice(inventory: PublicInventory) {
  return Math.min(...inventory.variants.map((variant) => variant.priceClp));
}

export function hasMultiplePrices(inventory: PublicInventory) {
  return new Set(inventory.variants.map((variant) => variant.priceClp)).size > 1;
}

export function formatClp(amount: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(amount);
}
