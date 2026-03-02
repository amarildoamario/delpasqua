"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/track";
import { getOrCreateCartId } from "@/lib/analytics/cartId";

type PurchaseItem = {
  sku: string;
  title: string;
  variantLabel: string;
  unitPriceCents: number;
  qty: number;
};

export default function SuccessTrackPurchase({
  orderId,
  isPaid,
  totalCents,
  currency,
  items,
}: {
  orderId: string;
  isPaid: boolean;
  totalCents: number;
  currency: string; // "eur"
  items: PurchaseItem[];
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (!isPaid) return;
    if (fired.current) return;
    fired.current = true;

    const cartId = getOrCreateCartId();

    track({
      type: "purchase",
      cartId,
      orderId,
      data: {
        totalCents,
        currency,
        items: items.map((it) => ({
          item_id: it.sku,
          item_name: it.title,
          item_variant: it.variantLabel,
          priceCents: it.unitPriceCents,
          quantity: it.qty,
        })),
      },
    });
  }, [orderId, isPaid, totalCents, currency, items]);

  return null;
}