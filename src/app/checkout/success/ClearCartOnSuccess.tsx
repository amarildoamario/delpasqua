"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/**
 * Svuota il carrello SOLO quando il pagamento è effettivamente riuscito.
 */
export default function ClearCartOnSuccess({ shouldClear }: { shouldClear: boolean }) {
  const { clear } = useCart();

  useEffect(() => {
    if (!shouldClear) return;
    clear();
  }, [shouldClear, clear]);

  return null;
}