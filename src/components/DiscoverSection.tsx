"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

type Card = {
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export default function DiscoverSection() {
  const cards: Card[] = useMemo(
    () => [
      {
        title: "PRODUZIONE",
        href: "/produzione",
        imageSrc: "/home/home_produzione.png",
        imageAlt: "Olive appena raccolte in cassetta",
      },
      {
        title: "IL NOSTRO OLIO",
        href: "/olio",
        imageSrc: "/home/home_olio.png",
        imageAlt: "Bottiglia di olio extravergine in mano",
      },
      {
        title: "CONTATTI",
        href: "/contatti",
        imageSrc: "/home/home_contatti.jpg",
        imageAlt: "Ramo di ulivo con olive",
      },
    ],
    []
  );

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      // Se reduce motion: rendi visibile tutto
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

    // Titolo
    const titleEl = titleRef.current;
    let titleIO: IntersectionObserver | null = null;

    if (titleEl) {
      // in caso di fast refresh, cancella animazioni precedenti
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
                transform: "translate3d(-26px, 0, 0)",
                filter: "blur(8px)",
              },
              {
                opacity: 1,
                transform: "translate3d(6px, 0, 0)",
                filter: "blur(2px)",
                offset: 0.72,
              },
              {
                opacity: 1,
                transform: "translate3d(0, 0, 0)",
                filter: "blur(0px)",
              },
            ],
            {
              duration: 1200,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "forwards",
            }
          );

          titleIO?.disconnect();
        },
        { threshold: 0.35, rootMargin: "0px 0px -12% 0px" }
      );

      titleIO.observe(titleEl);
    }

    // Cards
    const cardsIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;

          if (played.has(el)) continue;
          played.add(el);

          el.getAnimations?.().forEach((a) => a.cancel());

          const idx = Number(el.getAttribute("data-index") ?? "0");
          const delay = idx * 110;

          el.animate(
            [
              {
                opacity: 0,
                transform: "translate3d(0, 34px, 0) scale(0.985)",
                filter: "blur(9px)",
              },
              {
                opacity: 1,
                transform: "translate3d(0, -6px, 0) scale(1.01)",
                filter: "blur(2px)",
                offset: 0.78,
              },
              {
                opacity: 1,
                transform: "translate3d(0, 0, 0) scale(1)",
                filter: "blur(0px)",
              },
            ],
            {
              duration: 1400,
              delay,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "forwards",
            }
          );

          cardsIO.unobserve(el);
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -14% 0px" }
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
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <header className="text-center">
          <h2
            ref={titleRef}
            className="reveal-title font-serif text-3xl tracking-[0.08em] text-zinc-700 dark:text-zinc-200 md:text-4xl"
          >
            SCOPRI IL FRANTOIO DEL PASQUA
          </h2>
        </header>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
          {cards.map((c, i) => (
            <Link
              key={c.title}
              href={c.href}
              aria-label={c.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="reveal-card group block transform-gpu"
            >
              <div className="relative aspect-[4/3] md:aspect-[3/4] w-full overflow-hidden rounded-[6px] bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src={c.imageSrc}
                  alt={c.imageAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 rounded-[6px] bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </div>

              <div className="mt-5 text-center">
                <span className="font-serif text-2xl tracking-[0.10em] text-zinc-700 transition-colors group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-white">
                  {c.title}
                </span>
              </div>

              <div className="mx-auto mt-3 h-px w-14 bg-zinc-300/70 transition-all duration-300 group-hover:w-24 dark:bg-white/20" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
