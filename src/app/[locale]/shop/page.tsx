import { readPublicCatalogWithMerch } from "@/lib/server/catalog";
import { getLocalizedProductSlug } from "@/lib/productSlugs";
import { pageMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import ShopPageClient from "./ShopPageClient";

export const revalidate = 3600;

const SHOP_METADATA: Record<string, { title: string; description: string }> = {
  it: {
    title: "Shop",
    description: "Acquista online olio extravergine di oliva Del Pasqua e prodotti selezionati.",
  },
  en: {
    title: "Shop",
    description: "Buy Del Pasqua extra virgin olive oil and selected products online.",
  },
  de: {
    title: "Online-Shop",
    description: "Kaufen Sie natives Olivenoel extra und ausgewahlte Produkte von Del Pasqua online.",
  },
  nl: {
    title: "Winkel",
    description: "Koop extra vierge olijfolie en geselecteerde producten van Del Pasqua online.",
  },
  da: {
    title: "Butik",
    description: "Koeb Del Pasqua ekstra jomfruolivenolie og udvalgte produkter online.",
  },
  no: {
    title: "Butikk",
    description: "Kjop Del Pasqua extra virgin olivenolje og utvalgte produkter pa nett.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metadata = SHOP_METADATA[locale] ?? SHOP_METADATA.it;

  return pageMetadata({
    title: metadata.title,
    description: metadata.description,
    path: "/shop/",
    locale,
  });
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const products = await readPublicCatalogWithMerch();
  const initialProducts = products.map((product) => ({
    id: product.id,
    slug: getLocalizedProductSlug(product, locale),
    title: product.title ?? product.id,
    subtitle: product.subtitle ?? null,
    badge: product.badge ?? null,
    merchBadge: (product as Record<string, unknown>).merchBadge as string | null ?? null,
    imageSrc: product.imageSrc ?? null,
    imageAlt: product.imageAlt ?? product.title ?? product.id,
    variants: product.variants?.map((variant) => ({
      id: variant.id,
      label: variant.label ?? null,
      title: variant.title ?? null,
      priceCents: Number(variant.priceCents ?? 0),
      imageSrc: variant.imageSrc ?? null,
      imageAlt: variant.imageAlt ?? null,
    })) ?? [],
    category: product.category ?? null,
  }));

  const metadata = SHOP_METADATA[locale] ?? SHOP_METADATA.it;
  const shopLabel = metadata.title ?? "Shop";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": absoluteUrl(localizedPath("/", locale))
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": shopLabel,
        "item": absoluteUrl(localizedPath("/shop", locale))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ShopPageClient initialProducts={initialProducts} />
    </>
  );
}
