import Link from "next/link";

function Arrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-white/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 text-xs text-black/60">
        <span>© {new Date().getFullYear()} — All rights reserved</span>
        <div className="flex items-center gap-4">
          <Link className="hover:text-black/80" href="/shop">
            Shop
          </Link>
          <Link className="hover:text-black/80" href="/">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function ShopNotFound() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-white text-black">
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* light */}
        <div className="absolute -top-56 left-[-220px] hidden h-[720px] w-[720px] rounded-full bg-black/5 blur-3xl sm:block" />
        <div className="absolute -bottom-60 right-[-220px] hidden h-[720px] w-[720px] rounded-full bg-black/4 blur-3xl sm:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-b from-black/[0.04] via-transparent to-transparent sm:block" />

      </div>

      <section className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
          <p className="text-xs font-semibold tracking-[0.24em] text-black/50">
            SHOP / 404
          </p>

          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Prodotto non trovato.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/60">
            Quel link non punta a nessun prodotto disponibile. Torna al catalogo e scegli qualcosa.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Torna al catalogo
              <Arrow className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center rounded-full px-2 py-2 text-sm font-semibold text-black/70 transition hover:text-black"
            >
              Home
            </Link>
          </div>

          <div className="mt-14 flex items-center gap-3 text-xs text-black/45">
            <span className="h-[1px] w-10 bg-black/15" />
            <span>Se te l’ha mandato qualcuno, potrebbe essere un link vecchio.</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
