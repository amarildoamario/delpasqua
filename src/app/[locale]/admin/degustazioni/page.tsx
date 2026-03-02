import PageHeader from "../_components/PageHeader";
import TastingStatusActions from "./status-actions";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

function fmt(d: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function statusBadge(status: string) {
  if (status === "CONFIRMED") return "bg-emerald-100 text-emerald-800";
  if (status === "CANCELED") return "bg-stone-200 text-stone-700";
  return "bg-amber-100 text-amber-900";
}

export default async function AdminDegustazioniPage() {
  const now = new Date();

  // ✅ ultimi 90 giorni (passato)
  const from = new Date(now);
  from.setDate(from.getDate() - 90);

  // ✅ prossimi 90 giorni (futuro)
  const to = new Date(now);
  to.setDate(to.getDate() + 90);

  const bookings = await prisma.tastingBooking.findMany({
    where: { slotStart: { gte: from, lte: to } },
    // ✅ più recente → più vecchia
    orderBy: { slotStart: "desc" },
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Degustazioni"
        subtitle="Prenotazioni degustazioni e visite al frantoio (ultimi 90 giorni + prossimi 90)."
      />

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-bold uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Stato</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Contatti</th>
                <th className="px-4 py-3">Persone</th>
                <th className="px-4 py-3">Azioni</th>
              </tr>
            </thead>

            <tbody>
              {!bookings.length ? (
                <tr>
                  <td className="px-4 py-6 text-neutral-600" colSpan={7}>
                    Nessuna prenotazione.
                  </td>
                </tr>
              ) : null}

              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-neutral-200 last:border-b-0">
                  <td className="px-4 py-3 font-semibold text-neutral-900">
                    <div>{fmt(b.slotStart)}</div>
                    <div className="text-xs text-neutral-500">→ {fmt(b.slotEnd)}</div>
                    <div className="mt-1 text-[11px] font-mono text-neutral-500">{b.id}</div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold",
                        statusBadge(b.status),
                      ].join(" ")}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-semibold text-neutral-900">{b.tastingType}</td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-neutral-900">{b.fullName}</div>
                    {b.notes ? (
                      <div className="mt-1 line-clamp-2 text-xs text-neutral-600">{b.notes}</div>
                    ) : (
                      <div className="mt-1 text-xs text-neutral-400">(nessuna nota)</div>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="text-neutral-900">
                      <a className="underline" href={`mailto:${b.email}`}>
                        {b.email}
                      </a>
                    </div>
                    <div className="text-neutral-700">{b.phone}</div>
                  </td>

                  <td className="px-4 py-3 font-semibold text-neutral-900">{b.people}</td>

                  <td className="px-4 py-3">
                    <TastingStatusActions id={b.id} status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}