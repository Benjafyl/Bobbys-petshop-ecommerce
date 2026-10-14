export type ProductCategory = "parka-impermeable" | "chaleco" | "accesorio";

export const categoryLabels: Record<ProductCategory, string> = {
  "parka-impermeable": "Parka impermeable",
  chaleco: "Chaleco",
  accesorio: "Accesorio",
};

export type ProductVariant = {
  id: string;
  sku: string;
  colorName: string;
  colorHex: string;
  size: "XS" | "S" | "M" | "L" | "XL";
  neckCm: string;
  chestCm: string;
  backCm: string;
  stock: number;
  lowStockThreshold: number;
};

export type Product = {
  slug: string;
  category: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  care: string;
  price: number;
  cost: number;
  image: string;
  alt: string;
  badge: string;
  featured: boolean;
  createdAt: string;
  variants: ProductVariant[];
};

export const products: Product[] = [
  {
    slug: "parka-impermeable-mostaza",
    category: "parka-impermeable",
    name: "Parka Impermeable Mostaza",
    tagline: "Capa liviana para lluvia, viento y paseos largos.",
    description:
      "Parka repelente al agua con cuello alto, calce comodo y terminaciones pensadas para perros chicos y medianos.",
    care: "Lavar a mano con agua fria. Secar a la sombra. No usar secadora.",
    price: 19990,
    cost: 8500,
    image: "/images/hero-raincoat.jpg",
    alt: "Perro usando una parka impermeable amarilla durante un paseo",
    badge: "Approved by the Boss",
    featured: true,
    createdAt: "2026-07-13",
    variants: [
      {
        id: "parka-mostaza-xs",
        sku: "BPS-PAR-001-MOS-XS",
        colorName: "Mostaza",
        colorHex: "#E6A817",
        size: "XS",
        neckCm: "22-26",
        chestCm: "32-38",
        backCm: "24-28",
        stock: 5,
        lowStockThreshold: 3,
      },
      {
        id: "parka-mostaza-s",
        sku: "BPS-PAR-001-MOS-S",
        colorName: "Mostaza",
        colorHex: "#E6A817",
        size: "S",
        neckCm: "26-30",
        chestCm: "38-44",
        backCm: "29-33",
        stock: 2,
        lowStockThreshold: 3,
      },
      {
        id: "parka-mostaza-m",
        sku: "BPS-PAR-001-MOS-M",
        colorName: "Mostaza",
        colorHex: "#E6A817",
        size: "M",
        neckCm: "30-34",
        chestCm: "44-52",
        backCm: "34-39",
        stock: 0,
        lowStockThreshold: 3,
      },
    ],
  },
  {
    slug: "parka-impermeable-carbon",
    category: "parka-impermeable",
    name: "Parka Impermeable Carbon",
    tagline: "Proteccion sobria para lluvia intensa y barro.",
    description:
      "Tela impermeable con interior suave, cierre seguro y cobertura extendida para paseos de invierno.",
    care: "Limpiar con pano humedo despues de la lluvia. Lavar solo cuando sea necesario.",
    price: 21990,
    cost: 9100,
    image: "/images/black-raincoat.jpg",
    alt: "Perro con impermeable negro entrando a una tienda",
    badge: "Ultimas unidades",
    featured: true,
    createdAt: "2026-07-12",
    variants: [
      {
        id: "parka-carbon-s",
        sku: "BPS-PAR-002-CAR-S",
        colorName: "Carbon",
        colorHex: "#1F2428",
        size: "S",
        neckCm: "26-30",
        chestCm: "38-44",
        backCm: "29-33",
        stock: 1,
        lowStockThreshold: 3,
      },
      {
        id: "parka-carbon-m",
        sku: "BPS-PAR-002-CAR-M",
        colorName: "Carbon",
        colorHex: "#1F2428",
        size: "M",
        neckCm: "30-34",
        chestCm: "44-52",
        backCm: "34-39",
        stock: 4,
        lowStockThreshold: 3,
      },
      {
        id: "parka-carbon-l",
        sku: "BPS-PAR-002-CAR-L",
        colorName: "Carbon",
        colorHex: "#1F2428",
        size: "L",
        neckCm: "34-40",
        chestCm: "52-60",
        backCm: "40-46",
        stock: 3,
        lowStockThreshold: 3,
      },
    ],
  },
  {
    slug: "chaleco-knit-bosque",
    category: "chaleco",
    name: "Chaleco Knit Bosque",
    tagline: "Abrigo suave para dias frios dentro y fuera de casa.",
    description:
      "Tejido elasticado de tacto suave, cuello comodo y ajuste facil para perros de torso corto.",
    care: "Lavar en ciclo delicado dentro de bolsa. Secar extendido.",
    price: 15990,
    cost: 6200,
    image: "/images/green-sweater.jpg",
    alt: "Perro pequeno usando un chaleco verde",
    badge: "Nuevo",
    featured: true,
    createdAt: "2026-07-11",
    variants: [
      {
        id: "chaleco-bosque-xs",
        sku: "BPS-CHA-001-BOS-XS",
        colorName: "Bosque",
        colorHex: "#2F6849",
        size: "XS",
        neckCm: "20-24",
        chestCm: "30-36",
        backCm: "23-27",
        stock: 6,
        lowStockThreshold: 3,
      },
      {
        id: "chaleco-bosque-s",
        sku: "BPS-CHA-001-BOS-S",
        colorName: "Bosque",
        colorHex: "#2F6849",
        size: "S",
        neckCm: "24-29",
        chestCm: "36-42",
        backCm: "28-32",
        stock: 4,
        lowStockThreshold: 3,
      },
      {
        id: "chaleco-bosque-m",
        sku: "BPS-CHA-001-BOS-M",
        colorName: "Bosque",
        colorHex: "#2F6849",
        size: "M",
        neckCm: "29-34",
        chestCm: "42-50",
        backCm: "33-38",
        stock: 0,
        lowStockThreshold: 3,
      },
    ],
  },
  {
    slug: "chaleco-knit-rojo",
    category: "chaleco",
    name: "Chaleco Knit Rojo",
    tagline: "Color intenso, ajuste calido y textura de invierno.",
    description:
      "Chaleco tejido con cuello alto flexible, ideal para mascotas friolentas y fotos con mucha personalidad.",
    care: "Lavar con prendas similares. No clorar. Secar a la sombra.",
    price: 14990,
    cost: 5900,
    image: "/images/red-sweater.jpg",
    alt: "Perro pequeno usando un chaleco rojo tejido",
    badge: "Favorito",
    featured: false,
    createdAt: "2026-07-10",
    variants: [
      {
        id: "chaleco-rojo-xs",
        sku: "BPS-CHA-002-ROJ-XS",
        colorName: "Rojo",
        colorHex: "#C7392D",
        size: "XS",
        neckCm: "20-24",
        chestCm: "30-36",
        backCm: "23-27",
        stock: 3,
        lowStockThreshold: 3,
      },
      {
        id: "chaleco-rojo-s",
        sku: "BPS-CHA-002-ROJ-S",
        colorName: "Rojo",
        colorHex: "#C7392D",
        size: "S",
        neckCm: "24-29",
        chestCm: "36-42",
        backCm: "28-32",
        stock: 2,
        lowStockThreshold: 3,
      },
      {
        id: "chaleco-rojo-m",
        sku: "BPS-CHA-002-ROJ-M",
        colorName: "Rojo",
        colorHex: "#C7392D",
        size: "M",
        neckCm: "29-34",
        chestCm: "42-50",
        backCm: "33-38",
        stock: 7,
        lowStockThreshold: 3,
      },
    ],
  },
  {
    slug: "bandana-terracota",
    category: "accesorio",
    name: "Bandana Terracota",
    tagline: "Un toque de color para cada paseo.",
    description: "Bandana de algodón suave con amarre ajustable para uso diario.",
    care: "Lavar a mano con agua fría y secar a la sombra.",
    price: 8990,
    cost: 3500,
    image: "/images/bandana-terracota.webp",
    alt: "Perro pequeño con bandana terracota",
    badge: "Accesorio",
    featured: true,
    createdAt: "2026-10-13",
    variants: [
      { id: "bandana-terracota-s", sku: "BPS-ACC-001-TER-S", colorName: "Terracota", colorHex: "#B6633A", size: "S", neckCm: "24-34", chestCm: "—", backCm: "—", stock: 5, lowStockThreshold: 2 },
      { id: "bandana-terracota-m", sku: "BPS-ACC-001-TER-M", colorName: "Terracota", colorHex: "#B6633A", size: "M", neckCm: "34-46", chestCm: "—", backCm: "—", stock: 5, lowStockThreshold: 2 },
    ],
  },
  {
    slug: "arnes-paseo-bosque",
    category: "accesorio",
    name: "Arnés de Paseo Bosque",
    tagline: "Ajuste cómodo para salir a explorar.",
    description: "Arnés ajustable de paseo con correa a juego y hebillas seguras.",
    care: "Limpiar con paño húmedo y dejar secar al aire.",
    price: 18990,
    cost: 8000,
    image: "/images/arnes-bosque.webp",
    alt: "Perro pequeño con arnés y correa verde bosque",
    badge: "Accesorio",
    featured: false,
    createdAt: "2026-10-12",
    variants: [
      { id: "arnes-bosque-s", sku: "BPS-ACC-002-BOS-S", colorName: "Bosque", colorHex: "#2F6849", size: "S", neckCm: "24-32", chestCm: "34-46", backCm: "—", stock: 4, lowStockThreshold: 2 },
      { id: "arnes-bosque-m", sku: "BPS-ACC-002-BOS-M", colorName: "Bosque", colorHex: "#2F6849", size: "M", neckCm: "30-40", chestCm: "44-60", backCm: "—", stock: 4, lowStockThreshold: 2 },
    ],
  },
];

export const sizeGuides = {
  "parka-impermeable": [
    { size: "XS", neck: "22-26", chest: "32-38", back: "24-28" },
    { size: "S", neck: "26-30", chest: "38-44", back: "29-33" },
    { size: "M", neck: "30-34", chest: "44-52", back: "34-39" },
    { size: "L", neck: "34-40", chest: "52-60", back: "40-46" },
    { size: "XL", neck: "40-46", chest: "60-68", back: "47-54" },
  ],
  chaleco: [
    { size: "XS", neck: "20-24", chest: "30-36", back: "23-27" },
    { size: "S", neck: "24-29", chest: "36-42", back: "28-32" },
    { size: "M", neck: "29-34", chest: "42-50", back: "33-38" },
    { size: "L", neck: "34-39", chest: "50-58", back: "39-45" },
    { size: "XL", neck: "39-45", chest: "58-66", back: "46-53" },
  ],
  accesorio: [
    { size: "S", neck: "24-34", chest: "34-46", back: "—" },
    { size: "M", neck: "34-46", chest: "44-60", back: "—" },
  ],
} satisfies Record<ProductCategory, { size: string; neck: string; chest: string; back: string }[]>;

export const orderStatuses = [
  "PENDING_PAYMENT",
  "UNDER_PAYMENT_REVIEW",
  "PAID",
  "PREPARING",
  "READY_FOR_PICKUP",
  "SHIPPED",
  "DELIVERED",
] as const;
