import Link from "next/link";
import RangePicker from "@/app/[locale]/admin/dashboard/RangerPicker";
import PageHeader from "../_components/PageHeader";

export const dynamic = "force-dynamic";

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function pickFirst(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
function isISODate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export default async function AdminExportsPage({
  searchParams,
}: {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}) {
  const sp = (await searchParams) ?? {};

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 30);

  const startRaw = pickFirst(sp.start);
  const endRaw = pickFirst(sp.end);

  const startISO =
    typeof startRaw === "string" && isISODate(startRaw)
      ? startRaw
      : toISO(defaultStart);
  const endISO =
    typeof endRaw === "string" && isISODate(endRaw) ? endRaw : toISO(today);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Export"
        subtitle={
          <>
            Periodo: <span className="font-semibold">{startISO}</span> →{" "}
            <span className="font-semibold">{endISO}</span>
          </>
        }
      />

      <RangePicker startISO={startISO} endISO={endISO} />

      <div className="grid gap-3 lg:grid-cols-2">
        <Card
          title="Report ordini (periodo)"
          desc="CSV ordini nel periodo selezionato (stesso della dashboard)."
          href={`/api/admin/report.csv?start=${startISO}&end=${endISO}`}
          cta="Scarica report.csv"
        />

        <Card
          title="Clienti"
          desc="Clienti derivati dagli ordini pagati: spesa, # ordini, ultimo ordine."
          href="/api/admin/customers.csv"
          cta="Scarica customers.csv"
        />

        <Card
          title="Fatture (periodo)"
          desc="PDF unico con una pagina per ordine (placeholder: struttura da definire)."
          href={`/api/admin/invoices.pdf?mode=range&start=${startISO}&end=${endISO}`}
          cta="Scarica fatture.pdf"
        />

        <Card
          title="Spedizioni (coda)"
          desc="Ordini pagati e non spediti (backlog attuale)."
          href="/api/admin/shipping.csv"
          cta="Scarica shipping.csv"
        />
      </div>
    </div>
  );
}

function Card({
  title,
  desc,
  href,
  cta,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-base font-extrabold tracking-tight text-neutral-900">
        {title}
      </div>
      <div className="mt-2 text-sm text-neutral-600">{desc}</div>
      <div className="mt-4">
        <Link
          href={href}
          className="inline-flex rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}