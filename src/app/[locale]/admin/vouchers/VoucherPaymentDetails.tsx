import { CalendarDays, Mail, Ticket } from "lucide-react";
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

export const voucherPaymentSelect = {
  id: true, codeDigest: true, sequence: true, isTest: true, totalCents: true,
  paidAt: true, email: true, phone: true, fullName: true,
  delivery: { select: { recipient: true, subject: true, body: true, createdAt: true, sentAt: true } },
  bookings: voucherBookingSelect,
} satisfies Prisma.TastingVoucherSelect;

type Payment = Prisma.TastingVoucherGetPayload<{ select: typeof voucherPaymentSelect }>;

export default function VoucherPaymentDetails({ payment, people }: { payment: Payment; people: number }) {
  const code = issuedVoucherCode(payment);
  const test = isTestVoucher(payment);
  const booking = payment.bookings[0];
  const number = voucherNumber(payment, people);
  const deliveryStatus = payment.delivery?.sentAt
    ? `Email a ${payment.delivery.recipient} il ${dateTime.format(payment.delivery.sentAt)}`
    : voucherEmailAllowed(test, payment.email) ? "Email del voucher in attesa di conferma"
      : "Email del voucher di prova non inviata";

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-900">Pagato</span>
        {test && <span className="rounded-full bg-neutral-200 px-2.5 py-1 text-xs font-semibold text-neutral-700">Prova</span>}
        <strong className="tabular-nums text-neutral-900">{formatMoney(payment.totalCents, "EUR")}</strong>
        <time dateTime={payment.paidAt.toISOString()} className="text-xs text-neutral-600 sm:ml-auto">{dateTime.format(payment.paidAt)}</time>
      </div>
      <div className="grid items-start gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="space-y-3 text-sm text-neutral-700">
          <div className="[overflow-wrap:anywhere]">
            {payment.fullName && <p className="font-semibold text-neutral-900">{payment.fullName}</p>}
            <p>{payment.email}{payment.phone && ` · ${payment.phone}`}</p>
          </div>
          <p className="flex items-start gap-2">
            <Ticket aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-neutral-500" />
            <span>Voucher <span className="font-mono text-xs font-semibold [overflow-wrap:anywhere]">{number}</span></span>
          </p>
        </div>
        <div className="min-w-0 rounded-xl bg-emerald-900 px-4 py-3 text-center text-white">
          <p className="text-xs font-semibold text-emerald-100">Codice di riscatto</p>
          {code ? <code className="mt-1 block select-all font-mono text-xl font-bold tracking-wider [overflow-wrap:anywhere] sm:text-2xl">{code}</code>
            : <p className="mt-1 text-sm font-semibold">Codice non disponibile</p>}
        </div>
      </div>
      <div className="grid gap-2 border-t border-neutral-200 px-4 py-3 text-xs text-neutral-600">
        <p className="flex items-start gap-2"><Mail aria-hidden="true" size={15} className="shrink-0" /><span className="[overflow-wrap:anywhere]">{deliveryStatus}</span></p>
        <p className="flex items-start gap-2">
          <CalendarDays aria-hidden="true" size={15} className="shrink-0" />
          <span>{booking ? `${voucherBookingLabel[booking.status]} · ${dateTime.format(booking.slotStart)}` : "Nessuna prenotazione attiva"}</span>
        </p>
      </div>
    </div>
  );
}
