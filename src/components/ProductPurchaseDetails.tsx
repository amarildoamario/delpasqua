"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/lib/shopTypes";
import { formatEUR } from "@/lib/money";
import AddToCartPanel from "@/components/AddToCartPanel";
import { track } from "@/lib/analytics/track";

function buildQueryString(sp: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(sp.toString());
  next.set(key, value);
  return next.toString();
}

type Props = {
  product: Product;
  availabilityByVariantId: Record<string, number>;
};

function StockLine({ available }: { available: number }) {
  const ok = available > 0;
  return (
    <div className="mt-3 flex items-center gap-2 text-xs tracking-[0.18em]">
      <span
        className={`h-2.5 w-2.5 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`}
        aria-hidden="true"
      />
      <span className={ok ? "text-emerald-600" : "text-red-600"}>
        {ok ? "DISPONIBILE" : "ESAURITO"}
      </span>
    </div>
  );
}

export default function ProductPurchaseDetails({ product, availabilityByVariantId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const defaultVariantId = product.variants[0]?.id ?? "default";

  const initialVariantId = useMemo(() => {
    const v = sp?.get("v");
    if (!v) return defaultVariantId;
    const ok = product.variants.some((x) => x.id === v);
    return ok ? v : defaultVariantId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.variants, defaultVariantId]);

  const [variantId, setVariantId] = useState(initialVariantId);

  useEffect(() => {
    const v = sp?.get("v");
    if (!v) return;
    if (v === variantId) return;
    const ok = product.variants.some((x) => x.id === v);
    if (ok) setVariantId(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp, product.variants]);

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? product.variants[0],
    [product.variants, variantId]
  );

  const available = useMemo(() => {
    const n = availabilityByVariantId?.[variantId];
    return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;
  }, [availabilityByVariantId, variantId]);

  const lastSentRef = useRef<string>("");

  useEffect(() => {
    if (!product?.id) return;

    const key = `pv:${product.id}:${variantId}:${pathname}`;
    const now = Date.now();

    if (lastSentRef.current === key) return;
    lastSentRef.current = key;

    try {
      const ssKey = "analytics_last_product_view";
      const raw = sessionStorage.getItem(ssKey);
      if (raw) {
        const prev = JSON.parse(raw) as { key: string; t: number };
        if (prev?.key === key && now - prev.t < 1500) return;
      }
      sessionStorage.setItem(ssKey, JSON.stringify({ key, t: now }));
    } catch {}

    track({
      type: "product_view",
      productKey: product.id,
      variantKey: variantId,
      data: { slug: product.slug ?? null, variantLabel: variant?.label ?? null },
    });
  }, [product.id, product.slug, variantId, pathname, variant?.label]);

  useEffect(() => {
    if (!sp) return;
    const current = sp.get("v") ?? "";
    if (current === variantId) return;

    const qs = buildQueryString(sp, "v", variantId);
    router.replace(`${pathname}?${qs}`, { scroll: false });
  }, [variantId, pathname, router, sp]);

  return (
    <div className="mt-8">
      <div className="flex items-baseline gap-4">
        <div className="font-serif text-3xl tracking-[0.06em] text-zinc-900">
          {variant ? formatEUR(variant.priceCents) : ""}
        </div>
        <div className="text-xs tracking-[0.18em] text-zinc-500">+ IVA</div>
      </div>

      {/* ✅ SOLO QUI: pallino + scritta verde/rossa */}
      <StockLine available={available} />

      <div className="mt-7">
        <AddToCartPanel
          product={product}
          variantId={variantId}
          onVariantIdChange={setVariantId}
          available={available}
        />
      </div>
    </div>
  );
}
