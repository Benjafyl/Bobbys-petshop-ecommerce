import { publicInventoryBySlug } from "@/lib/public-inventory";

export type OfficialCategory = "abrigos" | "polerones" | "halloween" | "accesorios";

export type OfficialProduct = {
  slug: string;
  name: string;
  category: OfficialCategory;
  description: string;
  images: { src: string; alt: string }[];
  video?: { src: string; poster: string; label: string };
  featured?: boolean;
};

export const officialCategoryLabels: Record<OfficialCategory, string> = {
  abrigos: "Abrigos",
  polerones: "Chalecos",
  halloween: "Halloween",
  accesorios: "Accesorios",
};

const image = (name: string, alt: string) => ({ src: `/images/official/${name}.jpg`, alt });

const catalogProducts: OfficialProduct[] = [
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
      image("parka-gris-paseo-nieve", "Perro con parka gris y negra durante un paseo en la nieve"),
    ],
    video: {
      src: "/videos/official/parka-gris-en-movimiento.mp4",
      poster: "/images/official/parka-gris-modelo-lateral.jpg",
      label: "Parka gris puesta en un perro, video corto",
    },
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
    slug: "parka-militar",
    name: "Parka militar",
    category: "abrigos",
    description: "Parka acolchada con estampado de camuflaje azul, amarillo y turquesa, cierre en la espalda y anillas para correa.",
    images: [
      image("parka-militar-producto", "Parka militar de colores, vista de producto"),
      image("parka-militar-modelo", "Perro junto a la parka militar de colores"),
    ],
  },
  {
    slug: "parka-azul",
    name: "Parka azul",
    category: "abrigos",
    description: "Parka acolchada negra y turquesa con cuello alto y anilla para correa.",
    images: [image("parka-azul-modelo", "Perro con parka negra y turquesa")],
  },
  {
    slug: "poleron-ositos",
    name: "Chaleco de ositos",
    category: "polerones",
    description: "Chaleco suave en tonos beige y crema con diseño de ositos.",
    images: [image("poleron-ositos-producto", "Chaleco beige y crema con ositos")],
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
    name: "Chaleco rosado con corazones",
    category: "polerones",
    description: "Chaleco rosado suave con corazones blancos.",
    images: [image("poleron-corazones-rosa-producto", "Chaleco rosado con corazones blancos")],
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
    name: "Chaleco gris jaspeado",
    category: "polerones",
    description: "Chaleco gris jaspeado de cuello alto. Fotografiado en un perro para mostrar su calce.",
    images: [image("poleron-gris-modelo", "Perro blanco con chaleco gris jaspeado")],
  },
  {
    slug: "polera-esqueleto",
    name: "Traje huesitos",
    category: "halloween",
    description: "Prenda negra sin mangas con diseño de huesitos blancos y corazón rojo.",
    images: [
      image("polera-esqueleto-modelo", "Perro con polera negra de esqueleto"),
      image("polera-esqueleto-producto", "Polera negra con esqueleto y corazón rojo"),
    ],
  },
  {
    slug: "vestido-esqueleto",
    name: "Vestido calabazas",
    category: "halloween",
    description: "Vestido negro con falda de tul y estampado de huesitos y calabaza para Halloween.",
    images: [
      image("vestido-esqueleto-modelo", "Perro con vestido negro de esqueleto"),
      image("vestido-esqueleto-producto", "Vestido negro con falda de tul y diseño de esqueleto"),
    ],
  },
  {
    slug: "vestido-vampirita",
    name: "Vestido murciélago",
    category: "halloween",
    description: "Vestido negro y rojo con alas de murciélago decorativas y falda de tul.",
    images: [image("vestido-vampirita-producto", "Vestido negro y rojo con alas de murciélago")],
  },
  {
    slug: "traje-calabaza",
    name: "Traje calabaza",
    category: "halloween",
    description: "Traje naranja sin mangas con rostro de calabaza para Halloween. En la foto se muestra combinado con un pañuelo que se vende por separado.",
    images: [
      image("traje-calabaza-modelo", "Perro con traje naranja de calabaza, combinado con un pañuelo vendido por separado"),
      image("traje-calabaza-producto", "Traje naranja de calabaza, vista de producto"),
    ],
  },
  {
    slug: "bandana-halloween",
    name: "Pañuelos",
    category: "accesorios",
    description: "Tres pañuelos de Halloween, uno de cada diseño: rosado, crema con fantasmas y murciélagos, y negro con estampado Boo!",
    images: [
      image("bandanas-halloween-tres-disenos", "Los tres pañuelos de Halloween: rosado, negro y crema"),
      image("bandana-halloween-modelo", "Perro con pañuelo rosado de Halloween"),
      image("bandana-fantasmas-murcielagos-producto", "Pañuelo crema con fantasmas y murciélagos"),
      image("bandana-boo-producto", "Pañuelo negro con fantasmas y letras Boo!"),
    ],
  },
  {
    slug: "collar-murcielago",
    name: "Collar murciélago para gatos",
    category: "accesorios",
    description: "Collar XS para gatos con lazo de telarañas, alas negras decorativas y colgante de temporada.",
    images: [
      image("collar-murcielago-gato", "Gato negro con collar de murciélago y colgante de telaraña"),
      image("collar-murcielago-producto", "Collar con lazo blanco y alas negras de murciélago"),
      image("accesorios-halloween-conjunto", "Accesorios de Halloween con lazos y alas"),
    ],
  },
  {
    slug: "collar-calabaza",
    name: "Collar calabaza para gatos",
    category: "accesorios",
    description: "Collar XS para gatos, morado con lazo naranja, alas decorativas y calabaza.",
    images: [image("collar-calabaza-producto", "Collar morado y naranja con calabaza y alas")],
  },
];

// Only items with confirmed, positive stock belong in the live catalog.
export const officialProducts = catalogProducts.filter((product) =>
  publicInventoryBySlug[product.slug]?.variants.some((variant) => variant.units > 0),
);

export function getOfficialProduct(slug: string) {
  return officialProducts.find((product) => product.slug === slug);
}
