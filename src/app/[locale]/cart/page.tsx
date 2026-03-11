"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { track } from "@/lib/analytics/track";
import { Tag, CheckCircle2 } from "lucide-react";
import PaymentMethodsBadges from "@/components/PaymentMethodsBadges";

// ✅ catalog per immagini/prezzi
import products from "@/db/products.json";
import type { Product } from "@/lib/shopTypes";

function formatEUR(cents: number) {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const intPart = Math.floor(abs / 100);
  const decPart = abs % 100;
  const grouped = String(intPart).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimals = String(decPart).padStart(2, "0");
  return `${sign}${grouped},${decimals} €`;
}

type Totals = {
  subtotalCents: number;
  discountCents: number;
  vatCents: number;
  shippingCents: number;
  totalCents: number;
  promotionApplied?: { code: string; percent?: number | null } | null;
};

type PromoResult = {
  code: string;
  discountCents: number;
  percent: number | null;
  freeShipping: boolean;
};

export default function CartPage() {
  const cart = useCart();

  const [payError, setPayError] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState<PromoResult | null>(null);

  // Totali "source of truth" calcolati dal server (/api/checkout)
  const [totals, setTotals] = useState<Totals>({
    subtotalCents: 0,
    discountCents: 0,
    vatCents: 0,
    shippingCents: 0,
    totalCents: 0,
  });

  const catalog = products as unknown as Product[];
  const cartLines = cart.lines;
  const lines = useMemo(() => cartLines ?? [], [cartLines]);
  const empty = lines.length === 0;

  // Tracking: view cart (una sola volta)
  const linesCount = lines.length;
  useEffect(() => {
    track({ type: "view_cart", data: { itemsCount: linesCount } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computed = useMemo(() => {
    return lines.map((l) => {
      const p = catalog.find((x) => x.id === l.productId);
      const v = p?.variants.find((vv) => vv.id === l.variantId);

      const title = p?.title ?? "Prodotto";
      const subtitle = v?.label ?? p?.subtitle ?? "";
      const unitPriceCents = v?.priceCents ?? 0;

      const imageSrc = v?.imageSrc ?? p?.imageSrc ?? "";
      const imageAlt = v?.imageAlt ?? p?.imageAlt ?? title;

      const href = p?.slug ? `/shop/${p.slug}` : "/shop";

      return {
        productId: l.productId,
        variantId: l.variantId,
        qty: l.qty,
        title,
        subtitle,
        unitPriceCents,
        lineTotalCents: unitPriceCents * l.qty,
        imageSrc,
        imageAlt,
        href,
        valid: Boolean(p && v),
      };
    });
  }, [lines, catalog]);

  // ✅ Totali aggiornati dal server (IVA/spedizione/sconto coerenti col backend)
  useEffect(() => {
    let cancelled = false;

    async function refreshTotals() {
      if (lines.length === 0) {
        if (!cancelled) {
          setTotals({ subtotalCents: 0, discountCents: 0, vatCents: 0, shippingCents: 0, totalCents: 0 });
        }
        return;
      }

      try {
        const r = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: lines.map((it) => ({
              productId: it.productId,
              variantId: it.variantId,
              qty: it.qty,
            })),
            promotionCode: promoApplied?.code,
          }),
        });

        if (!r.ok) return;
        const j = (await r.json()) as Totals;
        if (!cancelled) {
          setTotals({
            subtotalCents: Number(j.subtotalCents ?? 0),
            discountCents: Number(j.discountCents ?? 0),
            vatCents: Number(j.vatCents ?? 0),
            shippingCents: Number(j.shippingCents ?? 0),
            totalCents: Number(j.totalCents ?? 0),
            promotionApplied: j.promotionApplied,
          });
        }
      } catch {
        // ignore
      }
    }

    refreshTotals();
    return () => {
      cancelled = true;
    };
  }, [lines, promoApplied]);

  async function handleApplyPromo() {
    const code = promoInput.trim();
    if (!code) return;
    setPromoLoading(true);
    setPromoError(null);
    setPromoApplied(null);

    // Compute subtotal client-side for the validation request
    const subtotalCents = computed.reduce((s, x) => s + x.lineTotalCents, 0);

    try {
      const res = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotalCents }),
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

  async function handleCheckout() {
    setPayError(null);
    setPayLoading(true);

    try {
      if (lines.length === 0) throw new Error("Carrello vuoto");

      // blocca checkout se qualche riga non matcha il catalogo (evita 400 "Variant not found")
      if (computed.some((x) => !x.valid)) {
        throw new Error("Nel carrello ci sono prodotti non validi. Svuota il carrello e riprova.");
      }

      // tracking begin_checkout
      track({
        type: "begin_checkout",
        data: {
          itemsCount: lines.length,
          totalCents: totals.totalCents,
        },
      });

      // ✅ /api/order crea ordine + session Stripe e ritorna checkoutUrl
      const idemKey = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)
        .toString()
        .slice(0, 200);

      const orderBody: Record<string, unknown> = {
        items: lines.map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          qty: it.qty,
        })),
      };
      if (promoApplied?.code) {
        orderBody.promotionCode = promoApplied.code;
      }

      const r = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idemKey,
        },
        body: JSON.stringify(orderBody),
      });

      if (!r.ok) {
        const msg = await r.text().catch(() => "");
        throw new Error(msg || "Checkout non disponibile");
      }

      const j = await r.json().catch(() => ({}));
      const url = j?.checkoutUrl;

      if (typeof url === "string" && url.startsWith("http")) {
        window.location.href = url;
        return;
      }

      throw new Error("URL checkout mancante");
    } catch (e: unknown) {
      setPayError((e as Error)?.message ?? "Errore checkout");
    } finally {
      setPayLoading(false);
    }
  }

  return (
    <>
      <section className="bg-zinc-50 min-h-[calc(100vh-80px)]" data-testid="cart-page">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs tracking-[0.22em] text-zinc-500">CARRELLO</div>
              <h1 className="mt-2 font-serif text-3xl tracking-[0.06em] text-zinc-900">
                Il tuo carrello
              </h1>
            </div>

            <Link href="/shop" className="text-sm tracking-[0.10em] text-zinc-600 hover:text-zinc-900">
              Torna allo shop
            </Link>
          </div>

          {empty ? (
            <div className="mt-10 rounded-[20px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.03] p-6 text-sm text-zinc-500">
              Il carrello è vuoto. Vai allo{" "}
              <Link className="underline" href="/shop">
                shop
              </Link>
              .
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] items-start">
              {/* LISTA */}
              <div className="flex flex-col gap-5 md:gap-6">
                {computed.map((line) => (
                  <div
                    key={`${line.productId}:${line.variantId}`}
                    className="flex gap-4 sm:gap-6 bg-white p-5 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/[0.03]"
                  >
                    {/* IMG */}
                    <Link
                      href={line.href}
                      className="relative h-28 w-24 sm:h-32 sm:w-28 shrink-0 bg-transparent"
                      aria-label={`Apri ${line.title}`}
                    >
                      {line.imageSrc ? (
                        <Image
                          src={line.imageSrc}
                          alt={line.imageAlt}
                          fill
                          sizes="(max-width: 640px) 96px, 112px"
                          className="object-contain"
                        />
                      ) : (
                        <div className="h-full w-full bg-transparent" />
                      )}
                    </Link>

                    {/* INFO */}
                    <div className="min-w-0 flex-1 flex flex-col justify-between py-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={line.href}
                            className="truncate font-serif text-[17px] sm:text-xl text-zinc-900 hover:underline"
                          >
                            {line.title}
                          </Link>
                          {line.subtitle ? (
                            <div className="mt-1 truncate text-[11px] sm:text-[13px] tracking-[0.18em] text-zinc-500">
                              {line.subtitle}
                            </div>
                          ) : null}
                        </div>

                        <div className="text-right">
                          <div className="text-sm sm:text-base font-medium tracking-[0.08em] text-zinc-900">
                            {formatEUR(line.lineTotalCents)}
                          </div>
                          <div className="mt-1 text-[10px] sm:text-xs text-zinc-400 sm:text-zinc-500">
                            {formatEUR(line.unitPriceCents)} / unità
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-5 flex items-center justify-between gap-3 sm:mt-6">
                        {/* qty */}
                        <div className="flex h-9 sm:h-10 items-center overflow-hidden rounded-[8px] sm:rounded-[10px] bg-zinc-100/80 border border-black/5">
                          <button
                            type="button"
                            className="h-9 w-9 sm:h-10 sm:w-10 text-zinc-700 hover:bg-black/5 disabled:opacity-30 transition-colors"
                            onClick={() => {
                              const nextQty = Math.max(1, line.qty - 1);
                              const delta = nextQty - line.qty;

                              track({
                                type: "update_cart_quantity",
                                productKey: line.productId,
                                variantKey: line.variantId,
                                data: {
                                  fromQty: line.qty,
                                  toQty: nextQty,
                                  delta,
                                  unitPriceCents: line.unitPriceCents,
                                },
                              });

                              cart.setQty(line.productId, line.variantId, nextQty);
                            }}
                            disabled={line.qty <= 1}
                            aria-label="Diminuisci quantità"
                          >
                            –
                          </button>

                          <div className="flex h-9 w-10 sm:h-10 sm:w-12 items-center justify-center bg-transparent text-center text-[13px] sm:text-sm font-medium text-zinc-900">
                            {line.qty}
                          </div>

                          <button
                            type="button"
                            className="h-9 w-9 sm:h-10 sm:w-10 text-zinc-700 hover:bg-black/5 transition-colors"
                            onClick={() => {
                              const nextQty = line.qty + 1;
                              const delta = nextQty - line.qty;

                              track({
                                type: "update_cart_quantity",
                                productKey: line.productId,
                                variantKey: line.variantId,
                                data: {
                                  fromQty: line.qty,
                                  toQty: nextQty,
                                  delta,
                                  unitPriceCents: line.unitPriceCents,
                                },
                              });

                              cart.setQty(line.productId, line.variantId, nextQty);
                            }}
                            aria-label="Aumenta quantità"
                          >
                            +
                          </button>
                        </div>

                        {/* remove */}
                        <button
                          type="button"
                          className="shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-[11px] font-medium tracking-[0.18em] bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          onClick={() => {
                            track({
                              type: "remove_from_cart",
                              productKey: line.productId,
                              variantKey: line.variantId,
                              data: {
                                qty: line.qty,
                                unitPriceCents: line.unitPriceCents,
                                lineTotalCents: line.lineTotalCents,
                              },
                            });

                            cart.remove(line.productId, line.variantId);
                          }}
                          aria-label="Rimuovi dal carrello"
                        >
                          Rimuovi
                        </button>
                      </div>

                      {!line.valid ? (
                        <div className="mt-3 text-xs text-red-600">
                          Riga non valida: prodotto/variante non trovati a catalogo.
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between gap-3 px-2 py-2 mt-2">
                  <button
                    type="button"
                    className="text-xs sm:text-sm tracking-[0.12em] text-zinc-500 hover:text-zinc-900 transition-colors"
                    onClick={() => {
                      track({
                        type: "clear_cart",
                        data: {
                          itemsCount: lines.length,
                          totalCents: totals.totalCents,
                        },
                      });

                      cart.clear();
                    }}
                  >
                    Svuota carrello
                  </button>

                  <Link href="/shop" className="text-xs sm:text-sm tracking-[0.12em] text-zinc-500 hover:text-zinc-900 transition-colors">
                    Continua lo shopping →
                  </Link>
                </div>
              </div>

              {/* RIEPILOGO */}
              <aside className="rounded-[20px] bg-white border border-black/[0.03] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 lg:sticky lg:top-28 h-fit">
                <div className="text-sm tracking-[0.12em] text-zinc-700">RIEPILOGO</div>

                {/* Codice sconto */}
                <div className="mt-5">
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
                    <>
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
                            className="h-10 w-full rounded-[10px] border border-black/10 bg-zinc-50 pl-9 pr-3 text-base text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-colors"
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
                      {promoError && (
                        <p className="mt-2 text-xs text-red-600">{promoError}</p>
                      )}
                    </>
                  )}
                </div>

                {/* Totali */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-zinc-600">
                    <span className="text-[13px]">Subtotale</span>
                    <span className="text-zinc-900 text-sm">{formatEUR(totals.subtotalCents)}</span>
                  </div>

                  {totals.discountCents > 0 && (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span className="text-[13px]">Sconto ({promoApplied?.code ?? totals.promotionApplied?.code})</span>
                      <span className="font-medium text-sm">–{formatEUR(totals.discountCents)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-zinc-600">
                    <span className="text-[13px]">IVA</span>
                    <span className="text-zinc-900 text-sm">{formatEUR(totals.vatCents)}</span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-600">
                    <span className="text-[13px]">Spedizione</span>
                    <span className="text-zinc-900 text-sm">{formatEUR(totals.shippingCents)}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
                    <span className="font-medium tracking-[0.08em] text-zinc-900">Totale</span>
                    <span className="font-medium tracking-[0.08em] text-zinc-900 text-lg">
                      {formatEUR(totals.totalCents)}
                    </span>
                  </div>
                </div>

                {payError ? (
                  <div className="mt-4 text-sm text-red-600" data-testid="cart-pay-error">
                    {payError}
                  </div>
                ) : null}

                <button
                  type="button"
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[12px] px-4 text-sm font-medium tracking-[0.10em] text-white bg-emerald-600 hover:bg-emerald-700 shadow-[0_4px_14px_0_rgba(5,150,105,0.39)] hover:shadow-[0_6px_20px_rgba(5,150,105,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  onClick={handleCheckout}
                  disabled={payLoading || empty}
                >
                  {payLoading ? "Apertura checkout…" : "Vai al checkout"}
                </button>
                
                <PaymentMethodsBadges className="mt-4" />
                
                <p className="mt-4 text-center text-[11px] text-zinc-400">
                  Pagamento sicuro tramite Stripe.<br />Riceverai conferma via email.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}