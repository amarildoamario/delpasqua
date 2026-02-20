import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import {
  AdminPromotionCreateSchema,
  AdminPromotionDeleteQuerySchema,
} from "@/lib/server/schemas";

export async function POST(req: Request) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 60, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  try {
    enforceBodyLimit(req, 40_000);
    const body = await req.json().catch(() => null);

    const parsed = AdminPromotionCreateSchema.safeParse(body ?? {});
    if (!parsed.success) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

    const data = parsed.data;

    // Normalizza coerentemente
    const code = data.code;
    const description = data.description ?? null;

    const type = data.type;
    const freeShipping = type === "free_shipping" ? true : Boolean(data.freeShipping);

    const percent = data.percent == null ? null : Math.trunc(data.percent);
    const amountCents = data.amountCents == null ? null : Math.trunc(data.amountCents);

    const minOrderCents = data.minOrderCents == null ? null : Math.trunc(data.minOrderCents);
    const usageLimit = data.usageLimit == null ? null : Math.trunc(data.usageLimit);

    const startsAt = data.startsAt ?? null;
    const endsAt = data.endsAt ?? null;

    if (!code) return NextResponse.json({ error: "Codice mancante" }, { status: 400 });

    const promo = await prisma.promotion.create({
      data: {
        code,
        description,
        type,
        percent: percent === 0 ? null : percent,
        amountCents: amountCents === 0 ? null : amountCents,
        freeShipping,
        minOrderCents: minOrderCents === 0 ? null : minOrderCents,
        usageLimit: usageLimit === 0 ? null : usageLimit,
        startsAt,
        endsAt,
        isActive: Boolean(data.isActive),
      },
    });

    return guard.attach(NextResponse.json({ ok: true, promo }));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.toLowerCase().includes("unique")) {
      return NextResponse.json({ error: "Codice già esistente" }, { status: 409 });
    }
    const err = e as Error & { status?: number };
    if (err.status === 413) return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 60, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  try {
    const { searchParams } = new URL(req.url);
    const parsed = AdminPromotionDeleteQuerySchema.safeParse({
      id: searchParams.get("id"),
    });

    if (!parsed.success) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

    await prisma.promotion.delete({ where: { id: parsed.data.id } });

    return guard.attach(NextResponse.json({ ok: true }));
  } catch {
    return NextResponse.json({ error: "Errore eliminazione" }, { status: 500 });
  }
}
