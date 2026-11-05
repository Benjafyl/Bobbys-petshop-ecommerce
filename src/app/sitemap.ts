import type { MetadataRoute } from "next";
import { officialProducts } from "@/lib/official-catalog";
import { absoluteSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/tienda",
    "/guia-de-tallas",
    "/the-boss",
    "/preguntas-frecuentes",
    "/cambios-y-devoluciones",
    "/contacto",
  ];

  return [...pages, ...officialProducts.map((product) => `/producto/${product.slug}`)].map((path) => ({
    url: absoluteSiteUrl(path),
  }));
}
