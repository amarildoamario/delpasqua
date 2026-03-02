import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import ShipToggleButton from "@/app/[locale]/admin/orders/ship/ShipToggleButton";
import RangePicker from "@/app/[locale]/admin/dashboard/RangerPicker";
import type * as Prisma from "@/generated/prisma/client";
import PageHeader from "@/app/[locale]/admin/_components/PageHeader";

export const dynamic = "force-dynamic";

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}
function getOne(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseDateOnly(s?: string) {
  if (!s) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

const ALLOWED_STATUSES: Prisma.OrderStatus[] = [
  "PENDING",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
  "REFUNDED",
  "EXPIRED",
  "FAILED",
];

function isOrderStatus(s: string): s is Prisma.OrderStatus {
  return (ALLOWED_STATUSES as readonly string[]).includes(s);
}

function safeParseMeta(metaJson?: string | null) {
  if (!metaJson) return {};
  try {
    return JSON.parse(metaJson);
  } catch {
    return {};
  }
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

  const statusParam = getOne(sp.status);
  const shipped = getOne(sp.shipped);
  const q = getOne(sp.q);

  const startParam = getOne(sp.start);
  const endParam = getOne(sp.end);

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 30);

  const start = parseDateOnly(startParam) ?? defaultStart;
  const end = parseDateOnly(endParam) ?? today;

  const startISO = toISODate(start);
  const endISO = toISODate(end);

  const endExclusive = new Date(end);
  endExclusive.setDate(end.getDate() + 1);

  const where: Prisma.Prisma.OrderWhereInput = {
    createdAt: { gte: start, lt: endExclusive },
    orderNumber: { not: null },
  };

  if (statusParam && isOrderStatus(statusParam)) {
    where.status = statusParam;
  }

  if (shipped === "yes") where.shippedAt = { not: null };
  if (shipped === "no") where.shippedAt = null;

  if (q && q.trim()) {
    const qq = q.trim();
    where.OR = [
      { id: { contains: qq } },
      { email: { contains: qq } },
      { fullName: { contains: qq } },
      { orderNumber: { contains: qq } },
      { stripeCheckoutSessionId: { contains: qq } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      events: {
        where: { type: "INVOICE_EXPORTED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true, metaJson: true, message: true },
      },
    },
  });

  const xmlHref = `/api/admin/invoices.xml?mode=range&start=${startISO}&end=${endISO}${statusParam ? `&status=${encodeURIComponent(statusParam)}` : ""
    }${shipped ? `&shipped=${encodeURIComponent(shipped)}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Ordini"
        subtitle={
          <>
            Ultimi <span className="font-semibold">{orders.length}</span> ordini (max 200) · Periodo:{" "}
            <span className="font-semibold">{startISO}</span> → <span className="font-semibold">{endISO}</span>
          </>
        }
        actions={
          <>
            {/* ✅ scarica JSON coerente coi filtri della pagina */}
            <a
              href={xmlHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Scarica fatture (.XML)
            </a>

            <Link
              href={`/api/admin/report.csv?start=${startISO}&end=${endISO}`}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Export CSV
            </Link>
          </>
        }
      />

      <RangePicker startISO={startISO} endISO={endISO} />

      <form className="flex flex-wrap items-end gap-2" action="/admin/orders" method="get">
        <input type="hidden" name="start" value={startISO} />
        <input type="hidden" name="end" value={endISO} />

        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Cerca id, orderNumber, email, stripe…"
          className="w-64 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900/20"
        />

        <select
          name="status"
          defaultValue={statusParam ?? ""}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
        >
          <option value="">Tutti stati</option>
          {ALLOWED_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          name="shipped"
          defaultValue={shipped ?? ""}
          className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
        >
          <option value="">Tutte spedizioni</option>
          <option value="no">Non spediti</option>
          <option value="yes">Spediti</option>
        </select>

        <button className="rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
          Filtra
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/60">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="bg-neutral-50 text-xs text-neutral-600">
            <tr>
              <th className="w-40 px-4 py-3">Data</th>
              <th className="w-56 px-4 py-3">Ordine</th>
              <th className="w-56 px-4 py-3">Cliente</th>
              <th className="w-28 px-4 py-3">Stato</th>
              <th className="w-24 px-4 py-3">Rischio</th>
              <th className="w-28 px-4 py-3">Pagamento</th>
              <th className="w-24 px-4 py-3">Spedito</th>
              <th className="w-24 px-4 py-3 text-right">Totale</th>
              <th className="w-28 px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200">
            {orders.map((o: typeof orders[0]) => {
              const exp = o.events?.[0] ?? null;
              const meta = exp ? safeParseMeta(exp.metaJson) : {};
              const inv = meta?.invoiceNumber ? ` (${meta.invoiceNumber})` : "";

              return (
                <tr
                  key={o.id}
                  className={[
                    "hover:bg-neutral-50",
                    o.status === "PREPARING" ? "bg-sky-100" : "",
                    o.status === "SHIPPED" ? "bg-emerald-100" : "",
                  ].join(" ")}
                >
                  <td className="px-4 py-3 text-neutral-700">
                    {new Date(o.createdAt).toLocaleString("it-IT")}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="block truncate font-semibold text-neutral-900 hover:underline"
                    >
                      {o.orderNumber ?? `${o.id.slice(0, 8)}…${o.id.slice(-6)}`}
                    </Link>

                    {o.orderNumber ? (
                      <div className="mt-1 truncate text-xs text-neutral-500">
                        id: {o.id.slice(0, 8)}…{o.id.slice(-6)}
                      </div>
                    ) : null}

                    {o.paidAt ? (
                      <div className="mt-1 truncate text-xs text-neutral-500">
                        pagato: {new Date(o.paidAt).toLocaleString("it-IT")}
                      </div>
                    ) : null}

                    {/* ✅ Riga rossa: marker export fattura */}
                    {exp ? (
                      <div className="mt-1 truncate text-xs font-semibold text-red-700">
                        Fattura esportata: {new Date(exp.createdAt).toLocaleString("it-IT")}
                        {inv}
                      </div>
                    ) : null}
                  </td>

                  <td className="px-4 py-3 text-neutral-700">
                    <div className="truncate font-medium">{o.fullName || "—"}</div>
                    <div className="truncate text-xs text-neutral-500">{o.email || "—"}</div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        o.status === "PREPARING"
                          ? "bg-sky-200 text-sky-900"
                          : o.status === "SHIPPED"
                            ? "bg-emerald-200 text-emerald-900"
                            : "bg-neutral-100 text-neutral-700",
                      ].join(" ")}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {o.isFlagged ? (
                      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                        FLAG {o.riskScore}
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                        {o.riskScore}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-neutral-700">
                    <span className="text-xs font-semibold">{o.paymentMethod ?? "—"}</span>
                  </td>

                  <td className="px-4 py-3">
                    {o.shippedAt ? (
                      <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                        Sì
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                        No
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-right font-semibold text-neutral-900">
                    {euro(o.totalCents)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <ShipToggleButton orderId={o.id} shipped={!!o.shippedAt} status={o.status} />
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-neutral-600" colSpan={9}>
                  Nessun ordine trovato.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
