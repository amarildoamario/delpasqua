"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/shopTypes";

type CartState = {
  lines: CartLine[];
  add: (line: CartLine) => void;
  remove: (productId: string, variantId: string) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<CartState | null>(null);
const LS_KEY = "dp_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  // ✅ SSR-safe: prima render sempre vuoto
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // ✅ Carica dal localStorage SOLO dopo mount (client)
  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {}
  }, []);

  // ✅ Salva SOLO dopo che abbiamo idratato (evita sovrascrivere subito con [])
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(lines));
    } catch {}
  }, [hydrated, lines]);

  const add = (line: CartLine) => {
    setLines((prev) => {
      const idx = prev.findIndex(
        (l) => l.productId === line.productId && l.variantId === line.variantId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + line.qty };
        return copy;
      }
      return [...prev, line];
    });
  };

  const remove = (productId: string, variantId: string) => {
    setLines((prev) =>
      prev.filter((l) => !(l.productId === productId && l.variantId === variantId))
    );
  };

  const setQty = (productId: string, variantId: string, qty: number) => {
    const q = Math.max(1, Math.min(99, qty));
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId && l.variantId === variantId ? { ...l, qty: q } : l
      )
    );
  };

  const clear = () => setLines([]);

  // ✅ count coerente con l'hydration: finché non hydrated, count = 0
  const count = useMemo(
    () => (hydrated ? lines.reduce((sum, l) => sum + l.qty, 0) : 0),
    [hydrated, lines]
  );

  // ✅ stessa cosa per lines: finché non hydrated, esponi []
  const value = useMemo(
    () => ({
      lines: hydrated ? lines : [],
      add,
      remove,
      setQty,
      clear,
      count,
    }),
    [hydrated, lines, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
