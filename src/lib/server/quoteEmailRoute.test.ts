import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

test("quote email protects access, sends the stored PDF snapshot once and keeps ambiguous receipts retryable", async () => {
  const state = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = state.prismaPostgres;
  const previousFetch = globalThis.fetch;
  const names = ["RESEND_API_KEY", "EMAIL_FROM", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"];
  const values = names.map((name) => process.env[name]);
  const csrf = "quote-email-csrf";
  const input = { subject: "Preventivo demo", body: "Buongiorno, ecco il PDF.", requestId: "0d62fd62-b918-4dd8-bdeb-e22055bd0532" };
  const pdf = Buffer.from("%PDF-1.4 stored-snapshot");
  let row = { id: "email-demo", quoteId: "quote-demo", ...input, idempotencyKey: `quote-email/quote-demo/${input.requestId}`, recipient: "customer@example.com", recipientName: "Cliente", quoteNumber: "PREV-2", from: "Frantoio <info@example.com>", replyTo: null, filename: "preventivo-PREV-2.pdf", pdf, emailId: null as string | null, sentAt: null as Date | null, createdAt: new Date(), lastError: null };
  let sends = 0, failReceipt = false, rejected = false, rateCount = 1;
  const keys: string[] = [];
  state.prismaPostgres = {
    adminSession: { findFirst: async () => ({ id: "admin-demo", csrfHash: createHash("sha256").update(csrf).digest("hex"), createdAt: new Date(), rotatedAt: new Date() }) },
    $queryRaw: async () => [{ count: rateCount }], $executeRaw: async () => 0,
    quoteEmail: {
      findUnique: async () => row,
      update: async ({ data }: { data: Partial<typeof row> }) => { if (failReceipt) throw new Error("DB failure"); row = { ...row, ...data }; return row; },
    },
  };
  process.env.RESEND_API_KEY = "re_test_fake_key";
  process.env.EMAIL_FROM = "Frantoio <info@example.com>";
  delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN;
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), "https://api.resend.com/emails");
    const payload = JSON.parse(String(options?.body));
    assert.equal(payload.to, row.recipient);
    assert.equal(payload.text, input.body);
    assert.equal(payload.attachments[0].filename, row.filename);
    assert.equal(Buffer.from(payload.attachments[0].content, "base64").toString(), pdf.toString());
    keys.push(new Headers(options?.headers).get("idempotency-key")!);
    sends++;
    return new Response(JSON.stringify(rejected ? { name: "validation_error", message: "Rejected" } : { id: "provider-email-id" }), { status: rejected ? 422 : 200, headers: { "content-type": "application/json" } });
  };
  try {
    const { POST } = await import("../../app/api/admin/quotes/[id]/email/route");
    const { GET } = await import("../../app/api/admin/quote-emails/[id]/attachment/route");
    const ctx = { params: Promise.resolve({ id: "quote-demo" }) };
    const headers = { cookie: `admin_session=demo; admin_csrf=${csrf}`, "x-csrf-token": csrf, origin: "https://delpasqua.com" };
    const request = (body = JSON.stringify(input), auth = true) => new Request("https://delpasqua.com/api/admin/quotes/quote-demo/email/", { method: "POST", headers: auth ? headers : {}, body });
    assert.equal((await POST(request(undefined, false), ctx)).status, 401);
    const noCsrf = request(); noCsrf.headers.delete("x-csrf-token");
    assert.equal((await POST(noCsrf, ctx)).status, 403);
    assert.equal((await POST(request("x".repeat(100001)), ctx)).status, 413);
    assert.equal((await POST(request(JSON.stringify({ ...input, to: "other@example.com" })), ctx)).status, 400);
    assert.equal(sends, 0);
    rejected = true;
    assert.equal((await POST(request(), ctx)).status, 502);
    rejected = false;
    assert.equal((await POST(request(), ctx)).status, 200);
    assert.ok(row.sentAt);
    const beforeRetry = sends;
    assert.equal((await POST(request(), ctx)).status, 200);
    assert.equal(sends, beforeRetry);
    assert.equal((await POST(request(JSON.stringify({ ...input, body: "Changed" })), ctx)).status, 409);
    row.emailId = null; row.sentAt = null; failReceipt = true;
    const accepted = await POST(request(), ctx);
    assert.equal(accepted.status, 200);
    assert.equal((await accepted.json()).historySaved, false);
    failReceipt = false;
    row.createdAt = new Date(Date.now() - 25 * 3600000);
    const beforeOldRetry = sends;
    assert.equal((await POST(request(), ctx)).status, 409);
    assert.equal(sends, beforeOldRetry);
    assert.equal(new Set(keys).size, 1);
    rateCount = 11;
    assert.equal((await POST(request(), ctx)).status, 429);
    assert.equal((await GET(new Request("https://delpasqua.com/api/admin/quote-emails/email-demo/attachment/"), { params: Promise.resolve({ id: "email-demo" }) })).status, 401);
    const attachment = await GET(new Request("https://delpasqua.com/api/admin/quote-emails/email-demo/attachment/", { headers }), { params: Promise.resolve({ id: "email-demo" }) });
    assert.equal(attachment.status, 200);
    assert.equal(attachment.headers.get("content-type"), "application/pdf");
    assert.equal(Buffer.from(await attachment.arrayBuffer()).toString(), pdf.toString());
  } finally {
    state.prismaPostgres = previous; globalThis.fetch = previousFetch;
    names.forEach((name, i) => { if (values[i] === undefined) delete process.env[name]; else process.env[name] = values[i]; });
  }
});
