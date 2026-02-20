"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./ShopHighlights.module.css";
import productsData from "@/db/products.json";
import type { Product as DbProduct } from "@/lib/shopTypes";
import { ArrowRight } from "lucide-react";

type HighlightProduct = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  href: string;
  badge?: string;
  labelTopRight?: string;
  imageSrc: string;
  imageAlt: string;
};

const FEATURED_SLUGS: string[] = ["fruttato-medio", "fruttato-intenso", "evo", "tartufo"];

function formatEur(cents: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function buildHighlight(p: DbProduct): HighlightProduct {
  const minPriceCents = Math.min(...(p.variants?.map((v) => v.priceCents) ?? [0]));
  const hasMany = (p.variants?.length ?? 0) > 1;

  return {
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    price: `${hasMany ? "Da " : ""}${formatEur(minPriceCents)} + IVA`,
    href: `/shop/${encodeURIComponent(p.slug)}`,
    badge: p.badge,
    labelTopRight: p.labelTopRight,
    imageSrc: p.imageSrc,
    imageAlt: p.imageAlt,
  };
}

export default function ShopHighlights() {
  const products: HighlightProduct[] = useMemo(() => {
    const all = (productsData as DbProduct[]) ?? [];
    const bySlug = new Map(all.map((p) => [p.slug, p] as const));

    const picked: DbProduct[] = FEATURED_SLUGS.map((s) => bySlug.get(s)).filter(
      (x): x is DbProduct => Boolean(x)
    );

    if (picked.length < 4) {
      const already = new Set(picked.map((p) => p.slug));
      for (const p of all) {
        if (picked.length >= 4) break;
        if (already.has(p.slug)) continue;
        picked.push(p);
        already.add(p.slug);
      }
    }

    return picked.slice(0, 4).map(buildHighlight);
  }, []);

  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const dragRef = useRef({ isDown: false, moved: false, startX: 0, startY: 0 });

  const updateActiveFromViewport = useCallback(() => {
    const scroller = scrollerRef.current;

    const viewportCenterX = scroller
      ? scroller.getBoundingClientRect().left + scroller.clientWidth / 2
      : window.innerWidth / 2;

    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < itemRefs.current.length; i += 1) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const center = r.left + r.width / 2;
      const dist = Math.abs(center - viewportCenterX);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    setActiveIndex(bestIdx);
  }, []);

  const onMobileScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateActiveFromViewport);
  }, [updateActiveFromViewport]);

  const scrollToIndex = useCallback((idx: number) => {
    const el = itemRefs.current[idx];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  useEffect(() => {
    updateActiveFromViewport();
    const onResize = () => updateActiveFromViewport();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateActiveFromViewport]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current.isDown = true;
    dragRef.current.moved = false;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;
    const dx = Math.abs(e.clientX - dragRef.current.startX);
    const dy = Math.abs(e.clientY - dragRef.current.startY);
    if (dx > 10 && dx > dy) dragRef.current.moved = true;
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current.isDown = false;
  }, []);

  const onLinkClickCapture = useCallback((e: React.MouseEvent) => {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  }, []);

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-14 md:pt-24 md:pb-18">
        <Header />

        {/* MOBILE */}
        <div className="md:hidden mt-10 pb-10">
          <div className={styles.mobileFullBleed}>
            <div
              ref={scrollerRef}
              className={styles.mobileScroller}
              onScroll={onMobileScroll}
              aria-label="Prodotti in evidenza"
            >
              <div className={styles.mobileTrack}>
                {products.map((p, idx) => (
                  <div
                    key={p.id}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    className={styles.mobileItem}
                  >
                    <div
                      className={styles.mobileCardWrap}
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerUp}
                    >
                      <Link
                        href={p.href}
                        aria-label={p.title}
                        className={styles.mobileCardLink}
                        onClickCapture={onLinkClickCapture}
                        draggable={false}
                      >
                        <article className={styles.mobileCard}>
                          <div className={styles.mobileImageSection}>
                            {p.badge && (
                              <div className={styles.mobileBadge}>
                                <span>{p.badge}</span>
                              </div>
                            )}
                            {p.labelTopRight && (
                              <div className={styles.mobileLabelTopRight}>{p.labelTopRight}</div>
                            )}
                            <Image
                              src={p.imageSrc}
                              alt={p.imageAlt}
                              fill
                              sizes="340px"
                              className="object-cover"
                              priority
                            />
                          </div>

                          <div className={styles.mobileContent}>
                            <div className={styles.mobileRowSubtitle}>
                              <p className={styles.mobileSubtitle}>{p.subtitle}</p>
                            </div>
                            <div className={styles.mobileRowTitle}>
                              <h3 className={styles.mobileTitle}>{p.title}</h3>
                            </div>
                            <div className={styles.mobilePriceRow}>
                              <span className={styles.mobilePrice}>{p.price}</span>
                            </div>
                            <div className={styles.mobileCtaRow}>
                              <div className={styles.mobileCta}>
                                <span>Scopri</span>
                                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </div>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.mobileDots}>
              {products.map((p, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={isActive ? styles.mobileDotActive : styles.mobileDotBtn}
                    onClick={() => scrollToIndex(idx)}
                    aria-label={`Vai al prodotto ${idx + 1} di ${products.length}`}
                    aria-current={isActive ? "true" : "false"}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block mt-12">
          <ShopHighlightsDesktop products={products} />
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
      <div>
        <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">SHOP</div>
        <h2 className="mt-2 font-serif text-3xl tracking-[0.06em] text-zinc-900 dark:text-white md:text-4xl">
          I più acquistati
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Dal nostro catalogo i prodotti best sellers.
        </p>
      </div>
      <Link
        href="/shop"
        className="hidden md:inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm tracking-[0.10em] text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
      >
        Vai allo shop <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </Link>
    </div>
  );
}

function ShopHighlightsDesktop({ products }: { products: HighlightProduct[] }) {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const titleEl = titleRef.current;

    if (titleEl) {
      titleEl.getAnimations?.().forEach((a) => a.cancel());
      titleEl.style.opacity = "0";
      titleEl.style.transform = "translate3d(-22px,0,0)";
      titleEl.style.filter = "blur(8px)";
      titleEl.style.willChange = "transform, opacity, filter";
    }

    cardsRef.current.forEach((el) => {
      if (!el) return;
      el.getAnimations?.().forEach((a) => a.cancel());
      el.style.opacity = "0";
      el.style.transform = "translate3d(0, 26px, 0) scale(0.99)";
      el.style.filter = "blur(8px)";
      el.style.willChange = "transform, opacity, filter";
    });

    const played = new WeakSet<Element>();
    let titleIO: IntersectionObserver | null = null;

    if (titleEl) {
      titleIO = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (played.has(titleEl)) return;
          played.add(titleEl);

          titleEl.animate(
            [
              { opacity: 0, transform: "translate3d(-22px,0,0)", filter: "blur(8px)" },
              { opacity: 1, transform: "translate3d(0,0,0)", filter: "blur(0px)" },
            ],
            { duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
          );

          titleIO?.disconnect();
        },
        { threshold: 0.35, rootMargin: "0px 0px -12% 0px" }
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

          const idx = Number(el.getAttribute("data-index") ?? "0");
          const delay = idx * 90;

          el.animate(
            [
              { opacity: 0, transform: "translate3d(0,26px,0) scale(0.99)", filter: "blur(9px)" },
              { opacity: 1, transform: "translate3d(0,0,0) scale(1)", filter: "blur(0px)" },
            ],
            { duration: 900, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
          );

          cardsIO.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    cardsRef.current.forEach((el, idx) => {
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
    <div className="grid grid-cols-4 gap-5">
      {products.map((p, i) => (
        <article
          key={p.id}
          ref={(el) => {
            cardsRef.current[i] = el;
          }}
          className="group overflow-hidden rounded-[12px] border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-zinc-950"
        >
          <Link href={p.href} aria-label={p.title} className="block">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={p.imageSrc}
                alt={p.imageAlt}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              {p.badge ? (
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] tracking-[0.16em] text-zinc-800 backdrop-blur dark:bg-black/60 dark:text-white">
                  {p.badge}
                </div>
              ) : null}
            </div>

            <div className="px-4 pb-4 pt-4">
              <div className="font-serif text-base tracking-[0.06em] text-zinc-900 dark:text-white">
                {p.title}
              </div>
              <div className="mt-1 text-xs tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                {p.subtitle}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm tracking-[0.10em] text-zinc-900 dark:text-white">{p.price}</div>
                <span className="inline-flex items-center gap-2 text-sm tracking-[0.10em] text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-white transition-colors">
                  Vedi <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </span>
              </div>
              <div className="mt-3 h-px w-10 bg-zinc-200 transition-all duration-300 group-hover:w-20 dark:bg-white/15" />
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}