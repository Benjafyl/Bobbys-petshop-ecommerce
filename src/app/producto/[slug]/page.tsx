import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { OfficialProductDetail } from "@/components/official-product-detail";
import { getLiveProductInventory } from "@/lib/live-product-inventory";
import { getOfficialProduct, officialCategoryLabels } from "@/lib/official-catalog";
import { SHIPPING_FEE_CLP } from "@/lib/shipping";
import { absoluteSiteUrl, SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getOfficialProduct((await params).slug);
  if (!product) return { title: "Producto", robots: { index: false } };
  const url = absoluteSiteUrl(`/producto/${product.slug}`);
  const description = `${product.description} Compra online en Chile con envío o retiro en Viña del Mar.`;
  return {
    title: `${product.name} para mascotas`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${product.name} | Bobby's Pet Shop`, description, url, images: product.images.map((image) => absoluteSiteUrl(image.src)) },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getOfficialProduct((await params).slug);
  if (!product) notFound();
  const inventory = await getLiveProductInventory(product.slug);
  const url = absoluteSiteUrl(`/producto/${product.slug}`);
  const offers = inventory?.variants.map((variant) => ({
    "@type": "Offer",
    url,
    sku: [product.slug, variant.size, variant.design].filter(Boolean).join("-"),
    price: variant.priceClp,
    priceCurrency: "CLP",
    availability: variant.units > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: SHIPPING_FEE_CLP, currency: "CLP" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "CL" },
    },
  }));
  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    image: product.images.map((image) => absoluteSiteUrl(image.src)),
    brand: { "@type": "Brand", name: "Bobby's Pet Shop" },
    category: officialCategoryLabels[product.category],
    ...(offers?.length ? { offers } : {}),
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: absoluteSiteUrl("/tienda") },
      { "@type": "ListItem", position: 3, name: product.name, item: url },
    ],
  };
  return <><JsonLd data={productData} /><JsonLd data={breadcrumbs} /><OfficialProductDetail product={product} initialInventory={inventory} /></>;
}
