"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ProductPurchaseBox from "../_components/ProductPurchaseBox.client";

type Specs = Record<string, string>;

type ProductVariant = {
  id: string;
  label: string;
  priceCents: number;
  sku?: string;
  imageSrc?: string;
  imageAlt?: string;
  specs?: Specs;
  stock?: number;
};

type PurchaseInfo = {
  caratteristiche?: string;
  imballaggio?: string;
  spedizione?: string;
  resi?: string;
};

type Product = {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  badge?: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  variants: ProductVariant[];
  specs?: Specs;

  // NUOVO
  purchaseInfo?: PurchaseInfo;
};

function buildSpecsRows(product: Product, variant?: ProductVariant) {
  const rows: Array<{ k: string; v: string }> = [];

  if (variant?.specs) {
    for (const [k, v] of Object.entries(variant.specs)) {
      if (v && String(v).trim().length) rows.push({ k, v: String(v) });
    }
  }

  if (product.specs) {
    for (const [k, v] of Object.entries(product.specs)) {
      if (v && String(v).trim().length) rows.push({ k, v: String(v) });
    }
  }

  return rows;
}

export default function ProductDetailsClient({
  product,
  initialVariantId,
}: {
  product: Product;
  initialVariantId?: string;
}) {
  const variants = useMemo(() => product.variants?.length ? product.variants : [], [product.variants]);

  const firstId = variants[0]?.id;
  const safeInitial =
    initialVariantId && variants.some((v) => String(v.id) === String(initialVariantId))
      ? initialVariantId
      : firstId;

  const [variantId, setVariantId] = useState<string | undefined>(safeInitial);

  const selectedVariant = useMemo(() => {
    return variants.find((v) => String(v.id) === String(variantId)) ?? variants[0];
  }, [variants, variantId]);

  const heroSrcRaw = selectedVariant?.imageSrc || product.imageSrc;
  const heroSrc = typeof heroSrcRaw === "string" ? heroSrcRaw.trim() : "";
  const heroAlt = selectedVariant?.imageAlt || product.imageAlt;
  const skuLabel = selectedVariant?.sku ?? "—";

  const specsRows = useMemo(() => buildSpecsRows(product, selectedVariant), [product, selectedVariant]);

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
          {heroSrc ? (
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-xs font-semibold text-neutral-500">Immagine non impostata</div>
                <div className="mt-1 text-[11px] text-neutral-400">Aggiungi un URL in Admin → Prodotti</div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 text-xs text-neutral-500">
          <span className="font-semibold text-neutral-700">SKU:</span>{" "}
          <span className="text-neutral-600">{skuLabel}</span>
        </div>
      </div>

      <div>
        <ProductPurchaseBox
          productId={product.id}
          variants={variants}
          selectedVariantId={selectedVariant?.id}
          onVariantChange={(id) => setVariantId(id)}
          purchaseInfo={product.purchaseInfo}
        />

        {specsRows.length ? (
          <section className="mt-8">
            <h3 className="text-sm font-semibold tracking-wide text-neutral-900">Dettagli</h3>

            <div className="mt-3 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
              {specsRows.map((r) => (
                <div key={r.k} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
                  <div className="text-neutral-700">{r.k}</div>
                  <div className="text-right text-neutral-900">{r.v}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}