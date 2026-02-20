import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import PageHeader from "../_components/PageHeader";

export const dynamic = "force-dynamic";

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function AdminCustomersPage() {
  const grouped = await prisma.order.groupBy({
    by: ["email"],
    where: { status: "PAID" },
    _count: { _all: true },
    _sum: { totalCents: true },
    _max: { createdAt: true },
    orderBy: { _sum: { totalCents: "desc" } },
    take: 200,
  });

  const emails = grouped.map((g) => g.email);

  // prendo l'ordine più recente per email per mostrare il nome
  const lastOrders = await prisma.order.findMany({
    where: { email: { in: emails }, status: "PAID" },
    orderBy: { createdAt: "desc" },
    distinct: ["email"],
    select: { email: true, fullName: true, createdAt: true },
  });

  const nameByEmail = new Map(lastOrders.map((o) => [o.email, o.fullName]));

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
  subtitle="Lista clienti derivata dagli ordini pagati (top 200 per spesa)."
  actions={
    <Link
      href="/api/admin/customers.csv"
      className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 dark:bg-white dark:text-neutral-900"
    >
      Export CSV clienti
    </Link>
  }
/>


      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Ordini</th>
              <th className="px-4 py-3 text-right">Totale speso</th>
              <th className="px-4 py-3">Ultimo ordine</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {rows.map((c) => (
              <tr key={c.email} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/40">
                <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-100">{c.fullName}</td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">{c.email}</td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">{c.ordersCount}</td>
                <td className="px-4 py-3 text-right font-extrabold text-neutral-900 dark:text-neutral-100">
                  {euro(c.totalCents)}
                </td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">
                  {c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleString("it-IT") : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders?email=${encodeURIComponent(c.email)}`}
                    className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Vedi ordini
                  </Link>
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-neutral-600 dark:text-neutral-300" colSpan={6}>
                  Nessun cliente trovato (nessun ordine PAID).
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
