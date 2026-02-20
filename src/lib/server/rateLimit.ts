import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";

export type RateLimitResult =
  | { ok: true; remaining: number; resetAt: Date }
  | { ok: false; remaining: 0; resetAt: Date };

function normInt(n: unknown, fallback: number) {
  const x = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(x)) return fallback;
  const i = Math.trunc(x);
  return i > 0 ? i : fallback;
}

/**
 * DB fixed-window rate limiter.
 * Robust against bad inputs (NaN/undefined).
 */
export async function rateLimit(params: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const limit = normInt(params.limit, 60);
  const windowSeconds = normInt(params.windowSeconds, 60);

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const resetAt = new Date(windowStart + windowMs);

  const row = await prisma.rateLimitCounter.upsert({
    where: { key_windowStart: { key: params.key, windowStart } },
    update: { count: { increment: 1 } },
    create: { key: params.key, windowStart, count: 1 },
  });

  if (row.count > limit) {
    return { ok: false, remaining: 0, resetAt };
  }
  return { ok: true, remaining: Math.max(0, limit - row.count), resetAt };
}

/**
 * Backward compat helper used in older routes (checkout/order/etc).
 * Throws NextResponse 429 when exceeded.
 */
export async function rateLimitOrThrow(params: {
  key: string;
  limit: number;
  windowSeconds: number;
  message?: string;
}) {
  const r = await rateLimit({
    key: params.key,
    limit: params.limit,
    windowSeconds: params.windowSeconds,
  });

  if (!r.ok) {
    const retryAfter = Math.max(1, Math.ceil((r.resetAt.getTime() - Date.now()) / 1000));
   throw NextResponse.json(
  { error: params.message || "Too Many Requests" },
  { status: 429, headers: { "Retry-After": String(retryAfter) } }
);
  }

  return r;
}
