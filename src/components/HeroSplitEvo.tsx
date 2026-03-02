// src/components/HeroSplitEvo.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import productsRaw from "@/db/products.json";
import ProductPurchaseBox from "@/app/[locale]/shop/_components/ProductPurchaseBox.client";

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
  const raw = productsRaw as unknown as Product[] | { products: Product[] };
  if (Array.isArray(raw)) return raw;
  if (raw && "products" in raw && Array.isArray(raw.products)) return raw.products;
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
              className="fill-zinc-900"
            />
          </svg>
        ))}
      </div>
      <div className="text-xs tracking-[0.18em] text-zinc-600">
        <span className="font-semibold text-zinc-900">{rating.toFixed(1)}</span>{" "}
        <span className="text-zinc-500">({count})</span>
      </div>
    </div>
  );
}

export default function HeroSplitEvo() {
  const t = useTranslations("HomePage.HeroSplitEvo");
  const tp = useTranslations("Products");

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
    <section className="relative bg-white">
      <div className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          {/* TEXT (mobile first, desktop bottom full width) */}
          <div className="order-1 lg:order-3 lg:col-span-2 lg:mt-2">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[11px] tracking-[0.20em] text-zinc-700 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
                {t("label")}
              </div>

              <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-[0.04em] text-zinc-900 md:text-5xl">
                {t("title")}
              </h1>

              <p className="mt-5 text-base leading-relaxed text-zinc-600 md:text-lg">
                {tp(`${evo.id}.description`) || t("description")}
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={`/shop/${encodeURIComponent(evo.slug)}`}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm tracking-[0.10em] text-white hover:bg-zinc-800"
                >
                  {t("buy_btn")}
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm tracking-[0.10em] text-zinc-900 hover:bg-zinc-50"
                >
                  {t("explore_btn")}
                </Link>
              </div>

              <div className="mt-7">
                <Stars rating={4.9} count={312} />
              </div>
            </div>
          </div>

          {/* IMAGE (mobile second, desktop left) */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
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
