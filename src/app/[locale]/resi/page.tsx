import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: "Resi e rimborsi",
    description: "Informazioni su recesso, resi e rimborsi di Frantoio Del Pasqua.",
    path: "/resi/",
    locale,
    hreflang: false,
  });
}

const lastUpdated = "24/05/2026";

const COMPANY_EMAIL = "info@delpasqua.com";
const COMPANY_PHONE = "+39 0575 810065";

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
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-800">
          {n}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <div className="mt-2 text-sm leading-relaxed text-zinc-700">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function ResiPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Resi e rimborsi</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Ultimo aggiornamento: <span className="font-medium">{lastUpdated}</span>
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-700">
            Se acquisti come consumatore, puoi richiedere il recesso entro 14 giorni dalla
            consegna, salvo le eccezioni previste dalla legge.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Recesso</p>
            <p className="mt-2 text-sm text-zinc-800">Entro 14 giorni dalla consegna.</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Rimborso</p>
            <p className="mt-2 text-sm text-zinc-800">Dopo ricezione e verifica del reso.</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Condizioni</p>
            <p className="mt-2 text-sm text-zinc-800">
              Prodotto integro, non utilizzato, con imballo adeguato.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Step n={1} title="Richiesta reso">
            <p>
              Scrivi a{" "}
              <a className="text-zinc-900 underline underline-offset-4" href={`mailto:${COMPANY_EMAIL}`}>
                {COMPANY_EMAIL}
              </a>{" "}
              oppure chiama il{" "}
              <a className="text-zinc-900 underline underline-offset-4" href="tel:+390575810065">
                {COMPANY_PHONE}
              </a>
              , indicando numero ordine e motivo della richiesta.
            </p>
          </Step>
          <Step n={2} title="Istruzioni e spedizione">
            <p>
              Ti confermeremo la procedura e l&apos;indirizzo a cui inviare il reso. Imballa il prodotto
              con cura per evitare danni durante il trasporto.
            </p>
          </Step>
          <Step n={3} title="Verifica e rimborso">
            <p>
              Dopo il controllo del reso, il rimborso viene disposto sul metodo di pagamento
              originario, quando possibile.
            </p>
          </Step>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Costi di reso</h2>
            <div className="mt-3 text-sm leading-relaxed text-zinc-700">
              <p>
                Se il prodotto arriva danneggiato o c&apos;è un errore nell&apos;ordine, contattaci subito.
                Negli altri casi, eventuali costi di restituzione vengono comunicati durante
                l&apos;apertura della pratica.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Eccezioni</h2>
            <div className="mt-3 text-sm leading-relaxed text-zinc-700">
              <p>
                Non possono essere accettati resi di prodotti aperti, alterati, privi di imballo
                idoneo o esclusi dal diritto di recesso secondo la normativa applicabile.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700 shadow-sm">
          <p className="font-medium text-zinc-900">Contatti utili</p>
          <p className="mt-1">
            Per velocizzare la pratica, indica sempre numero ordine, nome usato all&apos;acquisto e un
            recapito valido.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
