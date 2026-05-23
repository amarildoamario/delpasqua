import { pageMetadata } from "@/lib/seo";
import ProduzionePageClient from "./ProduzionePageClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return pageMetadata({
    title: locale === "en" ? "Production and Oil Mill" : "Produzione e Frantoio",
    description:
      locale === "en"
        ? "Discover Del Pasqua oil mill production: cold extraction, controlled process and traceability."
        : "Scopri la produzione del Frantoio Del Pasqua: estrazione a freddo, processo controllato e tracciabilita.",
    path: "/produzione/",
    locale,
  });
}

export default function ProduzionePage() {
  return <ProduzionePageClient />;
}
