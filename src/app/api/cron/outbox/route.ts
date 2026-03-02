export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { processOutboxBatch } from "@/lib/server/outbox";
import { CronLimitQuerySchema } from "@/lib/server/schemas";

export async function POST(req: NextRequest) {
  // In dev lasciamo aperto.
  // In prod: accetta sia "Authorization: Bearer <secret>" (standard Vercel cron)
  // che il vecchio header "x-cron-secret" per retrocompatibilità.
  const secret = process.env.CRON_SECRET;

  if (process.env.NODE_ENV === "production") {
    const authHeader = req.headers.get("authorization") ?? "";
    const xCronSecret = req.headers.get("x-cron-secret") ?? "";
    const bearerOk = secret && authHeader === `Bearer ${secret}`;
    const legacyOk = secret && xCronSecret === secret;

    if (!bearerOk && !legacyOk) {
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
