import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import PageHeader from "../_components/PageHeader";
import { readCustomerMetrics, CUSTOMER_SEGMENTS, type CustomerSegment } from "@/lib/server/customerMetrics";

export const dynamic = "force-dynamic";

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format((cents || 0) / 100);
}

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.segment) ? sp.segment[0] : sp.segment;
  const segment = raw && Object.hasOwn(CUSTOMER_SEGMENTS, raw) ? raw as CustomerSegment : null;
  const customers = await readCustomerMetrics(prisma);
  const matching = customers.rows.filter((row) => !segment || row.segment === segment);
  const rows = matching.slice(0, 200);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Clienti"
        subtitle="LTV su tutta la storia: pagamenti meno rimborsi, email normalizzate. Prime 200 righe per LTV netto; export completo."
        actions={
          <Link
            href={`/api/admin/customers.csv${segment ? `?segment=${segment}` : ""}`}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Export CSV clienti
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2 text-xs">
        <Link href="/admin/customers" aria-current={!segment ? "page" : undefined} className="rounded-xl border px-3 py-2">Tutti ({customers.totalCustomers})</Link>
        {Object.entries(CUSTOMER_SEGMENTS).map(([key, label]) => <Link key={key} href={`/admin/customers?segment=${key}`} aria-current={segment === key ? "page" : undefined} className={`rounded-xl border px-3 py-2 ${segment === key ? "bg-neutral-900 text-white" : "bg-white"}`}>{label} ({customers.segments[key as CustomerSegment]})</Link>)}
      </div>
      <p className="text-xs text-neutral-500">Dormienti: almeno 180 giorni senza acquisti (priorità, da ricontattare per l’olio nuovo). VIP: almeno 10 L storici di olio in latta. Nuovi: un solo acquisto negli ultimi 30 giorni. Altri: attivi. Mostrati {rows.length} di {matching.length} clienti.</p>
      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs text-neutral-600">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Ordini</th>
              <th className="px-4 py-3">Segmento</th>
              <th className="px-4 py-3 text-right">Spesa lorda</th>
              <th className="px-4 py-3 text-right">Rimborsi</th>
              <th className="px-4 py-3 text-right">LTV netto</th>
              <th className="px-4 py-3">Ultimo ordine</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200">
            {rows.map((c) => (
              <tr key={c.email} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-semibold text-neutral-900">{c.fullName}</td>
                <td className="px-4 py-3 text-neutral-700">{c.email}</td>
                <td className="px-4 py-3 text-neutral-700">{c.ordersCount}</td>
                <td className="px-4 py-3 text-xs font-semibold">{CUSTOMER_SEGMENTS[c.segment]}</td>
                <td className="px-4 py-3 text-right">{euro(c.grossCents)}</td>
                <td className="px-4 py-3 text-right">{euro(c.refundCents)}</td>
                <td className="px-4 py-3 text-right font-extrabold text-neutral-900">{euro(c.ltvCents)}</td>
                <td className="px-4 py-3 text-neutral-700">
                  {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleString("it-IT", { timeZone: "Europe/Rome" }) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders?email=${encodeURIComponent(c.email)}`}
                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
                  >
                    Vedi ordini
                  </Link>
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-neutral-600" colSpan={9}>
                  Nessun cliente trovato (nessun ordine con pagamento registrato).
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
