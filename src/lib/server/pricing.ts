import products from "@/db/products.json";
import type { Product } from "@/lib/shopTypes";
import { prisma } from "@/lib/server/prisma";
import { calcVatCentsFromSubtotal, getVatRate } from "@/lib/server/vat";

export type PricingInputLine = {
  productId: string;
  variantId: string;
  qty: number;
};

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

  productSnapshot: any;
  pricingSnapshot: any;
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

export async function computeOrderPricing(args: {
  lines: PricingInputLine[];
  promotionCode?: string;
}): Promise<PricingResult> {
  const catalog = products as Product[];

  // 1) righe base (snapshot da catalogo)
  const baseItems = args.lines.map((it) => {
    const p = catalog.find((x) => x.id === it.productId);
    if (!p) throw Object.assign(new Error("Product not found"), { status: 400 });

    const v = p.variants.find((vv) => vv.id === it.variantId);
    if (!v) throw Object.assign(new Error("Variant not found"), { status: 400 });

    const qty = clampInt(it.qty, 1, 99);
    const unitPriceCents = clampInt(v.priceCents, 0, 10_000_000);
    const lineSubtotalCents = unitPriceCents * qty;

    const sku = makeSku(p.id, v.id);

    const productSnapshot = {
      productId: p.id,
      variantId: v.id,
      slug: p.slug,
      category: (p as any).category ?? null,
      title: p.title,
      subtitle: (p as any).subtitle ?? null,
      badge: (p as any).badge ?? null,
      imageSrc: (p as any).imageSrc ?? null,
      imageAlt: (p as any).imageAlt ?? null,
      variantLabel: v.label,
    };

    return {
      productId: p.id,
      variantId: v.id,
      sku,
      imageUrl: (p as any).imageSrc ?? null,

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
    const promo = await prisma.promotion.findUnique({ where: { code } });

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

  // 3) Shipping (mantieni regola attuale, ma promo può azzerare)
  const shippingCents = freeShipping ? 0 : subtotalCents >= 6900 ? 0 : 590;

  // 4) Allocazione sconto per riga
  const weights = baseItems.map((x) => x.lineSubtotalCents);
  const discountAlloc = allocateProportionally(discountCents, weights);
  for (let i = 0; i < baseItems.length; i++) {
    baseItems[i].lineDiscountCents = discountAlloc[i];
  }

  // 5) IVA (adesso come prima: su subtotal). Se vuoi IVA su netto: baseVat = subtotalCents - discountCents
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
