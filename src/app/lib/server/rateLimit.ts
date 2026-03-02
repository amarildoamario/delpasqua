type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimitOrThrow(opts: { key: string; limit: number; windowMs: number }) {
  const now = Date.now();
  const b = buckets.get(opts.key);

  if (!b || now > b.resetAt) {
    buckets.set(opts.key, { count: 1, resetAt: now + opts.windowMs });
    return;
  }

  b.count += 1;
  if (b.count > opts.limit) {
    const retryAfterSec = Math.ceil((b.resetAt - now) / 1000);
    const err = new Error("RATE_LIMIT");
    const apiErr = err as Error & { status?: number; retryAfterSec?: number };
    apiErr.status = 429;
    apiErr.retryAfterSec = retryAfterSec;
    throw err;
  }
}
