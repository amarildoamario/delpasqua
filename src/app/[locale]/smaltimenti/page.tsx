import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { locales, type Locale } from "@/i18n/pathnames";
import { readPublicCatalog } from "@/lib/server/catalog";
import SmaltimentiClient from "@/components/SmaltimentiClient";

const translations = {
  it: {
    title: "Smaltimento Imballaggi",
    description: "Guida alla raccolta differenziata e allo smaltimento degli imballaggi dei prodotti Frantoio Del Pasqua."
  },
  en: {
    title: "Packaging Disposal Guide",
    description: "Guide to waste separation and recycling of Frantoio Del Pasqua product packaging."
  },
  de: {
    title: "Entsorgungshandbuch",
    description: "Leitfaden zur Mülltrennung und Entsorgung von Verpackungen der Produkte von Frantoio Del Pasqua."
  },
  nl: {
    title: "Afvalwijzer Verpakkingen",
    description: "Gids voor afvalscheiding en recycling van productverpakkingen van Frantoio Del Pasqua."
  },
  da: {
    title: "Affaldsguide for emballage",
    description: "Guide til affaldssortering og genanvendelse av Frantoio Del Pasqua-produktemballage."
  },
  no: {
    title: "Avfallsguide for emballasje",
    description: "Guide til kildesortering og gjenvinning av emballasje fra Frantoio Del Pasqua-produkter."
  }
};

export default async function SmaltimentiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  
  // Fetch products from JSON catalog on the server
  const rawCatalog = await readPublicCatalog();
  
  // Clean products list: exclude test products and map to simple types for client
  const products = rawCatalog
    .filter((p) => p.excludeFromSeo !== true && p.id !== "prodotto-test")
    .map((product) => ({
      id: product.id,
      title: product.title ?? product.id,
      category: product.category ?? "Olio",
      imageSrc: product.imageSrc ?? "",
      slug: product.slug ?? product.id
    }));

  return (
    <div className="min-h-screen bg-stone-50/40 text-stone-900">
      <SmaltimentiClient locale={activeLocale} products={products} />
      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const t = translations[activeLocale];

  return pageMetadata({
    title: t.title,
    description: t.description,
    path: "/smaltimenti/",
    locale,
    hreflang: true,
  });
}
