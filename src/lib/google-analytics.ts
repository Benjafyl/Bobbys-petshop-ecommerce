import { META_CONSENT_KEY } from "@/lib/meta-pixel";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";
const allowedCampaignParameters = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid"];

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: Gtag;
  }
}

function consentGranted() {
  try { return window.localStorage.getItem(META_CONSENT_KEY) === "accepted"; }
  catch { return false; }
}

export function loadGoogleAnalytics() {
  if (!/^G-[A-Z0-9]+$/.test(measurementId) || !consentGranted()) return false;
  if (window.gtag) return true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
  return true;
}

export function revokeGoogleAnalytics() {
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name?.startsWith("_ga")) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.bobbyspetshop.cl; SameSite=Lax`;
  }
}

export function trackGoogleEvent(name: string, data?: Record<string, unknown>) {
  if (!loadGoogleAnalytics()) return false;
  window.gtag?.("event", name, { page_location: safePageLocation(), ...data });
  return true;
}

export function safePageLocation() {
  const url = new URL(window.location.href);
  const campaign = new URLSearchParams();
  for (const key of allowedCampaignParameters) {
    const value = url.searchParams.get(key);
    if (value) campaign.set(key, value.slice(0, 200));
  }
  const query = campaign.toString();
  return `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
}

export function trackGooglePageView() {
  return trackGoogleEvent("page_view", { page_title: document.title });
}
