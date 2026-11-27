import type { PrismaClient } from "@/generated/prisma";
import { CHECKOUT_AUDIENCE_TYPES, excludedCheckout } from "./checkoutAudience";
import type { SalesOrderItem } from "./salesMetrics";
import { readVoucherCheckouts } from "./voucherMetrics";
import { readTastingStripeCheckouts } from "./tastingStripeCheckouts";

export const COMMERCIAL_CHANNELS = ["storefront", "quote", "voucher", "tasting"] as const;
export type CommercialChannel = (typeof COMMERCIAL_CHANNELS)[number];

export const COMMERCIAL_CHANNEL_LABELS: Record<CommercialChannel, string> = {
  storefront: "Ecommerce (Shop)",
  quote: "Preventivi PDF",
  voucher: "Voucher degustazione",
  tasting: "Degustazioni dirette",
};

export const ASSUMED_GOODS_MARGIN_RATE = 0.6;

export type CommercialAnalyticsContext = {
  visitorId: string;
  sessionId: string;
  env?: string;
};

export type CommercialTransaction = {
  id: string;
  entityType: "order" | "voucher" | "tasting";
  entityId: string;
  channel: CommercialChannel;
  quoteId: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  createdAt: Date;
  paidAt: Date | null;
  refundedAt: Date | null;
  status: string;
  currency: string;
  originalAmountCents: number;
  paidAmountCents: number;
  refundCents: number;
  subtotalCents: number | null;
  vatCents: number | null;
  shippingCents: number | null;
  discountCents: number | null;
  stripeFeeCents: number | null;
  isTest: boolean;
  excludedCheckout: boolean;
  customerEmail: string | null;
  customerName: string | null;
  userAgent: string | null;
  analyticsContext: CommercialAnalyticsContext | null;
  items: SalesOrderItem[];
};

export type ChannelEconomicsRow = {
  channel: CommercialChannel;
  label: string;
  paidTransactions: number;
  grossRevenueCents: number;
  grossRevenueEur: number;
  refundsInPeriodCents: number;
  refundsInPeriodEur: number;
  cohortRefundsCents: number;
  cohortRefundsEur: number;
  netCashCents: number;
  netCashEur: number;
  averageTransactionCents: number | null;
  averageTransactionEur: number | null;
};

export type CommercialEconomicsSummary = {
  currency: "EUR";
  displayLabel: string;
  paidTransactions: number;
  grossPaymentsCents: number;
  grossPaymentsEur: number;
  refundsInPeriodCents: number;
  refundsInPeriodEur: number;
  cohortRefundsCents: number;
  cohortRefundsEur: number;
  netCashCents: number;
  netCashEur: number;
  averageTransactionCents: number | null;
  averageTransactionEur: number | null;
  revenueByChannel: ChannelEconomicsRow[];
  revenueByChannelMap: Record<CommercialChannel, ChannelEconomicsRow>;
  fiscalBreakdown: {
    goodsGrossCents: number;
    goodsSubtotalCents: number | null;
    goodsDiscountCents: number | null;
    goodsVatCents: number | null;
    shippingCents: number | null;
    voucherGrossCents: number;
    tastingGrossCents: number;
    stripeFeeCents: number | null;
    hasCompleteFiscalData: boolean;
  };
  contributionMargin: {
    status: "estimated" | "unavailable";
    actualMarginCents: null;
    actualMarginEur: null;
    estimatedMarginCents: number | null;
    estimatedMarginEur: number | null;
    netGoodsRevenueCents: number;
    netGoodsRevenueEur: number;
    assumedMarginRate: number;
    appliesTo: "storefront_and_quote_goods_only";
    note: string;
  };
};

export type RawOrderForCommercial = {
  id: string;
  quoteId?: string | null;
  status?: string;
  currency?: string;
  totalCents?: number;
  subtotalCents?: number | null;
  vatCents?: number | null;
  shippingCents?: number | null;
  discountCents?: number | null;
  stripeFeeCents?: number | null;
  refundCents?: number | null;
  createdAt: Date;
  paidAt: Date | null;
  refundedAt?: Date | null;
  isTest: boolean;
  email?: string | null;
  fullName?: string | null;
  userAgent?: string | null;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  items?: SalesOrderItem[];
  events?: { type?: string; metaJson?: string | null }[];
};

export type RawVoucherForCommercial = {
  id: string;
  proposalId?: string | null;
  tastingTitle?: string;
  createdAt: Date;
  paidAt: Date | null;
  failedAt?: Date | null;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  totalCents?: number;
  email?: string | null;
  fullName?: string | null;
  isTest: boolean;
};

export type RawTastingForCommercial = {
  id: string;
  createdAt: Date;
  paidAt: Date | null;
  status?: string;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  totalCents?: number;
  email?: string | null;
  fullName?: string | null;
  isTest: boolean;
};

function centsToEur(cents: number): number {
  return +(cents / 100).toFixed(2);
}

function normalizeEmail(email?: string | null): string | null {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  return normalized || null;
}

function extractAnalyticsContext(
  events?: { type?: string; metaJson?: string | null }[],
): CommercialAnalyticsContext | null {
  for (const ev of events ?? []) {
    if (ev.type && ev.type !== "ANALYTICS_CONTEXT") continue;
    try {
      const parsed = JSON.parse(ev.metaJson ?? "null");
      if (typeof parsed?.visitorId === "string" && typeof parsed?.sessionId === "string") {
        return {
          visitorId: parsed.visitorId,
          sessionId: parsed.sessionId,
          env: typeof parsed.env === "string" ? parsed.env : undefined,
        };
      }
    } catch {
      /* Ignore malformed JSON */
    }
  }
  return null;
}

export function normalizeCommercialTransactions(input: {
  orders?: RawOrderForCommercial[];
  vouchers?: RawVoucherForCommercial[];
  directTastings?: RawTastingForCommercial[];
}): CommercialTransaction[] {
  const result: CommercialTransaction[] = [];
  const seenIds = new Set<string>();
  const seenPaymentIntents = new Set<string>();

  const pushUnique = (tx: CommercialTransaction) => {
    if (tx.isTest) return;
    if (seenIds.has(tx.id)) return;
    if (tx.stripePaymentIntentId && tx.paidAt) {
      if (seenPaymentIntents.has(tx.stripePaymentIntentId)) return;
      seenPaymentIntents.add(tx.stripePaymentIntentId);
    }
    seenIds.add(tx.id);
    result.push(tx);
  };

  for (const o of input.orders ?? []) {
    const channel: CommercialChannel = o.quoteId ? "quote" : "storefront";
    const totalCents = Math.max(0, Math.round(o.totalCents ?? 0));
    const paidAmountCents = o.paidAt ? totalCents : 0;
    const rawRefund = Math.max(0, Math.round(o.refundCents ?? 0));
    const refundCents = o.paidAt ? Math.min(paidAmountCents, rawRefund) : 0;
    pushUnique({
      id: o.id,
      entityType: "order",
      entityId: o.id,
      channel,
      quoteId: o.quoteId ?? null,
      stripeCheckoutSessionId: o.stripeCheckoutSessionId ?? null,
      stripePaymentIntentId: o.stripePaymentIntentId ?? null,
      createdAt: o.createdAt,
      paidAt: o.paidAt,
      refundedAt: o.refundedAt ?? null,
      status: o.status ?? (o.paidAt ? "PAGATO" : "IN_ATTESA"),
      currency: (o.currency ?? "eur").toUpperCase(),
      originalAmountCents: totalCents,
      paidAmountCents,
      refundCents,
      subtotalCents: o.subtotalCents !== undefined && o.subtotalCents !== null ? Math.round(o.subtotalCents) : null,
      vatCents: o.vatCents !== undefined && o.vatCents !== null ? Math.round(o.vatCents) : null,
      shippingCents: o.shippingCents !== undefined && o.shippingCents !== null ? Math.round(o.shippingCents) : null,
      discountCents: o.discountCents !== undefined && o.discountCents !== null ? Math.round(o.discountCents) : null,
      stripeFeeCents: o.stripeFeeCents !== undefined && o.stripeFeeCents !== null ? Math.round(o.stripeFeeCents) : null,
      isTest: Boolean(o.isTest),
      excludedCheckout: excludedCheckout({
        paidAt: o.paidAt,
        events: (o.events ?? []).map((e) => ({ type: e.type ?? "", metaJson: e.metaJson ?? null })),
      }),
      customerEmail: normalizeEmail(o.email),
      customerName: o.fullName?.trim() || null,
      userAgent: o.userAgent ?? null,
      analyticsContext: extractAnalyticsContext(o.events),
      items: o.items ?? [],
    });
  }

  for (const v of input.vouchers ?? []) {
    const totalCents = Math.max(0, Math.round(v.totalCents ?? 0));
    const paidAmountCents = v.paidAt ? totalCents : 0;
    const id = v.id.startsWith("voucher:") ? v.id : `voucher:${v.id}`;
    pushUnique({
      id,
      entityType: "voucher",
      entityId: v.id.replace(/^voucher:/, ""),
      channel: "voucher",
      quoteId: null,
      stripeCheckoutSessionId: v.stripeCheckoutSessionId ?? null,
      stripePaymentIntentId: v.stripePaymentIntentId ?? null,
      createdAt: v.createdAt,
      paidAt: v.paidAt,
      refundedAt: null,
      status: v.paidAt ? "PAGATO" : v.failedAt ? "SCADUTO" : "IN_ATTESA",
      currency: "EUR",
      originalAmountCents: totalCents,
      paidAmountCents,
      refundCents: 0,
      subtotalCents: null,
      vatCents: null,
      shippingCents: 0,
      discountCents: 0,
      stripeFeeCents: null,
      isTest: Boolean(v.isTest),
      excludedCheckout: false,
      customerEmail: normalizeEmail(v.email),
      customerName: v.fullName?.trim() || null,
      userAgent: null,
      analyticsContext: null,
      items: [],
    });
  }

  for (const t of input.directTastings ?? []) {
    const totalCents = Math.max(0, Math.round(t.totalCents ?? 0));
    const paidAmountCents = t.paidAt ? totalCents : 0;
    const id = t.id.startsWith("tasting:") ? t.id : `tasting:${t.id}`;
    pushUnique({
      id,
      entityType: "tasting",
      entityId: t.id.replace(/^tasting:/, ""),
      channel: "tasting",
      quoteId: null,
      stripeCheckoutSessionId: t.stripeCheckoutSessionId ?? null,
      stripePaymentIntentId: t.stripePaymentIntentId ?? null,
      createdAt: t.createdAt,
      paidAt: t.paidAt,
      refundedAt: null,
      status: t.paidAt ? "PAGATO" : (t.status ?? "IN_ATTESA"),
      currency: "EUR",
      originalAmountCents: totalCents,
      paidAmountCents,
      refundCents: 0,
      subtotalCents: null,
      vatCents: null,
      shippingCents: 0,
      discountCents: 0,
      stripeFeeCents: null,
      isTest: Boolean(t.isTest),
      excludedCheckout: false,
      customerEmail: normalizeEmail(t.email),
      customerName: t.fullName?.trim() || null,
      userAgent: null,
      analyticsContext: null,
      items: [],
    });
  }

  return result;
}

export function summarizeCommercialEconomics(
  transactions: CommercialTransaction[],
  start: Date,
  endExclusive: Date,
): CommercialEconomicsSummary {
  const inPeriod = (date: Date | null) => date !== null && date >= start && date < endExclusive;

  const channelAcc = new Map<CommercialChannel, {
    paidTransactions: number;
    grossRevenueCents: number;
    refundsInPeriodCents: number;
    cohortRefundsCents: number;
  }>();
  for (const ch of COMMERCIAL_CHANNELS) {
    channelAcc.set(ch, {
      paidTransactions: 0,
      grossRevenueCents: 0,
      refundsInPeriodCents: 0,
      cohortRefundsCents: 0,
    });
  }

  let goodsGrossCents = 0;
  let goodsSubtotalCents = 0;
  let goodsDiscountCents = 0;
  let goodsVatCents = 0;
  let shippingCents = 0;
  let stripeFeeCents = 0;
  let hasMissingSubtotal = false;
  let hasMissingVat = false;
  let hasMissingShipping = false;
  let hasMissingStripeFee = false;
  let voucherGrossCents = 0;
  let tastingGrossCents = 0;
  let netGoodsRevenueCents = 0;

  for (const tx of transactions) {
    if (tx.isTest) continue;
    const acc = channelAcc.get(tx.channel)!;

    // 1. Gross payments in period (strictly by paidAt)
    if (inPeriod(tx.paidAt)) {
      acc.paidTransactions += 1;
      acc.grossRevenueCents += tx.paidAmountCents;
      acc.cohortRefundsCents += tx.refundCents;

      if (tx.channel === "voucher") {
        voucherGrossCents += tx.paidAmountCents;
      } else if (tx.channel === "tasting") {
        tastingGrossCents += tx.paidAmountCents;
      } else {
        goodsGrossCents += tx.paidAmountCents;
        const sub = tx.subtotalCents ?? tx.paidAmountCents;
        const disc = tx.discountCents ?? 0;
        netGoodsRevenueCents += Math.max(0, sub - disc);

        if (tx.subtotalCents === null) hasMissingSubtotal = true;
        else goodsSubtotalCents += tx.subtotalCents;

        if (tx.discountCents !== null) goodsDiscountCents += tx.discountCents;

        if (tx.vatCents === null) hasMissingVat = true;
        else goodsVatCents += tx.vatCents;

        if (tx.shippingCents === null) hasMissingShipping = true;
        else shippingCents += tx.shippingCents;

        if (tx.stripeFeeCents === null) hasMissingStripeFee = true;
        else stripeFeeCents += tx.stripeFeeCents;
      }
    }

    // 2. Cash-flow refunds in period (by refundedAt, including refunds of prior-period orders)
    if (tx.refundCents > 0 && inPeriod(tx.refundedAt)) {
      acc.refundsInPeriodCents += tx.refundCents;
    }
  }

  const revenueByChannel: ChannelEconomicsRow[] = COMMERCIAL_CHANNELS.map((channel) => {
    const acc = channelAcc.get(channel)!;
    const netCashCents = acc.grossRevenueCents - acc.refundsInPeriodCents;
    const avgCents = acc.paidTransactions > 0 ? Math.round(acc.grossRevenueCents / acc.paidTransactions) : null;
    return {
      channel,
      label: COMMERCIAL_CHANNEL_LABELS[channel],
      paidTransactions: acc.paidTransactions,
      grossRevenueCents: acc.grossRevenueCents,
      grossRevenueEur: centsToEur(acc.grossRevenueCents),
      refundsInPeriodCents: acc.refundsInPeriodCents,
      refundsInPeriodEur: centsToEur(acc.refundsInPeriodCents),
      cohortRefundsCents: acc.cohortRefundsCents,
      cohortRefundsEur: centsToEur(acc.cohortRefundsCents),
      netCashCents,
      netCashEur: centsToEur(netCashCents),
      averageTransactionCents: avgCents,
      averageTransactionEur: acc.paidTransactions > 0 ? +((acc.grossRevenueCents / 100) / acc.paidTransactions).toFixed(2) : null,
    };
  });

  const revenueByChannelMap = Object.fromEntries(
    revenueByChannel.map((row) => [row.channel, row]),
  ) as Record<CommercialChannel, ChannelEconomicsRow>;

  const paidTransactions = revenueByChannel.reduce((s, r) => s + r.paidTransactions, 0);
  const grossPaymentsCents = revenueByChannel.reduce((s, r) => s + r.grossRevenueCents, 0);
  const refundsInPeriodCents = revenueByChannel.reduce((s, r) => s + r.refundsInPeriodCents, 0);
  const cohortRefundsCents = revenueByChannel.reduce((s, r) => s + r.cohortRefundsCents, 0);
  const netCashCents = grossPaymentsCents - refundsInPeriodCents;
  const averageTransactionCents = paidTransactions > 0 ? Math.round(grossPaymentsCents / paidTransactions) : null;
  const averageTransactionEur = paidTransactions > 0 ? +((grossPaymentsCents / 100) / paidTransactions).toFixed(2) : null;

  const hasGoodsPaid = (revenueByChannelMap.storefront.paidTransactions + revenueByChannelMap.quote.paidTransactions) > 0;
  const hasCompleteFiscalData = hasGoodsPaid && !hasMissingSubtotal && !hasMissingVat && !hasMissingShipping && voucherGrossCents === 0 && tastingGrossCents === 0;
  const estimatedMarginCents = hasGoodsPaid ? Math.round(netGoodsRevenueCents * ASSUMED_GOODS_MARGIN_RATE) : null;

  return {
    currency: "EUR",
    displayLabel: hasCompleteFiscalData ? "Incassi commerciali (con dettaglio fiscale)" : "Incassi commerciali",
    paidTransactions,
    grossPaymentsCents,
    grossPaymentsEur: centsToEur(grossPaymentsCents),
    refundsInPeriodCents,
    refundsInPeriodEur: centsToEur(refundsInPeriodCents),
    cohortRefundsCents,
    cohortRefundsEur: centsToEur(cohortRefundsCents),
    netCashCents,
    netCashEur: centsToEur(netCashCents),
    averageTransactionCents,
    averageTransactionEur,
    revenueByChannel,
    revenueByChannelMap,
    fiscalBreakdown: {
      goodsGrossCents,
      goodsSubtotalCents: hasGoodsPaid && !hasMissingSubtotal ? goodsSubtotalCents : null,
      goodsDiscountCents: hasGoodsPaid ? goodsDiscountCents : null,
      goodsVatCents: hasGoodsPaid && !hasMissingVat ? goodsVatCents : null,
      shippingCents: hasGoodsPaid && !hasMissingShipping ? shippingCents : null,
      voucherGrossCents,
      tastingGrossCents,
      stripeFeeCents: hasGoodsPaid && !hasMissingStripeFee ? stripeFeeCents : null,
      hasCompleteFiscalData,
    },
    contributionMargin: {
      status: estimatedMarginCents !== null ? "estimated" : "unavailable",
      actualMarginCents: null,
      actualMarginEur: null,
      estimatedMarginCents,
      estimatedMarginEur: estimatedMarginCents !== null ? centsToEur(estimatedMarginCents) : null,
      netGoodsRevenueCents,
      netGoodsRevenueEur: centsToEur(netGoodsRevenueCents),
      assumedMarginRate: ASSUMED_GOODS_MARGIN_RATE,
      appliesTo: "storefront_and_quote_goods_only",
      note: "Stima ipotetica al 60% sui soli beni (shop e preventivi); esclusi voucher e degustazioni. I costi reali di produzione/COGS non sono registrati nel database.",
    },
  };
}

export async function readCommercialTransactions(
  db: Pick<PrismaClient, "order"> & Partial<Pick<PrismaClient, "tastingVoucherCheckout" | "tastingBooking" | "stripeWebhookEvent">>,
  start: Date,
  endExclusive: Date,
  voucherCheckoutsPromise = readVoucherCheckouts(db, start, endExclusive),
): Promise<CommercialTransaction[]> {
  const range = { gte: start, lt: endExclusive };
  const [orders, vouchers, tastingCheckouts] = await Promise.all([
    db.order.findMany({
      where: {
        isTest: false,
        OR: [
          { paidAt: range },
          { createdAt: range },
          { refundedAt: range },
        ],
      },
      select: {
        id: true,
        quoteId: true,
        status: true,
        currency: true,
        totalCents: true,
        subtotalCents: true,
        vatCents: true,
        shippingCents: true,
        discountCents: true,
        stripeFeeCents: true,
        refundCents: true,
        createdAt: true,
        paidAt: true,
        refundedAt: true,
        isTest: true,
        email: true,
        fullName: true,
        userAgent: true,
        stripeCheckoutSessionId: true,
        stripePaymentIntentId: true,
        items: {
          select: {
            productId: true,
            variantId: true,
            qty: true,
            sku: true,
            unitPriceCents: true,
            lineTotalCents: true,
          },
        },
        events: {
          where: { type: { in: ["ANALYTICS_CONTEXT", ...CHECKOUT_AUDIENCE_TYPES] } },
          select: { type: true, metaJson: true },
        },
      },
    }),
    voucherCheckoutsPromise,
    voucherCheckoutsPromise.then((v) => readTastingStripeCheckouts(db, v, start, endExclusive)),
  ]);

  const directTastings: RawTastingForCommercial[] = tastingCheckouts
    .filter((c) => c.channel === "tasting")
    .map((c) => ({
      id: c.id,
      createdAt: c.createdAt,
      paidAt: c.paidAt,
      status: c.status,
      stripeCheckoutSessionId: c.stripeCheckoutSessionId,
      totalCents: c.totalCents ?? 0,
      email: c.email ?? null,
      isTest: c.isTest,
    }));

  return normalizeCommercialTransactions({
    orders,
    vouchers,
    directTastings,
  });
}
