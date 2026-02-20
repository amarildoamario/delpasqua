export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { processOutboxBatch } from "@/lib/server/outbox";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { AdminOutboxRetrySchema } from "@/lib/server/schemas";

export async function POST(req: Request) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 120, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  try {
    enforceBodyLimit(req, 15_000);
    const body = await req.json().catch(() => null);
    const parsed = AdminOutboxRetrySchema.safeParse(body ?? {});
    if (!parsed.success) return guard.attach(NextResponse.json({ error: "Bad Request" }, { status: 400 }));

    const outboxId = parsed.data.outboxId;

    const ev = await prisma.outboxEvent.findUnique({ where: { id: outboxId } });
    if (!ev) return guard.attach(NextResponse.json({ error: "OutboxEvent not found" }, { status: 404 }));

    if (ev.status === "done") {
      return guard.attach(NextResponse.json({ ok: true, skipped: true, reason: "Already DONE" }, { status: 200 }));
    }

    // reset minimo per consentire il retry
    await prisma.outboxEvent.update({
      where: { id: outboxId },
      data: {
        status: "pending",
        lastError: null,
        runAt: new Date(),
      },
    });

    // processa subito (best-effort)
    const res = await processOutboxBatch({ limit: 20 });

    return guard.attach(NextResponse.json({ ok: true, retried: 1, ...res }, { status: 200 }));
  } catch (e: unknown) {
    const err = e as Error & { status?: number };
    if (err.status === 413) return guard.attach(NextResponse.json({ error: "Payload Too Large" }, { status: 413 }));
    return guard.attach(NextResponse.json({ error: "Server Error" }, { status: 500 }));
  }
}
