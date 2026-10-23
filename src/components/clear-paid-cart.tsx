"use client";

import { useEffect } from "react";
import { useOfficialCart } from "@/components/official-cart-provider";

export function ClearPaidCart() {
  const { clearCart } = useOfficialCart();
  useEffect(() => { clearCart(); }, [clearCart]);
  return null;
}
