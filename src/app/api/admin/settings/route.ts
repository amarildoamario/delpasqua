export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { AdminSettingsUpdateSchema } from "@/lib/server/schemas";

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  const rows = await prisma.setting.findMany({ orderBy: { key: "asc" } });
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return guard.attach(NextResponse.json(map));
}

export async function POST(req: Request) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({ key: `admin:${ip}:${url.pathname}`, limit: 60, windowSeconds: 60 });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  try {
    enforceBodyLimit(req, 40_000);
    const json = await req.json().catch(() => null);

    const parsed = AdminSettingsUpdateSchema.safeParse(json ?? {});
    if (!parsed.success) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

    const values = parsed.data.values;

    const ops = Object.entries(values).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    );

    await prisma.$transaction(ops);
    return guard.attach(NextResponse.json({ ok: true }, { status: 200 }));
  } catch (e: unknown) {
    const err = e as Error & { status?: number };
    if (err.status === 413) return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
