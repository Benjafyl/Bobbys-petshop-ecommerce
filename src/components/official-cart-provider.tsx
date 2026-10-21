"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { addToOfficialCart, getOfficialCartLines, normalizeOfficialCart, OFFICIAL_CART_KEY, setOfficialCartQuantity, type OfficialCartItem, type OfficialInventoryMap } from "@/lib/official-cart";
import { publicInventoryBySlug } from "@/lib/public-inventory";

type OfficialCartContextValue = {
  cart: OfficialCartItem[];
  cartCount: number;
  ready: boolean;
  inventory: OfficialInventoryMap;
  inventoryError: boolean;
  addItem: (productSlug: string, variantId: string, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const OfficialCartContext = createContext<OfficialCartContextValue | null>(null);

export function OfficialCartProvider({ children, liveInventoryEnabled = false }: { children: ReactNode; liveInventoryEnabled?: boolean }) {
  const [cart, setCart] = useState<OfficialCartItem[]>([]);
  const [inventory, setInventory] = useState<OfficialInventoryMap>(liveInventoryEnabled ? {} : publicInventoryBySlug);
  const [inventoryError, setInventoryError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let currentInventory: OfficialInventoryMap = liveInventoryEnabled ? {} : publicInventoryBySlug;
    const load = async () => {
      if (liveInventoryEnabled) {
        try {
          const response = await fetch("/api/storefront/inventory", { cache: "no-store" });
          if (!response.ok) throw new Error("Inventory unavailable");
          const data = await response.json() as { inventory: OfficialInventoryMap };
          currentInventory = data.inventory;
          setInventory(currentInventory);
        } catch {
          currentInventory = {};
          setInventory({});
          setInventoryError(true);
        }
      }
      try {
        setCart(normalizeOfficialCart(JSON.parse(window.localStorage.getItem(OFFICIAL_CART_KEY) ?? "[]"), currentInventory));
      } catch {
        setCart([]);
      }
      setReady(true);
    };
    const timer = window.setTimeout(load, 0);
    const sync = (event: StorageEvent) => {
      if (event.key !== OFFICIAL_CART_KEY) return;
      try {
        setCart(normalizeOfficialCart(JSON.parse(event.newValue ?? "[]"), currentInventory));
      } catch {
        setCart([]);
      }
    };
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", sync);
    };
  }, [liveInventoryEnabled]);

  useEffect(() => {
    if (!ready || inventoryError) return;
    try {
      window.localStorage.setItem(OFFICIAL_CART_KEY, JSON.stringify(cart));
    } catch {
      // The cart still works for this tab when browser storage is unavailable.
    }
  }, [cart, ready, inventoryError]);

  const addItem = useCallback((productSlug: string, variantId: string, quantity = 1) => {
    setCart((current) => addToOfficialCart(current, productSlug, variantId, quantity, inventory));
  }, [inventory]);
  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setCart((current) => setOfficialCartQuantity(current, variantId, quantity, inventory));
  }, [inventory]);
  const removeItem = useCallback((variantId: string) => {
    setCart((current) => current.filter((item) => item.variantId !== variantId));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(() => ({
    cart,
    cartCount: getOfficialCartLines(cart, inventory).reduce((total, line) => total + line.quantity, 0),
    ready,
    inventory,
    inventoryError,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  }), [addItem, cart, clearCart, ready, inventory, inventoryError, removeItem, setQuantity]);

  return <OfficialCartContext.Provider value={value}>{children}</OfficialCartContext.Provider>;
}

export function useOfficialCart() {
  const value = useContext(OfficialCartContext);
  if (!value) throw new Error("useOfficialCart must be used inside OfficialCartProvider");
  return value;
}
