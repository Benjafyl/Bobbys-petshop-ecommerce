export type OfficialCategory = "abrigos" | "polerones" | "halloween" | "accesorios";

export type OfficialProduct = {
  slug: string;
  name: string;
  category: OfficialCategory;
  description: string;
  images: { src: string; alt: string }[];
  featured?: boolean;
};

export const officialCategoryLabels: Record<OfficialCategory, string> = {
  abrigos: "Abrigos",
  polerones: "Polerones y chalecos",
  halloween: "Halloween",
  accesorios: "Accesorios",
};

const image = (name: string, alt: string) => ({ src: `/images/official/${name}.jpg`, alt });

export const officialProducts: OfficialProduct[] = [
  {
    slug: "parka-bicolor-gris",
    name: "Parka bicolor gris",
    category: "abrigos",
    description: "Parka acolchada gris y negra con cierre en la espalda y anillas para correa. Mira las fotos de producto y cómo luce puesta.",
    images: [
      image("parka-gris-modelo-lateral", "Perro con parka gris y negra, vista lateral"),
      image("parka-gris-producto", "Parka bicolor gris y negra, vista de producto"),
      image("parka-gris-frente-dorso", "Parka gris y negra por ambos lados"),
      image("parka-gris-modelo-cerca", "Perro con parka gris y negra, detalle"),
      image("parka-gris-modelo-superior", "Parka gris y negra puesta, vista superior"),
    ],
    featured: true,
  },
  {
    slug: "parka-bicolor-beige",
    name: "Parka bicolor beige",
    category: "abrigos",
    description: "Parka acolchada beige y negra con cierre en la espalda y anillas para correa.",
    images: [
      image("parka-beige-modelo", "Perro con parka beige y negra"),
      image("parka-beige-frente-dorso", "Parka beige y negra por ambos lados"),
    ],
    featured: true,
  },
  {
    slug: "parka-rosa-metalizada",
    name: "Parka rosa metalizada",
    category: "abrigos",
    description: "Parka acolchada de acabado rosa brillante, con cierre en la espalda y anillas para correa.",
    images: [image("parka-rosa-metalizada-producto", "Parka acolchada rosa metalizada")],
  },
  {
    slug: "poleron-ositos",
    name: "Polerón de ositos",
    category: "polerones",
    description: "Polerón suave en tonos beige y crema con diseño de ositos.",
    images: [image("poleron-ositos-producto", "Polerón beige y crema con ositos")],
    featured: true,
  },
  {
    slug: "poleron-leopardo-gris",
    name: "Chaleco animal print blanco",
    category: "polerones",
    description: "Chaleco suave blanco y gris con estampado animal print y puños acanalados.",
    images: [image("poleron-leopardo-gris-producto", "Chaleco blanco y gris con estampado animal print")],
  },
  {
    slug: "poleron-flores-rosa",
    name: "Chaleco rosado con patitas",
    category: "polerones",
    description: "Chaleco rosado suave con diseño de patitas y terminaciones acanaladas.",
    images: [image("poleron-flores-rosa-producto", "Chaleco rosado estampado con terminaciones acanaladas")],
  },
  {
    slug: "poleron-corazones-rosa",
    name: "Polerón corazones rosa",
    category: "polerones",
    description: "Polerón rosa suave con corazones blancos.",
    images: [image("poleron-corazones-rosa-producto", "Polerón rosa con corazones blancos")],
  },
  {
    slug: "poleron-dinosaurios",
    name: "Chaleco azul con dinosaurios",
    category: "polerones",
    description: "Chaleco suave gris y azul con dinosaurios en blanco y celeste.",
    images: [image("poleron-dinosaurios-gris-producto", "Chaleco gris y azul con dinosaurios")],
  },
  {
    slug: "poleron-gris-jaspeado",
    name: "Polerón gris jaspeado",
    category: "polerones",
    description: "Polerón gris jaspeado de cuello alto. Fotografiado en un perro para mostrar su calce.",
    images: [image("poleron-gris-modelo", "Perro blanco con polerón gris jaspeado")],
  },
  {
    slug: "polera-esqueleto",
    name: "Polera esqueleto",
    category: "halloween",
    description: "Polera negra sin mangas con diseño de esqueleto blanco y corazón rojo.",
    images: [
      image("polera-esqueleto-modelo", "Perro con polera negra de esqueleto"),
      image("polera-esqueleto-producto", "Polera negra con esqueleto y corazón rojo"),
    ],
  },
  {
    slug: "vestido-esqueleto",
    name: "Vestido esqueleto",
    category: "halloween",
    description: "Vestido negro con falda de tul y estampado de esqueleto con motivos de Halloween.",
    images: [
      image("vestido-esqueleto-modelo", "Perro con vestido negro de esqueleto"),
      image("vestido-esqueleto-producto", "Vestido negro con falda de tul y diseño de esqueleto"),
    ],
  },
  {
    slug: "vestido-vampirita",
    name: "Vestido vampirita",
    category: "halloween",
    description: "Vestido negro y rojo con alas decorativas y falda de tul.",
    images: [image("vestido-vampirita-producto", "Vestido negro y rojo con alas decorativas")],
  },
  {
    slug: "bandana-halloween",
    name: "Bandana Halloween",
    category: "accesorios",
    description: "Bandana rosa con ilustraciones de temporada, fotografiada en un perro.",
    images: [image("bandana-halloween-modelo", "Perro con bandana rosa de Halloween")],
  },
  {
    slug: "collar-murcielago",
    name: "Collar murciélago",
    category: "accesorios",
    description: "Collar con lazo de telarañas, alas negras decorativas y colgante de temporada.",
    images: [
      image("collar-murcielago-producto", "Collar con lazo blanco y alas negras de murciélago"),
      image("accesorios-halloween-conjunto", "Accesorios de Halloween con lazos y alas"),
    ],
  },
  {
    slug: "collar-calabaza",
    name: "Collar calabaza",
    category: "accesorios",
    description: "Collar morado con lazo naranja, alas decorativas y calabaza.",
    images: [image("collar-calabaza-producto", "Collar morado y naranja con calabaza y alas")],
  },
];

export function getOfficialProduct(slug: string) {
  return officialProducts.find((product) => product.slug === slug);
}
