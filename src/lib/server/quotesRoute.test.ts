import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

test("quote API requires admin and CSRF, computes prices, deduplicates creation and never downloads on save", async () => {
  const state = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = state.prismaPostgres;
  const csrf = "quote-test-csrf";
  let saved: Record<string, unknown> | null = null;
  let creates = 0;
  let rateCount = 1;
  let failSave = false;
  state.prismaPostgres = {
    adminSession: { findFirst: async () => ({ id: "quote-admin", csrfHash: createHash("sha256").update(csrf).digest("hex"), createdAt: new Date(), rotatedAt: new Date() }) },
    setting: { findMany: async () => [{ key: "vatRatePercent", value: "4" }] },
    $queryRaw: async () => [{ count: rateCount }], $executeRaw: async () => 0,
    quote: {
      upsert: async ({ create }: { create: Record<string, unknown> }) => {
        if (failSave) throw new Error("unavailable");
        if (!saved) { saved = { ...create, id: "quote-test", sequence: 1, createdAt: new Date("2026-11-13T12:00:00Z") }; creates++; }
        return saved;
      },
    },
  };
  const envKeys = ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"];
  const envValues = envKeys.map((key) => process.env[key]);
  envKeys.forEach((key) => delete process.env[key]);
  try {
    const { POST } = await import("../../app/api/admin/quotes/route");
    const { POST: download } = await import("../../app/api/admin/quotes/[id]/document/route");
    const data = {
      requestId: "0d62fd62-b918-4dd8-bdeb-e22055bd0532", fullName: "Demo", email: "demo@example.test", phone: "",
      addressLine1: "Via Demo 1", addressLine2: "", city: "Firenze", postalCode: "50100", province: "FI", countryCode: "IT",
      paymentTerms: "Da concordare", notes: "", validUntil: "2026-12-13", discountCents: 100, shippingCents: 500,
      items: [{ productId: "evo", variantId: "500ml", sku: "EVO", title: "Olio EVO", variantLabel: "500 ml", qty: 2, unitPriceCents: 1500 }],
    };
    const headers = { cookie: `admin_session=quote-test; admin_csrf=${csrf}`, "x-csrf-token": csrf, origin: "https://delpasqua.com" };
    const request = (body = JSON.stringify(data), auth = true) => new Request("https://delpasqua.com/api/admin/quotes/", { method: "POST", headers: auth ? headers : {}, body });
    assert.equal((await POST(request(undefined, false))).status, 401);
    assert.equal((await download(request(undefined, false), { params: Promise.resolve({ id: "quote-test" }) })).status, 401);
    const noCsrf = request(); noCsrf.headers.delete("x-csrf-token");
    assert.equal((await POST(noCsrf)).status, 403);
    assert.equal((await POST(request("{"))).status, 400);
    assert.equal((await POST(request("x".repeat(150001)))).status, 413);
    assert.equal((await POST(request(JSON.stringify({ ...data, totalCents: 1 })))).status, 400);
    assert.equal((await POST(request(JSON.stringify({ ...data, discountCents: 999999 })))).status, 400);
    assert.equal(creates, 0);
    failSave = true;
    assert.equal((await POST(request())).status, 500);
    failSave = false;
    const created = await POST(request());
    assert.equal(created.status, 200);
    assert.equal((await created.json()).number, "PRE-2026-00001");
    assert.equal(saved!.totalCents, 3400);
    assert.deepEqual(saved!.events, { create: { type: "CREATED" } });
    assert.equal((await POST(request())).status, 200);
    assert.equal(creates, 1);
    assert.equal((await POST(request(JSON.stringify({ ...data, shippingCents: 0 })))).status, 409);
    assert.equal((await download(request(), { params: Promise.resolve({ id: "" }) })).status, 400);
    rateCount = 21;
    assert.equal((await POST(request())).status, 429);
  } finally {
    state.prismaPostgres = previous;
    envKeys.forEach((key, i) => { if (envValues[i] === undefined) delete process.env[key]; else process.env[key] = envValues[i]; });
  }
});
