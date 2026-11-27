import { metricsMonthKey } from "./salesMetrics";
import { estimateStripeFeeCents } from "./tastingLedger";
import { tastingVatCents } from "./tastingVat";
import { calcVatCentsFromSubtotal } from "./vat";

export type DashboardFinanceOrder = {
  createdAt: Date;
  totalCents: number;
  subtotalCents: number;
  shippingCents: number;
  vatCents: number;
  stripeFeeCents: number;
};

export type DashboardFinanceVoucher = {
  paidAt: Date;
  totalCents: number;
};

export type MonthlyFinanceOverride = {
  manualGrossCents?: number;
  manualGlsCents?: number;
  manualVatCents?: number;
  manualStripeFeeCents?: number;
};

type MonthTotals = {
  gross: number;
  shipping: number;
  vat: number;
  stripe: number;
  leonardo: number;
};

function deriveOrderVatCents(
  order: Pick<DashboardFinanceOrder, "vatCents" | "subtotalCents">,
  vatRatePercent: number,
) {
  if (order.vatCents > 0) return order.vatCents;
  return calcVatCentsFromSubtotal(order.subtotalCents, vatRatePercent / 100);
}

function addToMonth(map: Record<string, MonthTotals>, monthKey: string, entry: MonthTotals) {
  const bucket = (map[monthKey] ??= { gross: 0, shipping: 0, vat: 0, stripe: 0, leonardo: 0 });
  bucket.gross += entry.gross;
  bucket.shipping += entry.shipping;
  bucket.vat += entry.vat;
  bucket.stripe += entry.stripe;
  bucket.leonardo += entry.leonardo;
}

export function computeDashboardFinance(args: {
  monthlyOrders: readonly DashboardFinanceOrder[];
  monthlyVouchers: readonly DashboardFinanceVoucher[];
  overrides: Record<string, MonthlyFinanceOverride | undefined>;
  vatRatePercent: number;
  start: Date;
  endExclusive: Date;
}) {
  const { monthlyOrders, monthlyVouchers, overrides, vatRatePercent, start, endExclusive } = args;

  const entries: Array<{ at: Date } & MonthTotals> = [
    ...monthlyOrders.map((order) => ({
      at: new Date(order.createdAt),
      gross: order.totalCents,
      shipping: order.shippingCents,
      vat: deriveOrderVatCents(order, vatRatePercent),
      stripe: order.stripeFeeCents > 0 ? order.stripeFeeCents : estimateStripeFeeCents(order.totalCents),
      leonardo: Math.round(order.totalCents * 0.1),
    })),
    ...monthlyVouchers.map((voucher) => ({
      at: new Date(voucher.paidAt),
      gross: voucher.totalCents,
      shipping: 0,
      vat: tastingVatCents(voucher.totalCents),
      stripe: estimateStripeFeeCents(voucher.totalCents),
      leonardo: Math.round(voucher.totalCents * 0.1),
    })),
  ];

  const monthsDbTotals: Record<string, MonthTotals> = {};
  const rangeDbTotals: Record<string, MonthTotals> = {};

  for (const entry of entries) {
    const monthKey = metricsMonthKey(entry.at);
    addToMonth(monthsDbTotals, monthKey, entry);
    if (entry.at >= start && entry.at < endExclusive) {
      addToMonth(rangeDbTotals, monthKey, entry);
    }
  }

  let revenueCents = 0;
  let shippingCents = 0;
  let vatCents = 0;
  let stripeCents = 0;
  let leonardoCents = 0;

  for (const [monthKey, rDb] of Object.entries(rangeDbTotals)) {
    const ov = overrides[monthKey] ?? {};
    const mDb = monthsDbTotals[monthKey];
    const hasOverrides =
      ov.manualGrossCents !== undefined ||
      ov.manualGlsCents !== undefined ||
      ov.manualVatCents !== undefined ||
      ov.manualStripeFeeCents !== undefined;

    if (!hasOverrides) {
      revenueCents += rDb.gross;
      shippingCents += rDb.shipping;
      vatCents += rDb.vat;
      stripeCents += rDb.stripe;
      leonardoCents += rDb.leonardo;
      continue;
    }

    const monthRatio = mDb && mDb.gross > 0 ? rDb.gross / mDb.gross : 0;
    const actualMonthGross = ov.manualGrossCents !== undefined ? ov.manualGrossCents : mDb.gross;
    const actualMonthShipping = ov.manualGlsCents !== undefined ? ov.manualGlsCents : mDb.shipping;
    const actualMonthVat = ov.manualVatCents !== undefined ? ov.manualVatCents : mDb.vat;
    const actualMonthStripe = ov.manualStripeFeeCents !== undefined ? ov.manualStripeFeeCents : mDb.stripe;
    const actualMonthLeonardo = Math.round(actualMonthGross * 0.1);

    revenueCents += Math.round(actualMonthGross * monthRatio);
    shippingCents += Math.round(actualMonthShipping * monthRatio);
    vatCents += Math.round(actualMonthVat * monthRatio);
    stripeCents += Math.round(actualMonthStripe * monthRatio);
    leonardoCents += Math.round(actualMonthLeonardo * monthRatio);
  }

  const netCents = revenueCents - stripeCents - vatCents - shippingCents - leonardoCents;

  return {
    revenueCents,
    stripeCents,
    vatCents,
    shippingCents,
    leonardoCents,
    netCents,
  };
}
