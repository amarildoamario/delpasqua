import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { routing } from "@/i18n/routing";
import { formatMoney } from "@/lib/money";
import { prisma, databaseReadOnly } from "@/lib/server/prisma";
import { requireAdminPage } from "@/lib/server/adminAuth";
import { isRemovableVoucherTest } from "@/lib/server/deleteVoucherProposal";
import { VoucherProposalIdSchema } from "@/lib/server/tastingVoucherProposal";
import { voucherCheckoutMode } from "@/lib/server/tastingVoucherPayment";
import { isTestVoucher } from "@/lib/server/voucherTest";
import PageHeader from "../../_components/PageHeader";
import { DeleteVoucherProposal, VoucherProposalEmailForm } from "../VoucherProposalForms";
import VoucherPaymentDetails, { voucherArchivePaymentSelect } from "../VoucherPaymentDetails";

const dateTime = new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Rome" });
const action = "inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50";

export default async function VoucherProposalPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params;
  if (!VoucherProposalIdSchema.safeParse(id).success) notFound();
  const base = `${locale === routing.defaultLocale ? "" : `/${locale}`}/admin/vouchers/`;
  const detailPath = `${base}${id}/`;
  if (!(await requireAdminPage(detailPath)).ok) redirect(`/login?next=${encodeURIComponent(detailPath)}`);
  const proposal = await prisma.tastingVoucherProposal.findUnique({ where: { id }, include: {
    _count: { select: { checkouts: true } },
    emails: { orderBy: { createdAt: "desc" }, select: {
      id: true, recipient: true, subject: true, body: true, createdAt: true, sentAt: true, lastError: true,
    } },
  } });
  if (!proposal) notFound();
  const payments = await prisma.tastingVoucher.findMany({
    where: { checkout: { proposalId: id } }, orderBy: { paidAt: "desc" },
    select: voucherArchivePaymentSelect,
  });
  const checkoutMode = voucherCheckoutMode();
  const paid = payments.length > 0;
  const removableTest = isRemovableVoucherTest(proposal.id);
  const pdf = `/api/admin/vouchers/${id}/document/`;
  return <div className="space-y-4">
    <Link href={base} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 hover:underline">
      <ArrowLeft size={16} aria-hidden="true" /> Archivio voucher
    </Link>
    <PageHeader
      title={proposal.tastingTitle}
      subtitle={`Proposta del ${dateTime.format(proposal.createdAt)}`}
      meta={<span className="font-mono" title={proposal.id}>ID {proposal.id.slice(0, 8)}</span>}
      actions={<>
        <a href={pdf} className={action}><Download size={16} aria-hidden="true" /> Scarica PDF</a>
        <a href={`/api/vouchers/${id}/checkout/`} target="_blank" rel="noreferrer" className={action}>
          Link di pagamento <ExternalLink size={14} aria-hidden="true" />
        </a>
      </>}
    />
    {checkoutMode !== "live" && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {checkoutMode === "test" ? "Checkout Stripe di prova attivo. Gli importi di prova sono esclusi dalle metriche."
        : "Anteprima disponibile. Il checkout richiede la configurazione Stripe e email."}
    </p>}
    <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:grid-cols-3 sm:p-6">
      <div>
        <dt className="text-xs font-semibold text-neutral-600">Importo proposto</dt>
        <dd className="mt-1 font-bold tabular-nums">{formatMoney(proposal.totalCents, "EUR")}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold text-neutral-600">Partecipanti</dt>
        <dd className="mt-1 text-sm font-semibold">Adulti {proposal.people} · Bambini {proposal.children}</dd>
      </div>
      <div>
        <dt className="text-xs font-semibold text-neutral-600">Stato del pagamento</dt>
        <dd className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${paid ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{paid ? "Pagato" : "Da pagare"}</span>
          {(isTestVoucher(proposal) || (paid && payments.every(isTestVoucher))) &&
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">Prova</span>}
        </dd>
      </div>
    </dl>
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
      <h2 className="text-lg font-bold">Pagamenti registrati</h2>
      {!paid && <p className="mt-2 text-sm text-neutral-600">Nessun pagamento registrato.</p>}
      <ul className="mt-2 divide-y divide-neutral-200">
        {payments.map((payment) => <li key={payment.id} className="py-3">
          <VoucherPaymentDetails payment={payment} people={proposal.people} />
        </li>)}
      </ul>
    </section>
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
    {!databaseReadOnly && (proposal._count.checkouts === 0 || removableTest) && (
      <div className="border-t border-neutral-200 pt-4">
        <DeleteVoucherProposal id={id} tastingTitle={proposal.tastingTitle} testRun={removableTest} returnTo={base} />
      </div>
    )}
  </div>;
}
