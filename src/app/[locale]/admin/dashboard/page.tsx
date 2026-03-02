import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import RangePicker from "./RangerPicker";
import PageHeader from "@/app/[locale]/admin/_components/PageHeader";

export const dynamic = "force-dynamic";

function euro(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(s?: string) {
  if (!s) return null;
  // accetta solo YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-base font-bold text-neutral-900">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-neutral-500">{subtitle}</div> : null}
      </div>
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
      <div className="text-xs font-semibold text-neutral-500">{title}</div>
      <div className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-900">
        {value}
      </div>
      {hint ? <div className="mt-1 text-xs text-neutral-500">{hint}</div> : null}
    </div>
  );
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const startParam = Array.isArray(sp.start) ? sp.start[0] : sp.start;
  const endParam = Array.isArray(sp.end) ? sp.end[0] : sp.end;

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 30);

  const start = parseDate(startParam) ?? defaultStart;
  const end = parseDate(endParam) ?? today;

  // end inclusive -> endExclusive (giorno dopo)
  const endExclusive = new Date(end);
  endExclusive.setDate(end.getDate() + 1);

  const startISO = toISODate(start);
  const endISO = toISODate(end);

  // src/app/admin/dashboard/page.tsx

  const PAID_LIKE = [
    "PAID",
    "PREPARING",
    "SHIPPED",
    "DELIVERED",
    "REFUNDED",
    "PARTIALLY_REFUNDED",
  ] as const;

  const [totalOrders, paidOrders, pendingOrders, canceledOrders, checkoutCanceled] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, orderNumber: { not: null } } }),
    prisma.order.count({
      where: {
        createdAt: { gte: start, lt: endExclusive },
        status: { in: [...PAID_LIKE] },
      },
    }),
    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, status: "PENDING", orderNumber: { not: null } } }),
    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, status: "CANCELED", orderNumber: { not: null } } }),
    prisma.order.count({ where: { createdAt: { gte: start, lt: endExclusive }, status: "CANCELED", orderNumber: null } }),
  ]);

  const revenueAgg = await prisma.order.aggregate({
    where: {
      createdAt: { gte: start, lt: endExclusive },
      status: { in: [...PAID_LIKE] },
      // paidAt: { not: null }, // opzionale, ancora più robusto
    },
    _sum: { totalCents: true, stripeFeeCents: true, refundCents: true },
  });


  const revenueCents = revenueAgg._sum.totalCents ?? 0;
  const feeCents = revenueAgg._sum.stripeFeeCents ?? 0;
  const refundCents = revenueAgg._sum.refundCents ?? 0;

  const netCents = revenueCents - feeCents - refundCents;
  const aovCents = paidOrders > 0 ? Math.round(revenueCents / paidOrders) : 0;

  const feeRate = revenueCents > 0 ? feeCents / revenueCents : 0;
  const refundRate = revenueCents > 0 ? refundCents / revenueCents : 0;

  // ========= OPERATIVO (filtrato per periodo) =========
  const toShipInPeriod = await prisma.order.count({
    where: {
      status: { in: ["PAID", "PREPARING"] }, // oppure solo ["PAID","PREPARING"] se preferisci
      shippedAt: null,
      createdAt: { gte: start, lt: endExclusive },
    },
  });


  const shippedInPeriod = await prisma.order.findMany({
    where: {
      status: "PAID",
      shippedAt: { not: null },
      paidAt: { not: null },
      createdAt: { gte: start, lt: endExclusive },
    },
    select: { paidAt: true, shippedAt: true },
    take: 1000,
  });

  const avgFulfillmentMs =
    shippedInPeriod.length === 0
      ? 0
      : Math.round(
        shippedInPeriod.reduce((acc, o) => {
          const a = o.paidAt ? new Date(o.paidAt).getTime() : 0;
          const b = o.shippedAt ? new Date(o.shippedAt).getTime() : 0;
          return acc + Math.max(0, b - a);
        }, 0) / shippedInPeriod.length
      );
  const avgFulfillmentHours = avgFulfillmentMs ? Math.round(avgFulfillmentMs / (1000 * 60 * 60)) : 0;

  // ========= PRODOTTI (filtrato per periodo) =========
  // key robusta: productId + variantLabel (evita warning key duplicate)
  const topProducts =
    (await prisma.$queryRaw<
      Array<{
        rowKey: string;
        productId: string;
        title: string;
        variantLabel: string;
        qty: number;
        revenueCents: number;
      }>
    >`
    SELECT
      (oi."productId" || '|' || oi.title || '|' || oi."variantLabel") AS "rowKey",
      oi."productId" AS "productId",
      oi.title AS title,
      oi."variantLabel" AS "variantLabel",
      SUM(oi.qty)::int AS qty,
      SUM(oi."lineTotalCents")::int AS "revenueCents"
    FROM "OrderItem" oi
    JOIN "Order" o ON o.id = oi."orderId"
    WHERE o.status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
      AND o."createdAt" >= ${start.toISOString()}::timestamp
      AND o."createdAt" < ${endExclusive.toISOString()}::timestamp
    GROUP BY oi."productId", oi.title, oi."variantLabel"
    ORDER BY "revenueCents" DESC
    LIMIT 8
  `) ?? [];



  // ========= TREND GIORNALIERO (filtrato per periodo) =========
  const rows = (await prisma.$queryRaw<
    Array<{
      day: string;
      orders: number;
      paidOrders: number;
      grossCents: number | null;
      paidGrossCents: number | null;
    }>
  >`
  SELECT
    TO_CHAR("createdAt", 'YYYY-MM-DD') AS day,
    COUNT(*)::int AS orders,

    -- conteggio ordini "pagati" (anche se avanzano di stato)
    SUM(
      CASE
        WHEN status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
        THEN 1
        ELSE 0
      END
    )::int AS "paidOrders",

    -- totale lordo di TUTTI gli ordini (anche pending/canceled)
    SUM("totalCents")::int AS "grossCents",

    -- fatturato "pagati" (anche se avanzano di stato)
    SUM(
      CASE
        WHEN status IN ('PAID','PREPARING','SHIPPED','DELIVERED','REFUNDED','PARTIALLY_REFUNDED')
        THEN "totalCents"
        ELSE 0
      END
    )::int AS "paidGrossCents"

  FROM "Order"
  WHERE "createdAt" >= ${start.toISOString()}::timestamp AND "createdAt" < ${endExclusive.toISOString()}::timestamp
  GROUP BY TO_CHAR("createdAt", 'YYYY-MM-DD')
  ORDER BY day ASC
`) ?? [];


  const maxPaidGross = Math.max(1, ...rows.map((r) => Number(r.paidGrossCents ?? 0)));

  return (
    <div className="space-y-5">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle={
          <>
            Periodo: <span className="font-semibold">{startISO}</span> →{" "}
            <span className="font-semibold">{endISO}</span>
          </>
        }
        actions={
          <Link
            href={`/api/admin/report.csv?start=${startISO}&end=${endISO}`}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          >
            Export CSV
          </Link>
        }
      />

      {/* Range Picker */}
      <RangePicker startISO={startISO} endISO={endISO} />

      {/* Panoramica */}
      <Section title="Panoramica ordini" subtitle="Volumi e stati nel periodo selezionato.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Ordini totali" value={String(totalOrders)} />
          <StatCard title="Pagati" value={String(paidOrders)} />
          <StatCard title="In attesa" value={String(pendingOrders)} />
          <StatCard title="Annullati" value={String(canceledOrders)} />
          <StatCard title="Annullati al checkout" hint="In fase di pagamento" value={String(checkoutCanceled)} />
        </div>
      </Section>

      {/* Finanza */}
      <Section title="Finanza" subtitle="Ricavi pagati, fee, rimborsi e medie nel periodo.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Fatturato (pagati)" value={euro(revenueCents)} />
          <StatCard title="Netto stimato" value={euro(netCents)} hint="pagati − fee − refund" />
          <StatCard title="Valore medio ordine" value={euro(aovCents)} />
          <StatCard title="Fee / Refund" value={`${(feeRate * 100).toFixed(2)}% / ${(refundRate * 100).toFixed(2)}%`} />
        </div>
      </Section>

      {/* Operativo */}
      <Section title="Operativo" subtitle="Logistica ed evasione, sempre sul periodo selezionato.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Da spedire (nel periodo)" value={String(toShipInPeriod)} />
          <StatCard
            title="Evasione media"
            value={avgFulfillmentMs ? `${avgFulfillmentHours}h` : "—"}
            hint="paidAt → shippedAt (ordini spediti nel periodo)"
          />

        </div>
      </Section>

      {/* Prodotti */}
      <Section title="Prodotti" subtitle="Top prodotti/varianti per ricavo (pagati) nel periodo.">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-neutral-500">
              <tr>
                <th className="py-2 pr-4">Prodotto</th>
                <th className="py-2 pr-4">Variante</th>
                <th className="py-2 pr-4">Qty</th>
                <th className="py-2 pr-4 text-right">Ricavi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {topProducts.map((p) => (
                <tr key={p.rowKey}>

                  <td className="py-2 pr-4 font-semibold text-neutral-900">{p.title}</td>
                  <td className="py-2 pr-4 text-neutral-600">{p.variantLabel}</td>
                  <td className="py-2 pr-4 text-neutral-700">{Number(p.qty)}</td>
                  <td className="py-2 pr-4 text-right font-extrabold text-neutral-900">
                    {euro(Number(p.revenueCents))}
                  </td>
                </tr>
              ))}

              {topProducts.length === 0 ? (
                <tr>
                  <td className="py-6 text-neutral-600" colSpan={4}>
                    Nessun dato prodotti per il periodo selezionato.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Trend */}
      <Section title="Trend" subtitle="Andamento giornaliero sul periodo selezionato (barre = fatturato pagato).">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-neutral-500">
              <tr>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Ordini</th>
                <th className="py-2 pr-4">Pagati</th>
                <th className="py-2 pr-4">Fatturato (pagati)</th>
                <th className="py-2 pr-4">Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {rows.map((r) => {
                const paidGross = Number(r.paidGrossCents ?? 0);
                const w = Math.round((paidGross / maxPaidGross) * 240);
                return (
                  <tr key={r.day}>
                    <td className="py-2 pr-4 font-semibold text-neutral-900">{r.day}</td>
                    <td className="py-2 pr-4 text-neutral-700">{r.orders}</td>
                    <td className="py-2 pr-4 text-neutral-700">{r.paidOrders}</td>
                    <td className="py-2 pr-4 font-extrabold text-neutral-900">
                      {euro(paidGross)}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="h-2 w-[240px] rounded-full bg-neutral-100">
                        <div className="h-2 rounded-full bg-neutral-900" style={{ width: `${w}px` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 ? (
                <tr>
                  <td className="py-6 text-neutral-600" colSpan={5}>
                    Nessun dato per il periodo selezionato.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
