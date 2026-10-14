import { notFound } from "next/navigation";
import { OfficialProductDetail } from "@/components/official-product-detail";
import { getOfficialProduct, officialProducts } from "@/lib/official-catalog";

export function generateStaticParams() { return officialProducts.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const product = getOfficialProduct((await params).slug);
  return { title: product?.name ?? "Producto", description: product?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getOfficialProduct((await params).slug);
  if (!product) notFound();
  return <OfficialProductDetail product={product} />;
}
