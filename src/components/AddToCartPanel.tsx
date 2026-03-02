"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/shopTypes";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/analytics/track";
import { getOrCreateCartId } from "@/lib/analytics/cartId";

type Props = {
  product: Product;
  variantId: string;
  onVariantIdChange: (id: string) => void;
  available: number;
};

function clampInt(n: number, min: number, max: number) {
  const x = Math.trunc(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

function QtyHint({ available }: { available: number }) {
  const max = Math.min(Math.max(0, Math.trunc(available)), 99);

  if (max <= 0) {
    return (
      <div className="mt-2 text-[10px] tracking-[0.20em] text-red-600">
        ESAURITO
      </div>
    );
  }

  return (
    <div className="mt-2 text-[10px] tracking-[0.20em] text-zinc-500">
      MAX {max}
    </div>
  );
}

function ToggleMessage({
  open,
  message,
  durationMs = 2500,
  onClose,
}: {
  open: boolean;
  message: string;
  durationMs?: number;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(id);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-[9999] px-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-emerald-300 bg-emerald-100 px-5 py-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-600 text-white">
              <span className="text-lg leading-none">✓</span>
            </div>

            <div className="min-w-0">
              <div className="text-sm font-semibold text-emerald-950">
                Aggiunto al carrello
              </div>
              <div className="mt-1 text-sm text-emerald-900/90">{message}</div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="ml-auto rounded-lg px-2 py-1 text-emerald-900/70 hover:bg-emerald-200 hover:text-emerald-950"
              aria-label="Chiudi"
              title="Chiudi"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddToCartPanel({
  product,
  variantId: controlledId,
  onVariantIdChange,
  available,
}: Props) {
  const { add } = useCart();

  const defaultVariantId = product.variants[0]?.id ?? "default";
  const [uncontrolledId, setUncontrolledId] = useState(defaultVariantId);
  const variantId = controlledId ?? uncontrolledId;
  const prevVariantRef = useRef<string>(variantId);

  const setVariantId = (id: string) => {
    onVariantIdChange?.(id);
    if (controlledId === undefined) setUncontrolledId(id);
  };

  const variant = useMemo(
    () => product.variants.find((v) => v.id === variantId) ?? product.variants[0],
    [product.variants, variantId]
  );

  const maxQty = useMemo(() => {
    const n = Number.isFinite(available) ? Math.max(0, Math.trunc(available)) : 0;
    return Math.min(n, 99);
  }, [available]);

  const [qty, setQty] = useState<number>(() => (maxQty > 0 ? 1 : 0));

  useEffect(() => {
    queueMicrotask(() => {
      setQty((q) => {
        if (maxQty <= 0) return 0;
        if (q < 1) return 1;
        if (q > maxQty) return maxQty;
        return q;
      });
    });
  }, [maxQty, variantId]);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastOpen(false);
    requestAnimationFrame(() => {
      setToastMsg(msg);
      setToastOpen(true);
    });
  };

  const onAdd = () => {
    if (maxQty <= 0) {
      showToast("Prodotto esaurito.");
      return;
    }

    const safeQty = clampInt(qty, 1, maxQty);
    const cartId = getOrCreateCartId();

    track({
      type: "add_to_cart",
      cartId,
      productKey: product.id,
      variantKey: variantId,
      data: {
        qty: safeQty,
        unitPriceCents: typeof variant?.priceCents === "number" ? variant.priceCents : null,
        variantLabel: variant?.label ?? null,
        slug: product.slug ?? null,
      },
    });

    add({ productId: product.id, variantId, qty: safeQty });

    const title = product.title ?? product.slug ?? "Prodotto";
    const vLabel = variant?.label ? ` — ${variant.label}` : "";
    showToast(`${title}${vLabel} (x${safeQty})`);
  };

  return (
    <>
      <ToggleMessage open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />

      <div className="rounded-[14px] border border-black/10 p-4">
        <div className="flex flex-col gap-3">
          <div className="text-sm tracking-[0.12em] text-zinc-700">FORMATO BOTTIGLIA</div>

          <select
            value={variantId}
            onChange={(e) => {
              const next = e.target.value;
              const prev = prevVariantRef.current;

              if (next !== prev) {
                const prevV = product.variants.find((x) => x.id === prev);
                const nextV = product.variants.find((x) => x.id === next);

                track({
                  type: "select_variant",
                  productKey: product.id,
                  variantKey: next,
                  data: {
                    fromVariant: prev,
                    toVariant: next,
                    fromPriceCents: prevV?.priceCents ?? null,
                    toPriceCents: nextV?.priceCents ?? null,
                    priceDeltaCents:
                      typeof prevV?.priceCents === "number" && typeof nextV?.priceCents === "number"
                        ? nextV.priceCents - prevV.priceCents
                        : null,
                    slug: product.slug ?? null,
                  },
                });

                prevVariantRef.current = next;
              }

              setVariantId(next);
            }}
            className="h-11 w-full rounded-[10px] border border-black/10 bg-white px-3 text-sm"
            aria-label="Seleziona formato bottiglia"
            data-testid="variant-select"
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-[110px_1fr] items-start gap-3">
            <div className="flex flex-col">
              <div className="text-xs tracking-[0.18em] text-zinc-500">QUANTITÀ</div>

              <input
                type="number"
                min={maxQty > 0 ? 1 : 0}
                max={maxQty}
                value={qty}
                data-testid="qty-input"
                disabled={maxQty <= 0}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  if (maxQty <= 0) {
                    setQty(0);
                    return;
                  }
                  setQty(clampInt(next || 1, 1, maxQty));
                }}
                className="mt-2 h-11 w-full rounded-[10px] border border-black/10 bg-white px-3 text-sm disabled:opacity-50"
              />

              {/* ✅ SOLO NUMERO ORDINI MASSIMI */}
              <QtyHint available={available} />
            </div>

            <button
              type="button"
              onClick={onAdd}
              disabled={maxQty <= 0 || qty <= 0}
              data-testid="add-to-cart"
              className="mt-[22px] inline-flex h-11 w-full items-center justify-center rounded-full bg-zinc-900 px-4 text-sm tracking-[0.10em] text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {maxQty <= 0 ? "Esaurito" : "Aggiungi al carrello"}
            </button>
          </div>

          {variant?.label ? (
            <div className="text-xs text-zinc-500">
              Formato selezionato:{" "}
              <span className="text-zinc-700">{variant.label}</span>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
