import InfoTooltip from "./InfoTooltip";
import type { CommercialEconomicsSummary } from "@/lib/server/commercialTransactions";
import type { V7ReconciliationReport } from "@/lib/server/metricsAnalyticsV7";

type DailyRow = {
  date: string;
  weekday: string;
  isPartial: boolean;
  isObserved: boolean;
  paidOrders: number;
  revenueCents: number;
  revenueEur: number;
  revenueByChannel: {
    storefrontEur: number;
    quoteEur: number;
    voucherEur: number;
    tastingEur: number;
  };
};

type Forecasts = {
  completeDaysSample: number;
  trafficBaseline: {
    avgSessionsPerCompleteDay: number;
    projected30dSessionsAtConstantPace: number | null;
    note: string;
  } | null;
  operationalBaseline: {
    launchDate: string;
    completeOperationalDays: number;
    sessions: number;
    avgSessionsPerDay: number | null;
    projected30dSessions: number | null;
    note: string;
  } | null;
};

type Props = {
  economics: CommercialEconomicsSummary;
  daily: DailyRow[];
  forecasts: Forecasts;
  reconciliation: V7ReconciliationReport;
  periodLabel: string;
  observedThrough: string;
  isPartialPeriod: boolean;
  attributionCoverage: {
    session: number | null;
    source: number | null;
    device: number | null;
  };
  customerIdentificationCoverage: number | null;
  unavailableMetrics: string[];
};

const eurFmt = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });
const numFmt = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 2 });

function eur(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return eurFmt.format(value);
}

function pct(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${numFmt.format(value * 100)}%`;
}

export default function V7EconomicsSection({
  economics,
  daily,
  forecasts,
  reconciliation,
  periodLabel,
  observedThrough,
  isPartialPeriod,
  attributionCoverage,
  customerIdentificationCoverage,
  unavailableMetrics,
}: Props) {
  const daysWithPayments = daily.filter((d) => d.revenueCents > 0 || d.paidOrders > 0);
  const maxDayEur = Math.max(1, ...daysWithPayments.map((d) => d.revenueEur));

  return (
    <div className="space-y-4 min-w-0 max-w-full">
      {/* Performance economica per canale */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-3.5 sm:p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-1 text-sm font-extrabold text-neutral-900">
              Incassi per canale commerciale
              <InfoTooltip
                label="Incassi per canale commerciale"
                description="Sorgente unica backend basata su paidAt (incassi lordi) e refundedAt (rimborsi del periodo). L'importo medio mostra — quando un canale non ha transazioni pagate."
              />
            </h2>
            <p className="text-xs text-neutral-500">
              {economics.displayLabel} · Net cash = incassi lordi − rimborsi nel periodo
            </p>
          </div>
          <div className="text-xs font-semibold text-neutral-700 tabular-nums">
            Totale netto: <strong className="text-neutral-900">{eur(economics.netCashEur)}</strong>
            {economics.refundsInPeriodCents > 0 ? (
              <span className="ml-2 text-rose-700">Rimborsi: −{eur(economics.refundsInPeriodEur)}</span>
            ) : null}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs tabular-nums">
            <thead className="border-y border-neutral-200 bg-neutral-50 text-neutral-600">
              <tr>
                <th scope="col" className="px-2.5 py-2 font-bold">Canale</th>
                <th scope="col" className="px-2.5 py-2 text-right font-bold">Transazioni</th>
                <th scope="col" className="px-2.5 py-2 text-right font-bold">Incassi lordi</th>
                <th scope="col" className="px-2.5 py-2 text-right font-bold">Rimborsi</th>
                <th scope="col" className="px-2.5 py-2 text-right font-bold">Incassi netti</th>
                <th scope="col" className="px-2.5 py-2 text-right font-bold">Importo medio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {economics.revenueByChannel.map((row) => (
                <tr key={row.channel}>
                  <th scope="row" className="px-2.5 py-2 font-medium text-neutral-900">{row.label}</th>
                  <td className="px-2.5 py-2 text-right text-neutral-700">{numFmt.format(row.paidTransactions)}</td>
                  <td className="px-2.5 py-2 text-right font-semibold text-neutral-900">{eur(row.grossRevenueEur)}</td>
                  <td className="px-2.5 py-2 text-right text-neutral-600">
                    {row.refundsInPeriodCents > 0 ? `−${eur(row.refundsInPeriodEur)}` : eur(0)}
                  </td>
                  <td className="px-2.5 py-2 text-right font-semibold text-neutral-900">{eur(row.netCashEur)}</td>
                  <td className="px-2.5 py-2 text-right text-neutral-700">{eur(row.averageTransactionEur)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-neutral-200 bg-neutral-50/70 font-bold text-neutral-900">
              <tr>
                <th scope="row" className="px-2.5 py-2">Totale commerciale</th>
                <td className="px-2.5 py-2 text-right">{numFmt.format(economics.paidTransactions)}</td>
                <td className="px-2.5 py-2 text-right">{eur(economics.grossPaymentsEur)}</td>
                <td className="px-2.5 py-2 text-right">
                  {economics.refundsInPeriodCents > 0 ? `−${eur(economics.refundsInPeriodEur)}` : eur(0)}
                </td>
                <td className="px-2.5 py-2 text-right">{eur(economics.netCashEur)}</td>
                <td className="px-2.5 py-2 text-right">{eur(economics.averageTransactionEur)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Serie giornaliera incassi per canale */}
        <div className="mt-4 border-t border-neutral-100 pt-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-neutral-800">Incassi giornalieri per canale (Europe/Rome)</span>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-600">
              <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded-xs bg-neutral-800" />Shop</span>
              <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded-xs bg-blue-700" />Preventivi</span>
              <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded-xs bg-emerald-700" />Voucher</span>
              <span className="inline-flex items-center gap-1"><span className="size-2.5 rounded-xs bg-amber-600" />Degustazioni</span>
            </div>
          </div>
          {daysWithPayments.length === 0 ? (
            <p className="mt-2 text-xs text-neutral-500">Nessun incasso registrato nei giorni del periodo selezionato.</p>
          ) : (
            <div className="mt-2 space-y-1.5">
              {daysWithPayments.map((d) => {
                const wShop = (d.revenueByChannel.storefrontEur / maxDayEur) * 100;
                const wQuote = (d.revenueByChannel.quoteEur / maxDayEur) * 100;
                const wVoucher = (d.revenueByChannel.voucherEur / maxDayEur) * 100;
                const wTasting = (d.revenueByChannel.tastingEur / maxDayEur) * 100;
                return (
                  <div key={d.date} className="grid grid-cols-[96px_minmax(0,1fr)_90px] items-center gap-2 text-xs tabular-nums">
                    <span className="font-medium text-neutral-700">
                      {d.date} {d.isPartial ? <span className="text-[10px] text-amber-700">(parz.)</span> : null}
                    </span>
                    <div className="flex h-3 w-full overflow-hidden rounded-sm bg-neutral-100">
                      {wShop > 0 ? <div className="h-full bg-neutral-800" style={{ width: `${wShop}%` }} title={`Shop: ${eur(d.revenueByChannel.storefrontEur)}`} /> : null}
                      {wQuote > 0 ? <div className="h-full bg-blue-700" style={{ width: `${wQuote}%` }} title={`Preventivi: ${eur(d.revenueByChannel.quoteEur)}`} /> : null}
                      {wVoucher > 0 ? <div className="h-full bg-emerald-700" style={{ width: `${wVoucher}%` }} title={`Voucher: ${eur(d.revenueByChannel.voucherEur)}`} /> : null}
                      {wTasting > 0 ? <div className="h-full bg-amber-600" style={{ width: `${wTasting}%` }} title={`Degustazioni: ${eur(d.revenueByChannel.tastingEur)}`} /> : null}
                    </div>
                    <span className="text-right font-semibold text-neutral-900">
                      {eur(d.revenueEur)} <span className="text-[10px] font-normal text-neutral-500">({d.paidOrders})</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Forecast operativo */}
      {(forecasts.operationalBaseline || forecasts.trafficBaseline) ? (
        <section className="rounded-2xl border border-neutral-200 bg-white p-3.5 sm:p-4">
          <h2 className="text-sm font-extrabold text-neutral-900">Forecast operativo traffico</h2>
          <p className="text-xs text-neutral-500">
            Proiezione lineare su giorni completi (esclude la giornata parziale in corso; preserva i giorni a zero visite).
          </p>
          <div className="mt-2.5 grid gap-3 sm:grid-cols-2 text-xs tabular-nums">
            {forecasts.operationalBaseline ? (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3">
                <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                  Baseline post-lancio (dal {forecasts.operationalBaseline.launchDate})
                </div>
                <div className="mt-1 text-base font-extrabold text-neutral-900">
                  {forecasts.operationalBaseline.avgSessionsPerDay !== null
                    ? `${numFmt.format(forecasts.operationalBaseline.avgSessionsPerDay)} sess./giorno`
                    : "—"}
                </div>
                <div className="mt-0.5 text-neutral-600">
                  Proiezione 30 gg: <strong>{forecasts.operationalBaseline.projected30dSessions !== null ? numFmt.format(forecasts.operationalBaseline.projected30dSessions) : "—"}</strong>
                  {" · "}{forecasts.operationalBaseline.completeOperationalDays} gg completi ({numFmt.format(forecasts.operationalBaseline.sessions)} sess.)
                </div>
              </div>
            ) : null}
            {forecasts.trafficBaseline ? (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-3">
                <div className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
                  Baseline periodo selezionato
                </div>
                <div className="mt-1 text-base font-extrabold text-neutral-900">
                  {numFmt.format(forecasts.trafficBaseline.avgSessionsPerCompleteDay)} sess./giorno
                </div>
                <div className="mt-0.5 text-neutral-600">
                  Proiezione 30 gg: <strong>{forecasts.trafficBaseline.projected30dSessionsAtConstantPace !== null ? numFmt.format(forecasts.trafficBaseline.projected30dSessionsAtConstantPace) : "—"}</strong>
                  {" · "}{forecasts.completeDaysSample} gg completi nel filtro
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Data Quality (sezione tecnica compatta espandibile) */}
      <details className="rounded-2xl border border-neutral-200 bg-white p-3.5 sm:p-4 text-xs">
        <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 font-bold text-neutral-800">
          <span>Data Quality &amp; Riconciliazioni ({reconciliation.schemaVersion})</span>
          <span className={reconciliation.status === "ok" ? "text-emerald-700" : "text-rose-700"}>
            {reconciliation.status === "ok"
              ? `OK · ${reconciliation.passedCount}/${reconciliation.totalCount} controlli`
              : `ATTENZIONE · ${reconciliation.failedChecks.length} anomalie`}
          </span>
        </summary>
        <div className="mt-3 space-y-3 border-t border-neutral-100 pt-3 text-neutral-700">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 tabular-nums">
            <div><span className="text-neutral-500">Schema:</span> <strong>{reconciliation.schemaVersion}</strong></div>
            <div><span className="text-neutral-500">Periodo:</span> <strong>{periodLabel}</strong> {isPartialPeriod ? "(parziale)" : "(completo)"}</div>
            <div><span className="text-neutral-500">Osservato fino a:</span> <strong>{observedThrough}</strong></div>
            <div><span className="text-neutral-500">Identificazione clienti:</span> <strong>{pct(customerIdentificationCoverage)}</strong></div>
            <div><span className="text-neutral-500">Copertura sessione ordini:</span> <strong>{pct(attributionCoverage.session)}</strong></div>
            <div><span className="text-neutral-500">Copertura sorgente ordini:</span> <strong>{pct(attributionCoverage.source)}</strong></div>
            <div><span className="text-neutral-500">Copertura device ordini:</span> <strong>{pct(attributionCoverage.device)}</strong></div>
            <div><span className="text-neutral-500">Margine contribuzione:</span> <strong>{economics.contributionMargin.status}</strong></div>
          </div>

          <div>
            <div className="font-bold text-neutral-800">Controlli automatici di consistenza</div>
            <ul className="mt-1 grid gap-1 sm:grid-cols-2">
              {reconciliation.checks.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 rounded-lg bg-neutral-50 px-2 py-1 tabular-nums">
                  <span className="truncate">{c.label}</span>
                  <span className={c.passed ? "font-semibold text-emerald-700" : "font-bold text-rose-700"}>
                    {c.passed ? "OK" : `${c.actual} ≠ ${c.expected}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {unavailableMetrics.length > 0 ? (
            <div>
              <div className="font-bold text-neutral-800">Metriche non disponibili / stimate</div>
              <ul className="mt-1 list-disc pl-4 text-neutral-600">
                {unavailableMetrics.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      </details>
    </div>
  );
}
