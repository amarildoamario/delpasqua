"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

import products from "@/db/products.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { translateCartCheckoutError, translateCartPromoError } from "@/lib/cartI18n";
import { goToCassa } from "@/lib/client/goToCassa";
import { formatEUR } from "@/lib/money";
import type { CartLine, Product } from "@/lib/shopTypes";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  PackageOpen,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
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
  const t = useTranslations("Cart");
  const { lines, remove, setQty, clear } = useCart();
  const catalog = products as unknown as Product[];

  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState<PromoResult | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

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
    return lines.map((line) => {
      const product = catalog.find((x) => x.id === line.productId);
      const variant = product?.variants.find((vv) => vv.id === line.variantId);
      return { line, product, variant };
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
      className={["fixed inset-0 z-[9999]", open ? "pointer-events-auto" : "pointer-events-none"].join(" ")}
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
          "fixed right-0 top-0 h-[100dvh] max-h-[100dvh]",
          "w-[min(98vw,820px)] sm:w-[640px] lg:w-[820px]",
          "border-l border-black/10 bg-white shadow-2xl",
          "transition-transform duration-[250ms] ease-out",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-zinc-700" strokeWidth={1.5} />
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
                        {formatEUR(FREE_SHIPPING_THRESHOLD_CENTS)}
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
                <ShoppingBag className="mb-4 h-16 w-16 text-zinc-300" strokeWidth={1.5} />
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
                  const unit = variant?.priceCents ?? 0;
                  const lineTotal = unit * line.qty;
                  const imageSrc = variant?.imageSrc ?? product?.imageSrc;
                  const imageAlt = variant?.imageAlt ?? product?.imageAlt ?? product?.title ?? t("common.product_fallback");

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
                      onRemove={() => remove(line.productId, line.variantId)}
                      onDec={() => setQty(line.productId, line.variantId, Math.max(1, line.qty - 1))}
                      onInc={() => setQty(line.productId, line.variantId, Math.min(99, line.qty + 1))}
                      onChange={(next) => setQty(line.productId, line.variantId, next)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-black/10 bg-white/95 px-6 pb-[calc(34px+env(safe-area-inset-bottom))] pt-5 backdrop-blur">
            {lines.length > 0 && (
              <div className="mb-4">
                {promoApplied ? (
                  <div className="flex items-center justify-between rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-2.5">
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

            <div className="space-y-2 text-sm">
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
                <span>{t("common.vat_estimate")}</span>
                <span className="text-zinc-900">{formatEUR(vat)}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>{t("common.shipping_estimate")}</span>
                <span className={shippingPreview === 0 ? "font-medium text-emerald-600" : "text-zinc-900"}>
                  {shippingPreview === 0 ? t("common.free") : formatEUR(shippingPreview)}
                </span>
              </div>
              {discountCents > 0 && (
                <div className="flex items-center justify-between border-t border-black/10 pt-2 font-medium text-zinc-900">
                  <span>{t("drawer.discounted_total")}</span>
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
                    setPayError(translateCartCheckoutError(res.message, t));
                    setPayLoading(false);
                    return;
                  }

                  onClose();
                }}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm tracking-[0.10em] text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50"
                data-testid="drawer-go-to-cassa"
              >
                {payLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {t("drawer.redirecting")}
                  </>
                ) : (
                  <>
                    {t("drawer.go_to_checkout")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </>
                )}
              </button>

              <Link
                href="/cart"
                onClick={onClose}
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-black/10 bg-white px-4 text-sm tracking-[0.10em] text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50"
              >
                {t("drawer.view_cart")}
              </Link>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
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
  onRemove: () => void;
  onDec: () => void;
  onInc: () => void;
  onChange: (next: number) => void;
}) {
  const t = useTranslations("Cart");

  return (
    <Card className="overflow-hidden rounded-[24px] border-[#e8e0d6] bg-[linear-gradient(180deg,#fffdf9_0%,#faf6f0_100%)] shadow-[0_12px_36px_rgba(24,24,27,0.06)]">
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-3 sm:gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[18px] bg-[#f3ede5] sm:h-28 sm:w-28">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(min-width: 640px) 112px, 96px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-zinc-300" strokeWidth={1.5} />
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
                <QtyStepper qty={line.qty} onDec={onDec} onInc={onInc} onChange={onChange} />
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
  onDec,
  onInc,
  onChange,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
  onChange: (next: number) => void;
}) {
  const t = useTranslations("Cart");

  return (
    <div className="flex h-9 items-center overflow-hidden rounded-[14px] border border-black/10 bg-white shadow-sm">
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
        max={99}
        value={qty}
        onChange={(e) => {
          const v = Number(e.target.value);
          onChange(Number.isFinite(v) ? Math.min(99, Math.max(1, v)) : 1);
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
        disabled={qty >= 99}
        className="h-9 w-9 rounded-none border-l border-black/5 text-zinc-700 hover:bg-black/5 disabled:opacity-30"
        aria-label={t("actions.increase_quantity")}
        data-testid="qty-inc"
      >
        <Plus className="h-4 w-4" strokeWidth={1.5} />
      </Button>
    </div>
  );
}
