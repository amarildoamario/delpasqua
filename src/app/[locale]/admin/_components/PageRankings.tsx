"use client";

import { useState } from "react";
import { formatPageTime, rankPages, type PageRanking, type PageSort } from "@/lib/pageRankings";

const choices = [
  { key: "views", label: "Più viste" },
  { key: "totalMs", label: "Tempo totale" },
  { key: "averageMs", label: "Tempo medio" },
  { key: "longestMs", label: "Visita più lunga" },
] as const;

export default function PageRankings({ rows }: { rows: PageRanking[] }) {
  const [sort, setSort] = useState<PageSort>("views");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const ranked = rankPages(rows, sort, search);
  return <section className="min-w-0 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm" aria-label="Classifica pagine">
    <h2 className="text-sm font-extrabold text-neutral-900">Classifica pagine</h2>
    <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Ordina pagine per">
      {choices.map((choice) => <button key={choice.key} type="button" aria-pressed={sort === choice.key} onClick={() => setSort(choice.key)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${sort === choice.key ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>{choice.label}</button>)}
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Cerca pagina" placeholder="Cerca pagina…" className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
      <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} aria-label="Numero di pagine" className="rounded-lg border border-neutral-200 px-2 py-2 text-xs"><option value={20}>Prime 20</option><option value={50}>Prime 50</option><option value={0}>Tutte</option></select>
    </div>
    <p className="mt-3 text-xs text-neutral-500">Ordine decrescente. La media usa solo le visite con durata rilevata. Il tracciamento attuale registra fino a 20 minuti per permanenza; “—” indica durata non misurata.</p>
    <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full min-w-[620px] text-left text-xs tabular-nums">
        <thead className="bg-neutral-50 font-bold text-neutral-500"><tr>
          <th className="px-3 py-2">Pagina</th>
          {choices.map((choice) => <th key={choice.key} aria-sort={sort === choice.key ? "descending" : "none"} className="px-3 py-2 text-right">{choice.key === "views" ? "Visite" : choice.label}</th>)}
          <th className="px-3 py-2 text-right">Durate rilevate</th>
        </tr></thead>
        <tbody className="divide-y divide-neutral-200">{(limit ? ranked.slice(0, limit) : ranked).map((row) => <tr key={row.path} className="hover:bg-neutral-50">
          <th className="max-w-[240px] break-words px-3 py-2 text-left font-semibold text-neutral-900">{row.path}</th>
          <td className="px-3 py-2 text-right font-bold">{row.views.toLocaleString("it-IT")}</td>
          <td className="whitespace-nowrap px-3 py-2 text-right">{formatPageTime(row.totalMs)}</td>
          <td className="whitespace-nowrap px-3 py-2 text-right">{formatPageTime(row.averageMs)}</td>
          <td className="whitespace-nowrap px-3 py-2 text-right">{formatPageTime(row.longestMs)}</td>
          <td className="px-3 py-2 text-right text-neutral-500">{row.samples}</td>
        </tr>)}</tbody>
      </table>
      {!ranked.length && <p className="p-4 text-sm text-neutral-500">Nessuna pagina corrispondente nel periodo.</p>}
    </div>
    <p role="status" className="mt-2 text-xs text-neutral-500">{Math.min(limit || ranked.length, ranked.length)} di {ranked.length} pagine · {choices.find((choice) => choice.key === sort)?.label}</p>
  </section>;
}
