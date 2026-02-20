import Link from "next/link";
import { prisma } from "@/lib/server/prisma";
import PageHeader from "../_components/PageHeader";


export const dynamic = "force-dynamic";

function hhmm(d: Date) {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export default async function AdminOpsPage() {
  const now = new Date();

  // backlog “vecchio” > 48h
  const cutoff48h = new Date(now);
  cutoff48h.setHours(now.getHours() - 48);

  const [toShip, toShipOld, pendingOld] = await Promise.all([
    // backlog totale
    prisma.order.count({ where: { status: "PAID", shippedAt: null } }),

    // backlog “vecchio”
    prisma.order.count({
      where: {
        status: "PAID",
        shippedAt: null,
        paidAt: { not: null, lt: cutoff48h },
      },
    }),

    // PENDING vecchi
    prisma.order.count({
      where: {
        status: "PENDING",
        createdAt: { lt: cutoff48h },
      },
    }),
  ]);

  return (
    
    <div className="space-y-4">
      <PageHeader
  title="Operatività"
  subtitle="Tre numeri chiave per capire cosa fare adesso: spedire, recuperare ritardi e chiudere i PENDING vecchi."
  actions={
  <div className="flex flex-wrap items-center gap-2">
    <a
      href="/api/admin/invoices.json?mode=shipping"
      target="_blank"
      rel="noreferrer"
      className="rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      Fatture da fare (JSON)
    </a>

    
  </div>
}
/>

      {/* Hero */}
      <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
              Aggiornato alle {hhmm(now)}
            </div>

            

            
          </div>

          <div className="flex flex-wrap items-center gap-2">
            

            
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <KpiCard
            title="Da spedire"
            value={String(toShip)}
            hint="Ordini PAID non spediti"
            href="/admin/orders?status=PAID&shipped=no"
            cta="Apri backlog"
          />

          <KpiCard
            title="Da spedire > 48h"
            value={String(toShipOld)}
            hint="Pagati da oltre 48h"
            href="/admin/orders?status=PAID&shipped=no"
            cta="Vedi ritardi"
          />

          <KpiCard
            title="PENDING > 48h"
            value={String(pendingOld)}
            hint="Checkout in sospeso da troppo"
            href="/admin/orders?status=PENDING"
            cta="Vedi PENDING"
          />
        </div>
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
    <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-neutral-200/40 blur-2xl dark:bg-neutral-700/30" />
      </div>

      <div className="relative">
        <div className="text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {title}
        </div>

        <div className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          {value}
        </div>

        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          {hint}
        </div>

        <div className="mt-4">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            {cta}
            <span
              aria-hidden
              className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
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
      className="group rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
            {title}
          </div>
          <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            {desc}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-bold text-neutral-700 group-hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:group-hover:bg-neutral-800">
          Apri
        </div>
      </div>

      <div className="mt-4 text-sm font-semibold text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
        Vai →
      </div>
    </Link>
  );
}
