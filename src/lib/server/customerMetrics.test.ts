import test from "node:test";
import assert from "node:assert/strict";
import { readCustomerMetrics, summarizeCustomers } from "./customerMetrics";
import type { PrismaClient } from "@/generated/prisma";

const now = new Date("2026-11-09T12:00:00Z");
const base = { id: "order-one", isTest: false, email: " BUYER@example.com ", fullName: "Cliente", paidAt: new Date("2024-01-01"), totalCents: 20000, refundCents: 5000, items: [] };

test("customer reader loads full paid history without a reporting-period or top-N cutoff", async () => {
  const db = { order: { findMany: async (args: unknown) => {
    const query = args as { where: unknown; take?: number };
    assert.deepEqual(query.where, { isTest: false, paidAt: { lte: now }, currency: "eur" });
    assert.equal(query.take, undefined);
    return [base, { ...base, id: "order-two", email: "buyer@example.com", paidAt: now }];
  } } } as unknown as Pick<PrismaClient, "order">;
  const customers = await readCustomerMetrics(db, now);
  assert.equal(customers.totalCustomers, 1);
  assert.equal(customers.rows[0].ltvCents, 30000);
  assert.equal(customers.rows[0].ordersCount, 2);
  assert.equal(customers.rows[0].firstOrderAt.toISOString(), "2024-01-01T00:00:00.000Z");
});

test("customer segment boundaries use elapsed time and dormant takes priority over VIP", () => {
  const row = (id: string, days: number) => ({ ...base, id, email: `${id}@example.com`, paidAt: new Date(now.getTime() - days * 86_400_000) });
  const customers = summarizeCustomers([row("new", 30), row("active", 30.5), row("recent", 179.99), { ...row("dormant-vip", 180), items: [{ productId: "evo-latta", variantId: "5lt", qty: 2 }] }], now);
  const byEmail = new Map(customers.rows.map((r) => [r.email, r]));
  assert.equal(byEmail.get("new@example.com")!.segment, "new");
  assert.equal(byEmail.get("active@example.com")!.segment, "active");
  assert.equal(byEmail.get("recent@example.com")!.segment, "active");
  assert.equal(byEmail.get("dormant-vip@example.com")!.segment, "dormant");
});

test("CSV remains admin-only and exports normalized historical LTV, segment filters and escaped cells", async () => {
  let reads = 0;
  const fixtures = [base, { ...base, id: "order-two", email: "buyer@example.com", paidAt: new Date() }, { ...base, id: "unsafe", email: '=HYPERLINK("test")@example.com' }];
  const globalState = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = globalState.prismaPostgres;
  globalState.prismaPostgres = {
    order: { findMany: async () => { reads++; return fixtures; } },
    adminSession: { findFirst: async () => ({ id: "admin", createdAt: new Date(), rotatedAt: new Date() }) },
  };
  try {
    const { GET } = await import("../../app/api/admin/customers.csv/route");
    const url = "https://delpasqua.com/api/admin/customers.csv";
    assert.equal((await GET(new Request(url))).status, 401);
    assert.equal(reads, 0);
    const headers = { cookie: "admin_session=customer-test-token" };
    const response = await GET(new Request(url, { headers }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const csv = await response.text();
    assert(csv.includes('"buyer@example.com","2","40000","10000","30000"'));
    assert(csv.includes('"\'=hyperlink(""test"")@example.com"'));
    const dormant = await (await GET(new Request(`${url}?segment=dormant`, { headers }))).text();
    assert(!dormant.includes('"buyer@example.com"'));
    assert(dormant.includes("Dormienti"));
  } finally { globalState.prismaPostgres = previous; }
});
