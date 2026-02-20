import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import OutboxRetryButton from "./OutboxRetryButton";
import PageHeader from "../_components/PageHeader";

export const dynamic = "force-dynamic";

function fmtTs(d: Date) {
  return d.toLocaleString("it-IT");
}

function Pill({ label, tone }: { label: string; tone: "ok" | "warn" | "bad" }) {
  const cls =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
      : tone === "warn"
      ? "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
      : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{label}</span>;
}

function outcomeTone(outcome: string): "ok" | "warn" | "bad" {
  if (outcome === "processed") return "ok";
  if (outcome === "review" || outcome === "ignored" || outcome === "duplicate") return "warn";
  return "bad";
}

function outboxTone(status: string): "ok" | "warn" | "bad" {
  if (status === "done") return "ok";
  if (status === "failed") return "bad";
  return "warn";
}

export default async function AdminSystemPage({
  searchParams,
}: {
  searchParams?: { wid?: string };
}) {
  const wid = searchParams?.wid;

  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [outboxCounts, outboxRecent, webhookCounts, webhookRecent, selectedWebhook] =
    await Promise.all([
      prisma.outboxEvent.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.outboxEvent.findMany({
        orderBy: { updatedAt: "desc" },
        take: 25,
      }),
      prisma.stripeWebhookEvent.groupBy({
        by: ["outcome"],
        where: { receivedAt: { gte: since7d } },
        _count: { _all: true },
      }),
      prisma.stripeWebhookEvent.findMany({
        where: { receivedAt: { gte: since7d } },
        orderBy: { receivedAt: "desc" },
        take: 25,
      }),
      wid
        ? prisma.stripeWebhookEvent.findUnique({
            where: { id: wid },
          })
        : Promise.resolve(null),
    ]);

  const outboxMap = new Map(outboxCounts.map((r) => [r.status, r._count._all]));
  const pending = (outboxMap.get("pending") ?? 0) + (outboxMap.get("processing") ?? 0);
  const failed = outboxMap.get("failed") ?? 0;

  const webhookMap = new Map(webhookCounts.map((r) => [r.outcome, r._count._all]));
  const webhookIssues =
    (webhookMap.get("failed_signature") ?? 0) +
    (webhookMap.get("failed_validation") ?? 0) +
    (webhookMap.get("failed_processing") ?? 0) +
    (webhookMap.get("review") ?? 0);

  // ✅ Outbox correlata: best-effort su payload.orderId (filtriamo in app)
  let correlatedOutbox: any[] = [];
  if (selectedWebhook?.orderId) {
    const candidates = await prisma.outboxEvent.findMany({
      orderBy: { updatedAt: "desc" },
      take: 250,
    });

    correlatedOutbox = candidates.filter((e) => {
      const p: any = e.payload as any;
      return p && typeof p === "object" && p.orderId === selectedWebhook.orderId;
    });
  }

  return (
    <div className="space-y-4">

      <PageHeader
  title="Webhooks & Outbox"
  subtitle="Salute integrazioni (ultimi 7 giorni per Stripe). Se qui diventa rosso, è probabile che ordini/pagamenti non stiano venendo processati come previsto."
/>

    

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Outbox in coda</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{pending}</div>
            {pending === 0 ? <Pill label="OK" tone="ok" /> : <Pill label="Attenzione" tone="warn" />}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Outbox falliti</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{failed}</div>
            {failed === 0 ? <Pill label="OK" tone="ok" /> : <Pill label="Da sistemare" tone="bad" />}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Webhook Stripe problematici</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{webhookIssues}</div>
            {webhookIssues === 0 ? <Pill label="OK" tone="ok" /> : <Pill label="Controlla" tone="warn" />}
          </div>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Periodo: ultimi 7 giorni</div>
        </div>
      </div>

      {selectedWebhook ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Dettaglio webhook selezionato</div>
            <Link className="text-xs text-neutral-600 underline hover:text-neutral-900 dark:text-neutral-300" href="?">
              Chiudi
            </Link>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Tipo</div>
              <div className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">{selectedWebhook.type}</div>
              <div className="mt-2">
                <Pill label={selectedWebhook.outcome} tone={outcomeTone(selectedWebhook.outcome)} />
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Correlazioni</div>
              <div className="mt-1 text-xs text-neutral-700 dark:text-neutral-200">
                <div><b>orderId:</b> {selectedWebhook.orderId ?? "—"}</div>
                <div><b>sessionId:</b> {selectedWebhook.sessionId ?? "—"}</div>
                <div><b>paymentIntentId:</b> {selectedWebhook.paymentIntentId ?? "—"}</div>
                <div><b>attempts:</b> {selectedWebhook.attempts}</div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Timing</div>
              <div className="mt-1 text-xs text-neutral-700 dark:text-neutral-200">
                <div><b>receivedAt:</b> {fmtTs(new Date(selectedWebhook.receivedAt))}</div>
                <div><b>processedAt:</b> {selectedWebhook.processedAt ? fmtTs(new Date(selectedWebhook.processedAt)) : "—"}</div>
              </div>
              <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                {selectedWebhook.errorMessage ? <><b>error:</b> {selectedWebhook.errorMessage}</> : "Nessun errore."}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Outbox correlata</div>
            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Match: OutboxEvent.payload.orderId == {selectedWebhook.orderId ?? "—"}
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-neutral-500 dark:text-neutral-400">
                  <tr>
                    <th className="py-2 pr-4">Aggiornato</th>
                    <th className="py-2 pr-4">Tipo</th>
                    <th className="py-2 pr-4">Stato</th>
                    <th className="py-2 pr-4">Tentativi</th>
                    <th className="py-2 pr-4">Errore</th>
                    <th className="py-2">Retry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {correlatedOutbox.map((e) => (
                    <tr key={e.id}>
                      <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-200">{fmtTs(new Date(e.updatedAt))}</td>
                      <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-200">{e.type}</td>
                      <td className="py-2 pr-4">
                        <Pill label={e.status} tone={outboxTone(e.status)} />
                      </td>
                      <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-200">{e.attempts}</td>
                      <td className="py-2 pr-4 text-xs text-neutral-500 dark:text-neutral-400">{e.lastError ? e.lastError.slice(0, 120) : "—"}</td>
                      <td className="py-2">
                        <OutboxRetryButton outboxId={e.id} status={e.status} />
                      </td>
                    </tr>
                  ))}
                  {selectedWebhook.orderId && correlatedOutbox.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-neutral-600 dark:text-neutral-300">
                        Nessun evento correlato (assicurati che nel webhook tu crei OutboxEvent con payload.orderId).
                      </td>
                    </tr>
                  ) : null}
                  {!selectedWebhook.orderId ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-neutral-600 dark:text-neutral-300">
                        Questo webhook non ha orderId: non posso correlare Outbox.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Outbox - ultimi eventi</div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-neutral-500 dark:text-neutral-400">
                <tr>
                  <th className="py-2 pr-4">Aggiornato</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Stato</th>
                  <th className="py-2 pr-4">Tentativi</th>
                  <th className="py-2 pr-4">Errore</th>
                  <th className="py-2">Retry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {outboxRecent.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-200">{fmtTs(new Date(e.updatedAt))}</td>
                    <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-200">{e.type}</td>
                    <td className="py-2 pr-4">
                      <Pill label={e.status} tone={outboxTone(e.status)} />
                    </td>
                    <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-200">{e.attempts}</td>
                    <td className="py-2 pr-4 text-xs text-neutral-500 dark:text-neutral-400">{e.lastError ? e.lastError.slice(0, 80) : "—"}</td>
                    <td className="py-2">
                      <OutboxRetryButton outboxId={e.id} status={e.status} />
                    </td>
                  </tr>
                ))}
                {outboxRecent.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-neutral-600 dark:text-neutral-300">Nessun evento.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Stripe webhooks - ultimi eventi</div>
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Periodo: ultimi 7 giorni</div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-neutral-500 dark:text-neutral-400">
                <tr>
                  <th className="py-2 pr-4">Ricevuto</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Esito</th>
                  <th className="py-2 pr-4">Tentativi</th>
                  <th className="py-2 pr-4">Order</th>
                  <th className="py-2">Errore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {webhookRecent.map((e) => (
                  <tr key={e.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-200">{fmtTs(new Date(e.receivedAt))}</td>
                    <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-200">{e.type}</td>
                    <td className="py-2 pr-4">
                      <Pill label={e.outcome} tone={outcomeTone(e.outcome)} />
                    </td>
                    <td className="py-2 pr-4 text-neutral-700 dark:text-neutral-200">{e.attempts}</td>
                    <td className="py-2 pr-4 text-xs text-neutral-600 dark:text-neutral-300">{e.orderId ?? "—"}</td>
                    <td className="py-2 text-xs text-neutral-500 dark:text-neutral-400">{e.errorMessage ? e.errorMessage.slice(0, 80) : "—"}</td>
                    <td className="py-2 pl-2">
                      <Link
                        className="text-xs underline text-neutral-700 hover:text-neutral-900 dark:text-neutral-200"
                        href={`?wid=${e.id}`}
                      >
                        Dettagli
                      </Link>
                    </td>
                  </tr>
                ))}
                {webhookRecent.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-neutral-600 dark:text-neutral-300">Nessun evento.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
