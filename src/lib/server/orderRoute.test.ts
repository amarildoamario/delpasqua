/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import test from "node:test";
import assert from "node:assert/strict";
import Stripe from "stripe";

// 1. Setup global mocks and environment variables BEFORE importing the route
process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

type InventoryRow = {
  sku: string;
  stock: number;
  reserved: number;
};

type ReservationRow = {
  orderId: string;
  sku: string;
  qty: number;
};

type PromotionRow = {
  id: string;
  code: string;
  description: string | null;
  type: string;
  percent: number | null;
  amountCents: number | null;
  freeShipping: boolean;
  minOrderCents: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
};

class MockDb {
  orders = new Map<string, any>();
  orderEvents: any[] = [];
  inventory = new Map<string, InventoryRow>();
  reservations = new Map<string, ReservationRow>();
  promotions = new Map<string, PromotionRow>();

  reset() {
    this.orders.clear();
    this.orderEvents = [];
    this.inventory.clear();
    this.reservations.clear();
    this.promotions.clear();

    // Seed inventory
    this.inventory.set("EVO-B-500ML", { sku: "EVO-B-500ML", stock: 10, reserved: 0 });
    this.inventory.set("EVO-L-750ML", { sku: "EVO-L-750ML", stock: 5, reserved: 0 });

    // Seed promotion
    this.promotions.set("PROMO10", {
      id: "promo-10",
      code: "PROMO10",
      description: "10% Off",
      type: "percent",
      percent: 10,
      amountCents: null,
      freeShipping: false,
      minOrderCents: null,
      usageLimit: 5,
      usedCount: 0,
      startsAt: null,
      endsAt: null,
      isActive: true,
    });
  }
}

const db = new MockDb();
db.reset();

const mockPrisma = {
  order: {
    findUnique: async ({ where }: any) => {
      console.log("Mock prisma.order.findUnique called with where:", where);
      if (where.idempotencyKey) {
        for (const order of db.orders.values()) {
          if (order.idempotencyKey === where.idempotencyKey) {
            return order;
          }
        }
      }
      if (where.id) {
        return db.orders.get(where.id) || null;
      }
      return null;
    },
    create: async ({ data }: any) => {
      console.log("Mock prisma.order.create called with data keys:", Object.keys(data));
      const id = "ord_" + Math.random().toString(36).substring(2, 11);
      const items = data.items?.create || [];
      const order = {
        id,
        createdAt: new Date(),
        status: data.status,
        idempotencyKey: data.idempotencyKey,
        totalCents: data.totalCents,
        discountCents: data.discountCents || 0,
        shippingCents: data.shippingCents || 0,
        promotionCode: data.promotionCode || null,
        email: data.email || "",
        items: items.map((it: any) => ({
          id: "item_" + Math.random().toString(36).substring(2, 11),
          sku: it.sku,
          qty: it.qty,
          unitPriceCents: it.unitPriceCents,
        })),
        stripeCheckoutSessionId: data.stripeCheckoutSessionId || null,
        notes: data.notes || null,
      };
      db.orders.set(id, order);
      console.log("Mock prisma.order.create: Saved order with ID:", id, "Total orders in DB:", db.orders.size);
      return order;
    },
    update: async ({ where, data }: any) => {
      console.log("Mock prisma.order.update called for id:", where.id, "with data keys:", Object.keys(data));
      const order = db.orders.get(where.id);
      if (!order) throw new Error("Order not found in mock: " + where.id);
      const updated = { ...order, ...data };
      db.orders.set(where.id, updated);
      return updated;
    },
    count: async () => {
      console.log("Mock prisma.order.count called");
      return 0;
    },
  },
  orderEvent: {
    create: async ({ data }: any) => {
      console.log("Mock prisma.orderEvent.create called with:", data.type);
      db.orderEvents.push(data);
      return data;
    },
  },
  inventoryReservation: {
    findMany: async ({ where }: any) => {
      console.log("Mock prisma.inventoryReservation.findMany called for orderId:", where.orderId);
      return Array.from(db.reservations.values()).filter(r => r.orderId === where.orderId);
    },
    upsert: async ({ where, create, update }: any) => {
      console.log("Mock prisma.inventoryReservation.upsert called");
      const key = `${where.orderId_sku.orderId}::${where.orderId_sku.sku}`;
      const existing = db.reservations.get(key);
      if (existing) {
        existing.qty = update.qty;
        return existing;
      } else {
        const row = { orderId: create.orderId, sku: create.sku, qty: create.qty };
        db.reservations.set(key, row);
        return row;
      }
    },
    deleteMany: async ({ where }: any) => {
      console.log("Mock prisma.inventoryReservation.deleteMany called for where:", where);
      let count = 0;
      for (const [key, res] of db.reservations.entries()) {
        if (res.orderId === where.orderId) {
          db.reservations.delete(key);
          count++;
        }
      }
      return { count };
    },
  },
  inventoryItem: {
    findMany: async ({ where }: any) => {
      const skus = where.sku.in;
      return Array.from(db.inventory.values()).filter(item => skus.includes(item.sku));
    },
  },
  promotion: {
    findUnique: async ({ where }: any) => {
      return db.promotions.get(where.code) || null;
    },
    update: async ({ where, data }: any) => {
      const promo = db.promotions.get(where.code);
      if (!promo) throw new Error("Promo not found in mock");
      const updated = { ...promo, ...data };
      db.promotions.set(where.code, updated);
      return updated;
    },
  },
  rateLimitCounter: {
    deleteMany: async () => ({ count: 0 }),
  },
  setting: {
    findMany: async () => [],
  },
  productMerch: {
    findMany: async () => {
      return [];
    },
  },
  $executeRaw: async (queryParts: TemplateStringsArray, ...values: any[]) => {
    const query = queryParts.join("?");
    
    // Check if it's select 1 for promotion row locking
    if (query.includes('SELECT 1 FROM "Promotion"')) {
      return 1;
    }
    
    // Check reserve stock query
    if (query.includes("UPDATE \"InventoryItem\"") && query.includes('"reserved" +')) {
      const qty = values[0];
      const sku = values[1];
      const item = db.inventory.get(sku);
      if (item && (item.stock - item.reserved) >= qty) {
        item.reserved += qty;
        return 1;
      }
      return 0;
    }
    
    // Check release stock query
    if (query.includes("UPDATE \"InventoryItem\"") && query.includes('"reserved" -')) {
      const qty = values[0];
      const sku = values[1];
      const item = db.inventory.get(sku);
      if (item && item.reserved >= qty) {
        item.reserved -= qty;
        return 1;
      }
      return 0;
    }
    return 0;
  },
  $queryRaw: async (queryParts: TemplateStringsArray, ...values: any[]) => {
    const query = queryParts.join("?");
    if (query.includes('INSERT INTO "RateLimitCounter"')) {
      return [{ count: 1 }];
    }
    return [];
  },
  $transaction: async (fn: any) => {
    const tx = {
      ...mockPrisma,
      $executeRaw: mockPrisma.$executeRaw,
    };
    return fn(tx);
  },
};

(globalThis as any).prismaPostgres = mockPrisma;

test("successful checkout session creation reserves stock and persists session", async (t) => {
  const { POST } = await import("../../app/api/order/route");
  db.reset();

  // Mock Stripe API calls using StripeResource.prototype._makeRequest
  t.mock.method((Stripe as any).StripeResource.prototype, "_makeRequest", async (args: any, spec: any, options: any) => {
    if (spec.fullPath === "/v1/checkout/sessions") {
      return { id: "cs_test_success", url: "https://checkout.stripe.com/pay/cs_test_success" };
    }
    throw new Error("Unexpected Stripe call to path: " + spec.fullPath);
  });

  const request = new Request("http://localhost:3000/api/order", {
    method: "POST",
    headers: {
      "Idempotency-Key": "success-key-1",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ productId: "evo", variantId: "500ml", qty: 2 }],
      locale: "it",
      countryCode: "IT",
      customer: {
        fullName: "Mario Rossi",
        email: "mario@rossi.it",
        addressLine1: "Via Roma 1",
        city: "Arezzo",
        province: "AR",
        postalCode: "52100",
        countryCode: "IT",
      },
    }),
  });

  const response = await POST(request);
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.ok(body.orderId);
  assert.equal(body.checkoutUrl, "https://checkout.stripe.com/pay/cs_test_success");

  // Verify DB state
  const order = db.orders.get(body.orderId);
  assert.ok(order);
  assert.equal(order.status, "IN_ATTESA");
  assert.equal(order.stripeCheckoutSessionId, "cs_test_success");

  // Verify stock was reserved
  const item = db.inventory.get("EVO-B-500ML");
  assert.equal(item?.reserved, 2);
  assert.equal(db.reservations.size, 1);
});

test("Stripe checkout session creation failure transitions order to FAILED and releases stock", async (t) => {
  const { POST } = await import("../../app/api/order/route");
  db.reset();

  // Force Stripe session creation to fail
  t.mock.method((Stripe as any).StripeResource.prototype, "_makeRequest", async (args: any, spec: any, options: any) => {
    if (spec.fullPath === "/v1/checkout/sessions") {
      throw new Error("Stripe API connection timeout");
    }
    throw new Error("Unexpected Stripe call to path: " + spec.fullPath);
  });

  const request = new Request("http://localhost:3000/api/order", {
    method: "POST",
    headers: {
      "Idempotency-Key": "fail-key-1",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ productId: "evo", variantId: "500ml", qty: 3 }],
      locale: "it",
      countryCode: "IT",
      customer: {
        fullName: "Luca Bianchi",
        email: "luca@bianchi.it",
        addressLine1: "Via Firenze 10",
        city: "Firenze",
        province: "FI",
        postalCode: "50100",
        countryCode: "IT",
      },
    }),
  });

  const response = await POST(request);
  // Expect 500 error returned due to Stripe exception
  assert.equal(response.status, 500);

  // Verify compensation happened:
  // 1. Order should be in FAILED status
  assert.equal(db.orders.size, 1);
  const orderId = Array.from(db.orders.keys())[0];
  const order = db.orders.get(orderId);
  assert.equal(order.status, "FALLITO");
  assert.ok(order.notes.includes("Stripe checkout session creation failed"));

  // 2. Reserved stock must be fully released (back to 0)
  const item = db.inventory.get("EVO-B-500ML");
  assert.equal(item?.reserved, 0);
  assert.equal(db.reservations.size, 0);

  // 3. Compensation event logged
  const hasFailedEvent = db.orderEvents.some(e => e.orderId === orderId && e.type === "STRIPE_SESSION_FAILED");
  assert.ok(hasFailedEvent);
});

test("Stripe coupon creation failure transitions order to FAILED and releases stock", async (t) => {
  const { POST } = await import("../../app/api/order/route");
  db.reset();

  // Force Stripe coupon creation to fail
  t.mock.method((Stripe as any).StripeResource.prototype, "_makeRequest", async (args: any, spec: any, options: any) => {
    if (spec.fullPath === "/v1/coupons") {
      throw new Error("Stripe coupon limit exceeded");
    }
    throw new Error("Unexpected Stripe call to path: " + spec.fullPath);
  });

  const request = new Request("http://localhost:3000/api/order", {
    method: "POST",
    headers: {
      "Idempotency-Key": "fail-coupon-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ productId: "evo", variantId: "500ml", qty: 1 }],
      locale: "it",
      countryCode: "IT",
      promotionCode: "PROMO10", // Requires Stripe coupon creation
      customer: {
        fullName: "Anna Neri",
        email: "anna@neri.it",
        addressLine1: "Via Roma 5",
        city: "Milano",
        province: "MI",
        postalCode: "20100",
        countryCode: "IT",
      },
    }),
  });

  const response = await POST(request);
  assert.equal(response.status, 500);

  // Verify compensation
  assert.equal(db.orders.size, 1);
  const orderId = Array.from(db.orders.keys())[0];
  const order = db.orders.get(orderId);
  assert.equal(order.status, "FALLITO");
  assert.ok(order.notes.includes("Stripe coupon creation failed"));

  // Verify stock release
  const item = db.inventory.get("EVO-B-500ML");
  assert.equal(item?.reserved, 0);
  assert.equal(db.reservations.size, 0);
});

test("checkout session created but local DB save failure expires session and releases stock", async (t) => {
  const { POST } = await import("../../app/api/order/route");
  db.reset();

  // Stripe succeeds, but we will force Prisma update to fail
  t.mock.method((Stripe as any).StripeResource.prototype, "_makeRequest", async (args: any, spec: any, options: any) => {
    if (spec.fullPath === "/v1/checkout/sessions") {
      return { id: "cs_expire_test", url: "https://checkout.stripe.com/pay/cs_expire_test" };
    }
    if (spec.fullPath === "/v1/checkout/sessions/{session}/expire") {
      // Expiry mock call
      return { id: "cs_expire_test", status: "expired" };
    }
    throw new Error("Unexpected Stripe call to path: " + spec.fullPath);
  });

  // Mock prisma.order.update to throw an error when persisting session ID
  t.mock.method(mockPrisma.order, "update", async ({ where, data }: any) => {
    if (data.stripeCheckoutSessionId === "cs_expire_test") {
      throw new Error("Database transaction deadlock simulation");
    }
    // Fallback standard update behavior
    const order = db.orders.get(where.id);
    if (!order) throw new Error("Order not found in mock: " + where.id);
    const updated = { ...order, ...data };
    db.orders.set(where.id, updated);
    return updated;
  });

  const request = new Request("http://localhost:3000/api/order", {
    method: "POST",
    headers: {
      "Idempotency-Key": "fail-db-save-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ productId: "evo", variantId: "500ml", qty: 1 }],
      locale: "it",
      countryCode: "IT",
      customer: {
        fullName: "Emma Rossi",
        email: "emma@rossi.it",
        addressLine1: "Via Napoli 8",
        city: "Napoli",
        province: "NA",
        postalCode: "80100",
        countryCode: "IT",
      },
    }),
  });

  const response = await POST(request);
  assert.equal(response.status, 500);

  // Verify compensation:
  // 1. Order status is FAILED
  assert.equal(db.orders.size, 1);
  const orderId = Array.from(db.orders.keys())[0];
  const order = db.orders.get(orderId);
  assert.equal(order.status, "FALLITO");
  assert.ok(order.notes.includes("Stripe checkout session created but could not be persisted locally"));

  // 2. Stock is released
  const item = db.inventory.get("EVO-B-500ML");
  assert.equal(item?.reserved, 0);
  assert.equal(db.reservations.size, 0);
});
