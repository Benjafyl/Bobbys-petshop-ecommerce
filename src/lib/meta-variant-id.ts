import type { StockedVariant } from "@/lib/public-inventory";

export function getMetaVariantId(slug: string, variant: Pick<StockedVariant, "size" | "design">) {
  const design = (variant.design || "default")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const size = variant.size
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${size}-${design}`;
}
