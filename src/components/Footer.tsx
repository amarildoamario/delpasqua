"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-white text-zinc-900 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="font-serif text-xl tracking-[0.10em] text-zinc-900 dark:text-white">
              FRANTOIO DEL PASQUA
            </div>
            <div className="mt-1 text-xs tracking-[0.18em] text-zinc-600/90 dark:text-zinc-300/80">
              SRL
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-700 dark:text-zinc-300/90">
              Tradizione agricola, qualità e cura artigianale. Produciamo oli
              extravergini con tecniche moderne e rispetto della materia prima.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <SocialIcon
                href="https://facebook.com/"
                label="Facebook"
                icon={<FacebookIcon className="h-5 w-5" />}
              />
              <SocialIcon
                href="https://instagram.com/"
                label="Instagram"
                icon={<InstagramIcon className="h-5 w-5" />}
              />
            </div>
          </div>

          {/* Contatti */}
          <div className="md:col-span-5">
            <div className="text-xs tracking-[0.16em] text-zinc-600/90 dark:text-zinc-300/80">
              CONTATTI
            </div>

            <ul className="mt-5 space-y-3 text-sm text-zinc-700 dark:text-zinc-200/90">
              <li className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 text-zinc-600/80 dark:text-zinc-300/80" />
                <span className="leading-relaxed">
                  Loc. Infernaccio 510/B, Monte San Savino – Arezzo
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-zinc-600/80 dark:text-zinc-300/80" />
                <a
                  className="hover:text-black dark:hover:text-white"
                  href="tel:+390575810065"
                  aria-label="Chiama"
                >
                  +39 0575 810065
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="h-5 w-5 text-zinc-600/80 dark:text-zinc-300/80" />
                <a
                  className="hover:text-black dark:hover:text-white"
                  href="mailto:info@delpasqua.com"
                  aria-label="Email"
                >
                  info@delpasqua.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <ShieldIcon className="h-5 w-5 text-zinc-600/80 dark:text-zinc-300/80" />
                <Link
                  href="/parita-di-genere"
                  className="hover:text-black dark:hover:text-white"
                >
                  Politica Parità di Genere UNI PDR 125
                </Link>
              </li>
            </ul>
          </div>

          {/* Link utili */}
          <div className="md:col-span-3">
            <div className="text-xs tracking-[0.16em] text-zinc-600/90 dark:text-zinc-300/80">
              INFORMAZIONI
            </div>

            <ul className="mt-5 space-y-3 text-sm text-zinc-700 dark:text-zinc-200/90">
              <li>
                <Link className="hover:text-black dark:hover:text-white" href="/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-black dark:hover:text-white" href="/cookie">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-black dark:hover:text-white" href="/termini">
                  Termini e Condizioni
                </Link>
              </li>

              {/* (consigliati) */}
              <li>
                <Link className="hover:text-black dark:hover:text-white" href="/spedizioni">
                  Spedizioni
                </Link>
              </li>
              <li>
                <Link className="hover:text-black dark:hover:text-white" href="/resi">
                  Resi e rimborsi
                </Link>
              </li>

              <li>
                <Link className="hover:text-black dark:hover:text-white" href="/contatti">
                  Contatti
                </Link>
              </li>
            </ul>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-zinc-200/70 pt-6 text-xs text-zinc-600/90 dark:border-white/10 dark:text-zinc-300/80 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} Frantoio del Pasqua — Tutti i diritti
            riservati.
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-zinc-900 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
              aria-label="Torna su"
              title="Torna su"
            >
              Torna su
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- bits ---------- */

function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
    >
      {icon}
    </a>
  );
}

/* ---------- icons ---------- */

function PinIcon({ className }: { className?: string }) {
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
      <path d="M12 22s7-4.5 7-12a7 7 0 0 0-14 0c0 7.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
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
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L9 10.6a16 16 0 0 0 4.4 4.4l1.3-1.1a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9Z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
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
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  );
}

function ArrowUp({ className }: { className?: string }) {
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
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.4.7-1.4 1.4v1.7H16l-.4 2.9h-2.5v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm8.4 2H7.8A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4Zm-4.2 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.6 6.9a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1Z" />
    </svg>
  );
}
