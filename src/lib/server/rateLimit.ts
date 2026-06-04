import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { prisma } from "@/lib/server/prisma";

export type RateLimitResult =
  | { ok: true; remaining: number; resetAt: Date }
  | { ok: false; remaining: 0; resetAt: Date };

type WindowEntry = {
  count: number;
  resetAt: number;
};

const devStore = new Map<string, WindowEntry>();
const upstashLimiters = new Map<string, Ratelimit>();
let redis: Redis | null | undefined;

function normInt(n: unknown, fallback: number) {
  const x = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(x)) return fallback;
  const i = Math.trunc(x);
  return i > 0 ? i : fallback;
}

function computeWindow(now: number, windowSeconds: number) {
  const windowMs = normInt(windowSeconds, 60) * 1000;
  const windowStart = Math.floor(now / windowMs) * windowMs;

  return {
    windowMs,
    windowStart,
    resetAt: new Date(windowStart + windowMs),
  };
}

function resultFromCount(count: number, limit: number, resetAt: Date): RateLimitResult {
  if (count > limit) {
    return { ok: false, remaining: 0, resetAt };
  }

  return { ok: true, remaining: Math.max(0, limit - count), resetAt };
}

function hasUpstashEnv() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getRedis() {
  if (!hasUpstashEnv()) return null;
  if (typeof redis !== "undefined") return redis;
  redis = Redis.fromEnv();
  return redis;
}

function durationFromSeconds(windowSeconds: number) {
  return `${normInt(windowSeconds, 60)} s` as `${number} s`;
}

function getUpstashLimiter(limit: number, windowSeconds: number) {
  const client = getRedis();
  if (!client) return null;

  const normalizedLimit = normInt(limit, 60);
  const normalizedWindowSeconds = normInt(windowSeconds, 60);
  const cacheKey = `${normalizedLimit}:${normalizedWindowSeconds}`;

  const existing = upstashLimiters.get(cacheKey);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis: client,
    limiter: Ratelimit.fixedWindow(normalizedLimit, durationFromSeconds(normalizedWindowSeconds)),
    prefix: "delpasqua:ratelimit",
    ephemeralCache: false,
    timeout: 750,
  });

  upstashLimiters.set(cacheKey, limiter);
  return limiter;
}

async function rateLimitWithUpstash(params: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult | null> {
  const limiter = getUpstashLimiter(params.limit, params.windowSeconds);
  if (!limiter) return null;

  const result = await limiter.limit(params.key);
  const resetAt = new Date(result.reset);

  if (!result.success) {
    return { ok: false, remaining: 0, resetAt };
  }

  return {
    ok: true,
    remaining: Math.max(0, result.remaining),
    resetAt,
  };
}

function devMemoryRateLimit(params: {
  key: string;
  limit: number;
  windowSeconds: number;
}): RateLimitResult {
  const limit = normInt(params.limit, 60);
  const now = Date.now();
  const { resetAt } = computeWindow(now, params.windowSeconds);

  const existing = devStore.get(params.key);
  if (!existing || existing.resetAt <= now) {
    devStore.set(params.key, { count: 1, resetAt: resetAt.getTime() });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  existing.count += 1;

  if (Math.random() < 0.01) {
    for (const [key, entry] of devStore.entries()) {
      if (entry.resetAt <= now) devStore.delete(key);
    }
  }

  return resultFromCount(existing.count, limit, resetAt);
}

async function incrementDbCounter(args: {
  key: string;
  windowStart: bigint;
}) {
  const rows = await prisma.$queryRaw<Array<{ count: number | bigint }>>`
    INSERT INTO "RateLimitCounter" ("id", "key", "windowStart", "count", "updatedAt")
    VALUES (${randomUUID()}, ${args.key}, ${args.windowStart}, 1, NOW())
    ON CONFLICT ("key", "windowStart")
    DO UPDATE SET
      "count" = "RateLimitCounter"."count" + 1,
      "updatedAt" = NOW()
    RETURNING "count"
  `;

  const count = rows[0]?.count;
  return typeof count === "bigint" ? Number(count) : Number(count ?? 0);
}

async function cleanupOldDbCounters(cutoffWindowStart: bigint) {
  await prisma.rateLimitCounter.deleteMany({
    where: {
      windowStart: { lt: cutoffWindowStart },
    },
  });
}

/**
 * Distributed fixed-window rate limiter.
 * Uses Upstash Redis when configured, then falls back to Postgres.
 * Development keeps an in-memory fallback for local work without Redis/DB.
 */
export async function rateLimit(params: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const limit = normInt(params.limit, 60);
  const now = Date.now();
  const { windowStart, resetAt } = computeWindow(now, params.windowSeconds);

  try {
    const upstashResult = await rateLimitWithUpstash(params);
    if (upstashResult) return upstashResult;
  } catch (error) {
    console.error("Upstash rate limit unavailable; falling back to Postgres", error);
  }

  try {
    const count = await incrementDbCounter({
      key: params.key,
      windowStart: BigInt(windowStart),
    });

    if (Math.random() < 0.01) {
      await cleanupOldDbCounters(BigInt(now - 24 * 60 * 60 * 1000));
    }

    return resultFromCount(count, limit, resetAt);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Rate limit DB unavailable, using development in-memory fallback", error);
      return devMemoryRateLimit(params);
    }

    console.error("Rate limit DB unavailable; failing closed", error);
    return { ok: false, remaining: 0, resetAt };
  }
}

/**
 * Backward compat helper: throws a 429 NextResponse if the limit is exceeded.
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
