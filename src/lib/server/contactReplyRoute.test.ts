import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

test("contact reply API protects sending, reports rejection, and preserves acceptance if marking read fails", async () => {
  const globalState = globalThis as unknown as { prismaPostgres?: unknown };
  const previousPrisma = globalState.prismaPostgres;
  const previousFetch = globalThis.fetch;
  const envKeys = ["RESEND_API_KEY", "EMAIL_FROM", "EMAIL_REPLY_TO", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"];
  const previousEnv = envKeys.map((key) => process.env[key]);
  let sends = 0;
  let reads = 0;
  let updates = 0;
  let reject = false;
  let failUpdate = false;
  let missing = false;
  let rateCount = 1;
  let failSave = false;
  let failReceipt = false;
  let stored: Record<string, unknown> | null = null;
  const keys: string[] = [];
  const csrf = "contact-reply-test-csrf";
  globalState.prismaPostgres = {
    adminSession: { findFirst: async () => ({ id: "test-admin", csrfHash: createHash("sha256").update(csrf).digest("hex"), createdAt: new Date(), rotatedAt: new Date() }) },
    $queryRaw: async () => [{ count: rateCount }],
    $executeRaw: async () => 0,
    contactReply: {
      upsert: async ({ create }: { create: Record<string, unknown> }) => {
        if (failSave) throw new Error("database unavailable");
        stored ??= { ...create, id: "reply-test", emailId: null, sentAt: null, createdAt: new Date() };
        return stored;
      },
      update: async ({ data }: { data: Record<string, unknown> }) => {
        if (failReceipt) throw new Error("database unavailable");
        stored = { ...stored, ...data }; return stored;
      },
    },
    contactMessage: {
      findUnique: async () => { reads++; return missing ? null : { id: "contact-test", email: "customer@example.com" }; },
      updateMany: async () => { updates++; if (failUpdate) throw new Error("database unavailable"); return { count: 1 }; },
    },
  };
  process.env.RESEND_API_KEY = "re_test_fake_key";
  process.env.EMAIL_FROM = "Del Pasqua <ordini@delpasqua.com>";
  process.env.EMAIL_REPLY_TO = "info@delpasqua.com";
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  globalThis.fetch = async (url, init) => {
    assert.equal(String(url), "https://api.resend.com/emails");
    const payload = JSON.parse(String(init?.body));
    assert.equal(payload.to, "customer@example.com");
    assert.equal(payload.from, process.env.EMAIL_FROM);
    keys.push(new Headers(init?.headers).get("idempotency-key")!);
    sends++;
    return new Response(JSON.stringify(reject ? { name: "validation_error", message: "Rejected" } : { id: "email-test-id" }), { status: reject ? 422 : 200, headers: { "content-type": "application/json" } });
  };
  try {
    const { POST } = await import("../../app/api/admin/contact-messages/[id]/reply/route");
    const data = { subject: "Re: Olio", body: "Grazie per la richiesta", requestId: "0d62fd62-b918-4dd8-bdeb-e22055bd0532" };
    const headers = { cookie: `admin_session=contact-reply-test; admin_csrf=${csrf}`, "x-csrf-token": csrf, origin: "https://delpasqua.com" };
    const ctx = { params: Promise.resolve({ id: "contact-test" }) };
    const request = (body = JSON.stringify(data), auth = true) => new Request("https://delpasqua.com/api/admin/contact-messages/contact-test/reply/", { method: "POST", headers: auth ? headers : {}, body });
    assert.equal((await POST(request(undefined, false), ctx)).status, 401);
    const noCsrf = request();
    noCsrf.headers.delete("x-csrf-token");
    assert.equal((await POST(noCsrf, ctx)).status, 403);
    assert.equal(reads, 0);
    assert.equal(sends, 0);
    assert.equal((await POST(request("{"), ctx)).status, 400);
    assert.equal((await POST(request(JSON.stringify({ ...data, to: "attacker@example.com" })), ctx)).status, 400);
    assert.equal((await POST(request("x".repeat(100001)), ctx)).status, 413);
    missing = true;
    assert.equal((await POST(request(), ctx)).status, 404);
    assert.equal(sends, 0);
    missing = false;
    failSave = true;
    assert.equal((await POST(request(), ctx)).status, 502);
    assert.equal(sends, 0, "never send if saving the text fails");
    failSave = false;
    reject = true;
    assert.equal((await POST(request(), ctx)).status, 502);
    assert.equal(updates, 0, "a failed send must not mark the message read");
    reject = false;
    const accepted = await POST(request(), ctx);
    assert.equal(accepted.status, 200);
    const receipt = await accepted.json();
    assert.equal(receipt.emailId, "email-test-id");
    assert.equal(receipt.reply.body, data.body);
    assert.ok(receipt.reply.sentAt);
    const beforeRetry = sends;
    assert.equal((await POST(request(), ctx)).status, 200);
    assert.equal(sends, beforeRetry, "saved acceptance must prevent another provider request");
    stored = null;
    assert.equal(updates, 1);
    failUpdate = true;
    const acceptedWithoutRead = await POST(request(), ctx);
    assert.equal(acceptedWithoutRead.status, 200);
    assert.equal((await acceptedWithoutRead.json()).ok, true);
    stored = null;
    failReceipt = true;
    const unsavedReceipt = await POST(request(), ctx);
    assert.equal(unsavedReceipt.status, 200);
    const warning = await unsavedReceipt.json();
    assert.equal(warning.ok, true);
    assert.equal(warning.historySaved, false);
    assert.equal(warning.reply.body, data.body);
    failReceipt = false;
    stored = { ...(stored as unknown as Record<string, unknown>), createdAt: new Date(Date.now() - 25 * 3600000) };
    const beforeExpiredRetry = sends;
    assert.equal((await POST(request(), ctx)).status, 409);
    assert.equal(sends, beforeExpiredRetry);
    assert.equal(new Set(keys).size, 1, "retry requests must use the same provider idempotency key");
    rateCount = 11;
    const before = sends;
    assert.equal((await POST(request(), ctx)).status, 429);
    assert.equal(sends, before);
  } finally {
    globalState.prismaPostgres = previousPrisma;
    globalThis.fetch = previousFetch;
    envKeys.forEach((key, i) => { if (previousEnv[i] === undefined) delete process.env[key]; else process.env[key] = previousEnv[i]; });
  }
});
