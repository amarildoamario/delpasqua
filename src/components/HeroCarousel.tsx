"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Slide = {
  id: string;
  title: string;
  excerpt: string;
  cta: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export default function HeroCarousel() {
  const t = useTranslations("HomePage.HeroCarousel");

  const slides: Slide[] = useMemo(
    () => [
      {
        id: "storia",
        title: t("slides.storia.title"),
        excerpt: t("slides.storia.excerpt"),
        cta: t("slides.storia.cta"),
        href: "/storia",
        imageSrc: "/hero/storia.jpg",
        imageAlt: t("slides.storia.alt"),
      },
      {
        id: "oli",
        title: t("slides.oli.title"),
        excerpt: t("slides.oli.excerpt"),
        cta: t("slides.oli.cta"),
        href: "/olio",
        imageSrc: "/hero/oli.jpg",
        imageAlt: t("slides.oli.alt"),
      },
      {
        id: "tradizione",
        title: t("slides.tradizione.title"),
        excerpt: t("slides.tradizione.excerpt"),
        cta: t("slides.tradizione.cta"),
        href: "/produzione",
        imageSrc: "/hero/tradizione.jpg",
        imageAlt: t("slides.tradizione.alt"),
      },
    ],
    [t]
  );

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  function goTo(next: number) {
    const n = (next + slides.length) % slides.length;
    setIndex(n);
  }
  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  // autoplay
  useEffect(() => {
    if (reducedMotion) return;
    if (isPaused) return;

    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [slides.length, isPaused, reducedMotion]);

  // keyboard arrows
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  }

  const current = slides[index];

  return (
    <section
      className="relative w-full"
      aria-label={t("aria.hero_highlight")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {/* SEO: un H1 globale (una sola volta in pagina). */}
      <h1 className="sr-only">
        {t("sr_title")}
      </h1>

      {/* ✅ HERO più alta */}
      <div className="relative h-[100svh] min-h-[560px] sm:min-h-[600px] lg:min-h-[660px] w-full overflow-hidden bg-black">


        {slides.map((s, i) => {
          const active = i === index;
          return (
            <figure
              key={s.id}
              className={[
                "absolute inset-0",
                "transition-opacity duration-700 ease-out",
                active ? "opacity-100" : "opacity-0",
              ].join(" ")}
              aria-hidden={!active}
            >
              <Image
                src={s.imageSrc}
                alt={s.imageAlt}
                fill
                priority={active}
                sizes="100vw"
                className="block object-cover scale-[1.02]"

              />

              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />

              <figcaption className="absolute inset-0 flex items-center justify-center px-6">
                <header className="mx-auto w-full max-w-3xl text-center">
                  <div className="mx-auto w-full max-w-[320px] sm:max-w-[520px] md:max-w-none">
                    <h2 className="font-serif text-4xl tracking-[0.02em] text-white sm:tracking-[0.04em] md:text-6xl md:tracking-[0.06em]">

                      {s.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-[34ch] text-sm leading-6 text-white/85 sm:max-w-[46ch] md:max-w-2xl md:text-base md:leading-relaxed">

                      {s.excerpt}
                    </p>

                    <div className="mt-6 flex items-center justify-center">
                      <Link
                        href={s.href}
                        className="inline-flex items-center gap-2 border-b border-white/60 pb-1 text-sm tracking-[0.06em] text-white hover:border-white sm:tracking-[0.10em]"
                        aria-label={`${s.cta}: ${s.title}`}
                      >
                        {s.cta}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </header>
              </figcaption>
            </figure>
          );
        })}

        {/* ✅ Frecce più piccole */}
        <button
          type="button"
          onClick={prev}
          className={[
            "absolute left-4 top-1/2 -translate-y-1/2",
            "rounded-full bg-white/10 p-2 text-white",
            "backdrop-blur hover:bg-white/15",
            "focus:outline-none focus:ring-2 focus:ring-white/60",
          ].join(" ")}
          aria-label={t("aria.prev")}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={next}
          className={[
            "absolute right-4 top-1/2 -translate-y-1/2",
            "rounded-full bg-white/10 p-2 text-white",
            "backdrop-blur hover:bg-white/15",
            "focus:outline-none focus:ring-2 focus:ring-white/60",
          ].join(" ")}
          aria-label={t("aria.next")}
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {slides.map((s, i) => {
            const active = i === index;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                className={[
                  "h-2.5 w-2.5 rounded-full transition-all",
                  active ? "bg-white" : "bg-white/40 hover:bg-white/70",
                ].join(" ")}
                aria-label={`${t("aria.go_to")}: ${s.title}`}
                aria-current={active ? "true" : "false"}
              />
            );
          })}
        </div>
      </div>

      {/* SEO fallback */}
      <nav className="sr-only" aria-label={t("aria.main_sections")}>
        <ul>
          {slides.map((s) => (
            <li key={s.id}>
              <Link href={s.href}>{s.title}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <meta name="description" content={current.excerpt} />
    </section>
  );
}

/* ---------- hooks ---------- */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/* ---------- icons ---------- */

function ChevronLeft({ className }: { className?: string }) {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
