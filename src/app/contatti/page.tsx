import Footer from "@/components/Footer";
import Link from "next/link";

export default function ContattiPage() {
  return (
    <>
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 py-16">
          {/* HERO */}
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                CONTATTI
              </div>

              <h1 className="mt-3 font-serif text-4xl tracking-[0.06em] text-zinc-900 dark:text-white">
                Siamo qui
              </h1>

              <p className="mt-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                Per richieste commerciali, informazioni sui prodotti o collaborazioni, scrivici o chiamaci.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <Pill>RISPOSTA RAPIDA</Pill>
                <Pill>SUPPORTO ORDINI</Pill>
                <Pill>RICHIESTE B2B</Pill>
              </div>
            </div>

            {/* Mini placeholder a destra (diverso dalle altre pagine) */}
            <div className="lg:pl-6">
              <MiniPlaceholder label="PLACEHOLDER — FRANTOIO" />
            </div>
          </div>

          <hr className="my-12 border-black/10 dark:border-white/12" />

          {/* GRID: INFO + FORM */}
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            {/* INFO */}
            <div>
              <div className="rounded-[18px] border border-black/10 bg-white p-6 dark:border-white/12 dark:bg-white/5">
                <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  AZIENDA
                </div>

                <h2 className="mt-3 font-serif text-2xl tracking-[0.06em] text-zinc-900 dark:text-white">
                  FRANTOIO DEL PASQUA srl
                </h2>

                <div className="mt-6 space-y-4 text-sm text-zinc-800 dark:text-zinc-200">
                  <InfoRow label="Indirizzo">
                    Loc. Infernaccio 510/B Monte San Savino - Arezzo
                  </InfoRow>

                  <InfoRow label="Telefono">
                    <a
                      className="hover:underline"
                      href="tel:+390575810065"
                      aria-label="Telefono"
                    >
                      +39 0575 810065
                    </a>
                  </InfoRow>

                  <InfoRow label="Mobile">
                    <a className="hover:underline" href="tel:+393388110356" aria-label="Mobile">
                      +39 338 811 0356
                    </a>
                  </InfoRow>

                  <InfoRow label="Fax">
                    <span>+39 0575 810065</span>
                  </InfoRow>

                  <InfoRow label="Email">
                    <a className="hover:underline" href="mailto:info@delpasqua.com" aria-label="Email">
                      info@delpasqua.com
                    </a>
                  </InfoRow>
                </div>

                <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/12">
                  <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                    DOCUMENTI
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <a
                      href="https://delpasqua.com/wp-content/uploads/2025/03/Politica-Parita-di-Genere-Frantoio-Del-Pasqua-gen-20251.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-3 py-2 text-[10px] tracking-[0.20em] text-zinc-700 hover:bg-black/5 dark:border-white/12 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                    >
                      <IconFile />
                      POLITICA PARITÀ DI GENERE UNI PDR 125
                    </a>

                    <Link
                      href="/privacy"
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-3 py-2 text-[10px] tracking-[0.20em] text-zinc-700 hover:bg-black/5 dark:border-white/12 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                    >
                      <IconShield />
                      PRIVACY
                    </Link>
                  </div>
                </div>

                <div className="mt-8 border-t border-black/10 pt-6 dark:border-white/12">
                  <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                    SOCIAL
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <SocialChip href="https://facebook.com/" label="Facebook">
                      <FacebookIcon className="h-4 w-4" />
                      FACEBOOK
                    </SocialChip>
                    <SocialChip href="https://instagram.com/" label="Instagram">
                      <InstagramIcon className="h-4 w-4" />
                      INSTAGRAM
                    </SocialChip>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div>
              <div className="rounded-[18px] border border-black/10 bg-white p-6 dark:border-white/12 dark:bg-white/5">
                <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  SCRIVICI
                </div>

                <h2 className="mt-3 font-serif text-2xl tracking-[0.06em] text-zinc-900 dark:text-white">
                  Invia un messaggio
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                  Compila il form: ti rispondiamo il prima possibile.
                </p>

                <form className="mt-8 space-y-4" action="#" method="post">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nome" name="name" placeholder="Il tuo nome" />
                    <Field label="Email" name="email" type="email" placeholder="nome@email.com" />
                  </div>

                  <Field label="Oggetto" name="subject" placeholder="Es. informazioni prodotto / ordine / B2B" />

                  <div>
                    <label className="block text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                      Messaggio
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      placeholder="Scrivi qui…"
                      className={[
                        "mt-2 w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm",
                        "text-zinc-900 placeholder:text-zinc-400",
                        "focus:outline-none focus:ring-2 focus:ring-black/10",
                        "dark:border-white/12 dark:bg-black/30 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-white/10",
                      ].join(" ")}
                    />
                  </div>

                  {/* Consenso (testo come in pagina originale) */}
                  <label className="flex items-start gap-3 pt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      name="consent"
                      className="mt-1 h-4 w-4 rounded border-black/20 dark:border-white/20"
                    />
                    <span>
                      Acconsento al trattamento dei miei dati e dichiaro di aver preso visione della privacy policy
                    </span>
                  </label>

                  <div className="pt-2">
                    <button
                      type="button"
                      className={[
                        "inline-flex items-center justify-center rounded-full px-5 py-3",
                        "text-[11px] tracking-[0.20em]",
                        "bg-zinc-900 text-white hover:bg-zinc-800",
                        "dark:bg-white dark:text-black dark:hover:bg-zinc-200",
                      ].join(" ")}
                      title="Invia (placeholder)"
                      aria-label="Invia"
                    >
                      INVIA
                    </button>

                    <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                      (Per ora è un segnaposto: quando vuoi, lo colleghiamo a un endpoint /api/contact o a un servizio email.)
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* MAP PLACEHOLDER full-width */}
          <div className="mt-12">
            <div className="rounded-[18px] border border-black/10 bg-zinc-50 p-6 dark:border-white/12 dark:bg-white/5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                    DOVE SIAMO
                  </div>
                  <div className="mt-2 text-sm text-zinc-800 dark:text-zinc-200">
                    Loc. Infernaccio 510/B Monte San Savino - Arezzo
                  </div>
                </div>

                <a
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] tracking-[0.20em] text-zinc-700 hover:bg-black/5 dark:border-white/12 dark:bg-black/30 dark:text-zinc-200 dark:hover:bg-white/10"
                  href="https://www.google.com/maps/search/?api=1&query=Loc.%20Infernaccio%20510%2FB%20Monte%20San%20Savino%20Arezzo"
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconPin />
                  APRI SU MAPS
                </a>
              </div>

              <div className="mt-6">
                <MapPlaceholder label="MAPPA — PLACEHOLDER" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ---------- Small UI components ---------- */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] tracking-[0.20em] text-zinc-700 dark:border-white/12 dark:bg-white/5 dark:text-zinc-200">
      {children}
    </span>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[96px_1fr] gap-4">
      <div className="text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="text-sm text-zinc-900 dark:text-zinc-100">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={[
          "mt-2 w-full rounded-[14px] border border-black/10 bg-white px-4 py-3 text-sm",
          "text-zinc-900 placeholder:text-zinc-400",
          "focus:outline-none focus:ring-2 focus:ring-black/10",
          "dark:border-white/12 dark:bg-black/30 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-white/10",
        ].join(" ")}
      />
    </div>
  );
}

function MiniPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-black/10 bg-zinc-50 dark:border-white/12 dark:bg-white/5">
      <div className="aspect-[16/10] w-full">
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] tracking-[0.20em] text-zinc-700 dark:border-white/12 dark:bg-black/40 dark:text-zinc-200">
            {label}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-55">
        <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-zinc-200 blur-3xl dark:bg-white/10" />
        <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-zinc-200 blur-3xl dark:bg-white/10" />
      </div>
    </div>
  );
}

function MapPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-black/10 bg-white dark:border-white/12 dark:bg-black/30">
      <div className="aspect-[16/7] w-full">
        <div className="flex h-full w-full items-center justify-center">
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] tracking-[0.20em] text-zinc-700 dark:border-white/12 dark:bg-black/40 dark:text-zinc-200">
            {label}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 dark:border-white/12" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
      </div>
    </div>
  );
}

function SocialChip({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-3 py-2 text-[10px] tracking-[0.20em] text-zinc-700 hover:bg-black/5 dark:border-white/12 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
    >
      {children}
    </a>
  );
}

/* ---------- Icons (inline SVG) ---------- */

function IconPin() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s7-4.4 7-11a7 7 0 0 0-14 0c0 6.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
      <path d="M9 12l2 2 4-5" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.88 1.26 4 4 0 0 1 7.88-1.26Z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" />
    </svg>
  );
}
