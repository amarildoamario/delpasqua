import { ORDER_PENDING_TTL_MINUTES } from "@/lib/constants";
import { prisma } from "@/lib/server/prisma";
import { releaseReserved } from "@/lib/server/inventory";

type Args = {
  limit?: number;
  /** Override per test: se non passato usa il TTL ordini condiviso */
  olderThanMinutes?: number;
};

export async function expirePendingOrders(args: Args = {}) {
  const limit = Number.isFinite(args.limit)
    ? Math.max(1, Math.min(200, args.limit!))
    : 50;

  const ttlMinutes =
    Number.isFinite(args.olderThanMinutes) && args.olderThanMinutes! > 0
      ? args.olderThanMinutes!
      : ORDER_PENDING_TTL_MINUTES;

  const cutoff = new Date(Date.now() - ttlMinutes * 60_000);

  const candidates = await prisma.order.findMany({
    where: {
      status: "IN_ATTESA",
      paidAt: null,
      stripeCheckoutSessionId: null,
      createdAt: { lt: cutoff },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
    include: { items: true },
  });

  if (candidates.length === 0) {
    return {
      expired: 0,
      scanned: 0,
      cutoff: cutoff.toISOString(),
      ttlMinutes,
    };
  }

  const expired = await prisma.$transaction(async (tx) => {
    let n = 0;

    for (const order of candidates) {
      const fresh = await tx.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      });

      if (!fresh) continue;
      if (fresh.status !== "IN_ATTESA") continue;
      if (fresh.paidAt) continue;

      await releaseReserved(tx, {
        orderId: fresh.id,
        lines: fresh.items.map((item) => ({ sku: item.sku, qty: item.qty })),
      });

      await tx.order.update({
        where: { id: fresh.id },
        data: { status: "SCADUTO" },
      });

      await tx.orderEvent.create({
        data: {
          orderId: fresh.id,
          actor: "system",
          type: "ORDER_EXPIRED",
          message: `Ordine scaduto automaticamente (pending > ${ttlMinutes} minuti)`,
          fromStatus: "IN_ATTESA",
          toStatus: "SCADUTO",
          metaJson: JSON.stringify({
            ttlMinutes,
            cutoff: cutoff.toISOString(),
          }),
        },
      });

      n++;
    }

    return n;
  });

  return {
    expired,
    scanned: candidates.length,
    cutoff: cutoff.toISOString(),
    ttlMinutes,
  };
}
