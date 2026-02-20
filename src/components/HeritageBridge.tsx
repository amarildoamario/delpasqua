"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

export default function HeritageBridge() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardARef = useRef<HTMLDivElement | null>(null);
  const cardBRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const els = [wrapRef.current, cardARef.current, cardBRef.current].filter(Boolean) as HTMLElement[];

    els.forEach((el, i) => {
      el.getAnimations?.().forEach((a) => a.cancel());
      el.style.opacity = "0";
      el.style.filter = "blur(10px)";
      el.style.transform = `translate3d(${i % 2 ? "12px" : "-12px"}, 18px, 0) rotate(${i % 2 ? "-0.7deg" : "0.7deg"})`;
      el.style.willChange = "transform, opacity, filter";
    });

    const played = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (played.has(el)) continue;
          played.add(el);

          const idx = Number(el.getAttribute("data-idx") ?? "0");
          const delay = Math.min(idx * 120, 360);

          setTimeout(() => {
            el.animate(
              [
                {
                  opacity: 0,
                  filter: "blur(10px)",
                  transform: `translate3d(${idx % 2 ? "12px" : "-12px"}, 18px, 0) rotate(${idx % 2 ? "-0.7deg" : "0.7deg"})`,
                },
                { opacity: 1, filter: "blur(0px)", transform: "translate3d(0,0,0) rotate(0deg)" },
              ],
              {
                duration: 900,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "forwards",
              }
            );
          }, delay);

          io.unobserve(el);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" }
    );

    els.forEach((el, i) => {
      el.setAttribute("data-idx", String(i));
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* TOP: headline + CTA */}
        <div ref={wrapRef} className="relative">
          <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
            TRADIZIONE & CONTROLLO
          </div>

          <div className="mt-2 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <h3 className="font-serif text-2xl tracking-[0.08em] text-zinc-900 dark:text-white md:text-3xl">
                Un ponte visivo tra il gesto antico
                <br className="hidden md:block" /> e la precisione moderna.
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                Immagini che raccontano artigianalità, materia prima e controllo: il mix che fa percepire qualità
                prima ancora dell’assaggio.
              </p>
            </div>

            <div className="md:col-span-5 md:flex md:justify-end">
              <Link
                href="/storia"
                className="inline-flex items-center gap-2 border border-black/10 bg-white px-5 py-2.5 text-sm tracking-[0.10em] text-zinc-900 hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:text-white dark:hover:bg-white/5"
              >
                Storia & territorio <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="mt-7 h-[2px] w-20 bg-emerald-600/45 dark:bg-emerald-400/35" />
        </div>

        {/* TWO VISUAL CARDS */}
        <div className="mt-10 grid gap-4 md:grid-cols-12 md:gap-6">
          {/* left = tradizione */}
          <div
            ref={cardARef}
            className="relative overflow-hidden border border-black/10 bg-white shadow-sm dark:border-white/12 dark:bg-zinc-950 md:col-span-6"
          >
            <div className="absolute inset-0">
              <Image
                src="/home/home_contatti.jpg"
                alt="Territorio e tradizione"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/0" />
            </div>

            <div className="relative p-5 md:p-6">
              <div className="text-xs tracking-[0.22em] text-white/80">TRADIZIONE</div>
              <div className="mt-2 font-serif text-xl tracking-[0.08em] text-white md:text-2xl">
                Gesto umano, tempi giusti
              </div>
              <div className="mt-2 text-sm leading-relaxed text-white/85">
                Raccolta, attenzione, cura: la qualità nasce prima del frantoio.
              </div>

              <div className="mt-5 inline-flex items-center gap-2 border border-white/20 bg-black/20 px-3 py-1.5 text-xs tracking-[0.18em] text-white/90 backdrop-blur">
                <Dot /> Filiera corta
                <span className="opacity-60">•</span>
                <Dot /> Piccola scala
              </div>
            </div>
          </div>

          {/* right = controllo */}
          <div
            ref={cardBRef}
            className="relative overflow-hidden border border-black/10 bg-white shadow-sm dark:border-white/12 dark:bg-zinc-950 md:col-span-6"
          >
            <div className="absolute inset-0">
              <Image
                src="/home/home_produzione.png"
                alt="Produzione e controllo"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-black/0" />
            </div>

            <div className="relative p-5 md:p-6">
              <div className="text-xs tracking-[0.22em] text-white/80">CONTROLLO</div>
              <div className="mt-2 font-serif text-xl tracking-[0.08em] text-white md:text-2xl">
                Precisione senza industriale
              </div>
              <div className="mt-2 text-sm leading-relaxed text-white/85">
                Temperatura, tempi e conservazione: modernità al servizio del gusto.
              </div>

              <div className="mt-5 inline-flex items-center gap-2 border border-emerald-300/25 bg-emerald-500/10 px-3 py-1.5 text-xs tracking-[0.18em] text-white/90 backdrop-blur">
                <Dot className="bg-emerald-200" /> Freschezza preservata
                <span className="opacity-60">•</span>
                <Dot className="bg-emerald-200" /> Profilo pulito
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 h-px w-16 bg-zinc-300/70 dark:bg-white/20" />
      </div>
    </section>
  );
}

function Dot({ className }: { className?: string }) {
  return <span className={`h-1.5 w-1.5 rounded-full bg-white/70 ${className ?? ""}`} />;
}
