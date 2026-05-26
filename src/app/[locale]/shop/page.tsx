import { readCatalog } from "@/lib/server/catalog";
import { pageMetadata } from "@/lib/seo";
import ShopPageClient from "./ShopPageClient";

export const dynamic = "force-dynamic";

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

export default async function ShopPage() {
  const products = await readCatalog();
  const initialProducts = products.map((product) => ({
    id: product.id,
    slug: product.slug ?? product.id,
    title: product.title ?? product.id,
    subtitle: product.subtitle ?? null,
    badge: product.badge ?? null,
    imageSrc: product.imageSrc ?? null,
    imageAlt: product.imageAlt ?? product.title ?? product.id,
    variants: product.variants?.map((variant) => ({
      id: variant.id,
      priceCents: Number(variant.priceCents ?? 0),
    })) ?? [],
    category: product.category ?? null,
  }));

  return <ShopPageClient initialProducts={initialProducts} />;
}
