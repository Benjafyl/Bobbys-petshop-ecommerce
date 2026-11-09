"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loadMetaPixel, META_CONSENT_EVENT, META_CONSENT_KEY, revokeMetaPixel, trackMetaEvent } from "@/lib/meta-pixel";

export function MetaPixelConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<"accepted" | "rejected" | null>(null);
  const [open, setOpen] = useState(false);
  const lastPage = useRef("");

  useEffect(() => {
    const initial = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(META_CONSENT_KEY);
        if (saved === "accepted" || saved === "rejected") setChoice(saved);
        else setOpen(true);
      } catch { setOpen(true); }
    }, 0);
    const reopen = () => setOpen(true);
    window.addEventListener("bobbys-privacy-preferences", reopen);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("bobbys-privacy-preferences", reopen);
    };
  }, []);

  useEffect(() => {
    if (choice !== "accepted") return;
    loadMetaPixel();
    if (lastPage.current !== pathname) {
      lastPage.current = pathname;
      trackMetaEvent("PageView");
    }
  }, [choice, pathname]);

  function choose(next: "accepted" | "rejected") {
    try { window.localStorage.setItem(META_CONSENT_KEY, next); }
    catch { setChoice("rejected"); setOpen(false); return; }
    if (next === "accepted") {
      lastPage.current = "";
      loadMetaPixel();
      window.dispatchEvent(new Event(META_CONSENT_EVENT));
    } else revokeMetaPixel();
    setChoice(next);
    setOpen(false);
  }

  if (!open) return null;
  return <aside role="dialog" aria-label="Preferencias de privacidad" className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-lg rounded-xl border border-[#D8CEC1] bg-white p-4 shadow-xl sm:left-auto sm:right-5 sm:bottom-5 sm:p-5">
    <p className="text-sm font-black text-[#243C3A]">Privacidad</p>
    <p className="mt-2 text-sm leading-5 text-[#52615D]">Podemos medir visitas y compras con Meta para mejorar nuestros anuncios. Tú decides. <Link href="/privacidad" className="font-bold text-[#B6633A] underline">Ver política</Link></p>
    <div className="mt-4 flex gap-2"><button type="button" onClick={() => choose("rejected")} className="min-h-11 flex-1 rounded-lg border border-[#D8CEC1] px-3 text-sm font-bold">Rechazar</button><button type="button" onClick={() => choose("accepted")} className="min-h-11 flex-1 rounded-lg bg-[#243C3A] px-3 text-sm font-bold text-white">Aceptar</button></div>
  </aside>;
}
