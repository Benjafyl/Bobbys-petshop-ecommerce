export const instagramProfileUrl = "https://www.instagram.com/bobbys.cl/";

export const instagramReels = [
  {
    id: "DYmrIIAunRg",
    label: "Bobby usando una parka",
    cover: "/images/official/reel-parka-en-casa.jpg",
    video: "/videos/official/reel-parka-en-casa.mp4",
  },
  {
    id: "DZS1G_DirkD",
    label: "Modelos de parkas de Bobby's",
    cover: "/images/official/reel-coleccion-parkas.jpg",
    video: "/videos/official/reel-coleccion-parkas.mp4",
  },
  {
    id: "DYnBKm8CWga",
    label: "Cómo lavar una parka",
    cover: "/images/official/reel-lavado-parka.jpg",
    video: "/videos/official/reel-lavado-parka.mp4",
  },
].map((reel) => ({
  ...reel,
  url: `https://www.instagram.com/reel/${reel.id}/`,
}));
