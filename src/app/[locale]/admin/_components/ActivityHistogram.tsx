import InfoTooltip from "./InfoTooltip";

type ActivityRow = { label: string; visits: number; carts: number; orders: number };
const series = [
  { key: "visits", label: "Visite", dot: "bg-blue-500", bar: "from-blue-600 to-sky-400" },
  { key: "carts", label: "Carrelli", dot: "bg-amber-500", bar: "from-amber-600 to-amber-300" },
  { key: "orders", label: "Ordini pagati", dot: "bg-emerald-600", bar: "from-emerald-700 to-emerald-400" },
] as const;
const format = (value: number) => new Intl.NumberFormat("it-IT").format(value);

export default function ActivityHistogram({ title, rows, description }: { title: string; rows: ActivityRow[]; description: string }) {
  const hourly = rows.length > 7;
  const largest = Math.max(1, ...rows.flatMap((row) => series.map(({ key }) => row[key])));
  const power = 10 ** Math.floor(Math.log10(largest / 4));
  const step = Math.max(1, [1, 2, 5, 10].map((value) => value * power).find((value) => value >= largest / 4)!);
  const axisMax = Math.ceil(largest / step) * step;
  const ticks = Array.from({ length: axisMax / step + 1 }, (_, index) => index * step);
  const totals = series.map((s) => ({ ...s, total: rows.reduce((sum, row) => sum + row[s.key], 0) }));
  const hasData = totals.some((s) => s.total > 0);
  const columns = { gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))` };

  return <section className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="flex items-center gap-1 text-sm font-bold text-neutral-900">{title}<InfoTooltip label={title} description={description} /></h3>
      <div className="flex flex-wrap gap-2">{totals.map((s) => <span key={s.key} className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-600"><span className={`h-2 w-2 rounded-sm ${s.dot}`} /><span>{s.label}</span><b className="ml-1 text-neutral-900">{format(s.total)}</b></span>)}</div>
    </div>
    <div className="mt-6 overflow-x-auto pb-2 pt-2" tabIndex={0} role="region" aria-label={`${title}: grafico scorrevole`}>
      <div style={{ minWidth: hourly ? 1232 : 500 }}>
        <div className="flex gap-2" role="img" aria-label={`${title}. Valori esatti nella tabella espandibile sotto il grafico.`}>
          <div className="relative h-60 w-6 shrink-0 text-right text-[10px] tabular-nums text-neutral-400" aria-hidden="true">{ticks.map((tick) => <span key={tick} className="absolute right-0 -translate-y-1/2" style={{ top: `${100 - tick / axisMax * 100}%` }}>{format(tick)}</span>)}</div>
          <div className="relative min-w-0 flex-1">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">{ticks.map((tick) => <div key={tick} className={`absolute inset-x-0 border-t ${tick ? "border-dashed border-neutral-200/80" : "border-neutral-300"}`} style={{ top: `${100 - tick / axisMax * 100}%` }} />)}</div>
            <div className="relative grid h-60 gap-x-1.5" style={columns}>
              {rows.map((row) => <div key={row.label} className="group flex h-full min-w-0 items-end justify-center gap-[3px] rounded-t-lg transition-colors hover:bg-neutral-100/70" title={`${row.label}: ${row.visits} visite, ${row.carts} carrelli, ${row.orders} ordini`}>
                {series.map((s) => <div key={s.key} data-histogram-bar={s.key} className={`min-w-0 flex-1 rounded-t-[5px] bg-linear-to-t shadow-sm ${hourly ? "max-w-5" : "max-w-8"} ${s.bar}`} style={{ height: `${row[s.key] / axisMax * 100}%` }} />)}
              </div>)}
            </div>
            {!hasData ? <div className="pointer-events-none absolute inset-0 flex items-center justify-center"><span className="rounded-xl border border-neutral-100 bg-white/95 px-4 py-3 text-sm text-neutral-500 shadow-sm">Nessuna attività nel periodo selezionato</span></div> : null}
          </div>
        </div>
        <div className="ml-8 mt-3 grid gap-x-1.5 text-center text-[10px] font-medium tabular-nums text-neutral-500" style={columns}>{rows.map((row) => <span key={row.label}>{row.label.replace(":00", "")}</span>)}</div>
      </div>
    </div>
    <p className="mt-1 text-[10px] text-neutral-400">Orario italiano · {hourly ? "Scorri in orizzontale per vedere tutte le 24 ore." : "Da lunedì a domenica."}</p>
    <details className="mt-4 border-t border-neutral-100 pt-3 text-xs text-neutral-600"><summary className="cursor-pointer font-semibold text-neutral-700">Valori e picchi</summary>
      <div className="my-3 flex flex-wrap gap-2">{series.map((s) => {
        const peak = Math.max(...rows.map((row) => row[s.key]));
        return <span key={s.key} className="rounded-lg bg-neutral-50 px-2.5 py-2"><b>{s.label}:</b> {peak ? `${rows.filter((row) => row[s.key] === peak).map((row) => row.label).join(", ")} (${format(peak)})` : "nessun dato"}</span>;
      })}</div>
      <table className="w-full text-right tabular-nums"><caption className="sr-only">{title}</caption><thead><tr className="border-b border-neutral-200"><th className="py-2 text-left">Fascia</th>{series.map((s) => <th key={s.key} className="py-2">{s.label}</th>)}</tr></thead>
        <tbody className="divide-y divide-neutral-100">{rows.map((row) => <tr key={row.label} className="hover:bg-neutral-50"><th className="py-1.5 text-left font-normal">{row.label}</th>{series.map((s) => <td key={s.key}>{format(row[s.key])}</td>)}</tr>)}</tbody></table>
    </details>
  </section>;
}
