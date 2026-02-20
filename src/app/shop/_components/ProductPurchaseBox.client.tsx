// src/app/shop/_components/ProductPurchaseBox.client.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

type ProductVariant = {
  id: string;
  label: string;
  priceCents: number;
  sku?: string;
};

function formatEUR(cents: number) {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const intPart = Math.floor(abs / 100);
  const decPart = abs % 100;

  const grouped = String(intPart).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimals = String(decPart).padStart(2, "0");
  return `${sign}${grouped},${decimals} €`;
}

function makeSku(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

function Availability({
  loading,
  available,
}: {
  loading: boolean;
  available: number | null;
}) {
  const inStock = typeof available === "number" ? available > 0 : true;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={[
          "inline-block h-2.5 w-2.5 rounded-full",
          loading
            ? "bg-neutral-400 dark:bg-neutral-600"
            : inStock
              ? "bg-emerald-500"
              : "bg-red-500",
        ].join(" ")}
        aria-hidden
      />
      <span className="text-neutral-700 dark:text-neutral-200">
        {loading
          ? "Controllo disponibilità…"
          : available == null
            ? "—"
            : available > 0
              ? `${available} disponibili`
              : "Esaurito"}
      </span>
    </div>
  );
}

function QuantitySelector({
  value,
  setValue,
  min = 1,
  max = 99,
}: {
  value: number;
  setValue: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const dec = () => setValue(Math.max(min, value - 1));
  const inc = () => setValue(Math.min(max, value + 1));

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Quantità</div>
        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Seleziona quante unità vuoi acquistare
        </div>
      </div>

      <div className="flex items-center overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950 shadow-sm">
        <button
          type="button"
          onClick={dec}
          className="h-11 w-11 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50/80 dark:hover:bg-neutral-900/70"
          aria-label="Diminuisci quantità"
        >
          –
        </button>

        <div className="h-11 min-w-[56px] px-3 flex items-center justify-center text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {value}
        </div>

        <button
          type="button"
          onClick={inc}
          className="h-11 w-11 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50/80 dark:hover:bg-neutral-900/70"
          aria-label="Aumenta quantità"
        >
          +
        </button>
      </div>
    </div>
  );
}

function SelectedCheck() {
  return (
    <span
      className="pointer-events-none absolute bottom-3 right-3 z-20 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md"
      aria-hidden="true"
      title="Selezionata"
    >
      ✓
    </span>
  );
}

export default function ProductPurchaseBox({
  productId,
  variants,
  selectedVariantId,
  onVariantChange,
}: {
  productId: string;
  variants: ProductVariant[];
  selectedVariantId?: string;
  onVariantChange?: (variantId: string) => void;
}) {
  // ✅ controlled SOLO se hai sia value che handler
  const isControlled = selectedVariantId != null && typeof onVariantChange === "function";

  const [localVariantId, setLocalVariantId] = useState<string | undefined>(
    selectedVariantId ?? variants[0]?.id
  );

  // se NON controlled, usiamo local state
  const effectiveVariantId = isControlled
    ? selectedVariantId
    : (localVariantId ?? variants[0]?.id);

  const selected = useMemo(() => {
    return variants.find((v) => String(v.id) === String(effectiveVariantId)) ?? variants[0];
  }, [variants, effectiveVariantId]);

  const priceCents = selected?.priceCents ?? variants[0]?.priceCents ?? 0;

  const { add } = useCart();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const [loadingAvail, setLoadingAvail] = useState(false);
  const [availMap, setAvailMap] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let alive = true;

    if (!productId || variants.length === 0) {
      setAvailMap({});
      return;
    }

    const skus = variants.map((v) => makeSku(productId, v.id));
    setLoadingAvail(true);

    fetch(`/api/inventory/availability?skus=${encodeURIComponent(skus.join(","))}`)
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        return j?.availability ?? {};
      })
      .then((map) => {
        if (!alive) return;
        setAvailMap(map);
      })
      .catch(() => {
        if (!alive) return;
        setAvailMap({});
      })
      .finally(() => {
        if (!alive) return;
        setLoadingAvail(false);
      });

    return () => {
      alive = false;
    };
  }, [productId, variants.map((v) => v.id).join("|")]);

  const selectedSku = selected ? makeSku(productId, selected.id) : "";
  const selectedAvailable = availMap ? (availMap[selectedSku] ?? 0) : null;

  const maxQty = selectedAvailable == null ? 99 : Math.max(0, selectedAvailable);

  useEffect(() => {
    setQty((q) => {
      if (maxQty <= 0) return 1;
      return Math.min(Math.max(1, q), maxQty);
    });
    setAdded(false);
  }, [maxQty, selected?.id]);

  const setVariant = (id: string) => {
    if (!isControlled) setLocalVariantId(id);
    onVariantChange?.(id);
  };

  const isOut = selectedAvailable != null && selectedAvailable <= 0;
  const isDisabled = loadingAvail || !selected || isOut;

  const handleAddToCart = () => {
    if (!selected) return;
    if (isDisabled) return;

    const safeQty = Math.min(Math.max(1, qty), maxQty || 99);

    add({
      productId,
      variantId: selected.id,
      qty: safeQty,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className={[
        "rounded-3xl border p-6",
        "border-neutral-200 dark:border-neutral-800",
        "bg-neutral-50/70 dark:bg-neutral-950/60",
        "backdrop-blur",
        "shadow-[0_12px_35px_rgba(0,0,0,0.06)] dark:shadow-none",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-wide text-neutral-500 dark:text-neutral-400">
            Prezzo
          </div>
          <div className="mt-1 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            {formatEUR(priceCents)}
          </div>
        </div>

        <div className="mt-1">
          <Availability loading={loadingAvail} available={selectedAvailable} />
        </div>
      </div>

      {variants.length > 1 ? (
        <div className="mt-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Seleziona formato
              </div>
              <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Clicca una variante: aggiorna prezzo e disponibilità
              </div>
            </div>

            <div className="hidden sm:block text-xs text-neutral-500 dark:text-neutral-400">
              Scelto:{" "}
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {selected?.label}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {variants.map((v) => {
              const active = String(v.id) === String(selected?.id);

              const sku = makeSku(productId, v.id);
              const a = availMap ? (availMap[sku] ?? 0) : null;
              const out = a != null && a <= 0;

              const base =
                "relative rounded-2xl border p-4 transition-all cursor-pointer " +
                "focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:focus:ring-emerald-300/30";

              const inactive =
                "border-neutral-200 bg-white/70 text-neutral-900 hover:bg-white " +
                "dark:border-neutral-800 dark:bg-neutral-950/50 dark:text-neutral-100 dark:hover:bg-neutral-950";

              const activeStyle =
                "border-emerald-300/70 bg-emerald-50/70 text-neutral-900 " +
                "shadow-[0_10px_24px_rgba(16,185,129,0.12)] ring-1 ring-emerald-200/70 " +
                "dark:border-emerald-300/40 dark:bg-emerald-400/10 dark:text-neutral-100 " +
                "dark:ring-emerald-300/25 dark:shadow-none";

              const outStyle = "opacity-50 hover:bg-transparent dark:hover:bg-transparent";

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    if (out) return;
                    setVariant(String(v.id));
                  }}
                  className={[base, active ? activeStyle : inactive, out ? outStyle : ""].join(" ")}
                  aria-current={active ? "true" : "false"}
                  aria-disabled={out ? "true" : "false"}
                  disabled={out}
                  title={out ? "Non disponibile" : undefined}
                >
                  {active ? <SelectedCheck /> : null}

                  <div className="flex items-center justify-between gap-3 pr-8">
                    <div>
                      <div className="text-sm font-semibold">{v.label}</div>
                      <div
                        className={[
                          "mt-1 text-xs",
                          active
                            ? "text-emerald-700/90 dark:text-emerald-200/90"
                            : "text-neutral-500 dark:text-neutral-400",
                        ].join(" ")}
                      >
                        {loadingAvail
                          ? "Controllo…"
                          : out
                            ? "Non disponibile"
                            : a == null
                              ? "—"
                              : `Disponibili: ${a}`}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold tabular-nums">{formatEUR(v.priceCents)}</div>
                      <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                        per unità
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <QuantitySelector value={qty} setValue={setQty} min={1} max={Math.max(1, maxQty || 1)} />

        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {loadingAvail ? (
            <>
              Max acquistabile: <span className="font-semibold">…</span>
            </>
          ) : (
            <>
              Max acquistabile: <span className="font-semibold">{Math.max(0, maxQty)}</span>
            </>
          )}
        </div>
      </div>

      <button
        className={[
          "mt-6 w-full rounded-2xl px-5 py-4 text-sm font-semibold transition-all",
          isDisabled
            ? "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99] " +
              "shadow-[0_12px_28px_rgba(16,185,129,0.18)] " +
              "dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-neutral-950 dark:shadow-none",
        ].join(" ")}
        type="button"
        disabled={isDisabled}
        onClick={handleAddToCart}
      >
        {loadingAvail ? "Controllo disponibilità…" : isOut ? "Esaurito" : "Aggiungi al carrello"}
      </button>

      {added ? (
        <div className="mt-3 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-200">
          ✅ Aggiunto al carrello ({qty})
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-neutral-500 dark:text-neutral-400 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/40 px-3 py-2">
          Spedizione rapida • Imballo sicuro
        </div>
        <div className="rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/40 px-3 py-2">
          Assistenza WhatsApp • Resi semplici
        </div>
      </div>
    </div>
  );
}
