import { createHash, createHmac, randomUUID } from "node:crypto";
import Stripe from "stripe";
import { z } from "zod";
import { databasePolicy } from "./databaseSafety.mjs";
import { prisma } from "./prisma";
import { localStripeTestError } from "./stripeEnvironment";

export const VOUCHER_CHECKOUT_TYPE = "tasting-voucher";
export const TASTING_VOUCHER_EMAIL_EVENT = "TASTING_VOUCHER_PAID";
const emailSchema = z.string().max(254).email();

export function voucherSecret(): string | null {
  const candidates = [
    process.env.VOUCHER_CODE_SECRET,
    process.env.ADMIN_SESSION_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET,
  ];
  for (const value of candidates) {
    const trimmed = value?.trim();
    if (trimmed && trimmed.length >= 24) return trimmed;
  }
  return null;
}

export function voucherCheckoutMode(): "live" | "test" | null {
  const mode = databasePolicy().mode;
  if (!voucherSecret() || !process.env.STRIPE_WEBHOOK_SECRET) return null;
  if (mode === "local-development" && !localStripeTestError()) return "test";
  if (mode === "deployed-production" && /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "")
    && process.env.RESEND_API_KEY && process.env.EMAIL_FROM) return "live";
  return null;
}

export class VoucherCheckoutError extends Error {
  constructor(public code: "unavailable" | "paid" | "processing" | "internal", public attemptId?: string) {
    super(code);
  }
}

export function voucherNumber(voucher: { sequence: number; paidAt: Date }, people: number) {
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome", year: "2-digit", month: "2-digit", day: "2-digit",
  }).formatToParts(voucher.paidAt);
  const year = date.find(({ type }) => type === "year")?.value;
  const month = date.find(({ type }) => type === "month")?.value;
  const day = date.find(({ type }) => type === "day")?.value;
  return `DP${year}-${String(people).padStart(2, "0")}P-${month}${day}-${String(voucher.sequence).padStart(4, "0")}`;
}

export function voucherRedemptionCode(id: string) {
  const secret = voucherSecret();
  if (!secret) throw new Error("Voucher code secret unavailable");
  const num = createHmac("sha256", secret).update(id).digest().readUInt32BE(0) % 1_000_000;
  return String(num).padStart(6, "0");
}

export function voucherCodeDigest(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export function voucherEmailAllowed(isTest: boolean, email: string) {
  return !isTest || (databasePolicy().mode === "local-development" &&
    process.env.VOUCHER_TEST_EMAIL?.trim().toLowerCase() === email.trim().toLowerCase());
}

export async function startVoucherCheckout(proposalId: string, internal: boolean, origin: string) {
  const mode = voucherCheckoutMode();
  if (!mode) throw new VoucherCheckoutError("unavailable");
  const livemode = mode === "live";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { timeout: 8000, maxNetworkRetries: 1 });
  let sessionToExpire: string | undefined;
  try {
    const url = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "TastingVoucherProposal" WHERE "id" = ${proposalId} FOR UPDATE`;
      const proposal = await tx.tastingVoucherProposal.findUnique({
        where: { id: proposalId },
        include: { emails: { orderBy: { createdAt: "desc" }, take: 1, select: { recipient: true } } },
      });
      if (!proposal) throw new VoucherCheckoutError("unavailable");
      const paid = await tx.tastingVoucherCheckout.findFirst({
        where: { proposalId, livemode, voucher: { isNot: null } }, select: { id: true },
      });
      if (paid) throw new VoucherCheckoutError("paid", paid.id);
      const audience = { proposalId, internal, livemode };
      const previous = await tx.tastingVoucherCheckout.findFirst({
        where: audience, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        select: { id: true, stripeSessionId: true, failedAt: true },
      });
      if (previous && !previous.failedAt) {
        const session = await stripe.checkout.sessions.retrieve(previous.stripeSessionId);
        if (session.status === "open" && session.url) return session.url;
        if (session.status !== "expired") throw new VoucherCheckoutError("processing", previous.id);
      }

      const id = randomUUID();
      const returnUrl = new URL(`/voucher/${proposalId}/`, origin).href;
      const metadata = { type: VOUCHER_CHECKOUT_TYPE, voucherCheckoutId: id };
      const prefillEmail = proposal.emails[0]?.recipient;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        locale: "it",
        ...(prefillEmail ? { customer_email: prefillEmail } : {}),
        phone_number_collection: { enabled: true },
        billing_address_collection: "auto",
        expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
        line_items: [{ quantity: 1, price_data: {
          currency: "eur",
          unit_amount: proposal.totalCents,
          product_data: { name: proposal.tastingTitle, description: `Adulti: ${proposal.people} · Bambini: ${proposal.children}` },
        } }],
        metadata,
        payment_intent_data: { metadata },
        success_url: `${returnUrl}?checkout=completed&attempt=${id}`,
        cancel_url: `${returnUrl}?checkout=cancelled`,
      }, { idempotencyKey: `voucher-checkout/${id}` });
      sessionToExpire = session.id;
      if (!session.url || session.livemode !== livemode || session.amount_total !== proposal.totalCents || session.currency !== "eur") {
        throw new VoucherCheckoutError("unavailable");
      }
      await tx.tastingVoucherCheckout.create({
        data: { id, proposalId, stripeSessionId: session.id, internal, livemode: session.livemode },
      });
      return session.url;
    }, { timeout: 30_000 });
    return url;
  } catch (error) {
    if (sessionToExpire) await stripe.checkout.sessions.expire(sessionToExpire).catch(() => undefined);
    throw error;
  }
}

export async function processVoucherCheckoutEvent(event: {
  id: string; type: string; livemode: boolean; created: number;
}, session: Stripe.Checkout.Session) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "TastingVoucherCheckout" WHERE "stripeSessionId" = ${session.id} FOR UPDATE`;
    const checkout = await tx.tastingVoucherCheckout.findUnique({
      where: { stripeSessionId: session.id }, include: { proposal: { select: { totalCents: true } }, voucher: { select: { id: true } } },
    });
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    const finishEvent = async (outcome: "processed" | "review", errorMessage?: string) => {
      await tx.stripeWebhookEvent.update({ where: { eventId: event.id }, data: {
        processedAt: new Date(), sessionId: session.id, paymentIntentId, outcome, errorMessage: errorMessage ?? null,
      } });
      return false;
    };
    // The signed event may arrive before Checkout creation commits. Retry instead of dropping it.
    if (!checkout) throw new Error("Voucher checkout not available yet");
    if (session.metadata?.voucherCheckoutId !== checkout.id || session.livemode !== checkout.livemode
      || session.livemode !== event.livemode || session.currency !== "eur" || session.amount_total !== checkout.proposal.totalCents) {
      return finishEvent("review", "Voucher checkout identity, mode, currency or amount mismatch");
    }
    if (!checkout.voucher && (event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired")) {
      await tx.tastingVoucherCheckout.update({ where: { id: checkout.id }, data: { failedAt: new Date(event.created * 1000) } });
      return finishEvent("processed");
    }
    if (checkout.voucher || session.payment_status !== "paid") return finishEvent("processed");

    const email = emailSchema.safeParse(session.customer_details?.email?.trim());
    const phone = session.customer_details?.phone?.trim();
    if (!paymentIntentId || !email.success || !phone || phone.length > 50) {
      return finishEvent("review", "Voucher payment is missing payment or customer details");
    }
    const id = randomUUID();
    const codeDigest = voucherCodeDigest(voucherRedemptionCode(id));
    const isTest = !session.livemode;
    await tx.tastingVoucher.create({ data: {
      id, checkoutId: checkout.id, codeDigest, stripePaymentIntentId: paymentIntentId,
      totalCents: checkout.proposal.totalCents, fullName: session.customer_details?.name?.trim() || null,
      email: email.data, phone, isTest, paidAt: new Date(event.created * 1000),
    } });
    const enqueueEmail = voucherEmailAllowed(isTest, email.data);
    if (enqueueEmail) {
      await tx.outboxEvent.create({
        data: { id: `voucher-email-${id}`, type: TASTING_VOUCHER_EMAIL_EVENT, payload: { voucherId: id } },
      });
    }
    await finishEvent("processed");
    return enqueueEmail;
  });
}
