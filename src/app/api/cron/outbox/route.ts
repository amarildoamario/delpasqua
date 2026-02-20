export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { processOutboxBatch } from "@/lib/server/outbox";
import { CronLimitQuerySchema } from "@/lib/server/schemas";

export async function POST(req: NextRequest) {
  // In dev lasciamo aperto.
  // In prod proteggi con CRON_SECRET.
  const secret = process.env.CRON_SECRET;
  const provided = req.headers.get("x-cron-secret");

  if (process.env.NODE_ENV === "production") {
    if (!secret || provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const url = new URL(req.url);
  const parsed = CronLimitQuerySchema.safeParse({
    limit: url.searchParams.get("limit"),
  });

  const limit = parsed.success ? parsed.data.limit : 10;

  const res = await processOutboxBatch({ limit });
  return NextResponse.json({ ok: true, ...res }, { status: 200 });
}
