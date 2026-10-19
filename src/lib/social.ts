export const instagramProfileUrl = "https://www.instagram.com/bobbys.cl/";

export const instagramReels = [
  { id: "DYmrIIAunRg", label: "Reel 1 de Bobby's Pet Shop" },
  { id: "DZS1G_DirkD", label: "Reel 2 de Bobby's Pet Shop" },
  { id: "DYnBKm8CWga", label: "Reel 3 de Bobby's Pet Shop" },
].map((reel) => ({
  ...reel,
  url: `https://www.instagram.com/reel/${reel.id}/`,
  embedUrl: `https://www.instagram.com/reel/${reel.id}/embed/`,
}));
