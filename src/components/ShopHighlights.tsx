"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
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
  imageSrc: string;
  imageAlt: string;
};

const FEATURED_SLUGS: string[] = ["fruttato-medio", "fruttato-intenso", "evo", "tartufo"];





export default function ShopHighlights() {
  const t = useTranslations("HomePage.ShopHighlights");
  const tp = useTranslations("Products");
  const locale = useLocale();

  const products: HighlightProduct[] = useMemo(() => {
    const all = (productsData as unknown as DbProduct[]) ?? [];
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

    return picked.slice(0, 4).map((p) => {
      const minPriceCents = Math.min(...(p.variants?.map((v) => v.priceCents) ?? [0]));
      const hasMany = (p.variants?.length ?? 0) > 1;
      const fmt = new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US", {
        style: "currency",
        currency: "EUR",
      }).format(minPriceCents / 100);

      return {
        id: p.id,
        title: tp(`${p.id}.title`) || p.title,
        subtitle: tp(`${p.id}.subtitle`) || p.subtitle,
        price: `${hasMany ? t("from") : ""}${fmt}`,
        href: `/shop/${encodeURIComponent(p.slug)}`,
        badge: tp(`${p.id}.badge`) || p.badge,
        imageSrc: p.imageSrc,
        imageAlt: p.imageAlt,
      };
    });
  }, [t, tp, locale]);



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
    queueMicrotask(() => updateActiveFromViewport());
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
    <section className="bg-[#fcfbf4]">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10 lg:pt-28 lg:pb-16">
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
                        <ProductCardMobile product={p} />
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
  const t = useTranslations("HomePage.ShopHighlights");
  return (
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
      <div>
        <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
          <span className="h-px w-6 bg-[#8B7355]" />
          {t("label")}
        </div>
        <h2 className="mt-4 font-serif text-3xl font-light tracking-tight text-[#1C1917] md:text-4xl lg:text-5xl">
          {t("title_part1")}<span className="italic text-[#3D5A3D]">{t("title_italic")}</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#57534E]">
          {t("subtitle")}
        </p>
      </div>
      <Link
        href="/shop"
        className="hidden md:inline-flex items-center gap-2 rounded-full bg-[#1C1917] px-6 py-3 text-xs font-medium tracking-[0.2em] text-white hover:bg-[#3D5A3D] transition-colors"
      >
        {t("cta")} <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </Link>
    </div>
  );
}

// Card compatta per MOBILE
function ProductCardMobile({ product }: { product: HighlightProduct }) {
  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white shadow-sm">
      {/* Image container - PIÙ COMPATTA */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5F5F4]">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          sizes="240px"
          className="object-cover"
          priority
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full bg-[#B8860B] px-2 py-1 text-[8px] font-medium tracking-wider text-white uppercase">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Content - COMPATTO */}
      <div className="flex flex-col p-3">
        {/* Subtitle */}
        <div className="text-[8px] font-medium tracking-[0.15em] text-[#8B7355] uppercase">
          {product.subtitle || "Olio EVO"}
        </div>

        {/* Title - più piccolo */}
        <h3 className="mt-1 font-serif text-sm font-light leading-tight tracking-tight text-[#1C1917] line-clamp-2">
          {product.title}
        </h3>

        {/* Price row */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-base font-light text-[#1C1917]">
              {product.price}
            </span>
            <span className="text-[9px] text-[#8B7355]">+IVA</span>
          </div>

          {/* Arrow icon */}
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E7E5E4] text-[#57534E]">
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </article>
  );
}

// Card per DESKTOP
function ProductCardDesktop({ product }: { product: HighlightProduct }) {
  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#3D5A3D]/20 hover:shadow-xl hover:shadow-[#3D5A3D]/5">
      {/* Image container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F4]">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          sizes="25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B8860B] px-3 py-1.5 text-[10px] font-medium tracking-wider text-white uppercase shadow-lg">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick add */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-xs font-medium tracking-wider text-[#1C1917] shadow-lg transition hover:bg-[#3D5A3D] hover:text-white"
          >
            <IconPlus className="h-4 w-4" />
            {useTranslations("HomePage.ShopHighlights")("add")}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Subtitle */}
        <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
          {product.subtitle || "Olio EVO"}
        </div>

        {/* Title */}
        <h3 className="mt-2 font-serif text-lg font-light leading-tight tracking-tight text-[#1C1917] line-clamp-2 transition-colors group-hover:text-[#3D5A3D]">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-light text-[#1C1917]">
              {product.price}
            </span>
            <span className="text-xs text-[#8B7355]">+ IVA</span>
          </div>

          {/* Decorative line */}
          <div className="mt-3 h-px w-10 bg-[#E7E5E4] transition-all duration-300 group-hover:w-20 group-hover:bg-[#3D5A3D]" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#3D5A3D] to-[#B8860B] transition-all duration-300 group-hover:w-full" />
    </article>
  );
}

function ShopHighlightsDesktop({ products }: { products: HighlightProduct[] }) {
  const cardsRef = useRef<Array<HTMLElement | null>>([]);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const played = new WeakSet<Element>();

    const cardsIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const el = entry.target as HTMLElement;
          if (played.has(el)) continue;
          played.add(el);

          const idx = Number(el.getAttribute("data-index") ?? "0");
          const delay = idx * 100;

          el.animate(
            [
              { opacity: 0, transform: "translate3d(0,30px,0)", filter: "blur(8px)" },
              { opacity: 1, transform: "translate3d(0,0,0)", filter: "blur(0px)" },
            ],
            { duration: 800, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
          );

          cardsIO.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    cardsRef.current.forEach((el, idx) => {
      if (!el) return;
      el.style.opacity = "0";
      el.setAttribute("data-index", String(idx));
      cardsIO.observe(el);
    });

    return () => {
      cardsIO.disconnect();
    };
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
      {products.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => { cardsRef.current[i] = el; }}
          className="flex h-full"
        >
          <Link href={p.href} className="flex h-full w-full">
            <ProductCardDesktop product={p} />
          </Link>
        </div>
      ))}
    </div>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}