import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { pageMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import ProduzionePageClient from "./ProduzionePageClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

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

async function ProduzionePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

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
        "name": locale === "en" ? "Production and Oil Mill" : "Produzione e Frantoio",
        "item": absoluteUrl(localizedPath("/produzione", locale))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProduzionePageClient />
    </>
  );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProduzionePageWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const pageMessages = {
    Common: messages.Common,
    Cart: messages.Cart,
    ProduzionePage: messages.ProduzionePage,
  };
  return (
    <NextIntlClientProvider messages={pageMessages}>
      <ProduzionePage {...props} />
    </NextIntlClientProvider>
  );
}
