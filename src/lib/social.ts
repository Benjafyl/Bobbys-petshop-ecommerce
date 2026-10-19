export const instagramProfileUrl = "https://www.instagram.com/bobbys.cl/";

export const instagramReels = [
  { id: "DYmrIIAunRg", label: "Parka gris en Instagram", cover: "/images/official/parka-gris-modelo-superior.jpg" },
  { id: "DZS1G_DirkD", label: "Parka azul en Instagram", cover: "/images/official/parka-azul-modelo.jpg" },
  { id: "DYnBKm8CWga", label: "Parka azul en otro reel de Instagram", cover: "/images/official/parka-azul-captura.jpg" },
].map((reel) => ({
  ...reel,
  url: `https://www.instagram.com/reel/${reel.id}/`,
}));
