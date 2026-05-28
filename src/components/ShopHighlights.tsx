"use client";

import { Link } from "@/i18n/routing";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import styles from "./ShopHighlights.module.css";
import productsData from "@/db/products.json";
import type { Product as DbProduct } from "@/lib/shopTypes";
import { ArrowRight } from "lucide-react";
import ProductCard, { type ProductCardProduct } from "@/components/ProductCard";
import { getLocalizedProductSlug } from "@/lib/productSlugs";

type HighlightProduct = ProductCardProduct;

const FEATURED_SLUGS: string[] = ["fruttato-medio", "fruttato-intenso", "evo", "tartufo"];

const SHOP_HIGHLIGHTS_COPY = {
  it: {
    from: "A partire da",
    price: "Prezzo",
    featuredProducts: "Prodotti in evidenza",
    goToProduct: (index: number, total: number) => `Vai al prodotto ${index} di ${total}`,
  },
  en: {
    from: "From",
    price: "Price",
    featuredProducts: "Featured products",
    goToProduct: (index: number, total: number) => `Go to product ${index} of ${total}`,
  },
  de: {
    from: "Ab",
    price: "Preis",
    featuredProducts: "Vorgestellte Produkte",
    goToProduct: (index: number, total: number) => `Gehe zu Produkt ${index} von ${total}`,
  },
  nl: {
    from: "Vanaf",
    price: "Prijs",
    featuredProducts: "Aanbevolen producten",
    goToProduct: (index: number, total: number) => `Ga naar product ${index} van ${total}`,
  },
  da: {
    from: "Fra",
    price: "Pris",
    featuredProducts: "Udvalgte produkter",
    goToProduct: (index: number, total: number) => `Gå til produkt ${index} af ${total}`,
  },
  no: {
    from: "Fra",
    price: "Pris",
    featuredProducts: "Utvalgte produkter",
    goToProduct: (index: number, total: number) => `Gå til produkt ${index} av ${total}`,
  },
} as const;

export default function ShopHighlights() {
  const tp = useTranslations("Products");
  const locale = useLocale();
  const copy = SHOP_HIGHLIGHTS_COPY[locale as keyof typeof SHOP_HIGHLIGHTS_COPY] ?? SHOP_HIGHLIGHTS_COPY.en;

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

      // Build variant images list with deduplication
      const seenSrcs = new Set<string>();
      const variantImages = (p.variants ?? [])
        .filter((v) => typeof v.id === "string" && !!v.imageSrc)
        .filter((v) => {
          if (seenSrcs.has(v.imageSrc!)) return false;
          seenSrcs.add(v.imageSrc!);
          return true;
        })
        .map((v) => ({
          variantId: v.id!,
          imageSrc: v.imageSrc!,
          imageAlt: v.imageAlt ?? p.imageAlt ?? "",
        }));

      return {
        id: p.id,
        slug: getLocalizedProductSlug(p, locale),
        title: tp(`${p.id}.title`) || p.title,
        subtitle: tp(`${p.id}.subtitle`) || p.subtitle || "",
        priceLabel: fmt,
        priceCaption: hasMany ? copy.from : copy.price,
        priceCents: minPriceCents,
        defaultVariantId: p.variants?.[0]?.id,
        badge: tp(`${p.id}.badge`) || p.badge,
        imageSrc: p.imageSrc,
        imageAlt: p.imageAlt,
        variantsCount: p.variants?.length ?? 1,
        variantImages: variantImages.length > 1 ? variantImages : undefined,
      };
    });
  }, [copy.from, copy.price, tp, locale]);

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
    <section className="bg-[#fdfaf7]">
      <div className="mx-auto max-w-[1440px] px-8 py-20 lg:px-12 lg:py-28">
        <Header />

        {/* MOBILE */}
        <div className="md:hidden mt-10 pb-10">
          <div className={styles.mobileFullBleed}>
            <div
              ref={scrollerRef}
              className={styles.mobileScroller}
              onScroll={onMobileScroll}
              aria-label={copy.featuredProducts}
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
                      onClickCapture={onLinkClickCapture}
                    >
                      <ProductCardMobile product={p} />
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
                    aria-label={copy.goToProduct(idx + 1, products.length)}
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
        <h2 className="font-serif text-3xl font-light tracking-tight text-[#1f1a17] md:text-4xl lg:text-5xl">
          {t("title_part1")}<span className="italic text-[#8f6d4c]">{t("title_italic")}</span>
        </h2>
      </div>
      <Link
        href="/shop"
        className="group hidden md:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#8f6d4c] underline underline-offset-[6px] decoration-[1.5px] transition-colors duration-300 hover:text-[#1f1a17] hover:decoration-[#1f1a17]"
      >
        <span>{t("cta")}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.2} />
      </Link>
    </div>
  );
}

function ProductCardMobile({ product }: { product: HighlightProduct }) {
  return <ProductCard product={product} />;
}

function ProductCardDesktop({ product }: { product: HighlightProduct }) {
  return <ProductCard product={product} />;
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
      {products.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => { cardsRef.current[i] = el; }}
          className="flex h-full"
        >
          <ProductCardDesktop product={p} />
        </div>
      ))}
    </div>
  );
}
