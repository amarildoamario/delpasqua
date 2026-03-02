"use client";

import Link from "next/link";
import { useEffect } from "react";

function Refresh(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 12a8 8 0 1 1-2.3-5.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 4v6h-6"
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

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-white text-black">
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* light */}
        <div className="absolute -top-56 right-[-220px] hidden h-[720px] w-[720px] rounded-full bg-black/5 blur-3xl sm:block" />
        <div className="absolute -bottom-60 left-1/2 hidden h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-black/4 blur-3xl sm:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-b from-black/[0.04] via-transparent to-transparent sm:block" />

      </div>

      <section className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
          <p className="text-xs font-semibold tracking-[0.24em] text-black/50">
            ERROR
          </p>

          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Qualcosa si è rotto.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/60">
            Riprova: spesso è un errore temporaneo. Se persiste, torna allo shop.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={reset}
              className="group inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Refresh className="h-4 w-4 transition group-hover:rotate-180" />
              Riprova
            </button>

            <Link
              href="/shop"
              className="inline-flex items-center rounded-full px-2 py-2 text-sm font-semibold text-black/70 transition hover:text-black"
            >
              Vai allo shop
            </Link>
          </div>

          <details className="mt-12 max-w-2xl">
            <summary className="cursor-pointer text-sm font-semibold text-black/50 transition hover:text-black/70">
              Dettagli tecnici (dev)
            </summary>
            <pre className="mt-4 overflow-auto rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-xs text-black/70">
{String(error?.message ?? error)}
            </pre>
          </details>
        </div>
      </section>

      <Footer />
    </main>
  );
}
