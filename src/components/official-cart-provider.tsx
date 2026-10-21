"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { addToOfficialCart, getOfficialCartLines, normalizeOfficialCart, OFFICIAL_CART_KEY, setOfficialCartQuantity, type OfficialCartItem } from "@/lib/official-cart";

type OfficialCartContextValue = {
  cart: OfficialCartItem[];
  cartCount: number;
  ready: boolean;
  addItem: (productSlug: string, variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const OfficialCartContext = createContext<OfficialCartContextValue | null>(null);

export function OfficialCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<OfficialCartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        setCart(normalizeOfficialCart(JSON.parse(window.localStorage.getItem(OFFICIAL_CART_KEY) ?? "[]")));
      } catch {
        setCart([]);
      }
      setReady(true);
    };
    const timer = window.setTimeout(load, 0);
    const sync = (event: StorageEvent) => {
      if (event.key !== OFFICIAL_CART_KEY) return;
      try {
        setCart(normalizeOfficialCart(JSON.parse(event.newValue ?? "[]")));
      } catch {
        setCart([]);
      }
    };
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(OFFICIAL_CART_KEY, JSON.stringify(cart));
    } catch {
      // The cart still works for this tab when browser storage is unavailable.
    }
  }, [cart, ready]);

  const addItem = useCallback((productSlug: string, variantId: string, quantity = 1) => {
    setCart((current) => addToOfficialCart(current, productSlug, variantId, quantity));
  }, []);
  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setCart((current) => setOfficialCartQuantity(current, variantId, quantity));
  }, []);
  const removeItem = useCallback((variantId: string) => {
    setCart((current) => current.filter((item) => item.variantId !== variantId));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(() => ({
    cart,
    cartCount: getOfficialCartLines(cart).reduce((total, line) => total + line.quantity, 0),
    ready,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  }), [addItem, cart, clearCart, ready, removeItem, setQuantity]);

  return <OfficialCartContext.Provider value={value}>{children}</OfficialCartContext.Provider>;
}

export function useOfficialCart() {
  const value = useContext(OfficialCartContext);
  if (!value) throw new Error("useOfficialCart must be used inside OfficialCartProvider");
  return value;
}
