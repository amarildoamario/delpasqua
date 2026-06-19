import assert from "node:assert/strict";
import test from "node:test";
import {
  extractOrderIdFromCheckoutSession,
  registerIncomingStripeWebhookEvent,
} from "./stripeWebhook";

type StoredWebhookEvent = {
  eventId: string;
  type: string;
  livemode: boolean;
  created: number;
  payloadSnippet: string;
  outcome:
    | "processed"
    | "ignored"
    | "duplicate"
    | "failed_signature"
    | "failed_validation"
    | "failed_processing"
    | "review";
  attempts: number;
  processedAt: Date | null;
  errorMessage?: string | null;
};

function buildWebhookStore(initial?: StoredWebhookEvent[]) {
  const rows = new Map<string, StoredWebhookEvent>();

  for (const row of initial ?? []) {
    rows.set(row.eventId, { ...row });
  }

  return {
    rows,
    store: {
      findUnique: async ({ where }: { where: { eventId: string } }) => {
        const row = rows.get(where.eventId);
        if (!row) return null;
        return {
          outcome: row.outcome,
          attempts: row.attempts,
          processedAt: row.processedAt,
        };
      },
      create: async ({
        data,
      }: {
        data: Omit<StoredWebhookEvent, "processedAt"> & { attempts: number };
      }) => {
        rows.set(data.eventId, {
          ...data,
          processedAt: null,
          errorMessage: null,
        });
      },
      update: async ({
        where,
        data,
      }: {
        where: { eventId: string };
        data: {
          attempts?: { increment: number };
          payloadSnippet?: string;
          errorMessage?: string | null;
        };
      }) => {
        const row = rows.get(where.eventId);
        if (!row) throw new Error(`Missing webhook row ${where.eventId}`);
        if (data.attempts) row.attempts += data.attempts.increment;
        if (typeof data.payloadSnippet !== "undefined") row.payloadSnippet = data.payloadSnippet;
        if (Object.prototype.hasOwnProperty.call(data, "errorMessage")) {
          row.errorMessage = data.errorMessage ?? null;
        }
      },
    },
  };
}

test("registerIncomingStripeWebhookEvent creates a new webhook row and allows processing", async () => {
  const { rows, store } = buildWebhookStore();

  const result = await registerIncomingStripeWebhookEvent(store, {
    event: {
      id: "evt_new",
      type: "checkout.session.completed",
      livemode: false,
      created: 123,
    },
    rawBody: '{"id":"evt_new"}',
  });

  assert.deepEqual(result, { shouldProcess: true });
  assert.equal(rows.size, 1);
  assert.equal(rows.get("evt_new")?.attempts, 1);
  assert.equal(rows.get("evt_new")?.outcome, "ignored");
});

test("registerIncomingStripeWebhookEvent replays failed_processing events and clears stale error state", async () => {
  const { rows, store } = buildWebhookStore([
    {
      eventId: "evt_retry",
      type: "checkout.session.completed",
      livemode: true,
      created: 123,
      payloadSnippet: "old",
      outcome: "failed_processing",
      attempts: 1,
      processedAt: new Date("2026-06-07T09:00:00.000Z"),
      errorMessage: "db timeout",
    },
  ]);

  const result = await registerIncomingStripeWebhookEvent(store, {
    event: {
      id: "evt_retry",
      type: "checkout.session.completed",
      livemode: true,
      created: 123,
    },
    rawBody: '{"id":"evt_retry","retry":true}',
  });

  assert.deepEqual(result, { shouldProcess: true });
  assert.equal(rows.get("evt_retry")?.attempts, 2);
  assert.equal(rows.get("evt_retry")?.errorMessage, null);
});

test("registerIncomingStripeWebhookEvent replays review and not-yet-processed events", async () => {
  const { store: reviewStore } = buildWebhookStore([
    {
      eventId: "evt_review",
      type: "checkout.session.completed",
      livemode: true,
      created: 123,
      payloadSnippet: "old",
      outcome: "review",
      attempts: 2,
      processedAt: new Date("2026-06-07T09:00:00.000Z"),
      errorMessage: "manual review",
    },
  ]);

  const reviewResult = await registerIncomingStripeWebhookEvent(reviewStore, {
    event: {
      id: "evt_review",
      type: "checkout.session.completed",
      livemode: true,
      created: 123,
    },
    rawBody: '{"id":"evt_review"}',
  });
  assert.deepEqual(reviewResult, { shouldProcess: true });

  const { store: pendingStore } = buildWebhookStore([
    {
      eventId: "evt_pending",
      type: "checkout.session.completed",
      livemode: true,
      created: 123,
      payloadSnippet: "old",
      outcome: "ignored",
      attempts: 1,
      processedAt: null,
      errorMessage: "incomplete",
    },
  ]);

  const pendingResult = await registerIncomingStripeWebhookEvent(pendingStore, {
    event: {
      id: "evt_pending",
      type: "checkout.session.completed",
      livemode: true,
      created: 123,
    },
    rawBody: '{"id":"evt_pending"}',
  });
  assert.deepEqual(pendingResult, { shouldProcess: true });
});

test("registerIncomingStripeWebhookEvent short-circuits already processed duplicate events", async () => {
  const { rows, store } = buildWebhookStore([
    {
      eventId: "evt_done",
      type: "checkout.session.completed",
      livemode: true,
      created: 123,
      payloadSnippet: "old",
      outcome: "processed",
      attempts: 3,
      processedAt: new Date("2026-06-07T09:00:00.000Z"),
      errorMessage: "should stay",
    },
  ]);

  const result = await registerIncomingStripeWebhookEvent(store, {
    event: {
      id: "evt_done",
      type: "checkout.session.completed",
      livemode: true,
      created: 123,
    },
    rawBody: '{"id":"evt_done","duplicate":true}',
  });

  assert.deepEqual(result, {
    shouldProcess: false,
    duplicate: true,
    previousOutcome: "processed",
  });
  assert.equal(rows.get("evt_done")?.attempts, 4);
  assert.equal(rows.get("evt_done")?.errorMessage, "should stay");
});

test("extractOrderIdFromCheckoutSession prefers metadata.orderId and falls back to client_reference_id", () => {
  assert.equal(
    extractOrderIdFromCheckoutSession({
      metadata: { orderId: "order-meta" },
      client_reference_id: "order-client",
    }),
    "order-meta"
  );

  assert.equal(
    extractOrderIdFromCheckoutSession({
      metadata: {},
      client_reference_id: "order-client",
    }),
    "order-client"
  );

  assert.equal(
    extractOrderIdFromCheckoutSession({
      metadata: {},
      client_reference_id: null,
    }),
    null
  );
});
