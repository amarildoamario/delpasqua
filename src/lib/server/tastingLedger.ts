import type { PrismaClient } from "@/generated/prisma";
import type Stripe from "stripe";
import { tastingVatCents } from "./tastingVat";
import { VOUCHER_TEST_AMOUNT_CENTS } from "./voucherTest";

type Payment = {
  paidAt: Date;
  grossCents: number;
  vatCents: number;
  stripeFeeCents: number;
};

export function estimateStripeFeeCents(totalCents: number) {
  return Math.round(totalCents * 0.015 + 25);
}

export function tastingPayment(
  paidAt: Date, grossCents: number, stripeVatCents?: number, stripeFeeCents?: number,
): Payment {
  return {
    paidAt,
    grossCents,
    vatCents: stripeVatCents && stripeVatCents > 0
      ? stripeVatCents
      : tastingVatCents(grossCents),
    stripeFeeCents: stripeFeeCents ?? estimateStripeFeeCents(grossCents),
  };
}

function readPaymentSnapshot(payload: string | null) {
  try {
    const snapshot = JSON.parse(payload ?? "null");
    if (!snapshot || typeof snapshot !== "object") return null;
    const { paymentStatus, amountTotal, amountTax, currency } = snapshot;
    return {
      paymentStatus: typeof paymentStatus === "string" ? paymentStatus : undefined,
      grossCents: currency === "eur" && Number.isSafeInteger(amountTotal) && amountTotal > 0 ? Number(amountTotal) : undefined,
      vatCents: Number.isSafeInteger(amountTax) && amountTax >= 0 ? Number(amountTax) : undefined,
    };
  } catch {
    return null;
  }
}

async function readPaidStripeSession(stripe: Stripe | null, id: string) {
  if (!stripe) return null;
  try {
    return await stripe.checkout.sessions.retrieve(id, {
      expand: ["payment_intent.latest_charge.balance_transaction"],
    });
  } catch (error) {
    console.warn("[TASTING LEDGER] Stripe session unavailable", {
      sessionId: id, error: error instanceof Error ? error.name : "unknown",
    });
    return null;
  }
}

function sessionAmounts(session: Stripe.Checkout.Session | null) {
  if (session?.livemode !== true || session.payment_status !== "paid"
    || session.currency !== "eur" || !session.amount_total) return null;
  const intent = session.payment_intent;
  const charge = intent && typeof intent !== "string" ? intent.latest_charge : null;
  const balance = charge && typeof charge !== "string" ? charge.balance_transaction : null;
  return {
    grossCents: session.amount_total,
    vatCents: session.total_details?.amount_tax,
    feeCents: balance && typeof balance !== "string" && balance.currency === "eur" ? balance.fee : undefined,
  };
}

export async function readTastingLedger(
  db: Pick<PrismaClient, "tastingVoucher" | "tastingBooking" | "stripeWebhookEvent">,
  stripe: Stripe | null,
) {
  const [vouchers, bookings] = await Promise.all([
    db.tastingVoucher.findMany({
      where: {
        isTest: false,
        totalCents: { not: VOUCHER_TEST_AMOUNT_CENTS },
        checkout: { livemode: true, proposal: { totalCents: { not: VOUCHER_TEST_AMOUNT_CENTS } } },
      },
      select: { paidAt: true, totalCents: true, checkout: { select: { stripeSessionId: true } } },
    }).catch((error: unknown) => {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2021") return [];
      throw error;
    }),
    db.tastingBooking.findMany({
      where: { voucherId: null, stripeSessionId: { startsWith: "cs_live_" } },
      select: { stripeSessionId: true },
    }),
  ]);

  const bookingSessions = bookings.flatMap(({ stripeSessionId }) => stripeSessionId ? [stripeSessionId] : []);
  const events = bookingSessions.length ? await db.stripeWebhookEvent.findMany({
    where: {
      sessionId: { in: bookingSessions },
      livemode: true,
      paymentIntentId: { not: null },
      OR: [
        { outcome: "processed", type: "checkout.session.completed" },
        { outcome: { in: ["processed", "review"] }, type: "checkout.session.async_payment_succeeded" },
      ],
    },
    orderBy: [{ created: "asc" }, { eventId: "asc" }],
    select: { sessionId: true, created: true, type: true, payloadSnippet: true },
  }) : [];

  const candidates = new Map<string, { paidAt: Date; snapshot: ReturnType<typeof readPaymentSnapshot> }>();
  for (const event of events) {
    if (!event.sessionId) continue;
    const snapshot = readPaymentSnapshot(event.payloadSnippet);
    const asyncSuccess = event.type === "checkout.session.async_payment_succeeded";
    if (!asyncSuccess && (candidates.has(event.sessionId) || (snapshot?.paymentStatus && snapshot.paymentStatus !== "paid"))) continue;
    candidates.set(event.sessionId, { paidAt: new Date(event.created * 1000), snapshot });
  }

  const sources = [
    ...vouchers.map((voucher) => ({
      sessionId: voucher.checkout.stripeSessionId, paidAt: voucher.paidAt, recordedGross: voucher.totalCents,
    })),
    ...Array.from(candidates, ([sessionId, { paidAt, snapshot }]) => ({
      sessionId, paidAt, recordedGross: snapshot?.paymentStatus === "paid" ? snapshot.grossCents : undefined,
      recordedVat: snapshot?.vatCents,
    })),
  ];
  const payments: Payment[] = [];
  let unresolvedBookings = 0;
  for (let index = 0; index < sources.length; index += 8) {
    const batch = await Promise.all(sources.slice(index, index + 8).map(async (source) => {
      const session = await readPaidStripeSession(stripe, source.sessionId);
      const amounts = sessionAmounts(session);
      const gross = amounts?.grossCents ?? source.recordedGross;
      if (gross !== undefined) {
        const vat = amounts?.vatCents ?? ("recordedVat" in source ? source.recordedVat : undefined);
        return tastingPayment(source.paidAt, gross, vat ?? undefined, amounts?.feeCents);
      }
      if (!session) unresolvedBookings += 1;
      return null;
    }));
    for (const payment of batch) if (payment) payments.push(payment);
  }
  return { payments, unresolvedBookings };
}
