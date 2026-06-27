// src/app/providers.tsx
"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import type { Product } from "@/lib/shopTypes";

export function Providers({
  children,
  initialCatalog = [],
}: {
  children: React.ReactNode;
  initialCatalog?: Product[] | unknown[];
}) {
  return <CartProvider initialCatalog={initialCatalog}>{children}</CartProvider>;
}
