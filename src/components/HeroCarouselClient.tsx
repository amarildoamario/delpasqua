"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { HeroSlide } from "@/components/HeroCarousel";

const SLIDE_FADE_MS = 900;

type HeroCarouselClientProps = {
  slides: HeroSlide[];
  labels: {
    prev: string;
    next: string;
  };
};

export default function HeroCarouselClient({ slides, labels }: HeroCarouselClientProps) {
  const [index, setIndex] = useState(0);
  const [renderedSlideIndices, setRenderedSlideIndices] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const indexRef = useRef(0);
  const cleanupTimerRef = useRef<number | null>(null);
  const transitionFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsEnhanced(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }
      if (transitionFrameRef.current) {
        window.cancelAnimationFrame(transitionFrameRef.current);
      }
    };
  }, []);

  const goTo = useCallback(
    (nextIndex: number) => {
      const normalizedIndex = (nextIndex + slides.length) % slides.length;

      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }
      if (transitionFrameRef.current) {
        window.cancelAnimationFrame(transitionFrameRef.current);
      }

      if (normalizedIndex > 0) {
        setRenderedSlideIndices((current) =>
          current.includes(normalizedIndex) ? current : [...current, normalizedIndex]
        );
      }

      transitionFrameRef.current = window.requestAnimationFrame(() => {
        setIndex(normalizedIndex);

        cleanupTimerRef.current = window.setTimeout(() => {
          setRenderedSlideIndices(normalizedIndex > 0 ? [normalizedIndex] : []);
          cleanupTimerRef.current = null;
        }, SLIDE_FADE_MS);

        transitionFrameRef.current = null;
      });
    },
    [slides.length]
  );

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  useEffect(() => {
    if (!isEnhanced || reducedMotion || isPaused) return;

    const timer = window.setInterval(() => {
      goTo(indexRef.current + 1);
    }, 5600);

    return () => window.clearInterval(timer);
  }, [goTo, isEnhanced, isPaused, reducedMotion]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {renderedSlideIndices.map((slideIndex) => {
        const slide = slides[slideIndex];
        const active = slideIndex === index;

        return (
          <figure
            key={slide.id}
            className={[
              "absolute inset-0 w-full transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              active ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
            ].join(" ")}
            aria-hidden={!active}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
          >
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              fill
              quality={78}
              sizes="100vw"
              className="scale-100 object-cover object-center transition-transform duration-[7000ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,11,8,0.68)_0%,rgba(18,11,8,0.38)_38%,rgba(18,11,8,0.16)_62%,rgba(18,11,8,0.46)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,164,97,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(98,128,72,0.14),transparent_24%)]" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/40 to-transparent" />

            <figcaption className="absolute inset-0">
              <div className="mx-auto flex h-full max-w-6xl items-center justify-center px-6 py-14 text-center sm:px-10">
                <div
                  className={[
                    "w-full max-w-4xl text-white transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">
                    <span>Frantoio Del Pasqua</span>
                    <span className="h-px w-10 bg-[#c0a36b]/60" aria-hidden="true" />
                    <span>{String(slideIndex + 1).padStart(2, "0")}</span>
                  </div>

                  <h2 className="mx-auto mt-5 max-w-[220px] font-serif text-4xl leading-[0.95] tracking-[0.02em] text-white xs:max-w-[280px] sm:max-w-[12ch] sm:text-5xl sm:leading-[0.9] lg:text-6xl xl:text-7xl">
                    {slide.title}
                  </h2>

                  <p className="mx-auto mt-5 max-w-[260px] text-sm leading-6 text-white/85 xs:max-w-[320px] sm:max-w-[46rem] sm:text-base sm:leading-8 lg:text-lg">
                    {slide.excerpt}
                  </p>

                  <div className="mt-8 flex items-center justify-center">
                    <Link
                      href={slide.href}
                      className="inline-flex items-center gap-2 rounded-[5px] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#120f0d] transition-all duration-300 hover:scale-[1.02] hover:bg-neutral-100 hover:text-black hover:shadow-[0_12px_24px_rgba(255,255,255,0.12)] active:scale-[0.98]"
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
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className="pointer-events-auto absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full border-white/15 bg-black/20 text-white backdrop-blur-sm hover:bg-black/34 sm:left-6 lg:left-8"
        aria-label={labels.prev}
      >
        <ArrowLeft className="size-4" />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={next}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className="pointer-events-auto absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full border-white/15 bg-black/20 text-white backdrop-blur-sm hover:bg-black/34 sm:right-6 lg:right-8"
        aria-label={labels.next}
      >
        <ArrowRight className="size-4" />
      </Button>
    </div>
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
