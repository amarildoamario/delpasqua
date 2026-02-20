import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { AdminSalesPatchSchema } from "@/lib/server/schemas";

export async function PATCH(req: Request) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 60, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  try {
    enforceBodyLimit(req, 25_000);
    const body = await req.json().catch(() => null);

    const parsed = AdminSalesPatchSchema.safeParse(body ?? {});
    if (!parsed.success) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

    const d = parsed.data;

    const data = {
      showInHome: Boolean(d.showInHome),
      homeRank: Math.trunc(d.homeRank ?? 0),
      isBestSeller: Boolean(d.isBestSeller),
      badge: d.badge ?? null,
      promoLabel: d.promoLabel ?? null,
      discountPercent: d.discountPercent && d.discountPercent > 0 ? Math.trunc(d.discountPercent) : null,
      discountCents: d.discountCents && d.discountCents > 0 ? Math.trunc(d.discountCents) : null,
      startsAt: d.startsAt ?? null,
      endsAt: d.endsAt ?? null,
    };

    const merch = await prisma.productMerch.upsert({
      where: { productKey: d.productKey },
      create: { productKey: d.productKey, ...data },
      update: data,
    });

    return guard.attach(NextResponse.json({ ok: true, merch }, { status: 200 }));
  } catch (e: unknown) {
    const err = e as Error & { status?: number };
    if (err.status === 413) return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
