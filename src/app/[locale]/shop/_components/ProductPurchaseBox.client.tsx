// src/app/shop/_components/ProductPurchaseBox.client.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import {
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  ChevronDown,
  Check,
  X,
  Info,
  Package,
  RotateCcw,
} from "lucide-react";

type ProductVariant = {
  id: string;
  label: string;
  priceCents: number;
  sku?: string;
};

type PurchaseInfo = {
  caratteristiche?: string;
  imballaggio?: string;
  spedizione?: string;
  resi?: string;
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

function pickText(custom: unknown, fallback: string) {
  const s = typeof custom === "string" ? custom.trim() : "";
  return s.length ? s : fallback;
}

export default function ProductPurchaseBox({
  productId,
  variants,
  selectedVariantId,
  onVariantChange,
  purchaseInfo,
}: {
  productId: string;
  variants: ProductVariant[];
  selectedVariantId?: string;
  onVariantChange?: (variantId: string) => void;
  purchaseInfo?: PurchaseInfo;
}) {
  const isControlled = selectedVariantId != null && typeof onVariantChange === "function";
  const [localVariantId, setLocalVariantId] = useState<string | undefined>(selectedVariantId ?? variants[0]?.id);

  const effectiveVariantId = isControlled ? selectedVariantId : localVariantId ?? variants[0]?.id;

  const selected = useMemo(() => {
    return variants.find((v) => String(v.id) === String(effectiveVariantId)) ?? variants[0];
  }, [variants, effectiveVariantId]);

  const priceCents = selected?.priceCents ?? variants[0]?.priceCents ?? 0;

  const { add } = useCart();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const [loadingAvail, setLoadingAvail] = useState(false);
  const [availMap, setAvailMap] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let alive = true;
    if (!productId || variants.length === 0) {
      queueMicrotask(() => setAvailMap({}));
      return;
    }

    const skus = variants.map((v) => makeSku(productId, v.id));
    queueMicrotask(() => setLoadingAvail(true));

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
  }, [productId, variants]);

  const selectedSku = selected ? makeSku(productId, selected.id) : "";
  const selectedAvailable = availMap ? (availMap[selectedSku] ?? 0) : null;
  const maxQty = selectedAvailable == null ? 99 : Math.max(0, selectedAvailable);

  useEffect(() => {
    queueMicrotask(() => {
      setQty((q) => {
        if (maxQty <= 0) return 1;
        return Math.min(Math.max(1, q), maxQty);
      });
      setAdded(false);
    });
  }, [maxQty, selected?.id]);

  const setVariant = (id: string) => {
    if (!isControlled) setLocalVariantId(id);
    onVariantChange?.(id);
    setShowVariantDropdown(false);
  };

  const isOut = selectedAvailable != null && selectedAvailable <= 0;
  const isDisabled = loadingAvail || !selected || isOut;

  const handleAddToCart = async () => {
    if (!selected || isDisabled) return;

    setIsAdding(true);
    const safeQty = Math.min(Math.max(1, qty), maxQty || 99);

    await new Promise((r) => setTimeout(r, 400));

    add({
      productId,
      variantId: selected.id,
      qty: safeQty,
    });

    setIsAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const totalPrice = priceCents * qty;

  // Testi default (quelli che avevi hardcoded)
  const defaultTexts = {
    caratteristiche:
      "Olio extravergine di oliva ottenuto direttamente dalle olive e unicamente mediante processi meccanici. Acidità <0,3%. Estratto a freddo per preservare tutte le proprietà organolettiche.",
    imballaggio: "Bottiglia in vetro scuro per proteggere dall'ossidazione. Confezione riciclabile e protettiva.",
    spedizione: "Consegna in 2-3 giorni lavorativi. Tracking in tempo reale. Spedizione gratuita per ordini sopra i 50€.",
    resi: "Reso gratuito entro 14 giorni. Rimborso completo senza domande.",
  };

  const detailsTexts = {
    caratteristiche: pickText(purchaseInfo?.caratteristiche, defaultTexts.caratteristiche),
    imballaggio: pickText(purchaseInfo?.imballaggio, defaultTexts.imballaggio),
    spedizione: pickText(purchaseInfo?.spedizione, defaultTexts.spedizione),
    resi: pickText(purchaseInfo?.resi, defaultTexts.resi),
  };

  // Contenuto dettagli (condiviso tra desktop e mobile) — TITOLI + ICONE IDENTICI
  const detailsContent = (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">Caratteristiche</h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 whitespace-pre-wrap">
            {detailsTexts.caratteristiche}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Package className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">Imballaggio</h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 whitespace-pre-wrap">
            {detailsTexts.imballaggio}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Truck className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">Spedizione</h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 whitespace-pre-wrap">
            {detailsTexts.spedizione}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <RotateCcw className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-neutral-900">Resi</h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 whitespace-pre-wrap">
            {detailsTexts.resi}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-sm">
        {/* Header: Prezzo e disponibilità */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-medium tracking-[0.2em] text-neutral-400 uppercase">{productId}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-serif text-3xl text-neutral-900">{formatEUR(priceCents)}</span>
              {variants.length > 1 && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatEUR(Math.max(...variants.map((v) => v.priceCents)))}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-neutral-50 px-3 py-1.5">
            <span
              className={`h-2 w-2 rounded-full ${loadingAvail ? "bg-neutral-300 animate-pulse" : isOut ? "bg-red-500" : "bg-emerald-500"
                }`}
            />
            <span className="text-[11px] font-medium text-neutral-600">
              {loadingAvail ? "Controllo…" : isOut ? "Esaurito" : "Disponibile"}
            </span>
          </div>
        </div>

        {/* Selettore varianti */}
        {variants.length > 1 && (
          <div className="mt-6 relative">
            <label className="mb-2 block text-[11px] font-medium tracking-[0.15em] text-neutral-500 uppercase">
              Formato
            </label>
            <button
              onClick={() => setShowVariantDropdown(!showVariantDropdown)}
              className="group w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-left transition-all hover:border-neutral-300 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-900">{selected?.label}</span>
                  <span className="text-xs text-neutral-400 mt-0.5">
                    {loadingAvail ? "Controllo stock…" : selectedAvailable != null ? `${selectedAvailable} disponibili` : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-neutral-900">{formatEUR(priceCents)}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-neutral-400 transition-transform duration-300 ${showVariantDropdown ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </div>
            </button>

            {showVariantDropdown && (
              <div className="absolute z-20 mt-1 w-full rounded-xl border border-neutral-200 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                {variants.map((variant) => {
                  const sku = makeSku(productId, variant.id);
                  const avail = availMap ? (availMap[sku] ?? 0) : null;
                  const out = avail != null && avail <= 0;
                  const isSelected = String(variant.id) === String(selected?.id);

                  return (
                    <button
                      key={variant.id}
                      onClick={() => !out && setVariant(String(variant.id))}
                      disabled={out}
                      className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${isSelected ? "bg-neutral-50" : "hover:bg-neutral-50"
                        } ${out ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex flex-col">
                        <span className={`text-sm ${isSelected ? "font-medium text-neutral-900" : "text-neutral-600"}`}>
                          {variant.label}
                        </span>
                        <span className="text-[11px] text-neutral-400">{out ? "Non disponibile" : avail != null ? `${avail} in stock` : "—"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-neutral-900">{formatEUR(variant.priceCents)}</span>
                        {isSelected && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Quantità */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[11px] font-medium tracking-[0.15em] text-neutral-500 uppercase">Quantità</label>
            {!loadingAvail && maxQty > 0 && <span className="text-[11px] text-neutral-400">Max {maxQty}</span>}
          </div>
          <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-white">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
              className="flex h-11 w-11 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-900 disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-semibold tabular-nums text-neutral-900">{qty}</span>
            <button
              onClick={() => setQty(Math.min(maxQty || 99, qty + 1))}
              disabled={qty >= maxQty}
              className="flex h-11 w-11 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-900 disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="my-6 h-px bg-neutral-100" />

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          disabled={isDisabled || isAdding}
          className={`group relative w-full overflow-hidden rounded-xl py-4 text-sm font-semibold tracking-wide transition-all ${isDisabled || isAdding
            ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
            : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-[0_8px_24px_rgba(16,185,129,0.25)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.35)]"
            }`}
        >
          <span
            className={`flex items-center justify-center gap-2 transition-all duration-300 ${isAdding ? "-translate-y-10 opacity-0" : "translate-y-0 opacity-100"
              }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {isOut ? "Esaurito" : `Aggiungi — ${formatEUR(totalPrice)}`}
          </span>

          {isAdding && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          )}
        </button>

        {added && (
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-sm text-emerald-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Check className="h-4 w-4" />
            Aggiunto al carrello ({qty})
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-start gap-2 rounded-lg bg-neutral-50 p-3">
            <Truck className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium text-neutral-900">Spedizione gratis</p>
              <p className="text-[10px] text-neutral-500">Sopra i 50€</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-neutral-50 p-3">
            <ShieldCheck className="h-4 w-4 shrink-0 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-[11px] font-medium text-neutral-900">Qualità garantita</p>
              <p className="text-[10px] text-neutral-500">100% italiano</p>
            </div>
          </div>
        </div>

        {/* Dettagli - Desktop */}
        <div className="mt-4 hidden md:block space-y-1">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-xs text-neutral-500 transition-colors hover:text-neutral-900">
              <span>Dettagli prodotto</span>
              <Plus className="h-3 w-3 transition-transform group-open:rotate-45" />
            </summary>
            <div className="pb-2">
              {detailsContent}
            </div>
          </details>
        </div>

        {/* Bottone dettagli - Mobile */}
        <button
          onClick={() => setShowMobileDetails(true)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 py-3 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 md:hidden"
        >
          <Info className="h-4 w-4" />
          Dettagli prodotto
        </button>
      </div>

      {/* Bottom Sheet Mobile per dettagli */}
      {showMobileDetails && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={() => setShowMobileDetails(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div className="rounded-t-3xl bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1.5 w-12 rounded-full bg-neutral-200" />
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
                <h3 className="text-base font-semibold text-neutral-900">Dettagli prodotto</h3>
                <button
                  onClick={() => setShowMobileDetails(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto px-5 py-5">
                {detailsContent}
              </div>

              <div className="h-safe-area-inset-bottom bg-white" />
            </div>
          </div>
        </>
      )}
    </>
  );
}