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
import { releaseReserved, reserveStockOrThrow } from "@/lib/server/inventory";
import { applyPaidOrderInvariantsTx } from "@/lib/server/orderPayment";
import { AdminOrderStatusPatchSchema } from "@/lib/server/schemas";

function now() {
  return new Date();
}

function isAllowedTransition(from: OrderStatus, to: OrderStatus) {
  const allowed: Record<OrderStatus, OrderStatus[]> = {
    IN_ATTESA: ["PAGATO", "ANNULLATO", "SCADUTO", "FALLITO"],
    PAGATO: ["IN_PREPARAZIONE", "ANNULLATO", "FALLITO"],
    IN_PREPARAZIONE: ["SPEDITO", "ANNULLATO"],
    SPEDITO: ["CONSEGNATO"],
    CONSEGNATO: [],
    ANNULLATO: [],
    RIMBORSATO: [],
    PARZIALMENTE_RIMBORSATO: [],
    SCADUTO: [],
    FALLITO: [],
  };
  return allowed[from]?.includes(to) ?? false;
}

// helper: enqueue + AUTO process (best-effort) — usato per RIMBORSATO (ex REFUNDED)
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

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) return new Response("Not found", { status: 404 });

    if (restore) {
      if (order.status !== "ANNULLATO") {
        return new Response("Order is not ANNULLATO", { status: 400 });
      }

      const lastCancel = await prisma.orderEvent.findFirst({
        where: { orderId: id, toStatus: "ANNULLATO" },
        orderBy: { createdAt: "desc" },
      });

      const restoreTo: OrderStatus = (lastCancel?.fromStatus as OrderStatus | null) ?? "IN_ATTESA";

      const updated = await prisma.$transaction(async (tx) => {
        if (restoreTo === "IN_ATTESA") {
          await reserveStockOrThrow(tx, {
            orderId: id,
            lines: order.items.map((it) => ({ sku: it.sku, qty: it.qty })),
          });
        }

        return tx.order.update({
          where: { id },
          data: { status: restoreTo, canceledAt: null },
        });
      });

      await createOrderEvent({
        orderId: id,
        actor,
        type: "ORDER_RESTORED",
        fromStatus: "ANNULLATO",
        toStatus: restoreTo,
        message: message ?? `Ordine ripristinato: ANNULLATO → ${restoreTo}`,
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
      if (nextStatus === current) {
        return guard.attach(NextResponse.json({ ok: true, order: updated, unchanged: true }, { status: 200 }));
      }

      if (nextStatus === "RIMBORSATO" || nextStatus === "PARZIALMENTE_RIMBORSATO") {
        return NextResponse.json({ error: "USE_STRIPE_REFUND_ENDPOINT" }, { status: 400 });
      }

      // CANCEL resta com’era
      if (nextStatus === "ANNULLATO") {
        updated = await prisma.$transaction(async (tx) => {
          if (current === "IN_ATTESA") {
            await releaseReserved(tx, {
              orderId: id,
              lines: order.items.map((it) => ({ sku: it.sku, qty: it.qty })),
            });
          }

          return tx.order.update({
            where: { id },
            data: { status: "ANNULLATO", canceledAt: now() },
          });
        });

        await createOrderEvent({
          orderId: id,
          actor,
          type: "STATUS_CHANGED",
          fromStatus: current,
          toStatus: "ANNULLATO",
          message: message ?? `Stato cambiato: ${current} → ANNULLATO`,
        });

        return guard.attach(NextResponse.json({ ok: true, order: updated }, { status: 200 }));
      }

      if (!isAllowedTransition(current, nextStatus)) {
        return new Response(`Invalid transition ${current} -> ${nextStatus}`, { status: 400 });
      }

      if (nextStatus === "PAGATO") {
        updated = await prisma.$transaction((tx) =>
          applyPaidOrderInvariantsTx(tx, {
            orderId: id,
            actor,
            source: "admin_manual",
          })
        );
      } else {
        const patch: Prisma.Prisma.OrderUpdateInput = { status: nextStatus };
        if (nextStatus === "IN_PREPARAZIONE") patch.preparingAt = now();
        if (nextStatus === "SPEDITO") patch.shippedAt = now();
        if (nextStatus === "CONSEGNATO") patch.deliveredAt = now();

        updated = await prisma.$transaction(async (tx) => {
          if (current === "IN_ATTESA" && (nextStatus === "SCADUTO" || nextStatus === "FALLITO")) {
            await releaseReserved(tx, {
              orderId: id,
              lines: order.items.map((it) => ({ sku: it.sku, qty: it.qty })),
            });
          }

          return tx.order.update({ where: { id }, data: patch });
        });
      }
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

      // RIMBORSATO is handled exclusively via the /refund endpoint (see early-return guard above)
      if (nextStatus === "PAGATO") {
        processOutboxBatch({ limit: 10 }).catch((e) => {
          console.error("outbox auto-process failed (PAGATO manual):", e);
        });
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
