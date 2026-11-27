import type { OrderStatus, PrismaClient } from "@/generated/prisma";
import { closedCheckoutWhere } from "./checkoutMetrics";
import { toRomeDateISO } from "./metricsAnalyticsV6";
import type { summarizeVoucherCheckouts } from "./voucherMetrics";

type TrendRow = {
  day: string;
  orders: number;
  paidOrders: number;
  paidGrossCents: number;
  closedCheckouts: number;
  excludedCheckouts: number;
};

export async function readDashboardTrend(
  db: Pick<PrismaClient, "order">,
  start: Date,
  endExclusive: Date,
  market: string | null,
  paidStatuses: readonly OrderStatus[],
  vouchers?: ReturnType<typeof summarizeVoucherCheckouts>,
) {
  const country = market ? { countryCode: market } : {};
  const paid = { in: [...paidStatuses] };
  const [orders, closed, excluded] = await Promise.all([
    db.order.findMany({
      where: {
        ...country,
        createdAt: { gte: start, lt: endExclusive },
        isTest: false,
        OR: [{ orderNumber: { not: null } }, { status: paid }],
      },
      select: { createdAt: true, orderNumber: true, status: true, totalCents: true },
    }),
    db.order.findMany({
      where: { ...closedCheckoutWhere(start, endExclusive), ...country },
      select: { createdAt: true },
    }),
    db.order.findMany({
      where: { ...closedCheckoutWhere(start, endExclusive, "internal"), ...country },
      select: { createdAt: true },
    }),
  ]);

  const rows = new Map<string, TrendRow>();
  function rowFor(date: Date) {
    const day = toRomeDateISO(date);
    const existing = rows.get(day);
    if (existing) return existing;
    const row = { day, orders: 0, paidOrders: 0, paidGrossCents: 0, closedCheckouts: 0, excludedCheckouts: 0 };
    rows.set(day, row);
    return row;
  }

  for (const order of orders) {
    const row = rowFor(order.createdAt);
    if (order.orderNumber !== null) row.orders++;
    if (paidStatuses.includes(order.status)) {
      row.paidOrders++;
      row.paidGrossCents += order.totalCents;
    }
  }
  for (const checkout of closed) rowFor(checkout.createdAt).closedCheckouts++;
  for (const checkout of excluded) rowFor(checkout.createdAt).excludedCheckouts++;
  if (!market && vouchers) {
    for (const voucher of vouchers.paid) {
      const row = rowFor(voucher.paidAt);
      row.orders++;
      row.paidOrders++;
      row.paidGrossCents += voucher.totalCents;
    }
    for (const checkout of vouchers.closed) rowFor(checkout.createdAt).closedCheckouts++;
  }

  return [...rows.values()].sort((a, b) => a.day.localeCompare(b.day));
}
