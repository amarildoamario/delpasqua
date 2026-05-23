import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { readCatalog } from "@/lib/server/catalog";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: locale === "en" ? "Buy Del Pasqua Olive Oil" : "Acquista Olio Del Pasqua",
    description:
      locale === "en"
        ? "Buy Del Pasqua extra virgin olive oil online from the official shop."
        : "Acquista online olio extravergine Del Pasqua dallo shop ufficiale.",
    path: "/acquista/",
    locale,
    hreflang: false,
  });
}

function formatPrice(cents: number, locale: string) {
  return new Intl.NumberFormat(locale === "it" ? "it-IT" : "en-US", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default async function AcquistaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const tp = await getTranslations({ locale, namespace: "Products" });
  const products = (await readCatalog()).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#fdfaf7]">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8a7258]">
            {isEn ? "Official online shop" : "Shop online ufficiale"}
          </p>
          <h1 className="mt-5 font-serif text-4xl font-light tracking-tight text-[#1f1a17] lg:text-6xl">
            {isEn ? "Buy Del Pasqua olive oil" : "Acquista olio Del Pasqua"}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#5f554c] lg:text-lg">
            {isEn
              ? "Choose our extra virgin olive oils and selected products directly from the official Del Pasqua shop."
              : "Scegli i nostri oli extravergini e i prodotti selezionati direttamente dallo shop ufficiale Del Pasqua."}
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-xl bg-[#132c1c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#1a3d27]"
          >
            {isEn ? "Go to shop" : "Vai allo shop"}
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const prices = product.variants
              .map((variant) => variant.priceCents)
              .filter((price): price is number => typeof price === "number");
            const minPrice = prices.length > 0 ? Math.min(...prices) : null;
            const title = tp(`${product.id}.title`) || product.title || product.id;
            const subtitle = tp(`${product.id}.subtitle`) || product.subtitle || "";

            return (
              <Link
                key={product.id}
                href={`/shop/${product.slug ?? product.id}`}
                className="group overflow-hidden rounded-[5px] border border-[#ede8e0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-square bg-white">
                  {product.imageSrc ? (
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt ?? title}
                      fill
                      className="object-contain p-5 transition group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  ) : null}
                </div>
                <div className="border-t border-[#ede8e0] p-4">
                  <h2 className="font-serif text-lg font-semibold text-[#1f1a17]">{title}</h2>
                  {subtitle ? <p className="mt-1 text-sm text-[#6f6258]">{subtitle}</p> : null}
                  {minPrice !== null ? (
                    <p className="mt-4 text-sm font-semibold text-[#132c1c]">
                      {isEn ? "From " : "Da "}
                      {formatPrice(minPrice, locale)}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
