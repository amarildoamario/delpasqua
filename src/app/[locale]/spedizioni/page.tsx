import Footer from "@/components/Footer";

export const metadata = { title: "Spedizioni" };

const lastUpdated = "17/02/2026";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-sm text-zinc-800">{value}</p>
    </div>
  );
}

export default function SpedizioniPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Spedizioni</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Ultimo aggiornamento: <span className="font-medium">{lastUpdated}</span>
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-700">
            Qui trovi tempi, costi e modalità di consegna. Completa i campi in{" "}
            <span className="italic">corsivo</span> con le info reali (corrieri, soglie, aree servite).
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <InfoRow label="Preparazione ordine" value="(es.) 24/48h lavorative" />
          <InfoRow label="Consegna stimata" value="(es.) 1–3 giorni lavorativi" />
          <InfoRow label="Tracking" value="(es.) inviato via email dopo spedizione" />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Costi di spedizione</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
              <p className="italic">
                Inserisci tariffa standard, soglia spedizione gratuita, eventuali sovrapprezzi (isole/zone remote).
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Mancata consegna / Giacenza</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
              <p className="italic">
                Indica regole su tentativi di consegna, giacenza, indirizzo errato e costi di rientro.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
