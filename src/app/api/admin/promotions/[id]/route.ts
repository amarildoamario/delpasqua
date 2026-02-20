export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { AdminPromotionUpdateSchema, Id64Schema } from "@/lib/server/schemas";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 60, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const { id } = await ctx.params;
  if (!Id64Schema.safeParse(id).success) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  enforceBodyLimit(req, 20_000);
  const body = await req.json().catch(() => null);
  const parsed = AdminPromotionUpdateSchema.safeParse(body ?? {});
  if (!parsed.success) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  const promo = await prisma.promotion.update({
    where: { id },
    data: {
      isActive: typeof parsed.data.isActive === "boolean" ? parsed.data.isActive : undefined,
      description:
        typeof parsed.data.description === "string"
          ? parsed.data.description
          : parsed.data.description ?? undefined,
      percent: parsed.data.percent ?? undefined,
      amountCents: parsed.data.amountCents ?? undefined,
      minOrderCents: parsed.data.minOrderCents ?? undefined,
      usageLimit: parsed.data.usageLimit ?? undefined,
    },
  });

  return guard.attach(NextResponse.json(promo, { status: 200 }));
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 60, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const { id } = await ctx.params;
  if (!Id64Schema.safeParse(id).success) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  await prisma.promotion.delete({ where: { id } });
  return guard.attach(NextResponse.json({ ok: true }, { status: 200 }));
}
