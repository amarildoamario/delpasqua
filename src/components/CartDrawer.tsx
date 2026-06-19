"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import ToggleMessage from "@/components/ui/ToggleMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { translateCartCheckoutError, translateCartPromoError } from "@/lib/cartI18n";
import { goToCassa } from "@/lib/client/goToCassa";
import { formatEUR } from "@/lib/money";
import type { CartLine } from "@/lib/shopTypes";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  PackageOpen,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import { SHIPPING_FLAT_CENTS as SHIPPING_CENTS } from "@/lib/constants";
import { getShippingRule } from "@/lib/shippingConfig";

type PromoResult = {
  code: string;
  discountCents: number;
  percent: number | null;
  freeShipping: boolean;
};

type CheckoutPricingItem = {
  productId: string;
  variantId: string;
  unitPriceCents: number;
  qty: number;
  lineSubtotalCents: number;
  lineDiscountCents: number;
  lineTotalCents: number;
};

type Totals = {
  items: CheckoutPricingItem[];
  subtotalCents: number;
  discountCents: number;
  vatCents: number;
  shippingCents: number;
  totalCents: number;
  promotionApplied?: { code: string; percent?: number | null } | null;
};

const drawerStatusCopy = {
  it: {
    lineReduced: (title: string, qty: number) => `${title} aggiornato a ${qty} per disponibilita limitata.`,
    lineRemoved: (title: string) => `${title} rimosso dal carrello per esaurimento stock.`,
    lineMigrated: (title: string) => `${title} aggiornato nel carrello dopo una modifica al catalogo.`,
    invalidRemoved: "Un prodotto non piu disponibile e stato rimosso dal carrello.",
  },
  en: {
    lineReduced: (title: string, qty: number) => `${title} updated to ${qty} because of limited stock.`,
    lineRemoved: (title: string) => `${title} was removed from the cart because it is sold out.`,
    lineMigrated: (title: string) => `${title} was updated in the cart after a catalog change.`,
    invalidRemoved: "A product that is no longer available was removed from the cart.",
  },
  de: {
    lineReduced: (title: string, qty: number) => `${title} wurde wegen begrenztem Bestand auf ${qty} angepasst.`,
    lineRemoved: (title: string) => `${title} wurde aus dem Warenkorb entfernt, da es ausverkauft ist.`,
    lineMigrated: (title: string) => `${title} wurde nach einer Katalogaenderung im Warenkorb aktualisiert.`,
    invalidRemoved: "Ein nicht mehr verfuegbares Produkt wurde aus dem Warenkorb entfernt.",
  },
  nl: {
    lineReduced: (title: string, qty: number) => `${title} aangepast naar ${qty} vanwege beperkte voorraad.`,
    lineRemoved: (title: string) => `${title} is uit de winkelwagen verwijderd omdat het is uitverkocht.`,
    lineMigrated: (title: string) => `${title} is na een cataloguswijziging bijgewerkt in de winkelwagen.`,
    invalidRemoved: "Een product dat niet meer beschikbaar is, is uit de winkelwagen verwijderd.",
  },
  da: {
    lineReduced: (title: string, qty: number) => `${title} blev justeret til ${qty} pga. begraenset lager.`,
    lineRemoved: (title: string) => `${title} blev fjernet fra kurven, fordi varen er udsolgt.`,
    lineMigrated: (title: string) => `${title} blev opdateret i kurven efter en katalogaendring.`,
    invalidRemoved: "Et produkt, der ikke laengere er tilgaengeligt, blev fjernet fra kurven.",
  },
  no: {
    lineReduced: (title: string, qty: number) => `${title} ble justert til ${qty} paa grunn av begrenset lager.`,
    lineRemoved: (title: string) => `${title} ble fjernet fra handlekurven fordi varen er utsolgt.`,
    lineMigrated: (title: string) => `${title} ble oppdatert i handlekurven etter en katalogendring.`,
    invalidRemoved: "Et produkt som ikke lenger er tilgjengelig, ble fjernet fra handlekurven.",
  },
} as const;

const drawerLabels = {
  it: "Calcola la spedizione nel carrello per procedere",
  en: "Calculate shipping in the cart to proceed",
  de: "Berechnen Sie den Versand im Warenkorb, um fortzufahren",
  nl: "Bereken de verzendkosten in de winkelwagen om door te gaan",
  da: "Beregn forsendelse i indkøbskurven for at fortsætte",
  no: "Beregn frakt i handlekurven for å fortsette",
} as const;

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const {
    lines,
    remove,
    setQty,
    clear,
    getAvailableQty,
    refreshAvailability,
    catalog,
    lastAvailabilityNotice,
    clearAvailabilityNotice,
  } = useCart();
  const statusText = drawerStatusCopy[(locale as keyof typeof drawerStatusCopy)] ?? drawerStatusCopy.it;

  const countryCode = useMemo(() => {
    if (locale === "de") return "DE";
    if (locale === "nl") return "NL";
    if (locale === "da") return "DK";
    if (locale === "no") return "NO";
    if (locale === "it") return "IT";
    if (locale === "en") return "GB"; // Default fallback for en
    return "GB";
  }, [locale]);

  const shippingRule = getShippingRule(countryCode);
  const isCheckoutBlocked = locale !== "it";

  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState<PromoResult | null>(null);
  const [stockToast, setStockToast] = useState("");
  const [stockToastOpen, setStockToastOpen] = useState(false);
  const [totals, setTotals] = useState<Totals>({
    items: [],
    subtotalCents: 0,
    discountCents: 0,
    vatCents: 0,
    shippingCents: 0,
    totalCents: 0,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (!open) return;
    void refreshAvailability();
  }, [open, refreshAvailability]);

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
  }, [onClose, open]);

  const viewLines = useMemo(() => {
    return lines.map((line) => {
      const product = catalog.find((x) => x.id === line.productId);
      const variant = product?.variants.find((vv) => vv.id === line.variantId);
      return { line, product, variant };
    });
  }, [lines, catalog]);
  const pricingItemsByKey = useMemo(() => {
    return new Map(
      totals.items.map((item) => [`${item.productId}:${item.variantId}`, item] as const)
    );
  }, [totals.items]);

  useEffect(() => {
    if (!lastAvailabilityNotice || !open) return;
    const product = catalog.find((item) => item.id === lastAvailabilityNotice.productId);
    const variant = product?.variants.find((item) => item.id === lastAvailabilityNotice.variantId);
    const title = [product?.title, variant?.label].filter(Boolean).join(" - ") || t("common.product_fallback");
    const message =
      lastAvailabilityNotice.kind === "invalid_removed"
        ? statusText.invalidRemoved
        : lastAvailabilityNotice.kind === "migrated"
          ? statusText.lineMigrated(title)
          : lastAvailabilityNotice.kind === "removed"
            ? statusText.lineRemoved(title)
            : statusText.lineReduced(title, lastAvailabilityNotice.nextQty);

    setStockToast(message);
    setStockToastOpen(true);
    clearAvailabilityNotice();
  }, [catalog, clearAvailabilityNotice, lastAvailabilityNotice, open, statusText, t]);

  const subtotal = totals.subtotalCents;
  const remainingForFreeShipping = Math.max(0, shippingRule.freeShippingThresholdCents - subtotal);
  const shippingPreview = totals.shippingCents;
  const discountCents = totals.discountCents;
  const total = totals.totalCents;

  useEffect(() => {
    let cancelled = false;

    async function refreshTotals() {
      if (lines.length === 0) {
        if (!cancelled) {
          setTotals({
            items: [],
            subtotalCents: 0,
            discountCents: 0,
            vatCents: 0,
            shippingCents: 0,
            totalCents: 0,
          });
        }
        return;
      }

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: lines.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              qty: item.qty,
            })),
            promotionCode: promoApplied?.code,
            countryCode,
          }),
        });

        if (!response.ok) return;

        const data = (await response.json()) as Totals;
        if (!cancelled) {
          if (promoApplied?.code && !(data as Totals & { promotionApplied?: { code: string } | null }).promotionApplied) {
            setPromoApplied(null);
          }
          setTotals({
            items: Array.isArray(data.items) ? data.items : [],
            subtotalCents: Number(data.subtotalCents ?? 0),
            discountCents: Number(data.discountCents ?? 0),
            vatCents: Number(data.vatCents ?? 0),
            shippingCents: Number(data.shippingCents ?? 0),
            totalCents: Number(data.totalCents ?? 0),
            promotionApplied: data.promotionApplied ?? null,
          });
        }
      } catch {
        // ignore preview failures in drawer
      }
    }

    void refreshTotals();
    return () => {
      cancelled = true;
    };
  }, [lines, promoApplied, countryCode]);

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
        body: JSON.stringify({
          code,
          items: lines.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            qty: item.qty,
          })),
        }),
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
        setPromoError(translateCartPromoError(data.reason, t));
      }
    } catch {
      setPromoError(t("errors.network_retry"));
    } finally {
      setPromoLoading(false);
    }
  }

  const ui = (
    <div
      className={["fixed top-0 left-0 w-full z-[9999]", open ? "pointer-events-auto" : "pointer-events-none"].join(" ")}
      style={{ height: "var(--viewport-height)" }}
      aria-hidden={!open}
    >
      <button
        type="button"
        className={[
          "absolute inset-0 bg-black/70 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
        aria-label={t("drawer.close_cart")}
        tabIndex={open ? 0 : -1}
      />

      <aside
        className={[
          "fixed right-0 top-0",
          "w-[min(98vw,820px)] sm:w-[640px] lg:w-[820px]",
          "border-l border-black/10 bg-white shadow-2xl",
          "transition-transform duration-[250ms] ease-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        style={{ height: "var(--viewport-height)", maxHeight: "var(--viewport-height)" }}
      >
        <div className="flex h-full flex-col">
          <ToggleMessage open={stockToastOpen} message={stockToast} onClose={() => setStockToastOpen(false)} />
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-zinc-700" strokeWidth={1.5} />
              <div>
                <div className="text-[10px] tracking-[0.22em] text-zinc-500 uppercase">{t("drawer.eyebrow")}</div>
                <div className="mt-1 font-serif text-2xl tracking-[0.06em] text-zinc-900">{t("drawer.title")}</div>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full text-zinc-700 hover:bg-black/5"
              aria-label={t("drawer.close")}
              title={t("drawer.close")}
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </Button>
          </div>

          {lines.length > 0 && (
            <div className="border-b border-black/5 px-6 py-3">
              <div className="text-xs text-zinc-600">
                {remainingForFreeShipping > 0 ? (
                  <div className="flex items-center gap-2">
                    <PackageOpen className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
                    <span>
                      {t("drawer.free_shipping_above")}{" "}
                      <span className="font-medium text-zinc-900">
                        {formatEUR(shippingRule.freeShippingThresholdCents)}
                      </span>
                      . {t("drawer.free_shipping_missing")}{" "}
                      <span className="font-medium text-zinc-900">
                        {formatEUR(remainingForFreeShipping)}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <PackageOpen className="h-4 w-4" strokeWidth={1.5} />
                    <span className="font-medium">{t("drawer.free_shipping_active")}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-6 py-3">
            <div className="text-xs tracking-[0.18em] text-zinc-500 uppercase">{t("drawer.items_count", { count: lines.length })}</div>

            {lines.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clear}
                className="rounded-full text-xs tracking-[0.18em] text-zinc-600 uppercase hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                {t("drawer.clear")}
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto border-t border-black/5 px-6 py-5">
            {lines.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingCart className="mb-4 h-16 w-16 text-zinc-300" strokeWidth={1.5} />
                <p className="text-sm text-zinc-500">{t("drawer.empty")}</p>
                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full border border-black/5 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-600">
                  <PackageOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>{t("drawer.shipping_from", { amount: formatEUR(SHIPPING_CENTS) })}</span>
                </div>
                <button
                  onClick={onClose}
                  className="mt-6 text-sm text-zinc-900 underline underline-offset-4 hover:text-zinc-600"
                >
                  {t("common.continue_shopping")}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {viewLines.map(({ line, product, variant }) => {
                  const pricingItem = pricingItemsByKey.get(`${line.productId}:${line.variantId}`);
                  const unit = pricingItem?.unitPriceCents ?? variant?.priceCents ?? 0;
                  const lineTotal = pricingItem?.lineSubtotalCents ?? unit * line.qty;
                  const imageSrc = variant?.imageSrc ?? product?.imageSrc;
                  const imageAlt = variant?.imageAlt ?? product?.imageAlt ?? product?.title ?? t("common.product_fallback");
                  const available = getAvailableQty(line.productId, line.variantId);
                  const maxQty = available === null ? 99 : Math.max(0, available);

                  return (
                    <CartLineCard
                      key={`${line.productId}:${line.variantId}`}
                      line={line}
                      productTitle={product?.title ?? line.productId}
                      variantLabel={variant?.label ?? line.variantId}
                      unit={unit}
                      lineTotal={lineTotal}
                      imageSrc={imageSrc}
                      imageAlt={imageAlt}
                      maxQty={maxQty}
                      onRemove={() => remove(line.productId, line.variantId)}
                      onDec={() => setQty(line.productId, line.variantId, Math.max(1, line.qty - 1))}
                      onInc={() => setQty(line.productId, line.variantId, Math.min(maxQty, line.qty + 1))}
                      onChange={(next) => setQty(line.productId, line.variantId, next)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-black/10 bg-white/95 px-4 pb-[calc(14px+env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-[calc(34px+env(safe-area-inset-bottom))] sm:pt-5 backdrop-blur">
            {lines.length > 0 && (
              <div className="mb-3 sm:mb-4">
                {promoApplied ? (
                  <div className="flex items-center justify-between rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-2 sm:py-2.5">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span className="text-sm font-medium">{promoApplied.code}</span>
                      {promoApplied.percent && (
                        <span className="text-xs text-emerald-600">-{promoApplied.percent}%</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPromoApplied(null)}
                      className="text-xs text-emerald-700 underline underline-offset-2 transition-colors hover:text-red-600"
                    >
                      {t("common.remove")}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                        strokeWidth={1.5}
                      />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoError(null);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        placeholder={t("common.discount_code_placeholder")}
                        className="h-10 w-full rounded-[10px] border border-black/10 bg-white pl-9 pr-3 text-base text-zinc-900 placeholder-zinc-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        disabled={promoLoading}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      className="h-10 whitespace-nowrap rounded-[10px] bg-zinc-900 px-4 text-xs tracking-[0.12em] text-white transition-colors hover:bg-zinc-700 disabled:opacity-40"
                    >
                      {promoLoading ? "..." : t("common.apply")}
                    </button>
                  </div>
                )}
                {promoError && <p className="mt-1.5 text-xs text-red-600">{promoError}</p>}
              </div>
            )}

            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-zinc-600">
                <span>{t("common.subtotal")}</span>
                <span className="text-zinc-900">{formatEUR(subtotal)}</span>
              </div>
              {discountCents > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>{t("common.discount_with_code", { code: promoApplied?.code ?? "" })}</span>
                  <span className="font-medium">-{formatEUR(discountCents)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-zinc-600">
                <span>{t("common.shipping_estimate")}</span>
                <span className={shippingPreview === 0 ? "font-medium text-emerald-600" : "text-zinc-900"}>
                  {shippingPreview === 0 ? t("common.free") : formatEUR(shippingPreview)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-black/10 pt-2 font-medium text-zinc-900">
                <span>{t("common.total")}</span>
                <span>{formatEUR(total)}</span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
              {payError && (
                <div className="col-span-2 flex items-center gap-2 text-xs sm:text-sm text-red-600" data-testid="drawer-pay-error">
                  <X className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span>{payError}</span>
                </div>
              )}

              <Link
                href="/cart"
                onClick={onClose}
                className="inline-flex h-10 sm:h-12 w-full items-center justify-center rounded-[5px] border border-black/10 bg-white px-2 sm:px-4 text-xs sm:text-sm tracking-[0.10em] text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50"
              >
                {t("drawer.view_cart")}
              </Link>

              <button
                type="button"
                disabled={lines.length === 0 || payLoading || isCheckoutBlocked}
                onClick={async () => {
                  if (payLoading) return;
                  setPayError(null);
                  setPayLoading(true);

                  const res = await goToCassa(lines, {
                    promotionCode: promoApplied?.code,
                  });
                  if (!res.ok) {
                    setPayError(translateCartCheckoutError(res.message, t));
                    setPayLoading(false);
                    return;
                  }

                  onClose();
                }}
                className="group inline-flex h-10 sm:h-12 w-full items-center justify-center gap-1.5 sm:gap-2 rounded-[5px] bg-emerald-600 px-2 sm:px-4 text-xs sm:text-sm tracking-[0.10em] text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
                data-testid="drawer-go-to-cassa"
              >
                {payLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {t("drawer.redirecting")}
                  </>
                ) : (
                  <>
                    <span className="truncate">{t("drawer.go_to_checkout")}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>

            {isCheckoutBlocked && (
              <p className="mt-2 text-center text-xs text-amber-600 font-semibold">
                {drawerLabels[locale as keyof typeof drawerLabels] || drawerLabels.en}
              </p>
            )}

            <p className="mt-2.5 sm:mt-4 text-[10px] sm:text-xs text-zinc-500">
              {t("drawer.server_note")}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );

  if (!mounted) return null;
  return createPortal(ui, document.body);
}

function CartLineCard({
  line,
  productTitle,
  variantLabel,
  unit,
  lineTotal,
  imageSrc,
  imageAlt,
  maxQty,
  onRemove,
  onDec,
  onInc,
  onChange,
}: {
  line: CartLine;
  productTitle: string;
  variantLabel: string;
  unit: number;
  lineTotal: number;
  imageSrc?: string;
  imageAlt: string;
  maxQty: number;
  onRemove: () => void;
  onDec: () => void;
  onInc: () => void;
  onChange: (next: number) => void;
}) {
  const t = useTranslations("Cart");

  return (
    <Card className="overflow-hidden rounded-[5px] border-[#e8e0d6]/70 bg-white shadow-[0_8px_24px_rgba(24,24,27,0.12),0_1px_3px_rgba(24,24,27,0.08)]">
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-3 sm:gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[5px] bg-transparent sm:h-28 sm:w-28">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(min-width: 640px) 112px, 96px"
                className="object-contain p-1"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-zinc-300" strokeWidth={1.5} />
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="line-clamp-2 font-serif text-[1rem] leading-tight text-zinc-900 sm:text-[1.08rem]">
                  {productTitle}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <div className="max-w-full truncate text-[11px] font-medium tracking-[0.14em] text-[#b86c21] uppercase">
                    {variantLabel}
                  </div>
                  <span className="text-zinc-300">•</span>
                  <div className="text-[11px] text-zinc-500">
                    {unit > 0 ? t("common.per_item_with_price", { price: formatEUR(unit) }) : "--"}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onRemove}
                data-testid="remove-line"
                aria-label={t("actions.remove_product")}
                title={t("common.remove")}
                className="shrink-0 rounded-full text-zinc-400 hover:bg-black/5 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.6} />
              </Button>
            </div>

            <div className="mt-auto pt-4">
              <div className="flex items-center justify-between gap-3 border-t border-[#eee6dc] pt-3">
                <QtyStepper qty={line.qty} maxQty={maxQty} onDec={onDec} onInc={onInc} onChange={onChange} />
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{t("common.total")}</div>
                  <div className="mt-1 font-medium tracking-[0.03em] text-zinc-900">{formatEUR(lineTotal)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QtyStepper({
  qty,
  maxQty,
  onDec,
  onInc,
  onChange,
}: {
  qty: number;
  maxQty: number;
  onDec: () => void;
  onInc: () => void;
  onChange: (next: number) => void;
}) {
  const t = useTranslations("Cart");

  return (
    <div className="flex h-9 items-center overflow-hidden rounded-[5px] border border-black/10 bg-white shadow-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onDec}
        disabled={qty <= 1}
        className="h-9 w-9 rounded-none border-r border-black/5 text-zinc-700 hover:bg-black/5 disabled:opacity-30"
        aria-label={t("actions.decrease_quantity")}
        data-testid="qty-dec"
      >
        <Minus className="h-4 w-4" strokeWidth={1.5} />
      </Button>

      <input
        type="number"
        min={1}
        max={Math.max(1, maxQty)}
        value={qty}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(Number.isFinite(v) ? Math.min(Math.max(1, maxQty), Math.max(1, v)) : 1);
        }}
        className={cn(
          "h-9 w-11 bg-transparent text-center text-sm text-zinc-900 focus:outline-none",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        )}
        aria-label={t("common.quantity")}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onInc}
        disabled={qty >= maxQty}
        className="h-9 w-9 rounded-none border-l border-black/5 text-zinc-700 hover:bg-black/5 disabled:opacity-30"
        aria-label={t("actions.increase_quantity")}
        data-testid="qty-inc"
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} />
      </Button>
    </div>
  );
}
