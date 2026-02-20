export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { expirePendingOrders } from "@/lib/server/expirePending";
import { CronExpirePendingQuerySchema } from "@/lib/server/schemas";

const DEFAULT_MINUTES = 7 * 24 * 60; // 7 giorni

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (process.env.NODE_ENV === "production") {
    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const url = new URL(req.url);
  const parsed = CronExpirePendingQuerySchema.safeParse({
    limit: url.searchParams.get("limit"),
    minutes: url.searchParams.get("minutes") ?? String(DEFAULT_MINUTES),
  });

  const limit = parsed.success ? parsed.data.limit : 50;
  const olderThanMinutes = parsed.success ? parsed.data.minutes : DEFAULT_MINUTES;

  const res = await expirePendingOrders({ limit, olderThanMinutes });

  return NextResponse.json({ ok: true, ...res }, { status: 200 });
}
