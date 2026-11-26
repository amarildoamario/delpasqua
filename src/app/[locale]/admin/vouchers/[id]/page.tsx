import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { formatMoney } from "@/lib/money";
import { prisma, databaseReadOnly } from "@/lib/server/prisma";
import { requireAdminPage } from "@/lib/server/adminAuth";
import { VoucherProposalIdSchema } from "@/lib/server/tastingVoucherProposal";
import { voucherCheckoutMode, voucherEmailAllowed, voucherNumber } from "@/lib/server/tastingVoucherPayment";
import PageHeader from "../../_components/PageHeader";
import { VoucherProposalEmailForm } from "../VoucherProposalForms";

const dateTime = new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Rome" });

export default async function VoucherProposalPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  if (!VoucherProposalIdSchema.safeParse(id).success) notFound();
  const base = locale === routing.defaultLocale ? "" : `/${locale}`;
  const detailPath = `${base}/admin/vouchers/${id}/`;
  if (!(await requireAdminPage(detailPath)).ok) redirect(`/login?next=${encodeURIComponent(detailPath)}`);
  const proposal = await prisma.tastingVoucherProposal.findUnique({ where: { id }, include: {
    emails: { orderBy: { createdAt: "desc" }, select: {
      id: true, recipient: true, subject: true, body: true, createdAt: true, sentAt: true, lastError: true,
    } },
  } });
  if (!proposal) notFound();
  const payments = await prisma.tastingVoucher.findMany({
    where: { checkout: { proposalId: id } }, orderBy: { paidAt: "desc" },
    select: { sequence: true, isTest: true, paidAt: true, email: true, phone: true, fullName: true,
      delivery: { select: { sentAt: true } } },
  });
  const checkoutMode = voucherCheckoutMode();
  const pdf = `/api/admin/vouchers/${id}/document/`;
  return <div className="mx-auto max-w-5xl space-y-6">
    <Link href={`${base}/admin/vouchers/`} className="text-sm font-semibold underline">Torna a Voucher</Link>
    <PageHeader title={proposal.tastingTitle} subtitle={`Proposta del ${dateTime.format(proposal.createdAt)}`} />
    {checkoutMode !== "live" && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {checkoutMode === "test" ? "Checkout Stripe di prova attivo. Gli importi di prova sono esclusi dalle metriche."
        : "Anteprima disponibile. Il checkout richiede la configurazione Stripe e email."}
    </p>}
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
      <div>
        <p className="text-sm text-neutral-600">Adulti {proposal.people} · Bambini {proposal.children}</p>
        <p className="mt-1 text-xl font-bold tabular-nums">{formatMoney(proposal.totalCents, "EUR")}</p>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
        <a href={pdf} className="underline underline-offset-4">Scarica PDF</a>
        <a href={`/voucher/${id}/`} target="_blank" rel="noreferrer" className="underline underline-offset-4">Apri il link della proposta</a>
      </div>
    </section>
    {payments.length > 0 && <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
      <h2 className="text-lg font-bold">Pagamenti registrati</h2>
      <ul className="mt-2 divide-y divide-neutral-200">
        {payments.map((payment) => <li key={payment.sequence} className="space-y-1 py-3 text-sm">
          <p className="font-semibold">{voucherNumber(payment, proposal.people)}{payment.isTest && " · Prova esclusa dalle metriche"}</p>
          <p className="break-words text-neutral-700">{[payment.fullName, payment.email, payment.phone].filter(Boolean).join(" · ")}</p>
          <p className="text-neutral-600">{dateTime.format(payment.paidAt)}</p>
          <p className="text-neutral-600">{payment.delivery?.sentAt
            ? `Email accettata dal servizio di invio il ${dateTime.format(payment.delivery.sentAt)}`
            : voucherEmailAllowed(payment.isTest, payment.email) ? "Email del voucher in attesa di conferma"
              : "Email di prova non abilitata per questo indirizzo"}</p>
        </li>)}
      </ul>
    </section>}
    <div className="grid items-start gap-6 lg:grid-cols-2">
      {!databaseReadOnly && <VoucherProposalEmailForm id={id} tastingTitle={proposal.tastingTitle} />}
      <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        <h2 className="text-lg font-bold">Storico email</h2>
        {!proposal.emails.length && <p className="mt-3 text-sm text-neutral-600">Nessuna email in archivio.</p>}
        <ul className="mt-2 divide-y divide-neutral-200">
          {proposal.emails.map((email) => <li key={email.id} className="space-y-2 py-3 text-sm">
            <p className="break-words font-semibold">{email.recipient}</p>
            <p className="text-neutral-600">{dateTime.format(email.sentAt ?? email.createdAt)} · {email.sentAt ? "Accettata dal servizio email" : email.lastError ? "Invio non confermato" : "In attesa di conferma"}</p>
            <details>
              <summary className="cursor-pointer break-words font-medium">{email.subject}</summary>
              <p className="mt-2 whitespace-pre-wrap break-words text-neutral-700">{email.body}</p>
            </details>
            <a className="underline" href={`${pdf}?email=${email.id}`}>Scarica allegato</a>
          </li>)}
        </ul>
      </section>
    </div>
  </div>;
}
