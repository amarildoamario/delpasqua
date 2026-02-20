export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { createOrderEvent } from "@/lib/server/orderEvents";
import type { OrderStatus } from "@/generated/prisma/client";
import type * as Prisma from "@/generated/prisma/client";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { NextResponse } from "next/server";
import { processOutboxBatch } from "@/lib/server/outbox";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { AdminOrderStatusPatchSchema } from "@/lib/server/schemas";

function now() {
  return new Date();
}

function isAllowedTransition(from: OrderStatus, to: OrderStatus) {
  const allowed: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["PAID", "CANCELED", "EXPIRED", "FAILED"],
    PAID: ["PREPARING", "REFUNDED", "CANCELED", "FAILED"],
    PREPARING: ["SHIPPED", "CANCELED", "REFUNDED"],
    SHIPPED: ["DELIVERED", "REFUNDED"],
    DELIVERED: ["REFUNDED"],
    CANCELED: [],
    REFUNDED: [],
    PARTIALLY_REFUNDED: ["REFUNDED"],
    EXPIRED: [],
    FAILED: [],
  };
  return allowed[from]?.includes(to) ?? false;
}

// ✅ helper: enqueue + AUTO process (best-effort) — usato per REFUNDED
async function enqueueRefundedEmailOutbox(args: { orderId: string; actor: string | null }) {
  await prisma.outboxEvent.create({
    data: {
      type: "ORDER_REFUNDED",
      payload: { orderId: args.orderId, actor: args.actor, at: new Date().toISOString() },
      runAt: new Date(),
    },
  });

  // AUTO: processa subito (se fallisce resta in outbox e lo riprendi via /api/cron/outbox)
  processOutboxBatch({ limit: 10 }).catch((e) => {
    console.error("❌ outbox auto-process failed (REFUNDED):", e);
  });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 60, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const { id } = await ctx.params;

  try {
    enforceBodyLimit(req, 30_000);
    const body = await req.json().catch(() => null);
    const parsed = AdminOrderStatusPatchSchema.safeParse(body ?? {});
    if (!parsed.success) return new Response("Bad Request", { status: 400 });

    const restore = parsed.data.restore === true;
    const nextStatus = parsed.data.status as OrderStatus | undefined;

    const actor = parsed.data.actor ? String(parsed.data.actor) : null;
    const message = parsed.data.message ? String(parsed.data.message) : null;

    const notes = typeof parsed.data.notes === "string" ? parsed.data.notes : undefined;
    const isFlagged = typeof parsed.data.isFlagged === "boolean" ? parsed.data.isFlagged : undefined;
    const riskScore = typeof parsed.data.riskScore === "number" ? parsed.data.riskScore : undefined;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return new Response("Not found", { status: 404 });

    if (restore) {
      if (order.status !== "CANCELED") {
        return new Response("Order is not CANCELED", { status: 400 });
      }

      const lastCancel = await prisma.orderEvent.findFirst({
        where: { orderId: id, toStatus: "CANCELED" },
        orderBy: { createdAt: "desc" },
      });

      const restoreTo: OrderStatus = (lastCancel?.fromStatus as OrderStatus | null) ?? "PENDING";

      const updated = await prisma.order.update({
        where: { id },
        data: { status: restoreTo, canceledAt: null },
      });

      await createOrderEvent({
        orderId: id,
        actor,
        type: "ORDER_RESTORED",
        fromStatus: "CANCELED",
        toStatus: restoreTo,
        message: message ?? `Ordine ripristinato: CANCELED → ${restoreTo}`,
      });

      return guard.attach(NextResponse.json({ ok: true, order: updated }, { status: 200 }));
    }

    const current = order.status;
    let updated: Prisma.Order = order;

    // metadata updates
    if (typeof notes !== "undefined") {
      updated = await prisma.order.update({ where: { id }, data: { notes: String(notes ?? "") } });
    }
    if (typeof isFlagged !== "undefined") {
      updated = await prisma.order.update({ where: { id }, data: { isFlagged: Boolean(isFlagged) } });
    }
    if (typeof riskScore !== "undefined") {
      const rs = Math.max(0, Math.min(100, Math.trunc(riskScore)));
      updated = await prisma.order.update({ where: { id }, data: { riskScore: rs } });
    }

    if (nextStatus) {
      // CANCEL resta com’era (senza email qui se non ti serve)
      if (nextStatus === "CANCELED") {
        updated = await prisma.order.update({
          where: { id },
          data: { status: "CANCELED", canceledAt: now() },
        });

        await createOrderEvent({
          orderId: id,
          actor,
          type: "STATUS_CHANGED",
          fromStatus: current,
          toStatus: "CANCELED",
          message: message ?? `Stato cambiato: ${current} → CANCELED`,
        });

        return guard.attach(NextResponse.json({ ok: true, order: updated }, { status: 200 }));
      }

      if (!isAllowedTransition(current, nextStatus)) {
        return new Response(`Invalid transition ${current} -> ${nextStatus}`, { status: 400 });
      }

      const patch: Prisma.Prisma.OrderUpdateInput = { status: nextStatus };
      if (nextStatus === "PAID") patch.paidAt = now();
      if (nextStatus === "PREPARING") patch.preparingAt = now();
      if (nextStatus === "SHIPPED") patch.shippedAt = now();
      if (nextStatus === "DELIVERED") patch.deliveredAt = now();
      if (nextStatus === "REFUNDED") patch.refundedAt = now();

      updated = await prisma.order.update({ where: { id }, data: patch });
    }

    // Storico + AUTO outbox REFUNDED
    if (nextStatus && nextStatus !== current) {
      await createOrderEvent({
        orderId: id,
        actor,
        type: "STATUS_CHANGED",
        fromStatus: current,
        toStatus: nextStatus,
        message: message ?? `Stato cambiato: ${current} → ${nextStatus}`,
      });

      // ✅ SOLO REFUNDED
      if (nextStatus === "REFUNDED") {
        await enqueueRefundedEmailOutbox({ orderId: id, actor });
      }
    } else {
      if (typeof notes !== "undefined" || typeof isFlagged !== "undefined" || typeof riskScore !== "undefined") {
        await createOrderEvent({
          orderId: id,
          actor,
          type: "ORDER_METADATA_UPDATED",
          message: "Aggiornati note/flag/risk",
          meta: { notes, isFlagged, riskScore },
        });
      }
    }

    return guard.attach(NextResponse.json({ ok: true, order: updated }, { status: 200 }));
  } catch (e: unknown) {
    const err = e as Error & { status?: number };
    if (err.status === 413) return new Response("Payload Too Large", { status: 413 });
    return new Response("Server Error", { status: 500 });
  }
}
