import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import PageHeader from "../_components/PageHeader";


export const dynamic = "force-dynamic";

export default async function AdminOpsPage() {
  const now = new Date();

  // backlog “vecchio” > 48h
  const cutoff48h = new Date(now);
  cutoff48h.setHours(now.getHours() - 48);

  const [toShip, toShipOld, pendingOld] = await Promise.all([
    // backlog totale
    prisma.order.count({ where: { status: "PAGATO", shippedAt: null } }),

    // backlog “vecchio”
    prisma.order.count({
      where: {
        status: "PAGATO",
        shippedAt: null,
        paidAt: { not: null, lt: cutoff48h },
      },
    }),

    // IN_ATTESA vecchi
    prisma.order.count({
      where: {
        status: "IN_ATTESA",
        createdAt: { lt: cutoff48h },
      },
    }),
  ]);

  return (

    <div className="space-y-4">
      <PageHeader
        title="Operatività"
        subtitle="Tre numeri chiave per capire cosa fare adesso: spedire, recuperare ritardi e chiudere gli ordini IN ATTESA vecchi."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/api/admin/print-todo"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
            >
              Stampa ordini da fare
            </a>


          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid gap-3 md:grid-cols-3">
        <KpiCard
          title="Da spedire"
          value={String(toShip)}
          hint="Ordini PAGATI non spediti"
          href="/admin/orders?status=PAGATO&shipped=no"
          cta="Apri backlog"
        />

        <KpiCard
          title="Da spedire > 48h"
          value={String(toShipOld)}
          hint="Pagati da oltre 48h"
          href="/admin/orders?status=PAGATO&shipped=no"
          cta="Vedi ritardi"
        />

        <KpiCard
          title="IN ATTESA > 48h"
          value={String(pendingOld)}
          hint="Checkout in sospeso da troppo"
          href="/admin/orders?status=IN_ATTESA"
          cta="Vedi IN ATTESA"
        />
      </div>

      {/* Quick links (solo cose utili quotidianamente) */}
      <div className="grid gap-3 lg:grid-cols-3">
        <QuickLink title="Ordini" desc="Lista completa e filtri" href="/admin/orders" />

        <QuickLink title="Clienti" desc="Storico e recapiti" href="/admin/customers" />
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  hint,
  href,
  cta,
}: {
  title: string;
  value: string;
  hint: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-neutral-200/40 blur-2xl" />
      </div>

      <div className="relative">
        <div className="text-xs font-bold uppercase tracking-wide text-neutral-500">
          {title}
        </div>

        <div className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900">
          {value}
        </div>

        <div className="mt-1 text-sm text-neutral-600">
          {hint}
        </div>

        <div className="mt-4">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
          >
            {cta}
            <span
              aria-hidden
              className="text-neutral-400 group-hover:text-neutral-600"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-extrabold text-neutral-900">
            {title}
          </div>
          <div className="mt-1 text-sm text-neutral-600">
            {desc}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-bold text-neutral-700 group-hover:bg-neutral-50">
          Apri
        </div>
      </div>

      <div className="mt-4 text-sm font-semibold text-neutral-400 group-hover:text-neutral-600">
        Vai →
      </div>
    </Link>
  );
}
