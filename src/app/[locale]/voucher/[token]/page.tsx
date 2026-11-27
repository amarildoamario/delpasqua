import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { formatMoney } from "@/lib/money";
import { prisma } from "@/lib/server/prisma";
import { VoucherProposalIdSchema } from "@/lib/server/tastingVoucherProposal";
import { voucherCheckoutMode } from "@/lib/server/tastingVoucherPayment";
import { isTestVoucher } from "@/lib/server/voucherTest";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Proposta degustazione | Frantoio Del Pasqua",
  robots: { index: false, follow: false },
  referrer: "same-origin",
};

export default async function VoucherProposalPreview({ params, searchParams }: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ checkout?: string; attempt?: string }>;
}) {
  const { token } = await params;
  if (!VoucherProposalIdSchema.safeParse(token).success) notFound();
  const proposal = await prisma.tastingVoucherProposal.findUnique({
    where: { id: token }, select: { tastingTitle: true, people: true, children: true, totalCents: true },
  });
  if (!proposal) notFound();
  const { checkout, attempt } = await searchParams;
  const mode = voucherCheckoutMode();
  if (!checkout && mode) redirect(`/api/vouchers/${token}/checkout/`);
  const attemptId = VoucherProposalIdSchema.safeParse(attempt);
  const completed = (checkout === "completed" || checkout === "processing" || checkout === "paid") && mode && attemptId.success
    ? await prisma.tastingVoucherCheckout.findFirst({
      where: { id: attemptId.data, proposalId: token }, select: { failedAt: true, voucher: { select: { id: true } } },
    }) : null;
  const messages: Record<string, string> = {
    cancelled: "Pagamento annullato. Puoi riprovare quando vuoi.",
    paid: "Per questa proposta il pagamento risulta già registrato.",
    processing: "Pagamento in elaborazione. Ricarica questa pagina tra poco.",
    rate: "Troppi tentativi. Attendi un minuto.",
    unavailable: "Checkout temporaneamente non disponibile. Riprova tra poco.",
    internal: "Per le prove usa Stripe Sandbox nell’ambiente locale.",
  };
  const failed = !!completed?.failedAt && !completed.voucher;
  const status = completed
    ? completed.voucher ? (mode === "test" || isTestVoucher(proposal) ? "Pagamento di prova registrato." : "Pagamento confermato. Riceverai il voucher via email.") : failed
      ? "Il pagamento non è andato a buon fine. Puoi riprovare." : "Attendiamo la conferma del pagamento da Stripe."
    : checkout && messages[checkout];
  const canStart = failed || (!completed && checkout !== "paid" && checkout !== "processing" && checkout !== "internal");

  return <main className="mx-auto max-w-xl px-5 py-12">
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
      <p className="text-sm font-semibold text-red-800">Proposta voucher</p>
      <h1 className="mt-2 text-3xl font-bold">{proposal.tastingTitle}</h1>
      <p className="mt-2 text-neutral-700">Adulti {proposal.people} · Bambini {proposal.children}</p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-neutral-200 py-4">
        <span>Prezzo totale concordato</span><strong className="text-xl tabular-nums">{formatMoney(proposal.totalCents, "EUR")}</strong>
      </div>
      {status && <p role="status" className="mt-5 text-sm text-neutral-700">{status}</p>}
      {mode ? <div className="mt-5">
        {mode === "test" && <p className="text-sm text-neutral-600">Checkout Stripe in modalità di prova.</p>}
        {canStart && <form action={`/api/vouchers/${token}/checkout/`} method="post" className="mt-3">
          <button className="font-semibold text-sky-800 underline underline-offset-4">{mode === "test" ? "Vai al pagamento di prova" : "Vai al pagamento"}</button>
        </form>}
      </div> : <p className="mt-5 text-sm text-neutral-600">Il pagamento online sarà disponibile quando il servizio voucher sarà attivo.</p>}
    </section>
  </main>;
}
