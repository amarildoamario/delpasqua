import type { PrismaClient } from "@/generated/prisma";
import { VOUCHER_TEST_AMOUNT_CENTS } from "./voucherTest";

// Production test runs verified on 27 November 2026. Their checkout history
// can be removed once; all other proposals with checkouts keep their history.
const testRuns = new Map([
  ["1dd4ea62-7157-4192-9bc5-b10d7b25815c", { checkoutId: "9bc1f84e-db32-4093-9597-ce4052907680" }],
  ["e33bf96e-dfdf-4e3f-a0f6-539198aad4dc", {
    checkoutId: "1e44e5c1-d9d0-4df2-8187-f83101e0be05",
    voucherId: "74b2c0aa-b89d-4ecf-be02-881c7dba6615",
    bookingId: "cmwy7ec4m000008jps23i75ts",
  }],
]);

export function isRemovableVoucherTest(id: string) {
  return testRuns.has(id);
}

export function isRemovedVoucherTestCheckout(id: string | undefined) {
  return [...testRuns.values()].some((test) => test.checkoutId === id);
}

export async function deleteVoucherProposal(db: Pick<PrismaClient, "$transaction">, id: string) {
  return db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "TastingVoucherProposal" WHERE id = ${id} FOR UPDATE`;
    const proposal = await tx.tastingVoucherProposal.findUnique({
      where: { id }, select: { tastingType: true, totalCents: true, _count: { select: { checkouts: true } } },
    });
    if (!proposal) return true;
    if (!proposal._count.checkouts) {
      await tx.tastingVoucherProposal.delete({ where: { id } });
      return true;
    }

    const test = testRuns.get(id);
    if (!test || proposal.totalCents !== VOUCHER_TEST_AMOUNT_CENTS || proposal.tastingType !== "intermedia" ||
      proposal._count.checkouts !== 1) return false;
    await tx.$queryRaw`SELECT id FROM "TastingVoucherCheckout" WHERE id = ${test.checkoutId} FOR UPDATE`;
    const checkout = await tx.tastingVoucherCheckout.findUnique({
      where: { id: test.checkoutId }, select: { proposalId: true, failedAt: true, voucher: { select: { id: true, totalCents: true } } },
    });
    if (!checkout || checkout.proposalId !== id || checkout.voucher?.id !== test.voucherId) return false;
    if (checkout.voucher) {
      const { id: voucherId, totalCents } = checkout.voucher;
      if (totalCents !== VOUCHER_TEST_AMOUNT_CENTS) return false;
      await tx.$queryRaw`SELECT id FROM "TastingVoucher" WHERE id = ${voucherId} FOR UPDATE`;
      const bookings = await tx.tastingBooking.findMany({ where: { voucherId }, select: { id: true } });
      if (bookings.some((booking) => booking.id !== test.bookingId)) return false;
      const outboxId = `voucher-email-${voucherId}`;
      const outbox = await tx.outboxEvent.findUnique({ where: { id: outboxId }, select: { status: true } });
      if (outbox && outbox.status !== "done") return false;
      await tx.tastingBooking.deleteMany({ where: { voucherId, id: test.bookingId } });
      await tx.tastingVoucherDelivery.deleteMany({ where: { voucherId } });
      await tx.outboxEvent.deleteMany({ where: { id: outboxId, status: "done" } });
      await tx.tastingVoucher.delete({ where: { id: voucherId } });
    } else if (!checkout.failedAt) {
      return false;
    }

    await tx.tastingVoucherCheckout.delete({ where: { id: test.checkoutId } });
    await tx.tastingVoucherProposal.delete({ where: { id } });
    return true;
  });
}
