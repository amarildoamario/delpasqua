"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

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
        id: "tradizione",
        title: t("slides.tradizione.title"),
        excerpt: t("slides.tradizione.excerpt"),
        cta: t("slides.tradizione.cta"),
        href: "/produzione",
        imageSrc: "/hero/tradizione.png",
        imageAlt: t("slides.tradizione.alt"),
      },
      {
        id: "storia",
        title: t("slides.storia.title"),
        excerpt: t("slides.storia.excerpt"),
        cta: t("slides.storia.cta"),
        href: "/storia",
        imageSrc: "/hero/storia.jpeg",
        imageAlt: t("slides.storia.alt"),
      },
      {
        id: "oli",
        title: t("slides.oli.title"),
        excerpt: t("slides.oli.excerpt"),
        cta: t("slides.oli.cta"),
        href: "/shop",
        imageSrc: "/hero/oli.png",
        imageAlt: t("slides.oli.alt"),
      },
    ],
    [t]
  );

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  function goTo(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  useEffect(() => {
    if (reducedMotion || isPaused) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, [isPaused, reducedMotion, slides.length]);

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-[#120f0d]"
      aria-label={t("aria.hero_highlight")}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <h1 className="sr-only">{t("sr_title")}</h1>

      <div className="relative hero-container-height min-h-[500px] w-full md:min-h-[560px]">
        {slides.map((slide, slideIndex) => {
          const active = slideIndex === index;

          return (
            <figure
              key={slide.id}
              className={cn(
                "absolute inset-0 w-full transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                active ? "opacity-100" : "pointer-events-none opacity-0"
              )}
              aria-hidden={!active}
            >
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                priority={slideIndex === 0}
                sizes="100vw"
                className={cn(
                  "object-cover object-center transition-transform duration-[7000ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  active ? "scale-100" : "scale-[1.08]"
                )}
              />

              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,11,8,0.68)_0%,rgba(18,11,8,0.38)_38%,rgba(18,11,8,0.16)_62%,rgba(18,11,8,0.46)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,164,97,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(98,128,72,0.14),transparent_24%)]" />
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/40 to-transparent" />

              <figcaption className="absolute inset-0">
                <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-6 py-14 text-center sm:px-10">
                  <div
                    className={cn(
                      "w-full max-w-4xl text-white transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    )}
                  >
                    <div className="flex items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">
                      <span>Frantoio Del Pasqua</span>
                      <span className="h-px w-10 bg-[#c0a36b]/60" aria-hidden="true" />
                      <span>{String(slideIndex + 1).padStart(2, "0")}</span>
                    </div>

                    <h2 className="mx-auto mt-5 max-w-[220px] xs:max-w-[280px] sm:max-w-[12ch] font-serif text-4xl leading-[0.95] sm:leading-[0.9] tracking-[0.02em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                      {slide.title}
                    </h2>

                    <p className="mx-auto mt-5 max-w-[260px] xs:max-w-[320px] sm:max-w-[46rem] text-sm leading-6 sm:leading-8 text-white/85 sm:text-base lg:text-lg">
                      {slide.excerpt}
                    </p>

                    <div className="mt-8 flex items-center justify-center">
                      <Link
                        href={slide.href}
                        className="inline-flex items-center gap-2 rounded-[5px] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#120f0d] transition-all duration-300 hover:bg-neutral-100 hover:text-black hover:shadow-[0_12px_24px_rgba(255,255,255,0.12)] hover:scale-[1.02] active:scale-[0.98]"
                        aria-label={`${slide.cta}: ${slide.title}`}
                      >
                        {slide.cta}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>

                  </div>
                </div>
              </figcaption>
            </figure>
          );
        })}

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={prev}
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border-white/15 bg-black/20 text-white backdrop-blur-sm hover:bg-black/34 sm:left-6 lg:left-8"
          aria-label={t("aria.prev")}
        >
          <ArrowLeft className="size-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={next}
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border-white/15 bg-black/20 text-white backdrop-blur-sm hover:bg-black/34 sm:right-6 lg:right-8"
          aria-label={t("aria.next")}
        >
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <nav className="sr-only" aria-label={t("aria.main_sections")}>
        <ul>
          {slides.map((slide) => (
            <li key={slide.id}>
              <Link href={slide.href}>{slide.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

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
