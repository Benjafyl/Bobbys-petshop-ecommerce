"use client";

import { useEffect } from "react";
import { META_CONSENT_EVENT, trackMetaEvent } from "@/lib/meta-pixel";
import { trackGoogleEvent } from "@/lib/google-analytics";

type PurchaseItem = { item_id: string; item_name: string; item_variant: string; price: number; quantity: number };

export function MetaPurchaseEvent({ orderId, totalClp, revenueClp, shippingClp, contents, items }: { orderId: string; totalClp: number; revenueClp: number; shippingClp: number; contents: { id: string; quantity: number }[]; items: PurchaseItem[] }) {
  useEffect(() => {
    const track = () => {
      const metaKey = `bobbys-meta-purchase-${orderId}`;
      const googleKey = `bobbys-ga-purchase-${orderId}`;
      try {
        if (!window.localStorage.getItem(metaKey) && trackMetaEvent("Purchase", { content_type: "product", content_ids: contents.map((line) => line.id), contents, value: totalClp, currency: "CLP" })) window.localStorage.setItem(metaKey, "sent");
        if (!window.localStorage.getItem(googleKey) && trackGoogleEvent("purchase", { transaction_id: orderId, currency: "CLP", value: revenueClp, shipping: shippingClp, items })) window.localStorage.setItem(googleKey, "sent");
      } catch {
        // Consent also depends on localStorage; blocked storage prevents tracking.
      }
    };
    track();
    window.addEventListener(META_CONSENT_EVENT, track);
    return () => window.removeEventListener(META_CONSENT_EVENT, track);
  }, [orderId, totalClp, revenueClp, shippingClp, contents, items]);
  return null;
}
