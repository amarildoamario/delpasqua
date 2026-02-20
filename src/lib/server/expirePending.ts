import { prisma } from "@/lib/server/prisma";
import { releaseReserved } from "@/lib/server/inventory";

type Args = {
  limit?: number;
  /** Override per test: se non passato usa 7 giorni */
  olderThanMinutes?: number;
};

const PENDING_TTL_MINUTES = 7 * 24 * 60; // ✅ 7 giorni fissi

export async function expirePendingOrders(args: Args = {}) {
  const limit = Number.isFinite(args.limit)
    ? Math.max(1, Math.min(200, args.limit!))
    : 50;

  const ttlMinutes =
    Number.isFinite(args.olderThanMinutes) && args.olderThanMinutes! > 0
      ? args.olderThanMinutes!
      : PENDING_TTL_MINUTES;

  const cutoff = new Date(Date.now() - ttlMinutes * 60_000);

  const candidates = await prisma.order.findMany({
    where: {
      status: "PENDING",
      paidAt: null,
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

    for (const o of candidates) {
      // ricontrollo dentro transazione (race-safe)
      const fresh = await tx.order.findUnique({
        where: { id: o.id },
        include: { items: true },
      });

      if (!fresh) continue;
      if (fresh.status !== "PENDING") continue;
      if (fresh.paidAt) continue;

      // rilascia reserved stock
      await releaseReserved(
        tx,
        fresh.items.map((it) => ({ sku: it.sku, qty: it.qty }))
      );

      // expire ordine
      await tx.order.update({
        where: { id: fresh.id },
        data: { status: "EXPIRED" },
      });

      // audit event
      await tx.orderEvent.create({
        data: {
          orderId: fresh.id,
          actor: "system",
          type: "ORDER_EXPIRED",
          message: "Ordine scaduto automaticamente (pending > 7 giorni)",
          fromStatus: "PENDING",
          toStatus: "EXPIRED",
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
