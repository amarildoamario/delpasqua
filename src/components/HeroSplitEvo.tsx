// src/components/HeroSplitEvo.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import productsRaw from "@/db/products.json";
import ProductPurchaseBox from "@/app/shop/_components/ProductPurchaseBox.client";

type ProductVariant = {
  id: string;
  label: string;
  priceCents: number;
  sku?: string;
  imageSrc?: string;
  imageAlt?: string;
};

type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  badge?: string;
  imageSrc: string;
  imageAlt: string;
  description?: string;
  variants: ProductVariant[];
};

function getProductsList(): Product[] {
  const raw: any = productsRaw as any;
  if (Array.isArray(raw)) return raw as Product[];
  if (raw?.products && Array.isArray(raw.products)) return raw.products as Product[];
  return [];
}

function Stars({ rating = 4.9, count = 312 }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path
              d="M10 1.6l2.4 5.3 5.8.5-4.4 3.8 1.3 5.6L10 14.7 4.9 16.8l1.3-5.6L1.8 7.4l5.8-.5L10 1.6z"
              className="fill-zinc-900 dark:fill-white"
            />
          </svg>
        ))}
      </div>
      <div className="text-xs tracking-[0.18em] text-zinc-600 dark:text-zinc-300">
        <span className="font-semibold text-zinc-900 dark:text-white">{rating.toFixed(1)}</span>{" "}
        <span className="text-zinc-500 dark:text-zinc-400">({count})</span>
      </div>
    </div>
  );
}

export default function HeroSplitEvo() {
  const evo = useMemo(() => {
    const list = getProductsList();
    return (
      list.find((p) => String(p.slug).toLowerCase() === "evo") ??
      list.find((p) => p.id === "evo") ??
      null
    );
  }, []);

  // ✅ stato variante (così anche l’immagine può reagire)
  const [variantId, setVariantId] = useState<string | undefined>(undefined);

  if (!evo) return null;

  const variants = evo.variants ?? [];
  const effectiveId = variantId ?? variants[0]?.id;

  const selectedVariant =
    variants.find((v) => String(v.id) === String(effectiveId)) ?? variants[0];

  const heroSrc = selectedVariant?.imageSrc || evo.imageSrc;
  const heroAlt = selectedVariant?.imageAlt || evo.imageAlt;

  return (
    <section className="relative bg-white dark:bg-black">
      <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/*
          Mobile:  testo -> immagine -> acquisto
          Desktop: immagine + acquisto (come product page), poi testo sotto
        */}
        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          {/* TEXT (mobile first, desktop bottom full width) */}
          <div className="order-1 lg:order-3 lg:col-span-2 lg:mt-2">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[11px] tracking-[0.20em] text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-zinc-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                OLIO EXTRAVERGINE — EVO
              </div>

              <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-[0.04em] text-zinc-900 dark:text-white md:text-5xl">
                EVO, quello giusto per ogni giorno.
              </h1>

              <p className="mt-5 text-base leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-lg">
                {evo.description ?? "Il classico EVO da tutti i giorni."} Qualità, eleganza e gusto
                pulito: una bottiglia che sta bene in cucina e in tavola.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={`/shop/${encodeURIComponent(evo.slug)}`}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm tracking-[0.10em] text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Compra EVO
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm tracking-[0.10em] text-zinc-900 hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-white dark:hover:bg-zinc-900"
                >
                  Esplora lo shop
                </Link>
              </div>

              <div className="mt-7">
                <Stars rating={4.9} count={312} />
              </div>
            </div>
          </div>

          {/* IMAGE (mobile second, desktop left) */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
              <Image
                key={heroSrc} // ✅ forza update quando cambia src
                src={heroSrc}
                alt={heroAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* PURCHASE BOX (mobile third, desktop right) */}
          <div className="order-3 lg:order-2">
            <ProductPurchaseBox
              productId={evo.id}
              variants={variants}
              selectedVariantId={selectedVariant?.id}
              onVariantChange={(id) => setVariantId(id)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
