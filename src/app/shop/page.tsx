"use client";

import { useEffect, useState, useRef } from "react";
import ProductCard, { ProductCardProduct } from "@/components/ProductCard";
import { track } from "@/lib/analytics/track";
import Footer from "@/components/Footer";

type ApiProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  imageSrc?: string | null;
  imageAlt?: string | null;
  variants?: { id?: string; priceCents: number }[] | null;
};

function isApiProduct(x: unknown): x is ApiProduct {
  if (!x || typeof x !== "object") return false;
  const p = x as Record<string, unknown>;
  return typeof p.id === "string" && typeof p.slug === "string" && typeof p.title === "string";
}

export default function ShopPage() {
  const [products, setProducts] = useState<ProductCardProduct[] | null>(null);


  const sentListRef = useRef(false);

 useEffect(() => {
  (async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const raw: unknown = await res.json();

    const data: ApiProduct[] = Array.isArray(raw) ? raw.filter(isApiProduct) : [];
    
    if (!sentListRef.current) {
  sentListRef.current = true;
   // ✅ tracking lista prodotti (catalogo)
    track({
      type: "view_item_list",
      data: {
        listId: "shop",
        itemsShown: data.map((p) => ({ productKey: p.id, slug: p.slug })),
        itemsCount: data.length,
      },
    });
}

   

    setProducts(
      data.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle ?? "",
        badge: p.badge ?? "",
        imageSrc: p.imageSrc ?? "",
        imageAlt: p.imageAlt ?? "",
        priceLabel:
          p.variants?.[0] && typeof p.variants[0].priceCents === "number"
            ? `${new Intl.NumberFormat("it-IT", {
                style: "currency",
                currency: "EUR",
              }).format(p.variants[0].priceCents / 100)} + IVA`
            : "",
      }))
    );
  })();
}, []);


  return (
    <>
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-16 md:pt-20">
          <div>
            <div className="text-xs tracking-[0.22em] text-zinc-500 dark:text-zinc-400">SHOP</div>
            <h1 className="mt-2 font-serif text-3xl tracking-[0.06em] text-zinc-900 dark:text-white md:text-4xl">
              Tutti i prodotti
            </h1>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {!products
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[360px] animate-pulse rounded-[12px] border border-black/5 bg-zinc-100 dark:border-white/10 dark:bg-zinc-900"
                  />
                ))
              : products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onClick={() =>
                      track({
                        type: "product_click",
                        productKey: p.id,
                        variantKey: null, // nella lista non hai la variante: la aggiungiamo quando agganciamo la pagina prodotto
                        data: { slug: p.slug },
                      })
                    }
                  />
                ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
