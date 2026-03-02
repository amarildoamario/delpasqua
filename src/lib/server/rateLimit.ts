import { NextResponse } from "next/server";

export type RateLimitResult =
  | { ok: true; remaining: number; resetAt: Date }
  | { ok: false; remaining: 0; resetAt: Date };

// ─── In-memory store ──────────────────────────────────────────────────────────
// Zero DB queries. Resiste bene su Vercel (le istanze serverless vengono
// riutilizzate per lo stesso utente nella stessa regione).
// In caso di più istanze parallele si può passare ad Upstash Redis,
// ma per un sito e-commerce piccolo questo è più che sufficiente.

interface WindowEntry {
  count: number;
  resetAt: number; // timestamp ms
}

const store = new Map<string, WindowEntry>();

// Pulizia periodica per evitare memory leak (ogni 5 min)
if (typeof globalThis !== "undefined") {
  const g = globalThis as { _rlCleanupInterval?: ReturnType<typeof setInterval> };
  if (!g._rlCleanupInterval) {
    g._rlCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) store.delete(key);
      }
    }, 5 * 60 * 1000);
  }
}

function normInt(n: unknown, fallback: number) {
  const x = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(x)) return fallback;
  const i = Math.trunc(x);
  return i > 0 ? i : fallback;
}

/**
 * In-memory fixed-window rate limiter.
 * Zero DB queries — sostituisce il precedente basato su prisma.rateLimitCounter.
 */
export async function rateLimit(params: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const limit = normInt(params.limit, 60);
  const windowMs = normInt(params.windowSeconds, 60) * 1000;

  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const resetAt = new Date(windowStart + windowMs);

  const existing = store.get(params.key);

  // Se non esiste o la finestra è passata → nuovo contatore
  if (!existing || existing.resetAt <= now) {
    store.set(params.key, { count: 1, resetAt: windowStart + windowMs });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return { ok: false, remaining: 0, resetAt };
  }

  return { ok: true, remaining: Math.max(0, limit - existing.count), resetAt };
}

/**
 * Backward compat helper — lancia NextResponse 429 se il limite è superato.
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
