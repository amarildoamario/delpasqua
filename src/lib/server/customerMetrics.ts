import type { PrismaClient } from "@/generated/prisma";
import { isCanFormat, parseVariantLiters, productFamily, type SalesOrderItem } from "./salesMetrics";

export const CUSTOMER_RULES = { dormantDays: 180, newDays: 30, vipCanLiters: 10 };
export const CUSTOMER_SEGMENTS = { vip: "VIP scorta latta", dormant: "Dormienti", new: "Nuovi", active: "Attivi" } as const;
export type CustomerSegment = keyof typeof CUSTOMER_SEGMENTS;
type CustomerOrder = {
  id: string; isTest: boolean; email: string; fullName: string; paidAt: Date | null;
  totalCents: number; refundCents: number; items: SalesOrderItem[];
};

export function summarizeCustomers(orders: CustomerOrder[], now = new Date()) {
  const customers = new Map<string, {
    email: string; fullName: string; ordersCount: number; grossCents: number; refundCents: number;
    ltvCents: number; firstOrderAt: Date; lastOrderAt: Date; canLiters: number; segment: CustomerSegment;
  }>();
  const seen = new Set<string>();
  for (const order of orders) {
    const email = order.email.trim().toLowerCase();
    if (order.isTest || !order.paidAt || order.paidAt > now || !email || seen.has(order.id)) continue;
    seen.add(order.id);
    const customer = customers.get(email) ?? {
      email, fullName: order.fullName, ordersCount: 0, grossCents: 0, refundCents: 0, ltvCents: 0,
      firstOrderAt: order.paidAt, lastOrderAt: order.paidAt, canLiters: 0, segment: "active" as CustomerSegment,
    };
    customer.ordersCount++;
    customer.grossCents += order.totalCents;
    customer.refundCents += Math.min(order.totalCents, Math.max(0, order.refundCents));
    customer.ltvCents = customer.grossCents - customer.refundCents;
    if (order.paidAt < customer.firstOrderAt) customer.firstOrderAt = order.paidAt;
    if (order.paidAt >= customer.lastOrderAt) { customer.lastOrderAt = order.paidAt; customer.fullName = order.fullName; }
    // Fully refunded orders do not qualify a customer as a bulk oil buyer.
    if (order.refundCents < order.totalCents) for (const item of order.items) {
      if (productFamily(item.productId, item.sku) === "oil" && isCanFormat(item.variantId, item.productId)) {
        customer.canLiters += parseVariantLiters(item.variantId, item.productId) * (item.qty ?? 0);
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
    return { ...customer, canLiters: +customer.canLiters.toFixed(3), daysSinceOrder };
  }).sort((a, b) => b.ltvCents - a.ltvCents || a.email.localeCompare(b.email));
  const segments = Object.fromEntries(Object.keys(CUSTOMER_SEGMENTS).map((key) => [key, rows.filter((row) => row.segment === key).length])) as Record<CustomerSegment, number>;
  const totalLtvCents = rows.reduce((sum, row) => sum + row.ltvCents, 0);
  return { rows, segments, totalCustomers: rows.length, totalLtvCents, avgLtvCents: rows.length ? Math.round(totalLtvCents / rows.length) : null };
}

export async function readCustomerMetrics(db: Pick<PrismaClient, "order">, now = new Date()) {
  const orders = await db.order.findMany({
    where: { isTest: false, paidAt: { lte: now }, currency: "eur" },
    select: { id: true, isTest: true, email: true, fullName: true, paidAt: true, totalCents: true, refundCents: true,
      items: { select: { productId: true, variantId: true, qty: true, sku: true } } },
  });
  return summarizeCustomers(orders, now);
}
