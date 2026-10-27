import { publicInventoryBySlug } from "@/lib/public-inventory";

export type OfficialCategory = "abrigos" | "polerones" | "halloween" | "accesorios";

export type OfficialProduct = {
  slug: string;
  name: string;
  category: OfficialCategory;
  description: string;
  fit?: string;
  images: { src: string; alt: string; crop?: "left" | "right" }[];
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
    description: "Para paseos que no se suspenden por frío. Bobby la lleva con actitud; tu regalón pone el resto.",
    images: [
      image("parka-gris-producto", "Parka bicolor gris y negra, vista de producto"),
      image("parka-gris-modelo-cerca", "Perro con parka gris y negra, detalle"),
      image("parka-gris-modelo-lateral", "Perro con parka gris y negra, vista lateral"),
      image("parka-gris-frente-dorso", "Parka gris y negra por ambos lados"),
      image("parka-gris-modelo-superior", "Parka gris y negra puesta, vista superior"),
      image("parka-gris-paseo-nieve", "Perro con parka gris y negra durante un paseo en la nieve"),
    ],
    featured: true,
  },
  {
    slug: "parka-bicolor-beige",
    name: "Parka bicolor beige",
    category: "abrigos",
    description: "Un clásico con pinta de aventura. Beige y negro para salir a recorrer con toda la facha.",
    images: [
      image("parka-beige-producto", "Parka bicolor beige y negra, vista exterior"),
      image("parka-beige-modelo", "Perro con parka beige y negra"),
      { ...image("parka-beige-frente-dorso", "Parka beige y negra, vista interior"), crop: "right" },
      image("parka-beige-en-casa", "Perro con parka beige y negra en casa"),
    ],
    featured: true,
  },
  {
    slug: "parka-rosa-metalizada",
    name: "Parka rosa metalizada",
    category: "abrigos",
    description: "Si va a salir, que se note. Un brillo rosado que le pone alegría hasta al día más gris.",
    images: [image("parka-rosa-metalizada-producto", "Parka acolchada rosa metalizada")],
  },
  {
    slug: "parka-militar",
    name: "Parka militar",
    category: "abrigos",
    description: "Para quienes convierten cada vuelta a la manzana en una expedición. Esta parka llega con color de sobra.",
    images: [
      image("parka-militar-producto", "Parka militar de colores, vista de producto"),
      image("parka-militar-modelo", "Perro junto a la parka militar de colores"),
    ],
  },
  {
    slug: "parka-azul",
    name: "Parka azul",
    category: "abrigos",
    description: "Turquesa que se ve desde lejos y ganas de paseo que se contagian. Bobby ya salió a modelarla.",
    images: [
      image("parka-azul-producto", "Parka negra y turquesa, vista de producto"),
      image("parka-azul-modelo", "Bobby con la parka negra y turquesa"),
    ],
  },
  {
    slug: "poleron-ositos",
    name: "Chaleco animal print café",
    category: "polerones",
    description: "Animal print, pero en versión abrazo. Un chaleco para pasear bonito y volver directo al regaloneo.",
    images: [image("poleron-ositos-producto", "Chaleco animal print café y crema")],
    featured: true,
  },
  {
    slug: "poleron-leopardo-gris",
    name: "Chaleco animal print blanco",
    category: "polerones",
    description: "Un toque salvaje para el más tierno de la casa. El estampado hace todo el trabajo.",
    images: [image("poleron-leopardo-gris-producto", "Chaleco blanco y gris con estampado animal print")],
  },
  {
    slug: "poleron-flores-rosa",
    name: "Chaleco patitas",
    category: "polerones",
    description: "Patitas en la ropa, patitas en todas partes. Un chaleco alegre para salir a dejar huellas.",
    images: [image("poleron-flores-rosa-producto", "Chaleco rosado estampado con terminaciones acanaladas")],
  },
  {
    slug: "poleron-corazones-rosa",
    name: "Chaleco corazones",
    category: "polerones",
    description: "Para ese amor de cuatro patas que se lleva todos los corazones. Rosado para regalonear con estilo.",
    images: [image("poleron-corazones-rosa-producto", "Chaleco rosado con corazones blancos")],
  },
  {
    slug: "poleron-dinosaurios",
    name: "Chaleco dinosaurios",
    category: "polerones",
    description: "Pequeño por fuera, dinosaurio por dentro. Listo para paseos con energía y siestas de campeonato.",
    images: [image("poleron-dinosaurios-gris-producto", "Chaleco gris y azul con dinosaurios")],
  },
  {
    slug: "polera-esqueleto",
    name: "Traje huesitos",
    category: "halloween",
    description: "Un esqueleto adorable y cero sustos. Este traje está listo para salir a pedir miradas.",
    images: [
      image("polera-esqueleto-modelo", "Perro con polera negra de esqueleto"),
      image("polera-esqueleto-producto", "Polera negra con esqueleto y corazón rojo"),
    ],
  },
  {
    slug: "vestido-esqueleto",
    name: "Vestido calabaza",
    category: "halloween",
    description: "Una calabacita con mucho estilo. El tul pone el drama; tu mascota se roba el show.",
    images: [
      image("vestido-esqueleto-modelo", "Perro con vestido negro de esqueleto"),
      image("vestido-esqueleto-producto", "Vestido negro con falda de tul y diseño de esqueleto"),
    ],
  },
  {
    slug: "vestido-vampirita",
    name: "Vestido murciélago",
    category: "halloween",
    description: "Alitas listas, carita inocente. Un vestido para aparecer en la fiesta y llevarse todas las fotos.",
    images: [image("vestido-vampirita-producto", "Vestido negro y rojo con alas de murciélago")],
  },
  {
    slug: "traje-calabaza",
    name: "Traje calabaza",
    category: "halloween",
    description: "La calabaza más simpática del barrio. Combínala con su pañuelo favorito; el pañuelo se vende por separado.",
    images: [
      image("traje-calabaza-producto", "Traje naranja de calabaza, vista de producto"),
      image("traje-calabaza-modelo", "Perro con traje naranja de calabaza, combinado con un pañuelo vendido por separado"),
    ],
  },
  {
    slug: "bandana-halloween",
    name: "Pañuelos Spooky",
    category: "accesorios",
    description: "Un guiño spooky para el paseo. Elige entre tres diseños y deja que el pañuelo haga su magia.",
    fit: "Para perros medianos a grandes",
    images: [
      image("bandanas-halloween-tres-disenos", "Los tres pañuelos de Halloween: rosado, negro y crema"),
      image("bandana-halloween-modelo", "Perro con pañuelo rosado de Halloween"),
      image("bandana-fantasmas-murcielagos-producto", "Pañuelo crema con fantasmas y murciélagos"),
      image("bandana-boo-producto", "Pañuelo negro con fantasmas y letras Boo!"),
    ],
  },
  {
    slug: "collar-murcielago",
    name: "Collar murciélago",
    category: "accesorios",
    description: "Unas alitas y cambia toda la actitud. Pequeño accesorio, gran entrada.",
    images: [
      image("collar-murcielago-gato", "Gato negro con collar de murciélago y colgante de telaraña"),
      image("collar-murcielago-producto", "Collar con lazo blanco y alas negras de murciélago"),
      image("accesorios-halloween-conjunto", "Accesorios de Halloween con lazos y alas"),
    ],
  },
  {
    slug: "collar-calabaza",
    name: "Collar calabaza",
    category: "accesorios",
    description: "Un toque naranja para que la fiesta empiece desde el primer maullido o ladrido.",
    images: [
      image("collar-calabaza-producto", "Collar morado y naranja con calabaza y alas"),
      image("collar-calabaza-gato-perfil", "Gato gris con collar de calabaza visto de perfil"),
      image("collar-calabaza-gato-dorso", "Gato gris con el lazo naranja y las alas del collar de calabaza"),
    ],
  },
];

// Only items with confirmed, positive stock belong in the live catalog.
export const officialProducts = catalogProducts.filter((product) =>
  publicInventoryBySlug[product.slug]?.variants.some((variant) => variant.units > 0),
);

export function getOfficialProduct(slug: string) {
  return officialProducts.find((product) => product.slug === slug);
}
