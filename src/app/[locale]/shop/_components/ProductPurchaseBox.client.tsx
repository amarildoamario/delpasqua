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

        {/* Metodi di Pagamento */}
        <div className="mt-5 mb-2">
          <p className="text-center text-[10px] uppercase tracking-widest text-neutral-400 mb-2.5">Pagamenti sicuri</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* Apple Pay */}
            <div className="flex px-3 h-8 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-colors" title="Apple Pay">
              <svg role="img" viewBox="0 0 24 24" height="18" fill="black" xmlns="http://www.w3.org/2000/svg">
                <title>Apple Pay</title>
                <path d="M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072l1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z" />
              </svg>
            </div>
            {/* Mastercard */}
            <div className="flex px-3 h-8 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-colors" title="Mastercard">
              <svg role="img" viewBox="0 0 24 24" height="20" xmlns="http://www.w3.org/2000/svg">
                <title>MasterCard</title>
                <path d="M11.343 18.031c.058.049.12.098.181.146-1.177.783-2.59 1.238-4.107 1.238C3.32 19.416 0 16.096 0 12c0-4.095 3.32-7.416 7.416-7.416 1.518 0 2.931.456 4.105 1.238-.06.051-.12.098-.165.15C9.6 7.489 8.595 9.688 8.595 12c0 2.311 1.001 4.51 2.748 6.031zm5.241-13.447c-1.52 0-2.931.456-4.105 1.238.06.051.12.098.165.15C14.4 7.489 15.405 9.688 15.405 12c0 2.31-1.001 4.507-2.748 6.031-.058.049-.12.098-.181.146 1.177.783 2.588 1.238 4.107 1.238C20.68 19.416 24 16.096 24 12c0-4.094-3.32-7.416-7.416-7.416z" fill="#EB001B" />
                <path d="M12 6.174c-.096.075-.189.15-.28.231C10.156 7.764 9.169 9.765 9.169 12c0 2.236.987 4.236 2.551 5.595.09.08.185.158.28.232.096-.074.189-.152.28-.232 1.563-1.359 2.551-3.359 2.551-5.595 0-2.235-.987-4.236-2.551-5.595-.09-.08-.184-.156-.28-.231z" fill="#FF5F00" />
              </svg>
            </div>
            {/* PayPal */}
            <div className="flex px-3 h-8 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-colors" title="PayPal">
              <svg role="img" viewBox="0 0 24 24" height="18" xmlns="http://www.w3.org/2000/svg">
                <title>PayPal</title>
                <path d="M15.607 4.653H8.941L6.645 19.251H1.82L4.862 0h7.995c3.754 0 6.375 2.294 6.473 5.513-.648-.478-2.105-.86-3.722-.86" fill="#003087" />
                <path d="M13.604 17.052h-2.493L11.595 24H6.74l1.845-11.538h3.592c4.208 0 7.346-3.634 7.153-6.949a5.24 5.24 0 0 1 2.848 4.686 c0 3.41-3.01 6.853-6.958 6.853" fill="#009CDE" />
                <path d="M9.653 5.546h6.408c.907 0 1.942.222 2.363.541-.195 2.741-2.655 5.483-6.441 5.483H8.714Z" fill="#012169" />
              </svg>
            </div>
            {/* Revolut */}
            <div className="flex px-3 h-8 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-colors" title="Revolut">
              <svg role="img" viewBox="0 0 24 24" height="18" fill="black" xmlns="http://www.w3.org/2000/svg">
                <title>Revolut</title>
                <path d="M20.9133 6.9566C20.9133 3.1208 17.7898 0 13.9503 0H2.424v3.8605h10.9782c1.7376 0 3.177 1.3651 3.2087 3.043.016.84-.2994 1.633-.8878 2.2324-.5886.5998-1.375.9303-2.2144.9303H9.2322a.2756.2756 0 0 0-.2755.2752v3.431c0 .0585.018.1142.052.1612L16.2646 24h5.3114l-7.2727-10.094c3.6625-.1838 6.61-3.2612 6.61-6.9494zM6.8943 5.9229H2.424V24h4.4704z" />
              </svg>
            </div>
            {/* SEPA */}
            <div className="flex px-3 h-8 items-center justify-center rounded-md border border-neutral-200 bg-white shadow-sm hover:border-neutral-300 transition-colors" title="Bonifico SEPA">
              <span className="font-extrabold text-[#0055A5] text-[11px] tracking-tight italic">SEPA</span>
              <span className="ml-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#0055A5] text-[7px] font-bold text-white">€</span>
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