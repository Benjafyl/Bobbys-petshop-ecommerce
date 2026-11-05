export const SITE_URL = "https://bobbyspetshop.cl";

export function absoluteSiteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
