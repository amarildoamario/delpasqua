/* eslint-disable @typescript-eslint/no-explicit-any */
import assert from "node:assert/strict";
import test from "node:test";
import Stripe from "stripe";

process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

type BookingRow = {
  id: string;
  status: string;
  slotStart: Date;
  slotEnd: Date;
  tastingType: string;
  people: number;
  children: number;
  fullName: string;
  email: string;
  phone: string;
  notes: string | null;
  stripeSessionId: string | null;
};

class MockTastingDb {
  bookings = new Map<string, BookingRow>();
  rateLimitCounters = new Map<string, number>();
  transactionTail: Promise<void> = Promise.resolve();
  bookingSeq = 1;

  reset() {
    this.bookings.clear();
    this.rateLimitCounters.clear();
    this.transactionTail = Promise.resolve();
    this.bookingSeq = 1;
  }

  nextBookingId() {
    const id = `tb_${this.bookingSeq}`;
    this.bookingSeq += 1;
    return id;
  }
}

const db = new MockTastingDb();
db.reset();

type MockPrisma = {
  tastingBooking: {
    findMany: (args: any) => Promise<Array<{ slotStart: Date; slotEnd: Date }>>;
    create: (args: any) => Promise<any>;
    update: (args: any) => Promise<BookingRow>;
    delete: (args: any) => Promise<BookingRow>;
  };
  rateLimitCounter: {
    deleteMany: () => Promise<{ count: number }>;
  };
  $executeRaw: (...args: any[]) => Promise<number>;
  $queryRaw: (queryParts: TemplateStringsArray, ...values: any[]) => Promise<Array<{ count: number }>>;
  $transaction: (fn: (tx: MockPrisma) => Promise<unknown>) => Promise<unknown>;
};

const mockPrisma: MockPrisma = {
  tastingBooking: {
    findMany: async ({ where }: any) => {
      return [...db.bookings.values()]
        .filter((booking) => {
          const notCanceled = where?.status?.not ? booking.status !== where.status.not : true;
          const afterStart = where?.slotStart?.gte ? booking.slotStart >= where.slotStart.gte : true;
          const beforeEnd = where?.slotStart?.lte ? booking.slotStart <= where.slotStart.lte : true;
          return notCanceled && afterStart && beforeEnd;
        })
        .map((booking) => ({
          slotStart: booking.slotStart,
          slotEnd: booking.slotEnd,
        }));
    },
    create: async ({ data, select }: any) => {
      const booking: BookingRow = {
        id: db.nextBookingId(),
        status: data.status,
        slotStart: new Date(data.slotStart),
        slotEnd: new Date(data.slotEnd),
        tastingType: data.tastingType,
        people: data.people,
        children: data.children,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        notes: data.notes ?? null,
        stripeSessionId: null,
      };
      db.bookings.set(booking.id, booking);
      if (!select) return booking;

      return {
        id: booking.id,
        status: booking.status,
        slotStart: booking.slotStart,
        slotEnd: booking.slotEnd,
        tastingType: booking.tastingType,
        people: booking.people,
        children: booking.children,
        fullName: booking.fullName,
        email: booking.email,
        phone: booking.phone,
        notes: booking.notes,
      };
    },
    update: async ({ where, data }: any) => {
      const existing = db.bookings.get(where.id);
      if (!existing) throw new Error(`Missing tasting booking ${where.id}`);
      const updated = {
        ...existing,
        stripeSessionId:
          typeof data.stripeSessionId === "undefined" ? existing.stripeSessionId : data.stripeSessionId,
      };
      db.bookings.set(where.id, updated);
      return updated;
    },
    delete: async ({ where }: any) => {
      const existing = db.bookings.get(where.id);
      if (!existing) throw new Error(`Missing tasting booking ${where.id}`);
      db.bookings.delete(where.id);
      return existing;
    },
  },
  rateLimitCounter: {
    deleteMany: async () => ({ count: 0 }),
  },
  $executeRaw: async () => 0,
  $queryRaw: async (queryParts: TemplateStringsArray, ...values: any[]) => {
    const query = queryParts.join("?");
    if (!query.includes('INSERT INTO "RateLimitCounter"')) return [];

    const key = String(values[1]);
    const windowStart = String(values[2]);
    const counterKey = `${key}::${windowStart}`;
    const nextCount = (db.rateLimitCounters.get(counterKey) ?? 0) + 1;
    db.rateLimitCounters.set(counterKey, nextCount);
    return [{ count: nextCount }];
  },
  $transaction: async (fn: (tx: MockPrisma) => Promise<unknown>) => {
    let release = () => {};
    const waitTurn = db.transactionTail;
    db.transactionTail = new Promise<void>((resolve) => {
      release = resolve;
    });

    await waitTurn;
    try {
      return await fn(mockPrisma);
    } finally {
      release();
    }
  },
};

(globalThis as any).prismaPostgres = mockPrisma;

function buildRequest(overrides?: Partial<Record<string, unknown>>) {
  const payload = {
    slotStartIso: "2026-06-18T10:30:00.000Z",
    slotEndIso: "2026-06-18T11:30:00.000Z",
    tastingTypeId: "classica",
    people: 2,
    children: 0,
    fullName: "Mario Rossi",
    email: "mario@example.com",
    phone: "+390577000000",
    notes: "",
    ...overrides,
  };

  return new Request("http://localhost:3000/api/tasting/book", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "127.0.0.1",
    },
    body: JSON.stringify(payload),
  });
}

test("concurrent tasting bookings on the same slot allow only one successful checkout session", async (t) => {
  const { POST } = await import("../../app/api/tasting/book/route");
  db.reset();

  let sessionSeq = 1;
  t.mock.method(
    (Stripe as any).StripeResource.prototype,
    "_makeRequest",
    async (_args: any, spec: any) => {
      if (spec.fullPath === "/v1/checkout/sessions") {
        const sessionId = `cs_tasting_${sessionSeq++}`;
        return {
          id: sessionId,
          url: `https://checkout.stripe.com/pay/${sessionId}`,
        };
      }
      throw new Error(`Unexpected Stripe call: ${spec.fullPath}`);
    }
  );

  const [first, second] = await Promise.all([
    POST(buildRequest()),
    POST(
      buildRequest({
        fullName: "Luisa Bianchi",
        email: "luisa@example.com",
        phone: "+390577111111",
      })
    ),
  ]);

  const responses = [first, second];
  const statuses = responses.map((response) => response.status).sort((a, b) => a - b);
  assert.deepEqual(statuses, [200, 409]);
  assert.equal(db.bookings.size, 1);

  const storedBooking = [...db.bookings.values()][0];
  assert.ok(storedBooking);
  assert.equal(storedBooking?.stripeSessionId, "cs_tasting_1");

  const successResponse = responses.find((response) => response.status === 200);
  assert.ok(successResponse);

  const successPayload = await successResponse!.json();
  assert.equal(typeof successPayload.checkoutUrl, "string");
  assert.equal(successPayload.bookingId, storedBooking?.id);
});

test("paid tasting booking is deleted when Stripe checkout session creation fails", async (t) => {
  const { POST } = await import("../../app/api/tasting/book/route");
  db.reset();

  t.mock.method(
    (Stripe as any).StripeResource.prototype,
    "_makeRequest",
    async (_args: any, spec: any) => {
      if (spec.fullPath === "/v1/checkout/sessions") {
        throw new Error("Simulated Stripe checkout failure");
      }
      throw new Error(`Unexpected Stripe call: ${spec.fullPath}`);
    }
  );

  const response = await POST(buildRequest());
  assert.equal(response.status, 500);
  assert.equal(db.bookings.size, 0);

  const payload = await response.json();
  assert.equal(payload.error, "Errore durante la creazione della sessione di pagamento.");
});
