export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { createOrderEvent } from "@/lib/server/orderEvents";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { NextResponse } from "next/server";
import { processOutboxBatch } from "@/lib/server/outbox";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { AdminOrderShipSchema, Id64Schema } from "@/lib/server/schemas";

async function enqueueShippedEmail(orderId: string, actor: string | null) {
  await prisma.outboxEvent.create({
    data: {
      type: "ORDER_SHIPPED",
      payload: { orderId, actor, at: new Date().toISOString() },
      runAt: new Date(),
    },
  });
  // Processa immediatamente — non aspetta il cron
  processOutboxBatch({ limit: 5 }).catch((e) => {
    console.error("❌ outbox inline failed (ship route):", e);
  });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 60, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const { id } = await ctx.params;
  if (!Id64Schema.safeParse(id).success) return new Response("Bad Request", { status: 400 });

  enforceBodyLimit(req, 10_000);
  const body = await req.json().catch(() => null);
  const parsed = AdminOrderShipSchema.safeParse(body ?? {});
  if (!parsed.success) return new Response("Bad Request", { status: 400 });

  const shipped = parsed.data.shipped;
  const actor = parsed.data.actor ? String(parsed.data.actor) : null;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return new Response("Not found", { status: 404 });

  if (shipped && order.status !== "PREPARING") {
    return new Response("Order must be PREPARING before shipping", { status: 400 });
  }
  if (!shipped && order.status !== "SHIPPED") {
    return new Response("Order must be SHIPPED to unship", { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: {
      shippedAt: shipped ? new Date() : null,
      status: shipped ? "SHIPPED" : "PREPARING",
    },
  });

  await createOrderEvent({
    orderId: id,
    type: shipped ? "ORDER_SHIPPED" : "ORDER_UNSHIPPED",
    fromStatus: order.status,
    toStatus: updated.status,
    message: shipped ? "Spedito." : "Spedizione annullata",
    meta: null,
  });

  if (shipped && order.status !== "SHIPPED") {
    await enqueueShippedEmail(id, actor);
  }

  return guard.attach(NextResponse.json({ ok: true, order: updated }, { status: 200 }));
}
