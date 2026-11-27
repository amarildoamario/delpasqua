import type { Prisma, TastingBookingStatus } from "@/generated/prisma";
import { formatMoney } from "@/lib/money";
import { issuedVoucherCode, voucherEmailAllowed, voucherNumber } from "@/lib/server/tastingVoucherPayment";
import { isTestVoucher } from "@/lib/server/voucherTest";

const dateTime = new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Rome" });

export const voucherBookingSelect = {
  where: { status: { not: "CANCELED" } },
  take: 1,
  select: { status: true, slotStart: true },
} satisfies Prisma.TastingBookingFindManyArgs;

export const voucherBookingLabel: Record<TastingBookingStatus, string> = {
  PENDING: "Prenotazione in attesa",
  CONFIRMED: "Prenotazione confermata",
  CANCELED: "Prenotazione annullata",
};

export const voucherArchivePaymentSelect = {
  id: true, codeDigest: true, sequence: true, isTest: true, totalCents: true,
  paidAt: true, email: true, phone: true, fullName: true,
  delivery: { select: { recipient: true, sentAt: true } },
  bookings: voucherBookingSelect,
} satisfies Prisma.TastingVoucherSelect;

type Payment = Prisma.TastingVoucherGetPayload<{ select: typeof voucherArchivePaymentSelect }>;

export default function VoucherPaymentDetails({ payment, people }: { payment: Payment; people: number }) {
  const code = issuedVoucherCode(payment);
  const test = isTestVoucher(payment);
  const booking = payment.bookings[0];
  return <div className="space-y-1 text-sm">
    <p className="font-semibold text-emerald-800">Pagato · {formatMoney(payment.totalCents, "EUR")} · {dateTime.format(payment.paidAt)}{test && " · Prova"}</p>
    <p className="break-words text-neutral-700">{[payment.fullName, payment.email, payment.phone].filter(Boolean).join(" · ")}</p>
    <p className="text-neutral-600">
      Voucher {voucherNumber(payment, people)} · {code ? <>Codice <code className="font-semibold text-neutral-900">{code}</code></> : "Codice non disponibile"}
    </p>
    <p className="break-words text-neutral-600">{payment.delivery?.sentAt
      ? `Email a ${payment.delivery.recipient} il ${dateTime.format(payment.delivery.sentAt)}`
      : voucherEmailAllowed(test, payment.email) ? "Email del voucher in attesa di conferma"
        : "Email del voucher di prova non inviata"}</p>
    <p className="text-neutral-600">{booking ? `${voucherBookingLabel[booking.status]} · ${dateTime.format(booking.slotStart)}` : "Nessuna prenotazione attiva"}</p>
  </div>;
}
