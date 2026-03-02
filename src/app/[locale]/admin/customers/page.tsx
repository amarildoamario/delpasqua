import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import PageHeader from "../_components/PageHeader";

export const dynamic = "force-dynamic";

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format((cents || 0) / 100);
}

export default async function AdminCustomersPage() {
  const grouped = await prisma.order.groupBy({
    by: ["email"],
    where: { paidAt: { not: null } },
    _count: { _all: true },
    _sum: { totalCents: true },
    _max: { createdAt: true },
    orderBy: { _sum: { totalCents: "desc" } },
    take: 200,
  });

  const emails = grouped.map((g) => g.email).filter(Boolean);

  const lastOrders = await prisma.order.findMany({
    where: { email: { in: emails }, paidAt: { not: null } },
    orderBy: { createdAt: "desc" },
    distinct: ["email"],
    select: { email: true, fullName: true },
  });
  const nameByEmail = new Map(lastOrders.map((o) => [o.email, o.fullName] as const));

  const rows = grouped.map((g) => ({
    email: g.email,
    fullName: nameByEmail.get(g.email) ?? "—",
    ordersCount: g._count._all,
    totalCents: g._sum.totalCents ?? 0,
    lastOrderAt: g._max.createdAt,
  }));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Clienti"
        subtitle="Lista clienti che hanno effettuato almeno un ordine pagato (top 200 per spesa)."
        actions={
          <Link
            href="/api/admin/customers.csv"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Export CSV clienti
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs text-neutral-600">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Ordini</th>
              <th className="px-4 py-3 text-right">Totale speso</th>
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
                <td className="px-4 py-3 text-right font-extrabold text-neutral-900">{euro(c.totalCents)}</td>
                <td className="px-4 py-3 text-neutral-700">
                  {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleString("it-IT") : "—"}
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
                <td className="px-4 py-6 text-neutral-600" colSpan={6}>
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