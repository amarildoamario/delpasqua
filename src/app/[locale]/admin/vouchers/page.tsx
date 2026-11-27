import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowDown, ArrowRight, ChevronDown, Plus, Search, Ticket } from "lucide-react";
import type { Prisma } from "@/generated/prisma";
import { routing } from "@/i18n/routing";
import { formatMoney } from "@/lib/money";
import { requireAdminPage } from "@/lib/server/adminAuth";
import { prisma, databaseReadOnly } from "@/lib/server/prisma";
import { VoucherProposalIdSchema } from "@/lib/server/tastingVoucherProposal";
import { voucherNumber } from "@/lib/server/tastingVoucherPayment";
import { isTestVoucher } from "@/lib/server/voucherTest";
import { getTastingTypes } from "@/lib/tasting/slots";
import PageHeader from "../_components/PageHeader";
import { VoucherProposalForm } from "./VoucherProposalForms";
import { voucherBookingLabel, voucherBookingSelect } from "./VoucherPaymentDetails";

const batchSize = 25;
const date = new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeZone: "Europe/Rome" });
const time = new Intl.DateTimeFormat("it-IT", { timeStyle: "short", timeZone: "Europe/Rome" });
const columns = "xl:grid-cols-[minmax(5.5rem,0.8fr)_minmax(0,1.45fr)_minmax(0,1.4fr)_minmax(8.5rem,1.15fr)_minmax(5.25rem,0.72fr)_5.5rem]";
const field = "h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-base text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-700 sm:text-sm";
const action = "inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50";

export default async function VouchersPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ dopo?: string; q?: string; stato?: string }>;
}) {
  const { locale } = await params;
  const base = `${locale === routing.defaultLocale ? "" : `/${locale}`}/admin/vouchers/`;
  if (!(await requireAdminPage(base)).ok) redirect(`/login?next=${encodeURIComponent(base)}`);

  const filters = await searchParams;
  const cursor = VoucherProposalIdSchema.safeParse(filters.dopo);
  const q = typeof filters.q === "string" ? filters.q.trim().slice(0, 160) : "";
  const status = filters.stato === "pagato" || filters.stato === "da-pagare" ? filters.stato : "";
  const paidCheckout = { some: { voucher: { isNot: null } } };
  const where: Prisma.TastingVoucherProposalWhereInput = {};
  if (status === "pagato") where.checkouts = paidCheckout;
  if (status === "da-pagare") where.NOT = { checkouts: paidCheckout };
  if (q) {
    const escaped = q.replace(/[\\%_]/g, "\\$&");
    const contains = { contains: escaped, mode: "insensitive" } as const;
    const numberMatch = /^DP\d{2}-\d{2}P-\d{4}-(\d+)$/i.exec(q);
    const sequence = Number(numberMatch?.[1]);
    where.OR = [
      { id: { startsWith: escaped, mode: "insensitive" } },
      { tastingTitle: contains },
      { emails: { some: { recipient: contains } } },
      { checkouts: { some: { voucher: { is: { OR: [
        { fullName: contains },
        { email: contains },
        ...(sequence > 0 && sequence <= 2147483647 ? [{ sequence }] : []),
      ] } } } } },
    ];
  }

  const stored = await prisma.tastingVoucherProposal.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: batchSize + 1,
    ...(cursor.success ? { cursor: { id: cursor.data }, skip: 1 } : {}),
    select: {
      id: true, tastingTitle: true, people: true, children: true, totalCents: true, createdAt: true,
      emails: { orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 1, select: { recipient: true } },
      checkouts: {
        where: { voucher: { isNot: null } },
        orderBy: [{ voucher: { paidAt: "desc" } }, { id: "desc" }],
        select: { voucher: { select: {
          id: true, sequence: true, paidAt: true, totalCents: true, isTest: true, fullName: true, email: true,
          delivery: { select: { sentAt: true } },
          bookings: voucherBookingSelect,
        } } },
      },
    },
  }).catch((error: unknown) => {
    if (databaseReadOnly && typeof error === "object" && error !== null && "code" in error && error.code === "P2021") return null;
    throw error;
  });
  const proposals = stored?.slice(0, batchSize) ?? [];
  const last = proposals.at(-1);
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (status) query.set("stato", status);
  const firstPage = query.size ? `${base}?${query}` : base;
  if (last) query.set("dopo", last.id);

  return (
    <div className="space-y-4">
      <PageHeader title="Voucher" subtitle="Proposte di degustazione, pagamenti e prenotazioni collegate." />
      {databaseReadOnly ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {stored === null ? "L’archivio Voucher non è ancora disponibile in questo database." : "L’archivio è consultabile in sola lettura."}
        </p>
      ) : (
        <details suppressHydrationWarning className="group rounded-2xl border border-neutral-200 bg-white">
          <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 [&::-webkit-details-marker]:hidden">
            <span className="rounded-lg bg-neutral-900 p-1.5 text-white"><Plus size={16} aria-hidden="true" /></span>
            Nuova proposta
            <ChevronDown size={16} aria-hidden="true" className="ml-auto text-neutral-500 group-open:rotate-180" />
          </summary>
          <VoucherProposalForm tastings={getTastingTypes().map(({ id, title }) => ({ id, title }))} detailBase={base} />
        </details>
      )}

      {stored !== null && (
        <section aria-labelledby="voucher-archive-title" className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/70">
          <div className="space-y-3 p-4">
            <h2 id="voucher-archive-title" className="text-base font-bold text-neutral-900">Archivio proposte</h2>
            <form key={firstPage} action={base} method="get" className="grid grid-cols-[1fr_auto] items-end gap-2 sm:flex sm:flex-wrap">
              <label className="col-span-2 block min-w-0 sm:max-w-md sm:flex-1">
                <span className="mb-1 block text-xs font-semibold text-neutral-700">Cerca nell’archivio</span>
                <span className="relative block">
                  <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-neutral-500" />
                  <input type="search" name="q" defaultValue={q} maxLength={160} placeholder="Nome, email o n. voucher" className={`${field} pl-9`} />
                </span>
              </label>
              <label className="block min-w-0">
                <span className="mb-1 block text-xs font-semibold text-neutral-700">Stato del pagamento</span>
                <select name="stato" defaultValue={status} className={field}>
                  <option value="">Tutti gli stati</option>
                  <option value="da-pagare">Da pagare</option>
                  <option value="pagato">Pagato</option>
                </select>
              </label>
              <button className="h-10 rounded-xl bg-neutral-900 px-4 text-sm font-semibold text-white hover:bg-neutral-700">Filtra</button>
              {(q || status) && <Link href={base} className="col-span-2 px-2 py-2 text-sm font-semibold text-neutral-700 underline underline-offset-4">Azzera filtri</Link>}
            </form>
          </div>

          {proposals.length > 0 ? (
            <>
              <div aria-hidden="true" className={`hidden gap-4 border-y border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold text-neutral-600 xl:grid ${columns}`}>
                <span className="flex items-center gap-1">Data <ArrowDown size={12} /></span>
                <span>Proposta</span><span>Contatto</span><span>Stato</span><span>Importo</span><span className="text-right">Azioni</span>
              </div>
              <ul role="list" className="divide-y divide-neutral-200 border-t border-neutral-200 xl:border-t-0">
                {proposals.map((proposal) => {
                  const payment = proposal.checkouts[0]?.voucher;
                  const booking = payment?.bookings[0];
                  const recipient = proposal.emails[0]?.recipient;
                  const detail = `${base}${proposal.id}/`;
                  return (
                    <li key={proposal.id} className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 p-4 text-sm hover:bg-neutral-50/80 ${columns}`}>
                      <div className="col-span-2 text-xs text-neutral-500 xl:col-span-1">
                        <time dateTime={proposal.createdAt.toISOString()}>
                          <span className="font-medium text-neutral-700 xl:block">{date.format(proposal.createdAt)}</span>
                          <span className="xl:block"><span aria-hidden="true" className="xl:hidden"> · </span>{time.format(proposal.createdAt)}</span>
                        </time>
                      </div>
                      <div className="min-w-0">
                        <Link href={detail} className="font-bold text-neutral-900 [overflow-wrap:anywhere] hover:underline">{proposal.tastingTitle}</Link>
                        <p className="mt-0.5 text-xs text-neutral-600">Adulti {proposal.people} · Bambini {proposal.children}</p>
                        <p className="mt-1 font-mono text-xs text-neutral-600 [overflow-wrap:anywhere]" title={payment ? undefined : proposal.id}>
                          {payment ? voucherNumber(payment, proposal.people) : `ID ${proposal.id.slice(0, 8)}`}
                        </p>
                      </div>
                      <div className="col-span-2 min-w-0 xl:col-span-1">
                        {payment ? (
                          <>
                            <p className="font-medium text-neutral-900 [overflow-wrap:anywhere]">{payment.fullName || "Acquirente"}</p>
                            <p className="text-xs text-neutral-600 [overflow-wrap:anywhere]">{payment.email}</p>
                          </>
                        ) : recipient ? (
                          <>
                            <p className="font-medium text-neutral-900">Destinatario proposta</p>
                            <p className="text-xs text-neutral-600 [overflow-wrap:anywhere]">{recipient}</p>
                          </>
                        ) : <p className="text-xs text-neutral-500">Nessun contatto registrato</p>}
                      </div>
                      <div className="col-span-2 xl:col-span-1">
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${payment ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{payment ? "Pagato" : "Da pagare"}</span>
                          {(isTestVoucher(proposal) || (payment && isTestVoucher(payment))) &&
                            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">Prova</span>}
                        </div>
                        {payment && <p className="mt-1 text-xs text-neutral-600">Pagamento del {date.format(payment.paidAt)}</p>}
                        {payment?.delivery?.sentAt && <p className="mt-0.5 text-xs text-neutral-600">Voucher inviato</p>}
                        {booking && <p className="mt-0.5 text-xs font-medium text-sky-800">{voucherBookingLabel[booking.status]} · {date.format(booking.slotStart)}</p>}
                        {proposal.checkouts.length > 1 && <p className="mt-0.5 text-xs text-neutral-600">{proposal.checkouts.length} pagamenti registrati</p>}
                      </div>
                      <div className="col-start-2 row-start-2 text-right xl:col-start-auto xl:row-start-auto xl:text-left">
                        <p className="whitespace-nowrap font-bold tabular-nums text-neutral-900">{formatMoney(payment?.totalCents ?? proposal.totalCents, "EUR")}</p>
                        <p className="text-xs text-neutral-500">{payment ? "Ultimo pagamento" : "Proposto"}</p>
                      </div>
                      <div className="col-span-2 flex flex-wrap gap-2 xl:col-span-1 xl:justify-end">
                        <Link href={detail} className={action} aria-label={`Apri proposta ${proposal.tastingTitle}`}>Apri <ArrowRight size={14} aria-hidden="true" /></Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <div className="grid justify-items-center gap-2 border-t border-neutral-200 px-4 py-10 text-center">
              <Ticket size={24} aria-hidden="true" className="text-neutral-400" />
              <p className="text-sm font-semibold text-neutral-900">{q || status ? "Nessuna proposta corrisponde ai filtri" : cursor.success ? "Nessuna proposta in questa pagina" : "Nessuna proposta in archivio"}</p>
            </div>
          )}

          {(cursor.success || stored.length > batchSize) && (
            <nav aria-label="Paginazione proposte" className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 px-4 py-3">
              <div>{cursor.success && <Link href={firstPage} className={action}>Proposte recenti</Link>}</div>
              {last && stored.length > batchSize && <Link href={`${base}?${query}`} className={action}>Proposte precedenti <ArrowRight size={14} aria-hidden="true" /></Link>}
            </nav>
          )}
        </section>
      )}
    </div>
  );
}
