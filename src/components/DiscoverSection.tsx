"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";

type Card = {
  title: string;
  subtitle: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export default function DiscoverSection() {
  const t = useTranslations("HomePage.Discover");
  const cards: Card[] = useMemo(
    () => [
      {
        title: t("cards.produzione.title"),
        subtitle: t("cards.produzione.subtitle"),
        href: "/produzione",
        imageSrc: "/home/home_produzione.png",
        imageAlt: "Olive appena raccolte in cassetta",
      },
      {
        title: t("cards.olio.title"),
        subtitle: t("cards.olio.subtitle"),
        href: "/il-nostro-olio",
        imageSrc: "/home/home_olio.png",
        imageAlt: "Bottiglia di olio extravergine in mano",
      },
      {
        title: t("cards.contatti.title"),
        subtitle: t("cards.contatti.subtitle"),
        href: "/contatti",
        imageSrc: "/home/home_contatti.jpg",
        imageAlt: "Ramo di ulivo con olive",
      },
    ],
    [t]
  );

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      const t = titleRef.current;
      if (t) {
        t.classList.remove("reveal-title");
        t.style.opacity = "1";
        t.style.transform = "none";
        t.style.filter = "none";
      }
      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.classList.remove("reveal-card");
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      });
      return;
    }

    const played = new WeakSet<Element>();

    const titleEl = titleRef.current;
    let titleIO: IntersectionObserver | null = null;

    if (titleEl) {
      titleEl.getAnimations?.().forEach((a) => a.cancel());

      titleIO = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (played.has(titleEl)) return;
          played.add(titleEl);

          titleEl.animate(
            [
              {
                opacity: 0,
                transform: "translate3d(0, 40px, 0)",
                filter: "blur(12px)",
              },
              {
                opacity: 1,
                transform: "translate3d(0, 0, 0)",
                filter: "blur(0px)",
              },
            ],
            {
              duration: 1000,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "forwards",
            }
          );

          titleIO?.disconnect();
        },
        { threshold: 0.35, rootMargin: "0px 0px -10% 0px" }
      );

      titleIO.observe(titleEl);
    }

    const cardsIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;

          if (played.has(el)) continue;
          played.add(el);

          el.getAnimations?.().forEach((a) => a.cancel());

          const idx = Number(el.getAttribute("data-index") ?? "0");
          const delay = idx * 150;

          el.animate(
            [
              {
                opacity: 0,
                transform: "translate3d(0, 60px, 0) scale(0.96)",
                filter: "blur(8px)",
              },
              {
                opacity: 1,
                transform: "translate3d(0, 0, 0) scale(1)",
                filter: "blur(0px)",
              },
            ],
            {
              duration: 1200,
              delay,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "forwards",
            }
          );

          cardsIO.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      el.setAttribute("data-index", String(idx));
      cardsIO.observe(el);
    });

    return () => {
      titleIO?.disconnect();
      cardsIO.disconnect();
    };
  }, []);

  return (
    <section className="bg-[#F5F3EF]">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <header className="mb-14 text-center md:mb-20">
          <span className="mb-3 block text-xs font-medium tracking-[0.3em] text-[#6B7B4C] uppercase">
            {t("label")}
          </span>
          <h2
            ref={titleRef}
            className="reveal-title font-serif text-3xl leading-tight tracking-[0.02em] text-[#2C2C2C] md:text-4xl lg:text-5xl"
          >
            {t("title").includes("Del Pasqua") ? (
              <>
                {t("title").split("Del Pasqua")[0]}
                <span className="italic text-[#6B7B4C]">Del Pasqua</span>
              </>
            ) : (
              t("title")
            )}
          </h2>
        </header>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {cards.map((c, i) => (
            <Link
              key={c.title}
              href={c.href}
              aria-label={c.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="reveal-card group block"
            >
              {/* Card con bordi super tondi e ombra soft */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-[#E8E4DC] shadow-sm transition-shadow duration-500 group-hover:shadow-2xl">
                <Image
                  src={c.imageSrc}
                  alt={c.imageAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                {/* Contenuto in basso */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <span className="mb-1 block text-[10px] font-semibold tracking-[0.25em] text-[#B8C4A7] uppercase">
                      {c.subtitle}
                    </span>
                    <h3 className="font-serif text-xl tracking-[0.05em] text-white md:text-2xl">
                      {c.title}
                    </h3>
                  </div>

                  {/* Linea e freccia animata */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-[1px] w-8 bg-white/60 transition-all duration-500 group-hover:w-16" />
                    <ArrowUpRight
                      className="h-3 w-3 -translate-x-2 opacity-0 text-white transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* Bordo bianco interno che appare */}
                <div className="absolute inset-3 rounded-2xl border border-white/0 transition-all duration-500 group-hover:border-white/40" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}