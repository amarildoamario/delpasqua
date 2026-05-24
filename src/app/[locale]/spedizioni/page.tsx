import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: "Spedizioni",
    description: "Tempi, costi e modalita di spedizione di Frantoio Del Pasqua.",
    path: "/spedizioni/",
    locale,
    hreflang: false,
  });
}

const lastUpdated = "24/05/2026";

const COMPANY_EMAIL = "info@delpasqua.com";
const COMPANY_PHONE = "+39 0575 810065";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
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
            Qui trovi tempi, costi e modalita di consegna. I tempi indicati sono medi e possono
            variare nei periodi festivi o in presenza di destinazioni particolari.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <InfoRow label="Preparazione ordine" value="Di norma entro 24/48 ore lavorative." />
          <InfoRow label="Consegna stimata" value="In genere 2-3 giorni lavorativi dalla spedizione." />
          <InfoRow label="Tracking" value="Inviato all'email dell'ordine quando disponibile." />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Costi di spedizione</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
              <p>
                La spedizione e gratuita per ordini sopra 50 EUR. Per importi inferiori o condizioni
                particolari, l&apos;eventuale costo viene mostrato al checkout prima del pagamento.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Mancata consegna o giacenza</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700">
              <p>
                Verifica sempre indirizzo, citofono e recapito telefonico. In caso di mancata
                consegna o giacenza, contattaci a{" "}
                <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
                  {COMPANY_EMAIL}
                </a>{" "}
                o al numero{" "}
                <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
                  {COMPANY_PHONE}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
