import test from "node:test";
import assert from "node:assert/strict";

test("public quote checkout requires a secret link, same-origin POST and explicit acceptance before any payment action", async () => {
  const state = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = state.prismaPostgres;
  let reads = 0, rateCount = 1;
  state.prismaPostgres = { quote: { findUnique: async () => { reads++; return null; } }, $queryRaw: async () => [{ count: rateCount }], $executeRaw: async () => 0 };
  const envKeys = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"];
  const values = envKeys.map((key) => process.env[key]); envKeys.forEach((key) => delete process.env[key]);
  try {
    const { POST, GET } = await import("../../app/api/quotes/[token]/checkout/route");
    const token = "a".repeat(43);
    const ctx = { params: Promise.resolve({ token }) };
    const request = (body = "accepted=yes", origin = "https://delpasqua.com") => new Request(`https://delpasqua.com/api/quotes/${token}/checkout/`, { method: "POST", body, headers: { origin, "content-type": "application/x-www-form-urlencoded" } });
    assert.equal((await POST(request(), { params: Promise.resolve({ token: "guess" }) })).status, 404);
    assert.equal((await POST(request(undefined, "https://evil.example"), ctx)).status, 403);
    assert.equal((await POST(request(undefined, "null"), ctx)).status, 403);
    const withoutOrigin = request(); withoutOrigin.headers.delete("origin");
    assert.equal((await POST(withoutOrigin, ctx)).status, 403);
    assert.equal((await POST(request("accepted=no"), ctx)).status, 400);
    assert.equal((await POST(request("x".repeat(1025)), ctx)).status, 413);
    assert.equal(reads, 0);
    const absent = await POST(request(), ctx);
    assert.equal(absent.status, 404);
    assert.equal(absent.headers.get("cache-control"), "private, no-store");
    assert.equal(absent.headers.get("referrer-policy"), "no-referrer");
    const direct = () => new Request(`https://delpasqua.com/api/quotes/${token}/checkout/`);
    assert.equal((await GET(direct(), { params: Promise.resolve({ token: "guess" }) })).status, 404);
    const missingLink = await GET(direct(), ctx);
    assert.equal(missingLink.status, 404);
    assert.equal(missingLink.headers.get("cache-control"), "private, no-store");
    assert.equal(missingLink.headers.get("referrer-policy"), "no-referrer");
    rateCount = 11;
    assert.equal((await POST(request(), ctx)).status, 429);
    const limited = await GET(direct(), ctx);
    assert.equal(limited.status, 303);
    assert.match(limited.headers.get("location")!, /\?error=rate$/);
    assert.equal(reads, 2);
  } finally {
    state.prismaPostgres = previous;
    envKeys.forEach((key, i) => { if (values[i] === undefined) delete process.env[key]; else process.env[key] = values[i]; });
  }
});
