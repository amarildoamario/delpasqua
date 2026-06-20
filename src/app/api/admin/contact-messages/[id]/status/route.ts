export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { getClientIpFromHeaders, requireAdminApi } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { Id64Schema } from "@/lib/server/schemas";

const BodySchema = z.object({
  status: z.enum(["UNREAD", "READ", "ARCHIVED"]),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 60, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const { id } = await ctx.params;
  if (!Id64Schema.safeParse(id).success) {
    return guard.attach(NextResponse.json({ error: "Bad Request" }, { status: 400 }));
  }

  enforceBodyLimit(req, 2_000);
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body ?? {});
  if (!parsed.success) {
    return guard.attach(NextResponse.json({ error: "Bad Request" }, { status: 400 }));
  }

  const now = new Date();
  const status = parsed.data.status;

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      status,
      readAt: status === "READ" ? now : status === "UNREAD" ? null : undefined,
      archivedAt: status === "ARCHIVED" ? now : null,
    },
  });

  return guard.attach(NextResponse.json({ ok: true, message: updated }, { status: 200 }));
}
