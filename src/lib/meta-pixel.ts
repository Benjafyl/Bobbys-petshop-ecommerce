export const META_PIXEL_ID = "1143296638199935";
export const META_CONSENT_KEY = "bobbys-meta-consent-v1";
export const META_CONSENT_EVENT = "bobbys-meta-consent";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export function metaConsentGranted() {
  try { return window.localStorage.getItem(META_CONSENT_KEY) === "accepted"; }
  catch { return false; }
}

export function loadMetaPixel() {
  if (!metaConsentGranted()) return;
  if (window.fbq) {
    window.fbq("consent", "grant");
    return;
  }
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  }) as Fbq;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;
  fbq("init", META_PIXEL_ID);
  fbq("consent", "grant");
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
}

export function revokeMetaPixel() {
  window.fbq?.("consent", "revoke");
  for (const name of ["_fbp", "_fbc"]) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.bobbyspetshop.cl; SameSite=Lax`;
  }
}

export function trackMetaEvent(name: string, data?: Record<string, unknown>) {
  if (!metaConsentGranted()) return false;
  loadMetaPixel();
  if (!window.fbq) return false;
  window.fbq("track", name, data);
  return true;
}
