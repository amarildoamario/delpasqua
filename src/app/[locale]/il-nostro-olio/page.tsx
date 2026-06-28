import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { pageMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import IlNostroOlioPageClient from "./IlNostroOlioPageClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

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

async function IlNostroOlioPage({ params }: { params: Promise<{ locale: string }> }) {
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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function IlNostroOlioPageWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const pageMessages = {
    Common: messages.Common,
    Cart: messages.Cart,
    OlioPage: messages.OlioPage,
  };
  return (
    <NextIntlClientProvider messages={pageMessages}>
      <IlNostroOlioPage {...props} />
    </NextIntlClientProvider>
  );
}
