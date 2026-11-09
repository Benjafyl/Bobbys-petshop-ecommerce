"use client";

import { useEffect } from "react";
import { META_CONSENT_EVENT, trackMetaEvent } from "@/lib/meta-pixel";

export function MetaPurchaseEvent({ orderId, totalClp, contents }: { orderId: string; totalClp: number; contents: { id: string; quantity: number }[] }) {
  useEffect(() => {
    const track = () => {
      const key = `bobbys-meta-purchase-${orderId}`;
      try { if (window.localStorage.getItem(key)) return; } catch { return; }
      if (trackMetaEvent("Purchase", { content_type: "product", content_ids: contents.map((line) => line.id), contents, value: totalClp, currency: "CLP" })) {
        try { window.localStorage.setItem(key, "sent"); } catch { /* A browser may block storage. */ }
      }
    };
    track();
    window.addEventListener(META_CONSENT_EVENT, track);
    return () => window.removeEventListener(META_CONSENT_EVENT, track);
  }, [orderId, totalClp, contents]);
  return null;
}
