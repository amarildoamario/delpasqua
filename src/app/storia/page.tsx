import Footer from "@/components/Footer";

export default function StoriaPage() {
  return (
    <>
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {/* Header */}
          <div className="max-w-2xl">
            <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              STORIA
            </div>
            <h1 className="mt-3 font-serif text-4xl tracking-[0.06em] text-zinc-900 dark:text-white">
              La nostra storia
            </h1>

            <p className="mt-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
              L’azienda Del Pasqua nasce intorno agli anni ’60 dal lavoro del padre Sabatino. Con gli
              anni, si unisce all’azienda di famiglia anche il figlio Emanuele, con l’obiettivo di
              fare forza sulla diversificazione, puntando sulla qualità dei prodotti e aprendo così
              l’azienda a nuovi sbocchi e direzioni.
            </p>
          </div>

          {/* Separator */}
          <hr className="my-12 border-black/10 dark:border-white/12" />

          {/* Section 1 */}
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <SectionKicker>I nostri oliveti</SectionKicker>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                I nostri oliveti si estendono per 4 ettari, suddivisi tra le cultivar tipiche delle
                nostre zone: leccino, frantoiane e moraiolo.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                Nel rispetto delle coltivazioni tradizionali, ma secondo tecniche moderne e
                innovative, sono stati piantati nuovi olivi il cui stato viene costantemente
                monitorato dal lavoro dell’agronomo che valuta lo stato di maturità delle olive.
              </p>
            </div>

            <div className="md:pt-1">
              <ImagePlaceholder label="IMMAGINE — OLIVETI" />
            </div>
          </div>

          {/* Separator */}
          <hr className="my-12 border-black/10 dark:border-white/12" />

          {/* Section 2 */}
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div className="md:order-2">
              <SectionKicker>La nostra raccolta</SectionKicker>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                Aspettiamo sempre Ottobre per la raccolta e ci divertiamo lavorando con le nostre
                passioni. Oggi abbiamo raggiunto un grande traguardo: attualmente i nostri prodotti
                sono apprezzati a livello locale e internazionale. Da qualche anno l’azienda esporta
                stabilmente i propri prodotti negli Stati Uniti. L’olio extravergine di oliva “IL
                MAGNIFICO” riscuote una sempre più alta approvazione da parte del mercato.
              </p>
            </div>

            <div className="md:order-1 md:pt-1">
              <ImagePlaceholder label="IMMAGINE — RACCOLTA" />
            </div>
          </div>

          {/* Separator */}
          <hr className="my-12 border-black/10 dark:border-white/12" />

          {/* Closing statement */}
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                FILOSOFIA
              </div>

              <h2 className="mt-3 font-serif text-3xl tracking-[0.06em] text-zinc-900 dark:text-white">
                Sapori toscani nel rispetto dell&apos;ambiente <br className="hidden sm:block" />
                e delle Tradizioni
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                Una storia di famiglia, un lavoro paziente e una cura costante: la qualità nasce
                dalla somma di piccoli gesti, ripetuti bene, ogni anno.
              </p>
            </div>

            <div className="md:pt-1">
              <ImagePlaceholder label="IMMAGINE — TERRITORIO" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
      {children}
    </div>
  );
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-black/10 bg-zinc-50 dark:border-white/12 dark:bg-white/5">
      {/* Area immagine (placeholder) */}
      <div className="aspect-[4/5] w-full">
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] tracking-[0.20em] text-zinc-700 dark:border-white/12 dark:bg-black/40 dark:text-zinc-200">
            {label}
          </div>
        </div>
      </div>

      {/* Dettaglio “decor” leggero */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-zinc-200 blur-3xl dark:bg-white/10" />
        <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-zinc-200 blur-3xl dark:bg-white/10" />
      </div>
    </div>
  );
}
