import products from "@/db/products.json";
import type { Product } from "@/lib/shopTypes";
import { prisma } from "@/lib/server/prisma";
import { calcVatCentsFromSubtotal, getVatRate } from "@/lib/server/vat";
import type { Promotion } from "@/generated/prisma";

// ─── Promotion cache (in-memory, TTL 60s) ──────────────────────────────────
// Evita una query findUnique per ogni tentativo di checkout con codice promo.
const PROMO_CACHE_TTL_MS = 60_000;
interface PromoCacheEntry { promo: Promotion | null; cachedAt: number }
const promoCache = new Map<string, PromoCacheEntry>();

async function findPromotion(code: string): Promise<Promotion | null> {
  const entry = promoCache.get(code);
  if (entry && Date.now() - entry.cachedAt < PROMO_CACHE_TTL_MS) return entry.promo;
  const promo = await prisma.promotion.findUnique({ where: { code } });
  promoCache.set(code, { promo, cachedAt: Date.now() });
  return promo;
}

export type PricingInputLine = {
  productId: string;
  variantId: string;
  qty: number;
};

type JsonObject = Record<string, unknown>;

export type PricingResultItem = {
  productId: string;
  variantId: string;

  sku: string;
  imageUrl?: string | null;

  title: string;
  variantLabel: string;

  unitPriceCents: number;
  qty: number;

  lineSubtotalCents: number;
  lineDiscountCents: number;
  lineVatCents: number;
  lineTaxCents: number;

  lineTotalCents: number;

  productSnapshot: JsonObject;
  pricingSnapshot: JsonObject;
};

export type PricingResult = {
  items: PricingResultItem[];

  subtotalCents: number;
  discountCents: number;
  vatCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;

  promotionApplied: null | {
    code: string;
    type: string;
    percent?: number | null;
    amountCents?: number | null;
    freeShipping?: boolean;
  };
};

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

/** Allocazione proporzionale mantenendo somma esatta (largest remainder). */
function allocateProportionally(total: number, weights: number[]) {
  if (total <= 0) return weights.map(() => 0);
  const sumW = weights.reduce((a, b) => a + b, 0);
  if (sumW <= 0) return weights.map(() => 0);

  const raw = weights.map((w) => (total * w) / sumW);
  const base = raw.map((x) => Math.floor(x));
  let remainder = total - base.reduce((a, b) => a + b, 0);

  const fracIdx = raw
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac);

  const out = [...base];
  for (let k = 0; k < fracIdx.length && remainder > 0; k++) {
    out[fracIdx[k].i] += 1;
    remainder -= 1;
  }
  return out;
}

function makeSku(productId: string, variantId: string) {
  // SKU deterministico e stabile anche se cambi catalogo: ottimo baseline
  return `${productId}:${variantId}`;
}

function getOptionalString(obj: unknown, key: string): string | null {
  if (!obj || typeof obj !== "object") return null;
  const v = (obj as Record<string, unknown>)[key];
  return typeof v === "string" && v.length > 0 ? v : null;
}

export async function computeOrderPricing(args: {
  lines: PricingInputLine[];
  promotionCode?: string;
}): Promise<PricingResult> {
  const catalog = products as unknown as Product[];

  // 1) righe base (snapshot da catalogo)
  const baseItems: PricingResultItem[] = args.lines.map((it) => {
    const p = catalog.find((x) => x.id === it.productId);
    if (!p) throw Object.assign(new Error("Product not found"), { status: 400 });

    const v = p.variants.find((vv) => vv.id === it.variantId);
    if (!v) throw Object.assign(new Error("Variant not found"), { status: 400 });

    const qty = clampInt(it.qty, 1, 99);
    const unitPriceCents = clampInt(v.priceCents, 0, 10_000_000);
    const lineSubtotalCents = unitPriceCents * qty;

    const sku = makeSku(p.id, v.id);

    // ✅ FIX: immagine variante -> fallback prodotto (senza any)
    const variantImageSrc = getOptionalString(v as unknown, "imageSrc");
    const productImageSrc = getOptionalString(p as unknown, "imageSrc");

    const productSnapshot: JsonObject = {
      productId: p.id,
      variantId: v.id,
      slug: p.slug,
      category: getOptionalString(p as unknown, "category"),
      title: p.title,
      subtitle: getOptionalString(p as unknown, "subtitle"),
      badge: getOptionalString(p as unknown, "badge"),

      imageSrc: productImageSrc ?? null,
      imageAlt: getOptionalString(p as unknown, "imageAlt"),

      // ✅ aggiungo anche la variante nello snapshot
      variantImageSrc: variantImageSrc ?? null,

      variantLabel: v.label,
    };

    return {
      productId: p.id,
      variantId: v.id,
      sku,

      // ✅ qui ora salva la variante corretta
      imageUrl: variantImageSrc ?? productImageSrc ?? null,

      title: p.title,
      variantLabel: v.label,

      unitPriceCents,
      qty,

      lineSubtotalCents,
      lineDiscountCents: 0,
      lineVatCents: 0,
      lineTaxCents: 0,
      lineTotalCents: lineSubtotalCents,

      productSnapshot,
      pricingSnapshot: {},
    };
  });

  const subtotalCents = baseItems.reduce((s, x) => s + x.lineSubtotalCents, 0);

  // 2) Promo (se presente)
  let promotionApplied: PricingResult["promotionApplied"] = null;
  let discountCents = 0;
  let freeShipping = false;

  if (args.promotionCode) {
    const code = args.promotionCode.trim().toUpperCase();
    const promo = await findPromotion(code);

    if (promo && promo.isActive) {
      const now = new Date();
      const startsOk = !promo.startsAt || promo.startsAt <= now;
      const endsOk = !promo.endsAt || promo.endsAt >= now;
      const minOk = !promo.minOrderCents || subtotalCents >= promo.minOrderCents;
      const usageOk = !promo.usageLimit || promo.usedCount < promo.usageLimit;

      if (startsOk && endsOk && minOk && usageOk) {
        if (promo.freeShipping || promo.type === "free_shipping") freeShipping = true;

        if (promo.type === "percent" && promo.percent) {
          discountCents = Math.round((subtotalCents * promo.percent) / 100);
        } else if (promo.type === "fixed" && promo.amountCents) {
          discountCents = promo.amountCents;
        }

        discountCents = clampInt(discountCents, 0, subtotalCents);

        promotionApplied = {
          code: promo.code,
          type: promo.type,
          percent: promo.percent,
          amountCents: promo.amountCents,
          freeShipping: promo.freeShipping || promo.type === "free_shipping",
        };
      }
    }
  }

  // 3) Shipping
  const shippingCents = freeShipping ? 0 : subtotalCents >= 6900 ? 0 : 590;

  // 4) Allocazione sconto per riga
  const weights = baseItems.map((x) => x.lineSubtotalCents);
  const discountAlloc = allocateProportionally(discountCents, weights);
  for (let i = 0; i < baseItems.length; i++) {
    baseItems[i].lineDiscountCents = discountAlloc[i];
  }

  // 5) IVA (come prima: su subtotal)
  const baseVat = subtotalCents;
  const vatCents = calcVatCentsFromSubtotal(baseVat);

  const vatAlloc = allocateProportionally(vatCents, weights);
  for (let i = 0; i < baseItems.length; i++) {
    baseItems[i].lineVatCents = vatAlloc[i];
  }

  // 6) Tax extra (placeholder)
  const taxCents = 0;
  const taxAlloc = allocateProportionally(taxCents, weights);
  for (let i = 0; i < baseItems.length; i++) {
    baseItems[i].lineTaxCents = taxAlloc[i];
  }

  // 7) Totali riga + pricing snapshot
  const vatRateBps = Math.round(getVatRate() * 10_000);
  for (const it of baseItems) {
    const lineNetCents = it.lineSubtotalCents - it.lineDiscountCents;
    const lineTotalCents = lineNetCents + it.lineVatCents + it.lineTaxCents;

    it.lineTotalCents = lineTotalCents;
    it.pricingSnapshot = {
      unitPriceCents: it.unitPriceCents,
      qty: it.qty,
      lineSubtotalCents: it.lineSubtotalCents,
      lineDiscountCents: it.lineDiscountCents,
      lineNetCents,
      vatRateBps,
      lineVatCents: it.lineVatCents,
      lineTaxCents: it.lineTaxCents,
      lineTotalCents,
      promotionCode: promotionApplied?.code ?? null,
    };
  }

  const totalCents = subtotalCents + vatCents + shippingCents - discountCents + taxCents;

  return {
    items: baseItems,
    subtotalCents,
    discountCents,
    vatCents,
    taxCents,
    shippingCents,
    totalCents,
    promotionApplied,
  };
}