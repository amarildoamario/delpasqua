import Footer from "@/components/Footer";

export const metadata = { title: "Resi e rimborsi" };

const lastUpdated = "17/02/2026";

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-100">
          {n}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <div className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200/90">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResiPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:p-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Resi e rimborsi</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Ultimo aggiornamento: <span className="font-medium">{lastUpdated}</span>
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-700 dark:text-zinc-200/90">
            Qui trovi le condizioni per recesso, reso e rimborso. Completa i campi in{" "}
            <span className="italic">corsivo</span> con le policy reali (tempi, eccezioni, chi paga il reso).
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Recesso
            </p>
            <p className="mt-2 text-sm italic text-zinc-800 dark:text-zinc-200/90">
              (es.) Entro 14 giorni dalla consegna
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Rimborso
            </p>
            <p className="mt-2 text-sm italic text-zinc-800 dark:text-zinc-200/90">
              (es.) Entro 5–10 giorni lavorativi dalla verifica
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Condizioni
            </p>
            <p className="mt-2 text-sm italic text-zinc-800 dark:text-zinc-200/90">
              (es.) Prodotto integro + imballo adeguato
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Step n={1} title="Richiesta reso">
            <p className="italic">Contatta l’assistenza indicando numero ordine e motivazione.</p>
          </Step>
          <Step n={2} title="Istruzioni e spedizione">
            <p className="italic">Ricevi istruzioni e invia il pacco all’indirizzo indicato.</p>
          </Step>
          <Step n={3} title="Verifica e rimborso">
            <p className="italic">Dopo la verifica del reso, ricevi rimborso secondo i tempi indicati.</p>
          </Step>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold">Costi di reso</h2>
            <div className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200/90">
              <p className="italic">
                Specifica chi paga il reso (cliente/venditore) e in quali casi (difetto, errore spedizione, ecc.).
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold">Eccezioni</h2>
            <div className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200/90">
              <p className="italic">
                Inserisci eventuali esclusioni applicabili (beni sigillati, deperibili, personalizzati, ecc.).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200/90">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">Nota</p>
          <p className="mt-1">Questo testo è un template informativo e non costituisce consulenza legale.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
