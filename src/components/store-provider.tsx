"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type CartItem, enrichCart, getVariant } from "@/lib/commerce";

type StoreContextValue = {
  cart: CartItem[];
  cartCount: number;
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "bobbys-cart-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(CART_KEY);
      if (stored) {
        setCart(JSON.parse(stored) as CartItem[]);
      }
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, loaded]);

  const addItem = useCallback((item: CartItem) => {
    const match = getVariant(item.productSlug, item.variantId);
    if (!match || match.variant.stock <= 0) {
      return;
    }

    setCart((current) => {
      const existing = current.find((line) => line.variantId === item.variantId);
      if (!existing) {
        return [...current, { ...item, quantity: Math.min(item.quantity, match.variant.stock) }];
      }

      return current.map((line) =>
        line.variantId === item.variantId
          ? { ...line, quantity: Math.min(line.quantity + item.quantity, match.variant.stock) }
          : line,
      );
    });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setCart((current) =>
      current
        .map((line) => {
          if (line.variantId !== variantId) {
            return line;
          }

          const match = getVariant(line.productSlug, line.variantId);
          const max = match?.variant.stock ?? 1;
          return { ...line, quantity: Math.max(1, Math.min(quantity, max)) };
        })
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setCart((current) => current.filter((line) => line.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo<StoreContextValue>(() => {
    const enriched = enrichCart(cart);
    return {
      cart,
      cartCount: enriched.reduce((total, item) => total + item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [addItem, cart, clearCart, removeItem, updateQuantity]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);

  if (!value) {
    throw new Error("useStore must be used inside StoreProvider");
  }

  return value;
}
