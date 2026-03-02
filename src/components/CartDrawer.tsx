"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import products from "@/db/products.json";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/shopTypes";
import { formatEUR } from "@/lib/money";
import { goToCassa } from "@/lib/client/goToCassa";
import {
  X,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  PackageOpen,
  Tag,
  CheckCircle2,
} from "lucide-react";

const VAT_RATE = 0.04;
const FREE_SHIPPING_THRESHOLD_CENTS = 6900;
const SHIPPING_CENTS = 590;

type PromoResult = {
  code: string;
  discountCents: number;
  percent: number | null;
  freeShipping: boolean;
};

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lines, remove, setQty, clear } = useCart();
  const catalog = products as unknown as Product[];

  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState<PromoResult | null>(null);

  // ✅ Portal mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => { queueMicrotask(() => setMounted(true)); }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const viewLines = useMemo(() => {
    return lines.map((l) => {
      const p = catalog.find((x) => x.id === l.productId);
      const v = p?.variants.find((vv) => vv.id === l.variantId);
      return { line: l, product: p, variant: v };
    });
  }, [lines, catalog]);

  const subtotal = useMemo(() => {
    return viewLines.reduce((sum, x) => sum + (x.variant?.priceCents ?? 0) * x.line.qty, 0);
  }, [viewLines]);

  const vat = Math.round(subtotal * VAT_RATE);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotal);
  const shippingPreview =
    promoApplied?.freeShipping || subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;

  const discountCents = promoApplied?.discountCents ?? 0;
  const totalWithDiscount = subtotal + vat + shippingPreview - discountCents;

  async function handleApplyPromo() {
    const code = promoInput.trim();
    if (!code) return;
    setPromoLoading(true);
    setPromoError(null);
    setPromoApplied(null);

    try {
      const res = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotalCents: subtotal }),
      });
      const data = await res.json();

      if (data.valid) {
        setPromoApplied({
          code: data.code,
          discountCents: data.discountCents,
          percent: data.percent,
          freeShipping: data.freeShipping,
        });
        setPromoInput("");
      } else {
        setPromoError(data.reason ?? "Codice non valido.");
      }
    } catch {
      setPromoError("Errore di rete. Riprova.");
    } finally {
      setPromoLoading(false);
    }
  }

  const ui = (
    <div
      className={[
        "fixed inset-0 z-[9999]",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <button
        type="button"
        className={[
          "absolute inset-0 transition-opacity duration-200",
          "bg-black/70",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
        aria-label="Chiudi carrello"
        tabIndex={open ? 0 : -1}
      />

      {/* Drawer */}
      <aside
        className={[
          "fixed right-0 top-0 h-[100dvh] max-h-[100dvh]",
          "w-[min(98vw,820px)] sm:w-[640px] lg:w-[820px]",
          "bg-white",
          "shadow-2xl",
          "border-l border-black/10",
          "transition-transform duration-[250ms] ease-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-zinc-700" strokeWidth={1.5} />
              <div>
                <div className="text-[10px] tracking-[0.22em] text-zinc-500">
                  CARRELLO
                </div>
                <div className="mt-1 font-serif text-2xl tracking-[0.06em] text-zinc-900">
                  I tuoi prodotti
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-zinc-700 hover:bg-black/5"
              aria-label="Chiudi"
              title="Chiudi"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>

          {/* Info spedizione */}
          {lines.length > 0 && (
            <div className="border-b border-black/5 px-6 py-3">
              <div className="text-xs text-zinc-600">
                {remainingForFreeShipping > 0 ? (
                  <div className="flex items-center gap-2">
                    <PackageOpen className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
                    <span>
                      Spedizione gratis sopra{" "}
                      <span className="font-medium text-zinc-900">
                        {formatEUR(FREE_SHIPPING_THRESHOLD_CENTS)}
                      </span>
                      . Ti mancano{" "}
                      <span className="font-medium text-zinc-900">
                        {formatEUR(remainingForFreeShipping)}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <PackageOpen className="h-4 w-4" strokeWidth={1.5} />
                    <span className="font-medium">Spedizione gratis attiva!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between px-6 py-3">
            <div className="text-xs tracking-[0.18em] text-zinc-500">
              {lines.length > 0 ? `${lines.length} ${lines.length === 1 ? "PRODOTTO" : "PRODOTTI"}` : "VUOTO"}
            </div>

            {lines.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-2 text-xs tracking-[0.18em] text-zinc-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                SVUOTA
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto border-t border-black/5 px-6 py-5">
            {lines.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-zinc-300 mb-4" strokeWidth={1.5} />
                <p className="text-sm text-zinc-500">
                  Il carrello è vuoto.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 text-sm text-zinc-900 hover:text-zinc-600 underline underline-offset-4"
                >
                  Continua lo shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {viewLines.map(({ line, product, variant }) => {
                  const unit = variant?.priceCents ?? 0;
                  const lineTotal = unit * line.qty;

                  const lineImageSrc = variant?.imageSrc ?? product?.imageSrc;
                  const lineImageAlt =
                    variant?.imageAlt ?? product?.imageAlt ?? product?.title ?? "Prodotto";

                  return (
                    <div
                      key={`${line.productId}:${line.variantId}`}
                      className={[
                        "rounded-[18px] border border-black/10 bg-white",
                        "shadow-sm overflow-hidden",
                      ].join(" ")}
                    >
                      <div className="flex items-stretch">
                        {/* Immagine */}
                        <div className="relative w-[110px] sm:w-[140px] md:w-[160px] shrink-0">
                          <div className="absolute inset-0">
                            {lineImageSrc ? (
                              <Image
                                src={lineImageSrc}
                                alt={lineImageAlt}
                                fill
                                sizes="160px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-zinc-100 flex items-center justify-center">
                                <ShoppingBag className="h-8 w-8 text-zinc-300" strokeWidth={1.5} />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate font-serif text-lg text-zinc-900">
                                {product?.title ?? line.productId}
                              </div>
                              <div className="mt-1 truncate text-xs tracking-[0.18em] text-zinc-500">
                                {variant?.label ?? line.variantId}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => remove(line.productId, line.variantId)}
                              data-testid="remove-line"
                              className={[
                                "shrink-0 inline-flex items-center gap-1.5",
                                "rounded-full border px-3 py-2",
                                "text-xs tracking-[0.12em]",
                                "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
                                "transition-colors",
                              ].join(" ")}
                              aria-label="Rimuovi prodotto"
                              title="Rimuovi"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-4">
                            <div className="text-sm text-zinc-600">
                              {variant ? `${formatEUR(unit)} / cad.` : "—"}
                            </div>
                            <div className="text-sm font-medium tracking-[0.08em] text-zinc-900">
                              {formatEUR(lineTotal)}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <QtyStepper
                                qty={line.qty}
                                onDec={() => setQty(line.productId, line.variantId, Math.max(1, line.qty - 1))}
                                onInc={() => setQty(line.productId, line.variantId, Math.min(99, line.qty + 1))}
                                onChange={(next) => setQty(line.productId, line.variantId, next)}
                              />
                            </div>

                            <div className="text-[11px] tracking-[0.14em] text-zinc-500">
                              Totale + IVA
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-black/10 bg-white/95 px-6 pt-5 pb-[calc(34px+env(safe-area-inset-bottom))] backdrop-blur">

            {/* Codice sconto */}
            {lines.length > 0 && (
              <div className="mb-4">
                {promoApplied ? (
                  <div className="flex items-center justify-between rounded-[12px] bg-emerald-50 border border-emerald-200 px-4 py-2.5">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span className="text-sm font-medium">{promoApplied.code}</span>
                      {promoApplied.percent && (
                        <span className="text-xs text-emerald-600">–{promoApplied.percent}%</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPromoApplied(null)}
                      className="text-xs text-emerald-700 hover:text-red-600 transition-colors underline underline-offset-2"
                    >
                      Rimuovi
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoError(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        placeholder="Codice sconto"
                        className="h-10 w-full rounded-[10px] border border-black/10 bg-white pl-9 pr-3 text-base text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                        disabled={promoLoading}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      className="h-10 rounded-[10px] bg-zinc-900 px-4 text-xs tracking-[0.12em] text-white hover:bg-zinc-700 disabled:opacity-40 transition-colors whitespace-nowrap"
                    >
                      {promoLoading ? "…" : "Applica"}
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="mt-1.5 text-xs text-red-600">{promoError}</p>
                )}
              </div>
            )}

            {/* Totali */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Subtotale</span>
                <span className="text-zinc-900">{formatEUR(subtotal)}</span>
              </div>
              {discountCents > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Sconto ({promoApplied?.code})</span>
                  <span className="font-medium">–{formatEUR(discountCents)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-zinc-600">
                <span>IVA 4% (stima)</span>
                <span className="text-zinc-900">{formatEUR(vat)}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>Spedizione (stima)</span>
                <span
                  className={
                    shippingPreview === 0
                      ? "text-emerald-600 font-medium"
                      : "text-zinc-900"
                  }
                >
                  {shippingPreview === 0 ? "Gratis" : formatEUR(shippingPreview)}
                </span>
              </div>
              {discountCents > 0 && (
                <div className="flex items-center justify-between border-t border-black/10 pt-2 font-medium text-zinc-900">
                  <span>Totale scontato</span>
                  <span>{formatEUR(totalWithDiscount)}</span>
                </div>
              )}
            </div>

            <div className="mt-7 grid gap-3">
              {payError && (
                <div className="flex items-center gap-2 text-sm text-red-600" data-testid="drawer-pay-error">
                  <X className="h-4 w-4" strokeWidth={1.5} />
                  {payError}
                </div>
              )}

              <button
                type="button"
                disabled={lines.length === 0 || payLoading}
                onClick={async () => {
                  if (payLoading) return;
                  setPayError(null);
                  setPayLoading(true);

                  const res = await goToCassa(lines, {
                    promotionCode: promoApplied?.code,
                  });
                  if (!res.ok) {
                    setPayError(res.message);
                    setPayLoading(false);
                    return;
                  }

                  // ✅ NON SVUOTARE IL CARRELLO QUI.
                  // Il carrello si azzera SOLO a pagamento riuscito (/checkout/success).
                  onClose();
                }}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm tracking-[0.10em] text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                data-testid="drawer-go-to-cassa"
              >
                {payLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Reindirizzo…
                  </>
                ) : (
                  <>
                    Vai alla cassa
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </>
                )}
              </button>

              <Link
                href="/cart"
                onClick={onClose}
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-black/10 bg-white px-4 text-sm tracking-[0.10em] text-zinc-900 shadow-sm hover:bg-zinc-50 transition-colors"
              >
                Visualizza carrello
              </Link>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              Il totale finale (IVA + spedizione) viene validato dal server prima del pagamento.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );

  if (!mounted) return null;
  return createPortal(ui, document.body);
}

function QtyStepper({
  qty,
  onDec,
  onInc,
  onChange,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex h-10 items-center overflow-hidden rounded-[12px] border border-black/10 bg-white">
      <button
        type="button"
        onClick={onDec}
        disabled={qty <= 1}
        className="h-10 w-10 flex items-center justify-center text-zinc-700 hover:bg-black/5 disabled:opacity-30 transition-colors"
        aria-label="Diminuisci quantità"
        data-testid="qty-dec"
      >
        <Minus className="h-4 w-4" strokeWidth={1.5} />
      </button>

      <input
        type="number"
        min={1}
        max={99}
        value={qty}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(Number.isFinite(v) ? Math.min(99, Math.max(1, v)) : 1);
        }}
        className="h-10 w-14 bg-transparent text-center text-sm text-zinc-900 focus:outline-none"
        aria-label="Quantità"
      />

      <button
        type="button"
        onClick={onInc}
        disabled={qty >= 99}
        className="h-10 w-10 flex items-center justify-center text-zinc-700 hover:bg-black/5 disabled:opacity-30 transition-colors"
        aria-label="Aumenta quantità"
        data-testid="qty-inc"
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}