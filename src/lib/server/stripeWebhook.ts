import type Stripe from "stripe";

export type StripeWebhookOutcome =
  | "processed"
  | "ignored"
  | "duplicate"
  | "failed_signature"
  | "failed_validation"
  | "failed_processing"
  | "review";

type StripeWebhookEventStore = {
  findUnique: (args: {
    where: { eventId: string };
    select?: { outcome: true; attempts: true; processedAt: true };
  }) => Promise<{
    outcome: StripeWebhookOutcome;
    attempts: number;
    processedAt: Date | null;
  } | null>;
  create: (args: {
    data: {
      eventId: string;
      type: string;
      livemode: boolean;
      created: number;
      payloadSnippet: string;
      outcome: StripeWebhookOutcome;
      attempts: number;
    };
  }) => Promise<unknown>;
  update: (args: {
    where: { eventId: string };
    data: {
      attempts?: { increment: number };
      payloadSnippet?: string;
      errorMessage?: string | null;
    };
  }) => Promise<unknown>;
};

export function safeWebhookPayloadSnippet(raw: string, maxLen = 800) {
  return raw.length > maxLen ? raw.slice(0, maxLen) : raw;
}

export function extractOrderIdFromCheckoutSession(
  session: Pick<Stripe.Checkout.Session, "metadata" | "client_reference_id">
) {
  const metadataOrderId = session.metadata?.orderId?.trim();
  if (metadataOrderId) return metadataOrderId;

  const clientReferenceId = session.client_reference_id?.trim();
  return clientReferenceId || null;
}

export function shouldReplayStripeWebhookEvent(existing: {
  outcome: StripeWebhookOutcome;
  processedAt: Date | null;
}) {
  return (
    !existing.processedAt ||
    existing.outcome === "review" ||
    existing.outcome === "failed_processing"
  );
}

export async function registerIncomingStripeWebhookEvent(
  store: StripeWebhookEventStore,
  args: {
    event: Pick<Stripe.Event, "id" | "type" | "livemode" | "created">;
    rawBody: string;
  }
) {
  const existing = await store.findUnique({
    where: { eventId: args.event.id },
    select: { outcome: true, attempts: true, processedAt: true },
  });

  if (!existing) {
    await store.create({
      data: {
        eventId: args.event.id,
        type: args.event.type,
        livemode: args.event.livemode,
        created: args.event.created,
        payloadSnippet: safeWebhookPayloadSnippet(args.rawBody),
        outcome: "ignored",
        attempts: 1,
      },
    });

    return { shouldProcess: true as const };
  }

  const shouldReplay = shouldReplayStripeWebhookEvent(existing);

  await store.update({
    where: { eventId: args.event.id },
    data: {
      attempts: { increment: 1 },
      payloadSnippet: safeWebhookPayloadSnippet(args.rawBody),
      ...(shouldReplay ? { errorMessage: null } : {}),
    },
  });

  if (shouldReplay) {
    return { shouldProcess: true as const };
  }

  return {
    shouldProcess: false as const,
    duplicate: true as const,
    previousOutcome: existing.outcome,
  };
}
