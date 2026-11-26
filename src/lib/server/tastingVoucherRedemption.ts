import type { PrismaClient } from "@/generated/prisma/client";
import { z } from "zod";
import { buildWeekSlots, getTastingTypes, getWeekStartMonday } from "@/lib/tasting/slots";
import { databasePolicy } from "./databaseSafety.mjs";
import { voucherCodeDigest } from "./tastingVoucherPayment";

export const VoucherCodeInput = z.string().max(16).transform((value) =>
  value.trim().replace(/[\s-]/g, ""),
).pipe(z.string().regex(/^\d{6}$/));

export class VoucherBookingError extends Error {
  constructor(public code: "VOUCHER_INVALID" | "VOUCHER_USED" | "VOUCHER_SLOT", public status: 400 | 409) {
    super(code);
  }
}

export async function findRedeemableVoucher(db: Pick<PrismaClient, "tastingVoucher">, code: string) {
  const voucher = await db.tastingVoucher.findUnique({
    where: { codeDigest: voucherCodeDigest(code) },
    select: {
      id: true,
      isTest: true,
      checkout: { select: { proposal: { select: { tastingType: true, people: true, children: true } } } },
      bookings: { where: { status: { not: "CANCELED" } }, take: 1, select: { id: true } },
    },
  });
  if (!voucher || (voucher.isTest && databasePolicy().mode !== "local-development")) {
    throw new VoucherBookingError("VOUCHER_INVALID", 400);
  }
  const proposal = voucher.checkout.proposal;
  const type = getTastingTypes().find(({ id }) => id === proposal.tastingType);
  if (!type) throw new VoucherBookingError("VOUCHER_INVALID", 400);
  if (voucher.bookings.length) throw new VoucherBookingError("VOUCHER_USED", 409);
  return { id: voucher.id, type, people: proposal.people, children: proposal.children };
}

const romeDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
});
const romeClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Rome", hour: "2-digit", hourCycle: "h23", timeZoneName: "longOffset",
});

export function voucherBookingTimes(anchor: Date, time: string | undefined, durationMinutes: number) {
  // Use the same anchors exposed by the availability endpoint.
  const validAnchor = buildWeekSlots(getWeekStartMonday(anchor)).some(({ start }) => +start === +anchor);
  const [hour, minute] = (time ?? "").split(":").map(Number);
  const parts = romeClock.formatToParts(anchor);
  const morning = Number(parts.find(({ type }) => type === "hour")?.value) < 14;
  const matchesShift = morning ? hour >= 9 && hour <= 13 : hour >= 14 && hour <= 19;
  const offset = parts.find(({ type }) => type === "timeZoneName")?.value.replace("GMT", "");
  if (!validAnchor || !time || !matchesShift || minute > 59 || !offset) throw new VoucherBookingError("VOUCHER_SLOT", 400);

  // Daytime shifts share the anchor's UTC offset even on daylight saving change days.
  const slotStart = new Date(`${romeDay.format(anchor)}T${time}:00${offset}`);
  if (!Number.isFinite(+slotStart) || +slotStart <= Date.now()) throw new VoucherBookingError("VOUCHER_SLOT", 400);
  return { slotStart, slotEnd: new Date(+slotStart + durationMinutes * 60_000) };
}
