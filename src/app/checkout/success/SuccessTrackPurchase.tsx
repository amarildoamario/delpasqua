"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/track";
import { getOrCreateCartId } from "@/lib/analytics/cartId";

export default function SuccessTrackPurchase({ orderId, isPaid }: { orderId: string; isPaid: boolean }) {
  const fired = useRef(false);

  useEffect(() => {
    if (!isPaid) return;
    if (fired.current) return;
    fired.current = true;

    const cartId = getOrCreateCartId();
    track({ type: "purchase", cartId, orderId });
  }, [orderId, isPaid]);

  return null;
}
