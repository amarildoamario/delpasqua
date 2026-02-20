"use client";

import { useEffect, useMemo, useState } from "react";

export function makeSku(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

export function useVariantAvailability(productId: string, variantIds: string[]) {
  const [availability, setAvailability] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);

  const skus = useMemo(
    () => variantIds.map((vid) => makeSku(productId, vid)),
    [productId, variantIds]
  );

  useEffect(() => {
    let alive = true;
    if (!productId || skus.length === 0) return;

    setLoading(true);
    fetch(`/api/inventory/availability?skus=${encodeURIComponent(skus.join(","))}`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setAvailability(j?.availability ?? {});
      })
      .catch(() => {
        if (!alive) return;
        setAvailability({});
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [productId, skus.join(",")]); // ok: lista piccola

  return { availability, loading };
}
