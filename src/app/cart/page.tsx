"use client";

import products from "@/db/products.json";
import type { Product } from "@/lib/shopTypes";
import { useCart } from "@/context/CartContext";
import { formatEUR } from "@/lib/money";
import { useMemo, useState } from "react";
import Image from "next/image";
import { goToCassa } from "@/lib/client/goToCassa";
import Footer from "@/components/Footer";

const VAT_RATE = 0.04;

export default function CartPage() {
  const { lines, remove, setQty, clear } = useCart();
  const catalog = products as Product[];

  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

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

  return (
    <>
      <section className="bg-white dark:bg-black" data-testid="cart-page">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">CARRELLO</div>
              <h1 className="mt-2 font-serif text-3xl tracking-[0.06em] text-zinc-900 dark:text-white">
                Il tuo carrello
              </h1>
            </div>

            {lines.length > 0 ? (
              <button
                onClick={clear}
                className="text-sm tracking-[0.10em] text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                Svuota
              </button>
            ) : null}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            {/* LISTA PRODOTTI */}
            <div className="space-y-4">
              {lines.length === 0 ? (
                <div className="rounded-[14px] border border-black/10 p-6 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                  Carrello vuoto.
                </div>
              ) : (
                viewLines.map(({ line, product, variant }) => {
                  const unit = variant?.priceCents ?? 0;
                  const lineTotal = unit * line.qty;

                  // ✅ mostra l'immagine della VARIANTE (se presente), altrimenti quella del prodotto
                  const lineImageSrc = variant?.imageSrc ?? product?.imageSrc;
                  const lineImageAlt =
                    variant?.imageAlt ?? product?.imageAlt ?? product?.title ?? "Prodotto";

                  return (
                    <div
                      key={`${line.productId}:${line.variantId}`}
                      className={[
                        "rounded-[18px] border border-black/10 bg-white",
                        "shadow-sm overflow-hidden",
                        "dark:border-white/10 dark:bg-black/20",
                      ].join(" ")}
                    >
                      <div className="flex items-stretch">
                        {/* IMMAGINE FULL HEIGHT */}
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
                              <div className="h-full w-full bg-zinc-100 dark:bg-white/5" />
                            )}
                          </div>
                        </div>

                        {/* CONTENUTO */}
                        <div className="flex-1 p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate font-serif text-lg text-zinc-900 dark:text-white">
                                {product?.title ?? line.productId}
                              </div>
                              <div className="mt-1 truncate text-xs tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                                {variant?.label ?? line.variantId}
                              </div>
                            </div>

                            {/* RIMUOVI visibile */}
                            <button
                              onClick={() => remove(line.productId, line.variantId)}
                              data-testid="cart-remove-line"
                              className={[
                                "shrink-0 inline-flex items-center gap-2",
                                "rounded-full border px-3 py-2",
                                "text-xs tracking-[0.18em]",
                                "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
                                "dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60",
                              ].join(" ")}
                              aria-label="Rimuovi prodotto"
                              title="Rimuovi"
                            >
                              <RedXIcon className="h-4 w-4" />
                              RIMUOVI
                            </button>
                          </div>

                          {/* Prezzi ordinati */}
                          <div className="mt-3 flex items-center justify-between gap-4">
                            <div className="text-sm text-zinc-600 dark:text-zinc-300">
                              {variant ? `${formatEUR(unit)} / cad.` : "—"}
                            </div>
                            <div className="text-sm font-medium tracking-[0.08em] text-zinc-900 dark:text-white">
                              {formatEUR(lineTotal)}
                            </div>
                          </div>

                          {/* Qty */}
                          <div className="mt-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                                Q.TÀ
                              </span>
                              <QtyStepper
                                qty={line.qty}
                                onDec={() => setQty(line.productId, line.variantId, Math.max(1, line.qty - 1))}
                                onInc={() => setQty(line.productId, line.variantId, Math.min(99, line.qty + 1))}
                                onChange={(next) => setQty(line.productId, line.variantId, next)}
                              />
                            </div>

                            <div className="text-[11px] tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                              Totale + IVA
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* RIEPILOGO */}
            <aside className="rounded-[16px] border border-black/10 p-5 shadow-sm dark:border-white/10 dark:bg-black/20">
              <div className="text-sm tracking-[0.12em] text-zinc-700 dark:text-zinc-200">RIEPILOGO</div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
                  <span>Subtotale</span>
                  <span className="text-zinc-900 dark:text-white">{formatEUR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
                  <span>IVA 4% (stima)</span>
                  <span className="text-zinc-900 dark:text-white">{formatEUR(vat)}</span>
                </div>
              </div>

              {payError ? (
                <div className="mt-4 text-sm text-red-600 dark:text-red-400" data-testid="cart-pay-error">
                  {payError}
                </div>
              ) : null}

              <button
                type="button"
                disabled={lines.length === 0 || payLoading}
                onClick={async () => {
                  if (payLoading) return;
                  setPayError(null);
                  setPayLoading(true);

                  const res = await goToCassa(lines);
                  if (!res.ok) {
                    setPayError(res.message);
                    setPayLoading(false);
                    return;
                  }

                  clear();
                }}
                className={[
                  "mt-6 inline-flex h-12 w-full items-center justify-center rounded-full px-4",
                  "text-sm tracking-[0.10em] text-white shadow-sm",
                  "bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50",
                  "dark:bg-emerald-500 dark:hover:bg-emerald-600",
                ].join(" ")}
                data-testid="cart-go-to-cassa"
              >
                {payLoading ? "Reindirizzo…" : "Vai alla cassa"}
              </button>

              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                Il totale finale (IVA + spedizione) viene validato dal server prima del pagamento.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* FOOTER IN FONDO */}
      <Footer />
    </>
  );
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
    <div className="flex h-10 items-center overflow-hidden rounded-[12px] border border-black/10 bg-white dark:border-white/10 dark:bg-zinc-950">
      <button
        type="button"
        onClick={onDec}
        className="h-10 w-10 text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
        aria-label="Diminuisci quantità"
      >
        −
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
        className="h-10 w-14 bg-transparent text-center text-sm text-zinc-900 focus:outline-none dark:text-zinc-100"
        aria-label="Quantità"
      />

      <button
        type="button"
        onClick={onInc}
        className="h-10 w-10 text-zinc-700 hover:bg-black/5 dark:text-zinc-200 dark:hover:bg-white/10"
        aria-label="Aumenta quantità"
      >
        +
      </button>
    </div>
  );
}

function RedXIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
