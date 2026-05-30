import assert from "node:assert/strict";
import test from "node:test";
import { applyPaidOrderInvariantsTx } from "./orderPayment";
import {
  OutOfStockError,
  releaseReserved,
  reserveStockOrThrow,
} from "./inventory";

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

type OrderItemRow = {
  sku: string;
  qty: number;
};

type OrderRow = {
  id: string;
  status: string;
  orderNumber: string | null;
  paidAt: Date | null;
  email: string;
  fullName: string;
  address: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  province: string;
  postalCode: string;
  zip: string;
  countryCode: string;
  phone: string | null;
  stripePaymentIntentId: string | null;
  paymentMethod: string | null;
  items: OrderItemRow[];
  promotionCode: string | null;
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

type OrderEventRow = {
  orderId: string;
  type: string;
  message: string | null;
  metaJson: string | null;
};

type OutboxRow = {
  type: string;
  payload: Record<string, unknown>;
};

type TestTxShape = {
  inventoryReservation: {
    findMany: ({ where }: { where: { orderId: string } }) => Promise<Array<{ sku: string; qty: number }>>;
    upsert: (args: {
      where: { orderId_sku: { orderId: string; sku: string } };
      update: { qty: number };
      create: ReservationRow;
    }) => Promise<ReservationRow>;
    deleteMany: ({ where }: { where: { orderId: string } }) => Promise<{ count: number }>;
  };
  inventoryItem: {
    findMany: ({ where }: { where: { sku: { in: string[] } } }) => Promise<InventoryRow[]>;
  };
  order: {
    findUnique: ({ where }: { where: { id: string }; include?: { items: true } }) => Promise<OrderRow | null>;
    update: (args: {
      where: { id: string };
      data: Record<string, unknown>;
      include?: { items: true };
    }) => Promise<OrderRow>;
    count: (args: { where: { promotionCode: string; status: string } }) => Promise<number>;
  };
  promotion: {
    findUnique: (args: { where: { code: string } }) => Promise<PromotionRow | null>;
    update: (args: {
      where: { code: string };
      data: { usedCount: { increment: number } };
    }) => Promise<PromotionRow>;
  };
  orderEvent: {
    findFirst: (args: {
      where: { orderId: string; type: string };
      select?: { id: true };
    }) => Promise<{ id: string } | null>;
    create: (args: {
      data: { orderId: string; type: string; message?: string | null; metaJson?: string | null };
    }) => Promise<OrderEventRow>;
  };
  outboxEvent: {
    create: (args: { data: { type: string; payload: Record<string, unknown> } }) => Promise<OutboxRow>;
  };
  $executeRaw: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<number>;
  $queryRaw: (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Array<{ value: string }>>;
};

function unconfigured(): never {
  throw new Error("Unconfigured test double");
}

class FakeOrderTx {
  inventory = new Map<string, InventoryRow>();
  reservations = new Map<string, ReservationRow>();
  orders = new Map<string, OrderRow>();
  orderEvents: OrderEventRow[] = [];
  outbox: OutboxRow[] = [];
  settings = new Map<string, number>();
  promotions = new Map<string, PromotionRow>();

  constructor(args?: {
    inventory?: InventoryRow[];
    reservations?: ReservationRow[];
    orders?: OrderRow[];
    orderEvents?: OrderEventRow[];
    promotions?: PromotionRow[];
  }) {
    for (const row of args?.inventory ?? []) {
      this.inventory.set(row.sku, { ...row });
    }
    for (const row of args?.reservations ?? []) {
      this.reservations.set(this.key(row.orderId, row.sku), { ...row });
    }
    for (const row of args?.orders ?? []) {
      this.orders.set(row.id, {
        ...row,
        items: row.items.map((item) => ({ ...item })),
      });
    }
    for (const row of args?.promotions ?? []) {
      this.promotions.set(row.code, { ...row });
    }
    this.orderEvents = (args?.orderEvents ?? []).map((row) => ({ ...row }));
  }

  key(orderId: string, sku: string) {
    return `${orderId}::${sku}`;
  }

  tx: TestTxShape = {
    inventoryReservation: {
      findMany: async () => unconfigured(),
      upsert: async () => unconfigured(),
      deleteMany: async () => unconfigured(),
    },
    inventoryItem: {
      findMany: async () => unconfigured(),
    },
    order: {
      findUnique: async () => unconfigured(),
      update: async () => unconfigured(),
      count: async () => unconfigured(),
    },
    promotion: {
      findUnique: async () => unconfigured(),
      update: async () => unconfigured(),
    },
    orderEvent: {
      findFirst: async () => unconfigured(),
      create: async () => unconfigured(),
    },
    outboxEvent: {
      create: async () => unconfigured(),
    },
    $executeRaw: async () => unconfigured(),
    $queryRaw: async () => unconfigured(),
  };
}

function cloneOrder(order: OrderRow) {
  return {
    ...order,
    items: order.items.map((item) => ({ ...item })),
  };
}

function buildFakeTx(args?: ConstructorParameters<typeof FakeOrderTx>[0]) {
  const store = new FakeOrderTx(args);

  store.tx.inventoryReservation.findMany = async ({ where }: { where: { orderId: string } }) => {
    return [...store.reservations.values()]
      .filter((row) => row.orderId === where.orderId)
      .map((row) => ({ sku: row.sku, qty: row.qty }));
  };

  store.tx.inventoryReservation.upsert = async ({
    where,
    update,
    create,
  }: {
    where: { orderId_sku: { orderId: string; sku: string } };
    update: { qty: number };
    create: ReservationRow;
  }) => {
    const key = store.key(where.orderId_sku.orderId, where.orderId_sku.sku);
    const existing = store.reservations.get(key);
    const next = existing
      ? { ...existing, qty: update.qty }
      : { ...create };
    store.reservations.set(key, next);
    return next;
  };

  store.tx.inventoryReservation.deleteMany = async ({ where }: { where: { orderId: string } }) => {
    let count = 0;
    for (const key of [...store.reservations.keys()]) {
      if (store.reservations.get(key)?.orderId === where.orderId) {
        store.reservations.delete(key);
        count++;
      }
    }
    return { count };
  };

  store.tx.inventoryItem.findMany = async ({
    where,
  }: {
    where: { sku: { in: string[] } };
  }) => {
    return where.sku.in
      .map((sku) => store.inventory.get(sku))
      .filter((row): row is InventoryRow => Boolean(row))
      .map((row) => ({ ...row }));
  };

  store.tx.order.findUnique = async ({
    where,
  }: {
    where: { id: string };
    include?: { items: true };
  }) => {
    const order = store.orders.get(where.id);
    return order ? cloneOrder(order) : null;
  };

  store.tx.order.update = async ({
    where,
    data,
  }: {
    where: { id: string };
    data: Record<string, unknown>;
    include?: { items: true };
  }) => {
    const existing = store.orders.get(where.id);
    if (!existing) throw new Error(`Order ${where.id} not found`);
    const updated: OrderRow = {
      ...existing,
      ...data,
      items: existing.items.map((item) => ({ ...item })),
    } as OrderRow;
    store.orders.set(where.id, updated);
    return cloneOrder(updated);
  };

  store.tx.order.count = async ({ where }: { where: { promotionCode: string; status: string } }) => {
    return [...store.orders.values()].filter(
      (o) => o.promotionCode === where.promotionCode && o.status === where.status
    ).length;
  };

  store.tx.promotion = {
    findUnique: async ({ where }: { where: { code: string } }) => {
      const p = store.promotions.get(where.code);
      return p ? { ...p } : null;
    },
    update: async ({ where, data }: { where: { code: string }; data: { usedCount: { increment: number } } }) => {
      const p = store.promotions.get(where.code);
      if (!p) throw new Error(`Promotion ${where.code} not found`);
      const next = { ...p, usedCount: p.usedCount + data.usedCount.increment };
      store.promotions.set(where.code, next);
      return next;
    }
  };

  store.tx.orderEvent.findFirst = async ({
    where,
  }: {
    where: { orderId: string; type: string };
    select?: { id: true };
  }) => {
    const row = store.orderEvents.find((event) => event.orderId === where.orderId && event.type === where.type);
    return row ? { id: `${row.orderId}:${row.type}` } : null;
  };

  store.tx.orderEvent.create = async ({
    data,
  }: {
    data: { orderId: string; type: string; message?: string | null; metaJson?: string | null };
  }) => {
    const row: OrderEventRow = {
      orderId: data.orderId,
      type: data.type,
      message: data.message ?? null,
      metaJson: data.metaJson ?? null,
    };
    store.orderEvents.push(row);
    return row;
  };

  store.tx.outboxEvent.create = async ({
    data,
  }: {
    data: { type: string; payload: Record<string, unknown> };
  }) => {
    const row = { type: data.type, payload: data.payload };
    store.outbox.push(row);
    return row;
  };

  store.tx.$executeRaw = async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const sql = strings.join(" ");

    if (sql.includes('SELECT 1 FROM "Promotion"')) {
      return 1;
    }

    if (sql.includes('SET "reserved" = "reserved" +')) {
      const qty = Number(values[0]);
      const sku = String(values[1]);
      const minAvailable = Number(values[2]);
      const row = store.inventory.get(sku);
      if (!row) return 0;
      if (row.stock - row.reserved < minAvailable) return 0;
      row.reserved += qty;
      return 1;
    }

    if (sql.includes('SET "stock" = "stock" -')) {
      const qty = Number(values[0]);
      const reservedQty = Number(values[1]);
      const sku = String(values[2]);
      const minStock = Number(values[3]);
      const minReserved = Number(values[4]);
      const row = store.inventory.get(sku);
      if (!row) return 0;
      if (row.stock < minStock || row.reserved < minReserved) return 0;
      row.stock -= qty;
      row.reserved -= reservedQty;
      return 1;
    }

    if (sql.includes('SET "reserved" = "reserved" -')) {
      const qty = Number(values[0]);
      const sku = String(values[1]);
      const minReserved = Number(values[2]);
      const row = store.inventory.get(sku);
      if (!row) return 0;
      if (row.reserved < minReserved) return 0;
      row.reserved -= qty;
      return 1;
    }

    throw new Error(`Unsupported $executeRaw in test double: ${sql}`);
  };

  store.tx.$queryRaw = async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const sql = strings.join(" ");
    if (!sql.includes('INSERT INTO "Setting"')) {
      throw new Error(`Unsupported $queryRaw in test double: ${sql}`);
    }
    const key = String(values[0]);
    const current = store.settings.get(key) ?? 0;
    const next = current + 1;
    store.settings.set(key, next);
    return [{ value: String(next) }];
  };

  return {
    store,
    tx: store.tx as never,
  };
}

function baseOrder(id: string): OrderRow {
  return {
    id,
    status: "PENDING",
    orderNumber: null,
    paidAt: null,
    email: "",
    fullName: "",
    address: "",
    addressLine1: "",
    addressLine2: null,
    city: "",
    province: "",
    postalCode: "",
    zip: "",
    countryCode: "IT",
    phone: null,
    stripePaymentIntentId: null,
    paymentMethod: null,
    items: [{ sku: "sku-1", qty: 2 }],
    promotionCode: null,
  };
}

test("reserveStockOrThrow creates one reservation and is idempotent for the same order", async () => {
  const { store, tx } = buildFakeTx({
    inventory: [{ sku: "sku-1", stock: 5, reserved: 0 }],
  });

  await reserveStockOrThrow(tx, {
    orderId: "order-1",
    lines: [{ sku: "sku-1", qty: 2 }],
  });
  await reserveStockOrThrow(tx, {
    orderId: "order-1",
    lines: [{ sku: "sku-1", qty: 2 }],
  });

  assert.equal(store.inventory.get("sku-1")?.reserved, 2);
  assert.equal(store.reservations.size, 1);
  assert.ok(store.orderEvents.some((event) => event.type === "INVENTORY_RESERVED"));
  assert.deepEqual(store.reservations.get("order-1::sku-1"), {
    orderId: "order-1",
    sku: "sku-1",
    qty: 2,
  });
});

test("reserveStockOrThrow allows only one concurrent reservation on the last available unit", async () => {
  const { store, tx } = buildFakeTx({
    inventory: [{ sku: "sku-1", stock: 1, reserved: 0 }],
  });

  const results = await Promise.allSettled([
    reserveStockOrThrow(tx, {
      orderId: "order-1",
      lines: [{ sku: "sku-1", qty: 1 }],
    }),
    reserveStockOrThrow(tx, {
      orderId: "order-2",
      lines: [{ sku: "sku-1", qty: 1 }],
    }),
  ]);

  const fulfilled = results.filter((result) => result.status === "fulfilled");
  const rejected = results.filter((result) => result.status === "rejected");

  assert.equal(fulfilled.length, 1);
  assert.equal(rejected.length, 1);
  assert.equal(store.inventory.get("sku-1")?.reserved, 1);
  assert.equal(store.reservations.size, 1);
});

test("reserveStockOrThrow rejects a second order when the last unit is already reserved", async () => {
  const { store, tx } = buildFakeTx({
    inventory: [{ sku: "sku-1", stock: 1, reserved: 0 }],
  });

  await reserveStockOrThrow(tx, {
    orderId: "order-1",
    lines: [{ sku: "sku-1", qty: 1 }],
  });

  await assert.rejects(
    reserveStockOrThrow(tx, {
      orderId: "order-2",
      lines: [{ sku: "sku-1", qty: 1 }],
    }),
    OutOfStockError
  );

  assert.equal(store.inventory.get("sku-1")?.reserved, 1);
  assert.equal(store.reservations.size, 1);
});

test("releaseReserved decrements reserved stock and removes reservation rows", async () => {
  const { store, tx } = buildFakeTx({
    inventory: [{ sku: "sku-1", stock: 5, reserved: 2 }],
    reservations: [{ orderId: "order-1", sku: "sku-1", qty: 2 }],
  });

  await releaseReserved(tx, {
    orderId: "order-1",
    lines: [{ sku: "sku-1", qty: 2 }],
  });

  assert.equal(store.inventory.get("sku-1")?.reserved, 0);
  assert.equal(store.reservations.size, 0);
  assert.ok(store.orderEvents.some((event) => event.type === "INVENTORY_RELEASED"));
});

test("applyPaidOrderInvariantsTx commits stock, assigns numbers, and is idempotent once paid", async () => {
  const { store, tx } = buildFakeTx({
    inventory: [{ sku: "sku-1", stock: 5, reserved: 2 }],
    reservations: [{ orderId: "order-1", sku: "sku-1", qty: 2 }],
    orders: [baseOrder("order-1")],
  });

  const updated = await applyPaidOrderInvariantsTx(tx, {
    orderId: "order-1",
    actor: "admin",
    source: "admin_manual",
    paymentIntentId: "pi_123",
    paymentMethod: "Visa **** 4242",
    customer: {
      email: "cliente@example.com",
      fullName: "Mario Rossi",
      addressLine1: "Via Roma 1",
      city: "Bari",
      postalCode: "70100",
      countryCode: "IT",
      phone: "+3900000000",
    },
  });

  assert.equal(updated.status, "PAID");
  assert.match(updated.orderNumber ?? "", /^DP-\d{4}-\d{6}$/);
  assert.ok(updated.paidAt instanceof Date);
  assert.equal(updated.email, "cliente@example.com");
  assert.equal(updated.fullName, "Mario Rossi");
  assert.equal(updated.addressLine1, "Via Roma 1");
  assert.equal(updated.paymentMethod, "Visa **** 4242");
  assert.equal(updated.stripePaymentIntentId, "pi_123");

  assert.equal(store.inventory.get("sku-1")?.stock, 3);
  assert.equal(store.inventory.get("sku-1")?.reserved, 0);
  assert.equal(store.reservations.size, 0);
  assert.ok(store.orderEvents.some((event) => event.type === "INVENTORY_COMMITTED"));
  assert.equal(store.outbox.length, 1);
  assert.equal(store.outbox[0]?.type, "ORDER_PAID");
  assert.ok(store.orderEvents.some((event) => event.type === "INVOICE_ASSIGNED"));

  const outboxBefore = store.outbox.length;
  await applyPaidOrderInvariantsTx(tx, {
    orderId: "order-1",
    actor: "admin",
    source: "admin_manual",
  });
  assert.equal(store.outbox.length, outboxBefore);
});

test("applyPaidOrderInvariantsTx atomically increments promotion usedCount when order has promotionCode", async () => {
  const { store, tx } = buildFakeTx({
    inventory: [{ sku: "sku-1", stock: 5, reserved: 2 }],
    reservations: [{ orderId: "order-1", sku: "sku-1", qty: 2 }],
    orders: [{
      ...baseOrder("order-1"),
      promotionCode: "PROMO50",
    }],
    promotions: [{
      id: "promo-1",
      code: "PROMO50",
      description: "Test discount",
      type: "percent",
      percent: 50,
      amountCents: null,
      freeShipping: false,
      minOrderCents: null,
      usageLimit: 1,
      usedCount: 0,
      startsAt: null,
      endsAt: null,
      isActive: true,
    }],
  });

  const updated = await applyPaidOrderInvariantsTx(tx, {
    orderId: "order-1",
    actor: "admin",
    source: "admin_manual",
    paymentIntentId: "pi_123",
    paymentMethod: "Visa **** 4242",
  });

  assert.equal(updated.status, "PAID");
  assert.equal(store.promotions.get("PROMO50")?.usedCount, 1);
});

test("order count logic successfully returns PENDING orders for a given coupon", async () => {
  const { store } = buildFakeTx({
    orders: [
      { ...baseOrder("order-1"), status: "PENDING", promotionCode: "PROMO50" },
      { ...baseOrder("order-2"), status: "PENDING", promotionCode: "PROMO50" },
      { ...baseOrder("order-3"), status: "PAID", promotionCode: "PROMO50" },
      { ...baseOrder("order-4"), status: "PENDING", promotionCode: "PROMO10" },
    ],
  });

  const pendingPromo50Count = await store.tx.order.count({
    where: { promotionCode: "PROMO50", status: "PENDING" },
  });

  assert.equal(pendingPromo50Count, 2);
});

test("simulated expire pending order releases reserved stock and marks status EXPIRED", async () => {
  const { store, tx } = buildFakeTx({
    inventory: [{ sku: "sku-1", stock: 5, reserved: 2 }],
    reservations: [{ orderId: "order-1", sku: "sku-1", qty: 2 }],
    orders: [{
      ...baseOrder("order-1"),
      status: "PENDING",
      promotionCode: "PROMO50",
    }],
  });

  // Simulate expirePendingOrders transactional sweep for order-1
  const fresh = await store.tx.order.findUnique({
    where: { id: "order-1" },
    include: { items: true },
  });

  assert.ok(fresh);
  assert.equal(fresh.status, "PENDING");

  // Rilascia stock
  await releaseReserved(tx, {
    orderId: fresh.id,
    lines: fresh.items.map((it: { sku: string; qty: number }) => ({ sku: it.sku, qty: it.qty })),
  });

  // Cambia stato in EXPIRED
  const updated = await store.tx.order.update({
    where: { id: fresh.id },
    data: { status: "EXPIRED" },
  });

  assert.equal(updated.status, "EXPIRED");
  assert.equal(store.inventory.get("sku-1")?.reserved, 0);
  assert.equal(store.reservations.size, 0);
});
