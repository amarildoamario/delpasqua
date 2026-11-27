import type { Prisma } from "@/generated/prisma";
import { issuedVoucherCode, voucherEmailAllowed, voucherNumber } from "@/lib/server/tastingVoucherPayment";
import { isTestVoucher } from "@/lib/server/voucherTest";

const dateTime = new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Rome" });

export const voucherArchivePaymentSelect = {
  id: true, codeDigest: true, sequence: true, isTest: true, totalCents: true,
  paidAt: true, email: true, phone: true, fullName: true,
  delivery: { select: { recipient: true, sentAt: true } },
} satisfies Prisma.TastingVoucherSelect;

type Payment = Prisma.TastingVoucherGetPayload<{ select: typeof voucherArchivePaymentSelect }>;

export default function VoucherPaymentDetails({ payment, people }: { payment: Payment; people: number }) {
  const code = issuedVoucherCode(payment);
  const test = isTestVoucher(payment);
  return <div className="space-y-1 text-sm">
    <p className="font-semibold text-emerald-800">Pagato · {dateTime.format(payment.paidAt)}{test && " · Prova"}</p>
    <p className="break-words text-neutral-700">{[payment.fullName, payment.email, payment.phone].filter(Boolean).join(" · ")}</p>
    <p className="text-neutral-600">
      Voucher {voucherNumber(payment, people)} · {code ? <>Codice <code className="font-semibold text-neutral-900">{code}</code></> : "Codice non disponibile"}
    </p>
    <p className="break-words text-neutral-600">{payment.delivery?.sentAt
      ? `Email a ${payment.delivery.recipient} il ${dateTime.format(payment.delivery.sentAt)}`
      : voucherEmailAllowed(test, payment.email) ? "Email del voucher in attesa di conferma"
        : "Email del voucher di prova non inviata"}</p>
  </div>;
}
