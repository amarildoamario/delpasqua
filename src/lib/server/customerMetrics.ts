import type { PrismaClient } from "@/generated/prisma";
import { isCanFormat, parseVariantLiters, productFamily, type SalesOrderItem } from "./salesMetrics";
import { COMMERCIAL_CHANNELS, type CommercialChannel } from "./commercialTransactions";
import { VOUCHER_TEST_AMOUNT_CENTS } from "./voucherTest";

export const CUSTOMER_RULES = { dormantDays: 180, newDays: 30, vipCanLiters: 10 };
export const CUSTOMER_SEGMENTS = { vip: "VIP scorta latta", dormant: "Dormienti", new: "Nuovi", active: "Attivi" } as const;
export type CustomerSegment = keyof typeof CUSTOMER_SEGMENTS;

export type CustomerOrder = {
  id: string;
  isTest: boolean;
  email: string;
  fullName: string;
  paidAt: Date | null;
  totalCents: number;
  refundCents: number;
  items: SalesOrderItem[];
  channel?: CommercialChannel;
  quoteId?: string | null;
};

function inferChannel(order: CustomerOrder): CommercialChannel {
  if (order.channel) return order.channel;
  return order.quoteId ? "quote" : "storefront";
}

export function summarizeCustomers(orders: CustomerOrder[], now = new Date()) {
  const customers = new Map<string, {
    email: string;
    fullName: string;
    ordersCount: number;
    grossCents: number;
    refundCents: number;
    ltvCents: number;
    firstOrderAt: Date;
    lastOrderAt: Date;
    canLiters: number;
    segment: CustomerSegment;
    channelsSet: Set<CommercialChannel>;
  }>();
  const seen = new Set<string>();
  let totalPaidTransactions = 0;
  let identifiedPaidTransactions = 0;

  for (const order of orders) {
    if (order.isTest || !order.paidAt || order.paidAt > now || seen.has(order.id)) continue;
    seen.add(order.id);
    totalPaidTransactions++;
    const email = (order.email ?? "").trim().toLowerCase();
    if (!email) continue;
    identifiedPaidTransactions++;
    const channel = inferChannel(order);
    const customer = customers.get(email) ?? {
      email,
      fullName: order.fullName || email,
      ordersCount: 0,
      grossCents: 0,
      refundCents: 0,
      ltvCents: 0,
      firstOrderAt: order.paidAt,
      lastOrderAt: order.paidAt,
      canLiters: 0,
      segment: "active" as CustomerSegment,
      channelsSet: new Set<CommercialChannel>(),
    };
    customer.ordersCount++;
    customer.channelsSet.add(channel);
    customer.grossCents += order.totalCents;
    customer.refundCents += Math.min(order.totalCents, Math.max(0, order.refundCents));
    customer.ltvCents = customer.grossCents - customer.refundCents;
    if (order.paidAt < customer.firstOrderAt) customer.firstOrderAt = order.paidAt;
    if (order.paidAt >= customer.lastOrderAt) {
      customer.lastOrderAt = order.paidAt;
      if (order.fullName) customer.fullName = order.fullName;
    }
    // Fully refunded orders do not qualify a customer as a bulk oil buyer.
    if (order.refundCents < order.totalCents) {
      for (const item of order.items) {
        if (productFamily(item.productId, item.sku) === "oil" && isCanFormat(item.variantId, item.productId)) {
          customer.canLiters += parseVariantLiters(item.variantId, item.productId) * (item.qty ?? 0);
        }
      }
    }
    customers.set(email, customer);
  }

  const rows = [...customers.values()].map((customer) => {
    const ageDays = (now.getTime() - customer.lastOrderAt.getTime()) / 86_400_000;
    const daysSinceOrder = Math.floor(ageDays);
    customer.segment = daysSinceOrder >= CUSTOMER_RULES.dormantDays ? "dormant" :
      customer.canLiters >= CUSTOMER_RULES.vipCanLiters && customer.ltvCents > 0 ? "vip" :
      customer.ordersCount === 1 && ageDays <= CUSTOMER_RULES.newDays ? "new" : "active";
    const channels = COMMERCIAL_CHANNELS.filter((ch) => customer.channelsSet.has(ch));
    return {
      email: customer.email,
      fullName: customer.fullName,
      ordersCount: customer.ordersCount,
      grossCents: customer.grossCents,
      refundCents: customer.refundCents,
      ltvCents: customer.ltvCents,
      firstOrderAt: customer.firstOrderAt,
      lastOrderAt: customer.lastOrderAt,
      canLiters: +customer.canLiters.toFixed(3),
      segment: customer.segment,
      daysSinceOrder,
      channels,
    };
  }).sort((a, b) => b.ltvCents - a.ltvCents || a.email.localeCompare(b.email));

  const segments = Object.fromEntries(
    Object.keys(CUSTOMER_SEGMENTS).map((key) => [key, rows.filter((row) => row.segment === key).length]),
  ) as Record<CustomerSegment, number>;

  const byChannel = Object.fromEntries(
    COMMERCIAL_CHANNELS.map((ch) => [ch, rows.filter((row) => row.channels.includes(ch)).length]),
  ) as Record<CommercialChannel, number>;

  const totalLtvCents = rows.reduce((sum, row) => sum + row.ltvCents, 0);
  const identificationCoverage = totalPaidTransactions > 0 ? identifiedPaidTransactions / totalPaidTransactions : null;

  return {
    scope: "all_commercial_channels" as const,
    rows,
    segments,
    byChannel,
    totalCustomers: rows.length,
    totalLtvCents,
    avgLtvCents: rows.length ? Math.round(totalLtvCents / rows.length) : null,
    identificationCoverage,
    identifiedPaidTransactions,
    totalPaidTransactions,
  };
}

export async function readCustomerMetrics(
  db: Pick<PrismaClient, "order"> & Partial<Pick<PrismaClient, "tastingVoucher">>,
  now = new Date(),
) {
  const [orders, vouchers] = await Promise.all([
    db.order.findMany({
      where: { isTest: false, paidAt: { lte: now }, currency: "eur" },
      select: {
        id: true,
        quoteId: true,
        isTest: true,
        email: true,
        fullName: true,
        paidAt: true,
        totalCents: true,
        refundCents: true,
        items: { select: { productId: true, variantId: true, qty: true, sku: true } },
      },
    }),
    db.tastingVoucher?.findMany
      ? db.tastingVoucher.findMany({
          where: {
            isTest: false,
            paidAt: { lte: now },
            totalCents: { not: VOUCHER_TEST_AMOUNT_CENTS },
          },
          select: {
            id: true,
            email: true,
            fullName: true,
            paidAt: true,
            totalCents: true,
            isTest: true,
          },
        }).catch((error: unknown) => {
          if (typeof error === "object" && error !== null && "code" in error && error.code === "P2021") return [];
          throw error;
        })
      : Promise.resolve([]),
  ]);

  const combined: CustomerOrder[] = [
    ...orders.map((o) => ({
      ...o,
      channel: (o.quoteId ? "quote" : "storefront") as CommercialChannel,
    })),
    ...vouchers.map((v) => ({
      id: `voucher:${v.id}`,
      isTest: v.isTest,
      email: v.email,
      fullName: v.fullName ?? v.email,
      paidAt: v.paidAt,
      totalCents: v.totalCents,
      refundCents: 0,
      items: [],
      channel: "voucher" as const,
    })),
  ];

  return summarizeCustomers(combined, now);
}
