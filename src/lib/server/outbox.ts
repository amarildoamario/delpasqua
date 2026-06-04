import { prisma } from "@/lib/server/prisma";
import { sendTransactionalEmail } from "@/lib/server/email";
import type { TransactionalEmailType } from "@/generated/prisma/client";

const MAX_ATTEMPTS = 8;

function getErrText(e: unknown, fallback = "Unknown outbox error"): string {
  if (typeof e === "string") return e;
  if (e instanceof Error && e.message) return e.message;

  if (typeof e === "object" && e !== null) {
    const maybe = e as { message?: unknown; error?: { message?: unknown } };
    const msg = maybe.message ?? maybe.error?.message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }

  return fallback;
}

export async function processOutboxBatch(opts: {
  limit?: number;
  tx?: unknown;
  sendEmailFn?: (args: { type: TransactionalEmailType; orderId: string }) => Promise<unknown>;
} = {}) {
  const client = (opts.tx as typeof prisma) ?? prisma;
  const sendEmail = opts.sendEmailFn ?? (sendTransactionalEmail as (args: { type: TransactionalEmailType; orderId: string }) => Promise<unknown>);
  const limit = Math.max(1, Math.min(50, opts.limit ?? 10));
  const now = new Date();

  let batch: Array<{
    id: string;
    type: string;
    payload: unknown;
    status: string;
    attempts: number;
    runAt: Date;
    lastError: string | null;
    createdAt: Date;
    updatedAt: Date;
  }> = [];

  try {
    // Prova ad acquisire e marcare i record atomicamente usando Postgres FOR UPDATE SKIP LOCKED
    batch = await client.$queryRaw<Array<{
      id: string;
      type: string;
      payload: unknown;
      status: string;
      attempts: number;
      runAt: Date;
      lastError: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>>`
      UPDATE "OutboxEvent"
      SET "status" = 'processing', "updatedAt" = NOW()
      WHERE "id" IN (
        SELECT "id"
        FROM "OutboxEvent"
        WHERE "status" IN ('pending', 'failed') AND "runAt" <= ${now}
        ORDER BY "runAt" ASC
        LIMIT ${limit}
        FOR UPDATE SKIP LOCKED
      )
      RETURNING "id", "type", "payload", "status", "attempts", "runAt", "lastError", "createdAt", "updatedAt"
    `;
  } catch (rawError) {
    console.warn("[OUTBOX] Raw lock query failed, falling back to soft locking:", rawError);
    
    // Fallback soft-locking per ambienti non-Postgres (SQLite locale, mock unitari)
    const events = await client.outboxEvent.findMany({
      where: {
        status: { in: ["pending", "failed"] },
        runAt: { lte: now },
      },
      orderBy: { runAt: "asc" },
      take: limit,
    });

    for (const ev of events) {
      const locked = await client.outboxEvent.updateMany({
        where: { id: ev.id, status: { in: ["pending", "failed"] } },
        data: { status: "processing" },
      });
      if (locked.count === 1) {
        batch.push({
          id: ev.id,
          type: ev.type,
          payload: ev.payload,
          status: "processing",
          attempts: ev.attempts,
          runAt: ev.runAt,
          lastError: ev.lastError,
          createdAt: ev.createdAt,
          updatedAt: ev.updatedAt,
        });
      }
    }
  }

  let processed = 0;
  let failed = 0;

  for (const ev of batch) {
    try {
      const payloadObj: Record<string, unknown> =
        ev.payload && typeof ev.payload === "object" && !Array.isArray(ev.payload)
          ? (ev.payload as Record<string, unknown>)
          : {};

      const rawOrderId = payloadObj.orderId;
      const orderId =
        typeof rawOrderId === "string" ? rawOrderId.trim() : String(rawOrderId ?? "").trim();

      switch (ev.type) {
        case "ORDER_PAID":
          if (orderId) await sendEmail({ type: "ORDER_PAID" as TransactionalEmailType, orderId });
          break;
        case "ORDER_SHIPPED":
          if (orderId) await sendEmail({ type: "ORDER_SHIPPED" as TransactionalEmailType, orderId });
          break;
        case "ORDER_CANCELED":
          if (orderId) await sendEmail({ type: "ORDER_CANCELED" as TransactionalEmailType, orderId });
          break;
        case "ORDER_REFUNDED":
          if (orderId) await sendEmail({ type: "ORDER_REFUNDED" as TransactionalEmailType, orderId });
          break;
        default:
          break;
      }

      await client.outboxEvent.update({
        where: { id: ev.id },
        data: { status: "done", lastError: null },
      });
      processed++;
    } catch (e: unknown) {
      const attempts = (ev.attempts ?? 0) + 1;

      // backoff semplice (minuti): 1, 5, 15, 60, poi 6h fisso
      const delayMinutes =
        attempts === 1 ? 1 :
        attempts === 2 ? 5 :
        attempts === 3 ? 15 :
        attempts === 4 ? 60 :
        360;

      const nextRun = new Date(Date.now() + delayMinutes * 60_000);

      await client.outboxEvent.update({
        where: { id: ev.id },
        data: {
          // ✅ retry vero: finché attempts < MAX -> torna pending, sennò resta failed terminale
          status: attempts >= MAX_ATTEMPTS ? "failed" : "pending",
          attempts,
          lastError: getErrText(e, "Unknown outbox error"),
          runAt: nextRun,
        },
      });

      failed++;
    }
  }

  return { processed, failed, checked: batch.length };
}