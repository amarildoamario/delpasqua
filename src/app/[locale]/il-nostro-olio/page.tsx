import { pageMetadata } from "@/lib/seo";
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

export default function IlNostroOlioPage() {
  return <IlNostroOlioPageClient />;
}
