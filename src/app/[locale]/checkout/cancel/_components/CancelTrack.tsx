"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/track";

type Props = {
  orderId: string | null;
  sessionId: string | null;
  itemsCount: number;
  totalCents: number;
  currency: string; // "EUR"
  hasOrder: boolean;
};

export default function CancelTrack({
  orderId,
  sessionId,
  itemsCount,
  totalCents,
  currency,
  hasOrder,
}: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    track({
      type: "checkout_canceled",
      orderId: orderId ?? undefined,
      data: {
        currency,
        totalCents,
        itemsCount,
        sessionId,
        hasOrder,
      },
    });
  }, [orderId, sessionId, itemsCount, totalCents, currency, hasOrder]);

  return null;
}