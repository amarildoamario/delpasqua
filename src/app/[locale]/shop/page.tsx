import { readCatalog } from "@/lib/server/catalog";
import { pageMetadata } from "@/lib/seo";
import ShopPageClient from "./ShopPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: locale === "en" ? "Shop" : "Shop",
    description:
      locale === "en"
        ? "Buy Del Pasqua extra virgin olive oil and selected products online."
        : "Acquista online olio extravergine di oliva Del Pasqua e prodotti selezionati.",
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
