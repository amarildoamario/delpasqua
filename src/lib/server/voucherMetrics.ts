import type { PrismaClient } from "@/generated/prisma";
import { VOUCHER_TEST_AMOUNT_CENTS } from "./voucherTest";

export async function readVoucherCheckouts(
  db: Partial<Pick<PrismaClient, "tastingVoucherCheckout">>,
  start: Date,
  endExclusive: Date,
) {
  if (!db.tastingVoucherCheckout) return [];
  const range = { gte: start, lt: endExclusive };
  const checkouts = await db.tastingVoucherCheckout.findMany({
    where: {
      livemode: true,
      proposal: { totalCents: { not: VOUCHER_TEST_AMOUNT_CENTS } },
      AND: [
        { OR: [{ internal: false, voucher: null }, { voucher: { isTest: false, totalCents: { not: VOUCHER_TEST_AMOUNT_CENTS } } }] },
        { OR: [{ createdAt: range }, { voucher: { paidAt: range } }] },
      ],
    },
    select: {
      id: true, createdAt: true, failedAt: true, stripeSessionId: true,
      proposal: { select: { id: true, tastingTitle: true, totalCents: true } },
      voucher: { select: { email: true, paidAt: true, totalCents: true } },
    },
  }).catch((error: unknown) => {
    // Older read-only database snapshots may predate the voucher tables.
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2021") return [];
    throw error;
  });
  return checkouts.map(({ id, createdAt, failedAt, stripeSessionId, proposal, voucher }) => ({
    id: `voucher:${id}`,
    proposalId: proposal.id,
    tastingTitle: proposal.tastingTitle,
    createdAt,
    failedAt,
    stripeCheckoutSessionId: stripeSessionId,
    totalCents: voucher?.totalCents ?? proposal.totalCents,
    paidAt: voucher?.paidAt ?? null,
    email: voucher?.email ?? null,
    isTest: false,
    userAgent: null,
    events: [],
    channel: "voucher" as const,
  }));
}

export function paidVouchersInPeriod(
  checkouts: Awaited<ReturnType<typeof readVoucherCheckouts>>,
  start: Date,
  endExclusive: Date,
) {
  return checkouts.flatMap((checkout) =>
    checkout.paidAt && checkout.paidAt >= start && checkout.paidAt < endExclusive
      ? [{ ...checkout, paidAt: checkout.paidAt }]
      : [],
  );
}

export function summarizeVoucherCheckouts(
  checkouts: Awaited<ReturnType<typeof readVoucherCheckouts>>,
  start: Date,
  endExclusive: Date,
) {
  const started = checkouts.filter(({ createdAt }) => createdAt >= start && createdAt < endExclusive);
  const paid = paidVouchersInPeriod(checkouts, start, endExclusive);
  return {
    started,
    paid,
    grossCents: paid.reduce((total, voucher) => total + voucher.totalCents, 0),
    closed: started.filter(({ failedAt, paidAt }) => failedAt && failedAt < endExclusive && (!paidAt || paidAt >= endExclusive)),
  };
}
