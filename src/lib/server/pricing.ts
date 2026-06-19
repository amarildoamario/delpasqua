import type { ProductMerch } from "@/generated/prisma";
import { makeInventorySku } from "@/lib/inventorySku";
import { readCatalog } from "@/lib/server/catalog";
import { prisma } from "@/lib/server/prisma";
import { evaluatePromotionEligibility } from "@/lib/server/promotionUsage";
import { getStoreSettings } from "@/lib/server/settings";
import { calcVatCentsFromSubtotal } from "@/lib/server/vat";
import type { Product } from "@/lib/shopTypes";
import { getShippingRule } from "@/lib/shippingConfig";

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

function getOptionalString(obj: unknown, key: string): string | null {
  if (!obj || typeof obj !== "object") return null;
  const v = (obj as Record<string, unknown>)[key];
  return typeof v === "string" && v.length > 0 ? v : null;
}

function getOptionalBoolean(obj: unknown, key: string): boolean | null {
  if (!obj || typeof obj !== "object") return null;
  const v = (obj as Record<string, unknown>)[key];
  return typeof v === "boolean" ? v : null;
}

function isActiveWithinWindow(args: {
  startsAt: Date | null;
  endsAt: Date | null;
  now?: Date;
}) {
  const now = args.now ?? new Date();
  const startsOk = !args.startsAt || args.startsAt <= now;
  const endsOk = !args.endsAt || args.endsAt >= now;
  return startsOk && endsOk;
}

function applyProductMerchDiscount(unitPriceCents: number, merch: ProductMerch | null) {
  if (!merch) return unitPriceCents;

  let next = unitPriceCents;
  const percent = clampInt(merch.discountPercent ?? 0, 0, 100);
  const fixed = clampInt(merch.discountCents ?? 0, 0, 10_000_000);

  if (percent > 0) {
    next = Math.round((next * (100 - percent)) / 100);
  }

  if (fixed > 0) {
    next = Math.max(0, next - fixed);
  }

  return clampInt(next, 0, 10_000_000);
}

export async function computeOrderPricing(args: {
  lines: PricingInputLine[];
  promotionCode?: string;
  countryCode?: string;
}): Promise<PricingResult> {
  const countryCode = args.countryCode || "IT";
  const catalog = (await readCatalog()) as unknown as Product[];
  const now = new Date();
  const productKeys = [...new Set(args.lines.map((line) => line.productId))];
  const merchRows = productKeys.length
    ? await prisma.productMerch.findMany({
        where: {
          productKey: {
            in: productKeys,
          },
        },
      })
    : [];
  const merchByProductKey = new Map(
    merchRows
      .filter((row) => isActiveWithinWindow({ startsAt: row.startsAt, endsAt: row.endsAt, now }))
      .map((row) => [row.productKey, row])
  );

  const baseItems: PricingResultItem[] = args.lines.map((it) => {
    const p = catalog.find((x) => x.id === it.productId);
    if (!p) throw Object.assign(new Error("Product not found"), { status: 400 });

    const v = p.variants.find((vv) => vv.id === it.variantId);
    if (!v) throw Object.assign(new Error("Variant not found"), { status: 400 });

    const qty = clampInt(it.qty, 1, 99);
    const baseUnitPriceCents = clampInt(v.priceCents, 0, 10_000_000);
    const merch = merchByProductKey.get(p.id) ?? null;
    const unitPriceCents = applyProductMerchDiscount(baseUnitPriceCents, merch);
    const lineSubtotalCents = unitPriceCents * qty;

    const sku = makeInventorySku(p.id, v.id, v.sku);
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
      variantImageSrc: variantImageSrc ?? null,
      variantLabel: v.label,
    };

    return {
      productId: p.id,
      variantId: v.id,
      sku,
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
      pricingSnapshot: {
        baseUnitPriceCents,
        productMerch: merch
          ? {
              productKey: merch.productKey,
              discountPercent: merch.discountPercent,
              discountCents: merch.discountCents,
              promoLabel: merch.promoLabel,
              startsAt: merch.startsAt?.toISOString() ?? null,
              endsAt: merch.endsAt?.toISOString() ?? null,
            }
          : null,
      },
    };
  });

  const subtotalCents = baseItems.reduce((s, x) => s + x.lineSubtotalCents, 0);

  let promotionApplied: PricingResult["promotionApplied"] = null;
  let discountCents = 0;
  let freeShipping = false;

  if (args.promotionCode) {
    const eligibility = await evaluatePromotionEligibility(prisma, {
      code: args.promotionCode,
      subtotalCents,
      now,
    });

    if (eligibility.ok) {
      const promo = eligibility.promo;
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

  const settings = await getStoreSettings();
  const shippingRule = getShippingRule(countryCode);

  const hasProductWithFreeShipping = baseItems.some((item) => {
    const prod = catalog.find((x) => x.id === item.productId);
    return getOptionalBoolean(prod, "freeShipping") === true;
  });
  const orderFreeShipping = freeShipping || hasProductWithFreeShipping;

  let shippingCents = 0;
  if (!orderFreeShipping) {
    const isItaly = countryCode.toUpperCase() === "IT";
    if (isItaly) {
      shippingCents = subtotalCents >= shippingRule.freeShippingThresholdCents
        ? 0
        : shippingRule.shippingFlatCents;
    } else {
      // International order
      if (subtotalCents > 50000) {
        // High value order (>500.00 EUR) overrides
        if (countryCode.toUpperCase() === "US") {
          shippingCents = 6000; // Flat 60 EUR
        } else {
          shippingCents = 3000; // Flat 30 EUR for Europe
        }
      } else {
        // Under 500.00 EUR: dynamic weight calculation
        if (subtotalCents >= shippingRule.freeShippingThresholdCents) {
          shippingCents = 0;
        } else {
          // Compute mock package weight
          let totalWeightKg = 0;
          for (const item of baseItems) {
            const vId = item.variantId.toLowerCase();
            const label = item.variantLabel.toLowerCase();
            let itemWeight = 1.0; // default 1 kg per item
            
            if (vId.includes("250") || label.includes("250")) itemWeight = 0.25;
            else if (vId.includes("500") || label.includes("500")) itemWeight = 0.5;
            else if (vId.includes("750") || label.includes("750")) itemWeight = 0.75;
            else if (vId.includes("1lt") || vId.includes("1l") || label.includes("1l") || label.includes("1 l")) itemWeight = 1.0;
            else if (vId.includes("3lt") || vId.includes("3l") || label.includes("3l") || label.includes("3 l")) itemWeight = 3.0;
            else if (vId.includes("5lt") || vId.includes("5l") || label.includes("5l") || label.includes("5 l")) itemWeight = 5.0;
            
            totalWeightKg += itemWeight * item.qty;
          }

          const isUS = countryCode.toUpperCase() === "US";
          const extraCentsPerKg = isUS ? 300 : 150; // 3 EUR/kg for US, 1.50 EUR/kg for Europe
          shippingCents = shippingRule.shippingFlatCents + Math.round(extraCentsPerKg * totalWeightKg);
        }
      }
    }
  }

  const weights = baseItems.map((x) => x.lineSubtotalCents);
  const discountAlloc = allocateProportionally(discountCents, weights);
  for (let i = 0; i < baseItems.length; i++) {
    baseItems[i].lineDiscountCents = discountAlloc[i];
  }

  const baseVat = Math.max(0, subtotalCents - discountCents);
  const vatRate = settings.vatRatePercent / 100;
  const vatCents = calcVatCentsFromSubtotal(baseVat, vatRate);

  const netWeights = baseItems.map((x) => x.lineSubtotalCents - x.lineDiscountCents);
  const vatAlloc = allocateProportionally(vatCents, netWeights);
  for (let i = 0; i < baseItems.length; i++) {
    baseItems[i].lineVatCents = vatAlloc[i];
  }

  const taxCents = 0;
  const taxAlloc = allocateProportionally(taxCents, weights);
  for (let i = 0; i < baseItems.length; i++) {
    baseItems[i].lineTaxCents = taxAlloc[i];
  }

  const vatRateBps = Math.round(vatRate * 10_000);
  for (const it of baseItems) {
    const lineTotalCents = it.lineSubtotalCents - it.lineDiscountCents + it.lineTaxCents;
    const lineNetCents = lineTotalCents - it.lineVatCents - it.lineTaxCents;

    it.lineTotalCents = lineTotalCents;
    it.pricingSnapshot = {
      ...(it.pricingSnapshot as JsonObject),
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

  const totalCents = subtotalCents + shippingCents - discountCents + taxCents;

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
