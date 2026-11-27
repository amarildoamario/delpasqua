import {
  normalizeCommercialTransactions,
  summarizeCommercialEconomics,
  type CommercialEconomicsSummary,
  type CommercialTransaction,
} from "./commercialTransactions";
import { SITE_LAUNCH_DATE } from "./metricsAnalyticsV6";

export const METRICS_SCHEMA_VERSION_V7 = "metrics-export-v7" as const;
export const METRICS_LEGACY_ALIAS_V6 = "metrics-export-v6" as const;
export { SITE_LAUNCH_DATE };

export type ConsistencyCheckItem = {
  id: string;
  category: "revenue" | "checkout" | "funnel" | "attribution" | "alias";
  label: string;
  passed: boolean;
  expected: number | string;
  actual: number | string;
};

export type V7ReconciliationReport = {
  status: "ok" | "mismatch";
  schemaVersion: typeof METRICS_SCHEMA_VERSION_V7;
  checkedAt: string;
  passedCount: number;
  totalCount: number;
  failedChecks: string[];
  checks: ConsistencyCheckItem[];
};

export type V7ConsistencyInput = {
  economics: CommercialEconomicsSummary;
  daily: ReadonlyArray<{
    date: string;
    paidOrders: number;
    revenueCents: number;
    revenueEur: number;
    sessions: number;
  }>;
  insightsDaily?: ReadonlyArray<{
    date: string;
    paidOrders: number;
    revenueCents: number;
  }>;
  checkoutCohort: {
    stripeCheckoutsStarted: number;
    paid: number;
    openPending: number;
    canceledReturnOpen: number;
    definitiveClosedUnpaid: number;
    amountsCents?: {
      started: number;
      paid: number;
      openPending: number;
      canceledReturnOpen: number;
      definitiveClosedUnpaid: number;
    };
  };
  acquisition: ReadonlyArray<{ source: string; sessions: number }>;
  sessionFunnel: {
    sessions: number;
    shopSessions: number;
    productDetailSessions: number;
    addToCartSessions: number;
    addToCartAfterProductViewSessions: number;
    directAddToCartSessions: number;
    shopBreakdown: {
      listOnly: number;
      listAndDetail: number;
      detailOnly: number;
    };
  };
  orderAttribution: {
    paidOrders: number;
    ordersWithSession: number;
    ordersWithoutSession: number;
    ordersWithSource: number;
    unattributedOrders: number;
    ordersWithDevice: number;
    unknownDeviceOrders: number;
  };
  checkedAt?: string;
};

export function runV7ConsistencyChecks(input: V7ConsistencyInput): V7ReconciliationReport {
  const { economics, daily, insightsDaily, checkoutCohort, acquisition, sessionFunnel, orderAttribution } = input;
  const checks: ConsistencyCheckItem[] = [];

  const push = (
    id: string,
    category: ConsistencyCheckItem["category"],
    label: string,
    expected: number | string,
    actual: number | string,
  ) => {
    checks.push({ id, category, label, passed: expected === actual, expected, actual });
  };

  // 1. Revenue & transaction invariants
  const channelGrossCents = economics.revenueByChannel.reduce((s, c) => s + c.grossRevenueCents, 0);
  const channelPaidTx = economics.revenueByChannel.reduce((s, c) => s + c.paidTransactions, 0);
  const dailyGrossCents = daily.reduce((s, d) => s + d.revenueCents, 0);
  const dailyPaidTx = daily.reduce((s, d) => s + d.paidOrders, 0);

  push(
    "revenue.gross_equals_sum_channels",
    "revenue",
    "Incassi lordi = somma canali",
    economics.grossPaymentsCents,
    channelGrossCents,
  );
  push(
    "revenue.gross_equals_sum_daily",
    "revenue",
    "Incassi lordi = somma serie giornaliera",
    economics.grossPaymentsCents,
    dailyGrossCents,
  );
  push(
    "revenue.paid_tx_equals_sum_channels",
    "revenue",
    "Transazioni pagate = somma canali",
    economics.paidTransactions,
    channelPaidTx,
  );
  push(
    "revenue.paid_tx_equals_sum_daily",
    "revenue",
    "Transazioni pagate = somma serie giornaliera",
    economics.paidTransactions,
    dailyPaidTx,
  );
  push(
    "revenue.net_cash_equals_gross_minus_refunds",
    "revenue",
    "Incassi netti = incassi lordi - rimborsi nel periodo",
    economics.grossPaymentsCents - economics.refundsInPeriodCents,
    economics.netCashCents,
  );

  // 2. Checkout cohort invariants (counts & amounts)
  const checkoutStateSum =
    checkoutCohort.paid +
    checkoutCohort.openPending +
    checkoutCohort.canceledReturnOpen +
    checkoutCohort.definitiveClosedUnpaid;
  push(
    "checkout.started_equals_sum_states",
    "checkout",
    "Checkout avviati = somma stati mutualmente esclusivi",
    checkoutCohort.stripeCheckoutsStarted,
    checkoutStateSum,
  );

  if (checkoutCohort.amountsCents) {
    const a = checkoutCohort.amountsCents;
    const amountsSum = a.paid + a.openPending + a.canceledReturnOpen + a.definitiveClosedUnpaid;
    push(
      "checkout.amounts_reconcile_by_state",
      "checkout",
      "Importo checkout avviati = somma importi per stato",
      a.started,
      amountsSum,
    );
  }

  // 3. Session & funnel invariants
  const acquisitionSessionsSum = acquisition.reduce((s, a) => s + a.sessions, 0);
  push(
    "funnel.acquisition_equals_sessions",
    "funnel",
    "Somma sessioni acquisizione = sessioni coorte",
    sessionFunnel.sessions,
    acquisitionSessionsSum,
  );
  push(
    "funnel.shop_breakdown_reconciles",
    "funnel",
    "Sessioni Shop = solo elenco + elenco e schede + solo schede",
    sessionFunnel.shopSessions,
    sessionFunnel.shopBreakdown.listOnly +
      sessionFunnel.shopBreakdown.listAndDetail +
      sessionFunnel.shopBreakdown.detailOnly,
  );
  push(
    "funnel.product_detail_reconciles",
    "funnel",
    "Sessioni scheda prodotto = elenco e schede + solo schede",
    sessionFunnel.productDetailSessions,
    sessionFunnel.shopBreakdown.listAndDetail + sessionFunnel.shopBreakdown.detailOnly,
  );
  push(
    "funnel.add_to_cart_reconciles",
    "funnel",
    "Sessioni add-to-cart = dopo scheda + dirette da lista",
    sessionFunnel.addToCartSessions,
    sessionFunnel.addToCartAfterProductViewSessions + sessionFunnel.directAddToCartSessions,
  );

  // 4. Attribution invariants
  push(
    "attribution.session_split",
    "attribution",
    "Ordini pagati = con sessione + senza sessione",
    orderAttribution.paidOrders,
    orderAttribution.ordersWithSession + orderAttribution.ordersWithoutSession,
  );
  push(
    "attribution.source_split",
    "attribution",
    "Ordini pagati = con sorgente + non attribuiti",
    orderAttribution.paidOrders,
    orderAttribution.ordersWithSource + orderAttribution.unattributedOrders,
  );
  push(
    "attribution.device_split",
    "attribution",
    "Ordini pagati = con dispositivo + dispositivo sconosciuto",
    orderAttribution.paidOrders,
    orderAttribution.ordersWithDevice + orderAttribution.unknownDeviceOrders,
  );

  // 5. Alias / series parity
  if (insightsDaily) {
    const aliasDailyMatches =
      daily.length === insightsDaily.length &&
      daily.every(
        (row, idx) =>
          row.date === insightsDaily[idx]?.date &&
          row.paidOrders === insightsDaily[idx]?.paidOrders &&
          row.revenueCents === insightsDaily[idx]?.revenueCents,
      );
    push(
      "alias.series_daily_matches_insights_daily",
      "alias",
      "series.daily coincide con insights.daily",
      "match",
      aliasDailyMatches ? "match" : "mismatch",
    );
  }

  const failedChecks = checks.filter((c) => !c.passed).map((c) => c.id);
  return {
    status: failedChecks.length === 0 ? "ok" : "mismatch",
    schemaVersion: METRICS_SCHEMA_VERSION_V7,
    checkedAt: input.checkedAt ?? new Date().toISOString(),
    passedCount: checks.length - failedChecks.length,
    totalCount: checks.length,
    failedChecks,
    checks,
  };
}

export { normalizeCommercialTransactions, summarizeCommercialEconomics, type CommercialTransaction };
