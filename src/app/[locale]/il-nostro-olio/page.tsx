import { pageMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import IlNostroOlioPageClient from "./IlNostroOlioPageClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: locale === "en" ? "Our Olive Oil" : "Il Nostro Olio",
    description:
      locale === "en"
        ? "Discover Del Pasqua extra virgin olive oils, formats and sensory profiles."
        : "Scopri gli oli extravergini Del Pasqua, i formati e i profili sensoriali.",
    path: "/il-nostro-olio/",
    locale,
  });
}

export default async function IlNostroOlioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

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
        "name": locale === "en" ? "Our Olive Oil" : "Il Nostro Olio",
        "item": absoluteUrl(localizedPath("/il-nostro-olio", locale))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <IlNostroOlioPageClient />
    </>
  );
}
