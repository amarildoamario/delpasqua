import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/server/adminAuth";
import { prisma, databaseReadOnly } from "@/lib/server/prisma";
import { VoucherProposalIdSchema } from "@/lib/server/tastingVoucherProposal";
import { formatMoney } from "@/lib/money";
import { getTastingTypes } from "@/lib/tasting/slots";
import { routing } from "@/i18n/routing";
import PageHeader from "../_components/PageHeader";
import { DeleteVoucherProposal, VoucherProposalForm } from "./VoucherProposalForms";

const batchSize = 25;

export default async function VouchersPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ dopo?: string }>;
}) {
  const { locale } = await params;
  const base = `${locale === routing.defaultLocale ? "" : `/${locale}`}/admin/vouchers`;
  if (!(await requireAdminPage(base)).ok) redirect(`/login?next=${encodeURIComponent(base)}`);
  const cursor = VoucherProposalIdSchema.safeParse((await searchParams).dopo);
  const stored = await prisma.tastingVoucherProposal.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: batchSize + 1,
    ...(cursor.success ? { cursor: { id: cursor.data }, skip: 1 } : {}),
    select: { id: true, tastingTitle: true, people: true, children: true, totalCents: true, createdAt: true, _count: { select: { emails: true } } },
  }).catch((error: unknown) => {
    if (databaseReadOnly && typeof error === "object" && error !== null && "code" in error && error.code === "P2021") return null;
    throw error;
  });
  const proposals = stored?.slice(0, batchSize) ?? [];

  return <div className="mx-auto max-w-5xl space-y-6">
    <PageHeader title="Voucher" subtitle="Prepara una proposta di degustazione, scarica il PDF o invialo per email." />
    {databaseReadOnly ? <p className="text-sm text-neutral-600">{stored === null ? "L'archivio Voucher non è ancora disponibile in questo database." : "L'archivio è consultabile in sola lettura."}</p>
      : <VoucherProposalForm tastings={getTastingTypes().map(({ id, title }) => ({ id, title }))} detailBase={base} />}
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
      <h2 className="mb-3 text-lg font-bold">Archivio proposte</h2>
      {!proposals.length && <p className="text-sm text-neutral-600">Nessuna proposta da mostrare.</p>}
      <ul className="divide-y divide-neutral-200">
        {proposals.map((proposal) => <li key={proposal.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <Link href={`${base}/${proposal.id}/`} className="font-semibold underline decoration-neutral-400 underline-offset-4">{proposal.tastingTitle}</Link>
            <p className="mt-1 text-sm text-neutral-600">
              {proposal.createdAt.toLocaleDateString("it-IT", { timeZone: "Europe/Rome" })} · Adulti {proposal.people} · Bambini {proposal.children}
              {proposal._count.emails > 0 && ` · ${proposal._count.emails} email in archivio`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <strong className="text-sm tabular-nums">{formatMoney(proposal.totalCents, "EUR")}</strong>
            {!databaseReadOnly && <DeleteVoucherProposal id={proposal.id} tastingTitle={proposal.tastingTitle} />}
          </div>
        </li>)}
      </ul>
      <nav className="mt-3 flex flex-wrap gap-4 text-sm">
        {cursor.success && <Link className="underline" href={base}>Proposte recenti</Link>}
        {stored && stored.length > batchSize && <Link className="underline" href={`${base}/?dopo=${proposals.at(-1)?.id}`}>Proposte precedenti</Link>}
      </nav>
    </section>
  </div>;
}
