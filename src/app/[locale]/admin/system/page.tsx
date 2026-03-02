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
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "bg-amber-50 text-amber-800"
        : "bg-red-50 text-red-700";
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

async function fetchSystemData(wid?: string) {
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return Promise.all([
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
}

export default async function AdminSystemPage({
  searchParams,
}: {
  searchParams?: Promise<{ wid?: string }>;
}) {
  const { wid } = (await searchParams) ?? {};
  const [outboxCounts, outboxRecent, webhookCounts, webhookRecent, selectedWebhook] = await fetchSystemData(wid);

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
  // Tipizziamo per evitare `unknown` nel render.
  type OutboxRow = (typeof outboxRecent)[number];
  let correlatedOutbox: OutboxRow[] = [];
  if (selectedWebhook?.orderId) {
    const candidates = await prisma.outboxEvent.findMany({
      orderBy: { updatedAt: "desc" },
      take: 250,
    });

    correlatedOutbox = candidates.filter((e) => {
      const p = e.payload as Record<string, unknown> | null;
      return p && typeof p === "object" && p.orderId === selectedWebhook.orderId;
    }) as OutboxRow[];
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Webhooks & Outbox"
        subtitle="Salute integrazioni (ultimi 7 giorni per Stripe). Se qui diventa rosso, è probabile che ordini/pagamenti non stiano venendo processati come previsto."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-neutral-500">Outbox in coda</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="text-2xl font-bold text-neutral-900">{pending}</div>
            {pending === 0 ? <Pill label="OK" tone="ok" /> : <Pill label="Attenzione" tone="warn" />}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-neutral-500">Outbox falliti</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="text-2xl font-bold text-neutral-900">{failed}</div>
            {failed === 0 ? <Pill label="OK" tone="ok" /> : <Pill label="Da sistemare" tone="bad" />}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-neutral-500">Webhook Stripe problematici</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="text-2xl font-bold text-neutral-900">{webhookIssues}</div>
            {webhookIssues === 0 ? <Pill label="OK" tone="ok" /> : <Pill label="Controlla" tone="warn" />}
          </div>
          <div className="mt-2 text-xs text-neutral-500">Periodo: ultimi 7 giorni</div>
        </div>
      </div>

      {selectedWebhook ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-neutral-900">Dettaglio webhook selezionato</div>
            <Link className="text-xs text-neutral-600 underline hover:text-neutral-900" href="?">
              Chiudi
            </Link>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 p-3">
              <div className="text-xs text-neutral-500">Tipo</div>
              <div className="mt-1 text-sm text-neutral-900">{selectedWebhook.type}</div>
              <div className="mt-2">
                <Pill label={selectedWebhook.outcome} tone={outcomeTone(selectedWebhook.outcome)} />
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-3">
              <div className="text-xs text-neutral-500">Correlazioni</div>
              <div className="mt-1 text-xs text-neutral-700">
                <div><b>orderId:</b> {selectedWebhook.orderId ?? "—"}</div>
                <div><b>sessionId:</b> {selectedWebhook.sessionId ?? "—"}</div>
                <div><b>paymentIntentId:</b> {selectedWebhook.paymentIntentId ?? "—"}</div>
                <div><b>attempts:</b> {selectedWebhook.attempts}</div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-3">
              <div className="text-xs text-neutral-500">Timing</div>
              <div className="mt-1 text-xs text-neutral-700">
                <div><b>receivedAt:</b> {fmtTs(new Date(selectedWebhook.receivedAt))}</div>
                <div><b>processedAt:</b> {selectedWebhook.processedAt ? fmtTs(new Date(selectedWebhook.processedAt)) : "—"}</div>
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                {selectedWebhook.errorMessage ? <><b>error:</b> {selectedWebhook.errorMessage}</> : "Nessun errore."}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-neutral-900">Outbox correlata</div>
            <div className="mt-1 text-xs text-neutral-500">
              Match: OutboxEvent.payload.orderId == {selectedWebhook.orderId ?? "—"}
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-neutral-500">
                  <tr>
                    <th className="py-2 pr-4">Aggiornato</th>
                    <th className="py-2 pr-4">Tipo</th>
                    <th className="py-2 pr-4">Stato</th>
                    <th className="py-2 pr-4">Tentativi</th>
                    <th className="py-2 pr-4">Errore</th>
                    <th className="py-2">Retry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {correlatedOutbox.map((e) => (
                    <tr key={e.id}>
                      <td className="py-2 pr-4 text-neutral-700">{fmtTs(new Date(e.updatedAt))}</td>
                      <td className="py-2 pr-4 text-neutral-700">{e.type}</td>
                      <td className="py-2 pr-4">
                        <Pill label={e.status} tone={outboxTone(e.status)} />
                      </td>
                      <td className="py-2 pr-4 text-neutral-700">{e.attempts}</td>
                      <td className="py-2 pr-4 text-xs text-neutral-500">{e.lastError ? e.lastError.slice(0, 120) : "—"}</td>
                      <td className="py-2">
                        <OutboxRetryButton outboxId={e.id} status={e.status} />
                      </td>
                    </tr>
                  ))}
                  {selectedWebhook.orderId && correlatedOutbox.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-neutral-600">
                        Nessun evento correlato (assicurati che nel webhook tu crei OutboxEvent con payload.orderId).
                      </td>
                    </tr>
                  ) : null}
                  {!selectedWebhook.orderId ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-neutral-600">
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
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Outbox - ultimi eventi</div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-neutral-500">
                <tr>
                  <th className="py-2 pr-4">Aggiornato</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Stato</th>
                  <th className="py-2 pr-4">Tentativi</th>
                  <th className="py-2 pr-4">Errore</th>
                  <th className="py-2">Retry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {outboxRecent.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2 pr-4 text-neutral-700">{fmtTs(new Date(e.updatedAt))}</td>
                    <td className="py-2 pr-4 text-neutral-700">{e.type}</td>
                    <td className="py-2 pr-4">
                      <Pill label={e.status} tone={outboxTone(e.status)} />
                    </td>
                    <td className="py-2 pr-4 text-neutral-700">{e.attempts}</td>
                    <td className="py-2 pr-4 text-xs text-neutral-500">{e.lastError ? e.lastError.slice(0, 80) : "—"}</td>
                    <td className="py-2">
                      <OutboxRetryButton outboxId={e.id} status={e.status} />
                    </td>
                  </tr>
                ))}
                {outboxRecent.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-neutral-600">Nessun evento.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-neutral-900">Stripe webhooks - ultimi eventi</div>
          <div className="mt-1 text-xs text-neutral-500">Periodo: ultimi 7 giorni</div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-neutral-500">
                <tr>
                  <th className="py-2 pr-4">Ricevuto</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Esito</th>
                  <th className="py-2 pr-4">Tentativi</th>
                  <th className="py-2 pr-4">Order</th>
                  <th className="py-2">Errore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {webhookRecent.map((e) => (
                  <tr key={e.id} className="hover:bg-neutral-50">
                    <td className="py-2 pr-4 text-neutral-700">{fmtTs(new Date(e.receivedAt))}</td>
                    <td className="py-2 pr-4 text-neutral-700">{e.type}</td>
                    <td className="py-2 pr-4">
                      <Pill label={e.outcome} tone={outcomeTone(e.outcome)} />
                    </td>
                    <td className="py-2 pr-4 text-neutral-700">{e.attempts}</td>
                    <td className="py-2 pr-4 text-xs text-neutral-600">{e.orderId ?? "—"}</td>
                    <td className="py-2 text-xs text-neutral-500">{e.errorMessage ? e.errorMessage.slice(0, 80) : "—"}</td>
                    <td className="py-2 pl-2">
                      <Link
                        className="text-xs underline text-neutral-700 hover:text-neutral-900"
                        href={`?wid=${e.id}`}
                      >
                        Dettagli
                      </Link>
                    </td>
                  </tr>
                ))}
                {webhookRecent.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-neutral-600">Nessun evento.</td>
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