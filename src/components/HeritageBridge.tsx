// HeritageBridge.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, MapPin, Thermometer } from "lucide-react";
import styles from "./HeritageBridge.module.css";

export default function HeritageBridge() {
  const t = useTranslations("HomePage.HeritageBridge");
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cardARef = useRef<HTMLDivElement | null>(null);
  const cardBRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const els = [wrapRef.current, cardARef.current, cardBRef.current].filter(Boolean) as HTMLElement[];
    els.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = `translate3d(${i % 2 ? "12px" : "-12px"}, 16px, 0)`;
    });

    const played = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || played.has(e.target)) continue;
          played.add(e.target);
          const el = e.target as HTMLElement;
          const idx = Number(el.getAttribute("data-idx") ?? "0");
          setTimeout(() => {
            el.animate(
              [
                { opacity: 0, transform: `translate3d(${idx % 2 ? "12px" : "-12px"}, 16px, 0)` },
                { opacity: 1, transform: "translate3d(0,0,0)" },
              ],
              { duration: 800, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
            );
          }, idx * 100);
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el, i) => {
      el.setAttribute("data-idx", String(i));
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 md:px-6 md:pt-16 md:pb-32">
        {/* Header */}
        <div ref={wrapRef} className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-[10px] font-medium tracking-widest text-emerald-700 md:text-xs">
            <span className="h-px w-4 bg-emerald-500" />
            {t("label")}
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="font-serif text-xl leading-tight text-stone-900 md:text-3xl">
                {t("title_part1")}
                <br className="hidden md:block" />
                <span className="text-emerald-700">{t("title_italic")}</span>
              </h3>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-stone-600 md:text-sm">
                {t("subtitle")}
              </p>
            </div>
            <Link href="/storia" className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-emerald-700 md:justify-start">
              {t("cta")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {/* Tradizione */}
          <div ref={cardARef} className="group relative h-[280px] overflow-hidden rounded-[2rem] md:h-[420px]">
            <Image
              src="/home/home_contatti.jpg"
              alt={t("tradition.title")}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-800/50 to-stone-700/20" />

            <div className="relative flex h-full flex-col justify-end p-5 md:p-8">
              <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-medium tracking-widest text-white backdrop-blur-md md:left-8 md:top-8 md:gap-2 md:text-xs">
                <MapPin className="h-3 w-3 text-emerald-400 md:h-3.5 md:w-3.5" />
                {t("tradition.label")}
              </div>

              <h4 className="font-serif text-lg text-white md:text-3xl">{t("tradition.title")}</h4>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-stone-100/80 md:mt-2 md:text-sm">
                {t("tradition.text")}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                <span className="rounded-full bg-emerald-500/25 px-3 py-1 text-[10px] text-emerald-100 ring-1 ring-emerald-400/30 backdrop-blur-sm md:text-xs">
                  {t("tradition.tag1")}
                </span>
                <span className="rounded-full bg-emerald-500/25 px-3 py-1 text-[10px] text-emerald-100 ring-1 ring-emerald-400/30 backdrop-blur-sm md:text-xs">
                  {t("tradition.tag2")}
                </span>
              </div>
            </div>
          </div>

          {/* Controllo */}
          <div ref={cardBRef} className="group relative h-[280px] overflow-hidden rounded-[2rem] md:h-[420px]">
            <Image
              src="/home/home_produzione.png"
              alt={t("control.title")}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-800/50 to-stone-700/20" />

            <div className="relative flex h-full flex-col justify-end p-5 md:p-8">
              <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1.5 text-[10px] font-medium tracking-widest text-emerald-100 ring-1 ring-emerald-400/30 backdrop-blur-md md:left-8 md:top-8 md:gap-2 md:text-xs">
                <Thermometer className="h-3 w-3 text-emerald-300 md:h-3.5 md:w-3.5" />
                {t("control.label")}
              </div>

              <h4 className="font-serif text-lg text-white md:text-3xl">{t("control.title")}</h4>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-stone-100/80 md:mt-2 md:text-sm">
                {t("control.text")}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 md:mt-4">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/90 ring-1 ring-white/20 backdrop-blur-sm md:text-xs">
                  {t("control.tag1")}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/90 ring-1 ring-white/20 backdrop-blur-sm md:text-xs">
                  {t("control.tag2")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
