import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import ShipToggleButton from "@/app/[locale]/admin/orders/ship/ShipToggleButton";
import PrepareButton from "@/app/[locale]/admin/orders/ship/PrepareButton";
import RangePicker from "@/app/[locale]/admin/dashboard/RangerPicker";
import type * as Prisma from "@/generated/prisma/client";
import PageHeader from "@/app/[locale]/admin/_components/PageHeader";
import { getFlagEmoji } from "@/lib/utils";
import OrderStatusBadge from "@/app/[locale]/admin/orders/OrderStatusBadge";
import OrderAttentionControl from "@/app/[locale]/admin/orders/OrderAttentionControl";

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
  "IN_ATTESA",
  "PAGATO",
  "IN_PREPARAZIONE",
  "SPEDITO",
  "CONSEGNATO",
  "ANNULLATO",
  "RIMBORSATO",
  "SCADUTO",
  "FALLITO",
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
  const customerEmail = getOne(sp.email)?.trim();
  const testParam = getOne(sp.test);
  const testOnly = testParam === "1";

  const startParam = getOne(sp.start);
  const endParam = getOne(sp.end);

  const today = new Date();
  const defaultDays = statusParam === "IN_ATTESA" ? 180 : 30;
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - defaultDays);

  const start = parseDateOnly(startParam) ?? defaultStart;
  const end = parseDateOnly(endParam) ?? today;

  const startISO = toISODate(start);
  const endISO = toISODate(end);

  const endExclusive = new Date(end);
  endExclusive.setDate(end.getDate() + 1);

  const where: Prisma.Prisma.OrderWhereInput = {
    ...(customerEmail && !startParam && !endParam ? {} : { createdAt: { gte: start, lt: endExclusive } }),
    isTest: testOnly,
  };
  if (customerEmail) where.email = { equals: customerEmail, mode: "insensitive" };

  if (statusParam && isOrderStatus(statusParam)) {
    where.status = statusParam;
  } else if (!q) {
    where.orderNumber = { not: null };
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
    select: {
      id: true,
      createdAt: true,
      orderNumber: true,
      paidAt: true,
      preparingAt: true,
      fullName: true,
      email: true,
      status: true,
      isFlagged: true,
      attentionDismissedAt: true,
      riskScore: true,
      isTest: true,
      paymentMethod: true,
      shippedAt: true,
      totalCents: true,
      countryCode: true,
      events: {
        where: { type: "INVOICE_EXPORTED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true, metaJson: true, message: true },
      },
    },
  });

  const printParams = new URLSearchParams({ start: startISO, end: endISO });
  if (statusParam) printParams.set("status", statusParam);
  if (shipped) printParams.set("shipped", shipped);
  if (q) printParams.set("q", q);
  const printHref = `/api/admin/print-todo?${printParams.toString()}`;

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
            {/* ✅ stampa gli ordini da fare */}
            <a
              href={printHref}
              target="_blank"
              rel="noreferrer"
              title="Stampa gli ordini filtrati nella lista corrente"
              className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-xl bg-neutral-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Stampa ordini da fare
            </a>

            <Link
              href={`/api/admin/report.csv?start=${startISO}&end=${endISO}`}
              className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Export CSV
            </Link>
          </>
        }
      />

      <RangePicker startISO={startISO} endISO={endISO} />

      <div>
        <Link
          href={testOnly ? `/admin/orders?start=${startISO}&end=${endISO}` : `/admin/orders?start=${startISO}&end=${endISO}&test=1`}
          className="inline-flex rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100"
        >
          {testOnly ? "Torna agli ordini commerciali" : "Visualizza ordini di test"}
        </Link>
      </div>

      <form className="grid grid-cols-2 sm:flex sm:flex-wrap items-end gap-2" action="/admin/orders" method="get">
        <input type="hidden" name="start" value={startISO} />
        <input type="hidden" name="end" value={endISO} />
        {testOnly ? <input type="hidden" name="test" value="1" /> : null}

        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Cerca id, orderNumber, email, stripe…"
          className="col-span-2 w-full sm:w-64 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base sm:text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900/20"
        />

        <select
          name="status"
          defaultValue={statusParam ?? ""}
          className="w-full sm:w-auto rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base sm:text-sm text-neutral-900"
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
          className="w-full sm:w-auto rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base sm:text-sm text-neutral-900"
        >
          <option value="">Tutte spedizioni</option>
          <option value="no">Non spediti</option>
          <option value="yes">Spediti</option>
        </select>

        <button className="col-span-2 w-full sm:w-auto rounded-xl bg-neutral-900 px-4 py-2.5 sm:py-2 text-sm font-semibold text-white hover:opacity-90">
          Filtra
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/60">
        {/* Mobile Card View (< lg) */}
        <div className="lg:hidden divide-y divide-neutral-200">
          {orders.map((o: typeof orders[0]) => {
            const exp = o.events?.[0] ?? null;
            const meta = exp ? safeParseMeta(exp.metaJson) : {};
            const inv = meta?.invoiceNumber ? ` (${meta.invoiceNumber})` : "";
            const cutoff48h = new Date(today.getTime() - 48 * 60 * 60 * 1000);
            const isDelicate =
              (o.status === "IN_ATTESA" && o.createdAt < cutoff48h) ||
              o.status === "FALLITO" ||
              o.status === "SCADUTO" ||
              o.isFlagged ||
              (o.status === "PAGATO" && !o.paidAt) ||
              (o.status === "IN_PREPARAZIONE" && !o.preparingAt);

            return (
              <div
                key={o.id}
                className={[
                  "p-4 space-y-3",
                  o.status === "IN_PREPARAZIONE" ? "bg-sky-50/80" : "",
                  o.status === "SPEDITO" || o.status === "CONSEGNATO" ? "bg-emerald-50/80" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="block truncate text-base font-bold text-neutral-900 hover:underline"
                    >
                      {o.orderNumber ?? `${o.id.slice(0, 8)}…${o.id.slice(-6)}`}
                    </Link>
                    <div className="mt-0.5 text-xs text-neutral-500">
                      {new Date(o.createdAt).toLocaleString("it-IT")}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-base font-extrabold text-neutral-900">{euro(o.totalCents)}</span>
                    <OrderStatusBadge status={o.status} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-semibold text-neutral-800 truncate">
                      <span className="truncate">{o.fullName || "—"}</span>
                      {o.countryCode ? (
                        <span title={o.countryCode} className="text-base select-none shrink-0" aria-label={`Bandiera nazione: ${o.countryCode}`}>
                          {getFlagEmoji(o.countryCode)}
                        </span>
                      ) : null}
                    </div>
                    <div className="truncate text-xs text-neutral-500">{o.email || "—"}</div>
                  </div>
                  <div className="shrink-0">
                    {isDelicate ? (
                      <OrderAttentionControl
                        orderId={o.id}
                        acknowledged={Boolean(o.attentionDismissedAt)}
                      />
                    ) : (
                      <span title="Ordine regolare" aria-label="Ordine regolare" className="text-lg">✅</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 font-semibold text-neutral-700">
                    {o.paymentMethod ?? "—"}
                  </span>
                  {o.shippedAt ? (
                    <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-0.5 font-semibold text-sky-700">
                      Spedito: Sì
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 font-semibold text-neutral-600">
                      Spedito: No
                    </span>
                  )}
                  <span
                    className={
                      o.isFlagged
                        ? "inline-flex rounded-full bg-red-50 px-2.5 py-0.5 font-semibold text-red-700"
                        : "inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 font-semibold text-neutral-600"
                    }
                  >
                    Rischio: {o.riskScore}
                  </span>
                  {o.isTest ? (
                    <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-900">
                      ORDINE TEST
                    </span>
                  ) : null}
                </div>

                {exp ? (
                  <div className="truncate text-xs font-semibold text-red-700">
                    Fattura esportata: {new Date(exp.createdAt).toLocaleString("it-IT")}
                    {inv}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50"
                  >
                    Apri ordine
                  </Link>
                  <PrepareButton orderId={o.id} status={o.status} />
                  <ShipToggleButton orderId={o.id} shipped={!!o.shippedAt} status={o.status} />
                </div>
              </div>
            );
          })}

          {orders.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-neutral-600">
              Nessun ordine trovato.
            </div>
          ) : null}
        </div>

        {/* Desktop Table View (lg+) */}
        <div className="hidden lg:block overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="bg-neutral-50 text-xs text-neutral-600">
            <tr>
              <th className="w-40 px-4 py-3">Data</th>
              <th className="w-56 px-4 py-3">Ordine</th>
              <th className="w-56 px-4 py-3">Cliente</th>
              <th className="w-28 px-4 py-3 text-center">Stato</th>
              <th className="w-28 px-4 py-3 text-center">Controllo</th>
              <th className="w-20 px-4 py-3">Rischio</th>
              <th className="w-28 px-4 py-3">Pagamento</th>
              <th className="w-24 px-4 py-3">Spedito</th>
              <th className="w-28 px-4 py-3 text-left">Totale</th>
              <th className="w-44 px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {orders.map((o: typeof orders[0]) => {
              const exp = o.events?.[0] ?? null;
              const meta = exp ? safeParseMeta(exp.metaJson) : {};
              const inv = meta?.invoiceNumber ? ` (${meta.invoiceNumber})` : "";
              const cutoff48h = new Date(today.getTime() - 48 * 60 * 60 * 1000);
              const isDelicate =
                (o.status === "IN_ATTESA" && o.createdAt < cutoff48h) ||
                  o.status === "FALLITO" ||
                  o.status === "SCADUTO" ||
                  o.isFlagged ||
                  (o.status === "PAGATO" && !o.paidAt) ||
                  (o.status === "IN_PREPARAZIONE" && !o.preparingAt);

              return (
                <tr
                  key={o.id}
                  className={[
                    "hover:bg-neutral-50",
                    o.status === "IN_PREPARAZIONE" ? "bg-sky-100" : "",
                    o.status === "SPEDITO" || o.status === "CONSEGNATO" ? "bg-emerald-100" : "",
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

                    {o.isTest ? (
                      <div className="mt-1 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                        ORDINE TEST
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
                    <div className="flex items-center gap-1.5 truncate font-medium">
                      <span className="truncate">{o.fullName || "—"}</span>
                      {o.countryCode ? (
                        <span title={o.countryCode} className="text-base select-none shrink-0" aria-label={`Bandiera nazione: ${o.countryCode}`}>
                          {getFlagEmoji(o.countryCode)}
                        </span>
                      ) : null}
                    </div>
                    <div className="truncate text-xs text-neutral-500">{o.email || "—"}</div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <OrderStatusBadge status={o.status} />
                  </td>

                  <td className="px-4 py-3 text-center">
                    {isDelicate ? (
                      <OrderAttentionControl
                        orderId={o.id}
                        acknowledged={Boolean(o.attentionDismissedAt)}
                      />
                    ) : (
                      <span title="Ordine regolare" aria-label="Ordine regolare" className="text-xl">✅</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {o.isFlagged ? (
                      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                        {o.riskScore}
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

                  <td className="px-4 py-3 text-left font-semibold text-neutral-900">
                    {euro(o.totalCents)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <PrepareButton orderId={o.id} status={o.status} />
                      <ShipToggleButton orderId={o.id} shipped={!!o.shippedAt} status={o.status} />
                    </div>
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
    </div>
  );
}
