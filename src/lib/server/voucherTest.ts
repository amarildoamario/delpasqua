import type { Prisma } from "@/generated/prisma";

export const VOUCHER_TEST_AMOUNT_CENTS = 50;

export function isTestVoucher(payment: { isTest?: boolean; livemode?: boolean; totalCents: number }) {
  return payment.isTest === true || payment.livemode === false || payment.totalCents === VOUCHER_TEST_AMOUNT_CENTS;
}

export const commercialTastingBooking: Prisma.TastingBookingWhereInput = {
  OR: [
    { voucherId: null },
    { voucher: { isTest: false, totalCents: { not: VOUCHER_TEST_AMOUNT_CENTS }, checkout: { livemode: true } } },
  ],
};
