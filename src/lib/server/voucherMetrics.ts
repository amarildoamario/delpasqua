import { databaseReadOnly, prisma } from "./prisma";

export async function voucherMetrics(start: Date, endExclusive: Date) {
  const window = { gte: start, lt: endExclusive };
  try {
    const [checkouts, sales] = await Promise.all([
      prisma.tastingVoucherCheckout.count({ where: { internal: false, livemode: true, createdAt: window } }),
      prisma.tastingVoucher.aggregate({
        where: { isTest: false, paidAt: window },
        _count: { _all: true },
        _sum: { totalCents: true },
      }),
    ]);
    return { checkouts, paid: sales._count._all, grossCents: sales._sum.totalCents ?? 0 };
  } catch (error) {
    if (databaseReadOnly && typeof error === "object" && error !== null && "code" in error && error.code === "P2021") return null;
    throw error;
  }
}
