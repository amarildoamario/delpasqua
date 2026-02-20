import { prisma } from "@/lib/server/prisma";
import { sendTransactionalEmail } from "@/lib/server/email";

const MAX_ATTEMPTS = 8;

export async function processOutboxBatch(opts: { limit?: number } = {}) {
  const limit = Math.max(1, Math.min(50, opts.limit ?? 10));
  const now = new Date();

  // ✅ prendi sia pending che failed (per recuperare vecchi eventi già marcati failed)
  const batch = await prisma.outboxEvent.findMany({
    where: {
      status: { in: ["pending", "failed"] },
      runAt: { lte: now },
    },
    orderBy: { runAt: "asc" },
    take: limit,
  });

  let processed = 0;
  let failed = 0;

  for (const ev of batch) {
    // ✅ lock: accetta pending o failed (così anche gli ex-failed ripartono)
    const locked = await prisma.outboxEvent.updateMany({
      where: { id: ev.id, status: { in: ["pending", "failed"] } },
      data: { status: "processing" },
    });
    if (locked.count !== 1) continue;

    try {
      const payload = ev.payload as any;
      const orderId = String(payload?.orderId ?? "").trim();

      switch (ev.type) {
        case "ORDER_PAID":
          if (orderId) await sendTransactionalEmail({ type: "ORDER_PAID", orderId });
          break;
        case "ORDER_SHIPPED":
          if (orderId) await sendTransactionalEmail({ type: "ORDER_SHIPPED", orderId });
          break;
        case "ORDER_CANCELED":
          if (orderId) await sendTransactionalEmail({ type: "ORDER_CANCELED", orderId });
          break;
        case "ORDER_REFUNDED":
          if (orderId) await sendTransactionalEmail({ type: "ORDER_REFUNDED", orderId });
          break;
        default:
          break;
      }

      await prisma.outboxEvent.update({
        where: { id: ev.id },
        data: { status: "done", lastError: null },
      });
      processed++;
    } catch (e: any) {
      const attempts = (ev.attempts ?? 0) + 1;

      // backoff semplice (minuti): 1, 5, 15, 60, poi 6h fisso
      const delayMinutes =
        attempts === 1 ? 1 :
        attempts === 2 ? 5 :
        attempts === 3 ? 15 :
        attempts === 4 ? 60 :
        360;

      const nextRun = new Date(Date.now() + delayMinutes * 60_000);

      await prisma.outboxEvent.update({
        where: { id: ev.id },
        data: {
          // ✅ retry vero: finché attempts < MAX -> torna pending, sennò resta failed terminale
          status: attempts >= MAX_ATTEMPTS ? "failed" : "pending",
          attempts,
          lastError: e?.message ?? "Unknown outbox error",
          runAt: nextRun,
        },
      });

      failed++;
    }
  }

  return { processed, failed, checked: batch.length };
}
