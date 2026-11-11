import { setRequestLocale, getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import fs from "fs";
import path from "path";
import dynamic from "next/dynamic";

const BlogHighlights = dynamic(() => import("@/components/BlogHighlights"));
const DiscoverSection = dynamic(() => import("@/components/DiscoverSection"));
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
const HomeAboutFamily = dynamic(() => import("@/components/HomeAboutFamily"));
const HomeAboutTerritory = dynamic(() => import("@/components/HomeAboutTerritory"));
const HomeGallery = dynamic(() => import("@/components/HomeGallery"));
const HomeMillFeature = dynamic(() => import("@/components/HomeMillFeature"));
const HomeProductShowcase = dynamic(() => import("@/components/HomeProductShowcase"));
const HomeTastingsFeature = dynamic(() => import("@/components/HomeTastingsFeature"));
const HomeTrustAndReviews = dynamic(() => import("@/components/HomeTrustAndReviews"));
const HomeUniqueness = dynamic(() => import("@/components/HomeUniqueness"));
const ShopHighlights = dynamic(() => import("@/components/ShopHighlights"));
import { pageMetadata, SITE_URL, SITE_NAME, absoluteUrl, localizedPath } from "@/lib/seo";
import { companyInfo } from "@/lib/companyInfo";
import { readPublicCatalogWithMerch } from "@/lib/server/catalog";

export const revalidate = 3600;

const HOME_DESCRIPTIONS: Record<string, string> = {
  it: "Frantoio Del Pasqua a Monte San Savino (Arezzo, Toscana): raccolta tradizionale delle olive e molitura entro 24 ore con estrazione a freddo, gramolazione controllata e conservazione in acciaio inox sotto azoto per preservare aromi e polifenoli. Produzione artigianale e vendita diretta di olio extravergine di oliva 100% italiano, biologico e IGP Toscano, vini della tenuta e degustazioni guidate in frantoio.",
  en: "Frantoio Del Pasqua in Monte San Savino (Arezzo, Tuscany): traditional olive harvesting and milling within 24 hours with cold extraction, controlled malaxation, and nitrogen-sealed stainless steel storage to preserve aromas and polyphenols. Artisanal production and direct online shop of 100% Italian, organic and Tuscan PGI extra virgin olive oil, estate wines, and guided olive mill tastings.",
  de: "Frantoio Del Pasqua in Monte San Savino (Arezzo, Toskana): traditionelle Olivenernte und Verarbeitung innerhalb von 24 Stunden mit Kaltextraktion, kontrollierter Malaxation und Lagerung in Edelstahltanks unter Stickstoff zum Erhalt von Aromen und Polyphenolen. Handwerkliche Produktion und Direktverkauf von 100% italienischem, Bio- und IGP-Toskana-Olivenöl extra vergine, Gutsweinen und geführten Verkostungen in der Ölmühle.",
  nl: "Frantoio Del Pasqua in Monte San Savino (Arezzo, Toscane): traditionele olijvenoogst en verwerking binnen 24 uur met koude extractie, gecontroleerde kneding en opslag in roestvrij staal onder stikstof om aroma's en polyfenolen te behouden. Ambachtelijke productie en directe verkoop van 100% Italiaanse, biologische en Toscaanse BGA extra vierge olijfolie, landgoedwijnen en rondleidingen met proeverij in de olijfmolen.",
  da: "Frantoio Del Pasqua i Monte San Savino (Arezzo, Toscana): traditionel olivenhøst og presning inden for 24 timer med koldpresning, kontrolleret æltning og opbevaring i rustfrit stål under kvælstof for at bevare aromaer og polyfenoler. Håndværksmæssig produktion og direkte salg af 100% italiensk, økologisk og toscansk IGP ekstra jomfruolivenolie, gårdvine og guidede smagninger i oliemøllen.",
  no: "Frantoio Del Pasqua i Monte San Savino (Arezzo, Toscana): tradisjonell olivenhøsting og pressing innen 24 timer med kaldpressing, kontrollert elting og lagring på rustfrie ståltanker under nitrogen for å bevare aromaer og polyfenoler. Håndverksmessig produksjon og direktesalg av 100% italiensk, økologisk og toskansk IGP ekstra virgin olivenolje, gårdsviner og guidede smakinger i oljemøllen.",
  es: "Frantoio Del Pasqua en Monte San Savino (Arezzo, Toscana): recolección tradicional de la aceituna y molienda en 24 horas con extracción en frío, batido controlado y conservación en acero inoxidable bajo nitrógeno para preservar aromas y polifenoles. Producción artesanal y venta directa de aceite de oliva virgen extra 100% italiano, ecológico e IGP Toscano, vinos de la finca y catas guiadas en la almazara.",
  fr: "Frantoio Del Pasqua à Monte San Savino (Arezzo, Toscane) : récolte traditionnelle des olives et trituration dans les 24 heures avec extraction à froid, malaxage contrôlé et conservation en cuves inox sous azote pour préserver arômes et polyphénols. Production artisanale et vente directe d'huile d'olive vierge extra 100% italienne, biologique et IGP Toscano, vins du domaine et dégustations guidées au moulin.",
  us: "Frantoio Del Pasqua in Monte San Savino (Arezzo, Tuscany): traditional olive harvesting and milling within 24 hours with cold extraction, controlled malaxation, and nitrogen-sealed stainless steel storage to preserve aromas and polyphenols. Artisanal production and direct online shop of 100% Italian, organic and Tuscan PGI extra virgin olive oil, estate wines, and guided olive mill tastings.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return pageMetadata({
    title: "Frantoio Del Pasqua",
    description: HOME_DESCRIPTIONS[locale] ?? HOME_DESCRIPTIONS.it,
    path: "/",
    locale,
  });
}

async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "Common.navbar" });
  const products = await readPublicCatalogWithMerch();

  // Read gallery images dynamically from public/home_gallery at build/request time
  let galleryImages: string[] = [];
  try {
    const galleryDir = path.join(process.cwd(), "public/home_gallery");
    if (fs.existsSync(galleryDir)) {
      galleryImages = fs.readdirSync(galleryDir).filter((file) => {
        return /\.(jpe?g|png|webp|gif)$/i.test(file);
      });
    }
  } catch (error) {
    console.error("Error reading home_gallery directory:", error);
  }

  const homeUrl = absoluteUrl(localizedPath("/", locale));
  const homeDescription = HOME_DESCRIPTIONS[locale] ?? HOME_DESCRIPTIONS.it;
  const primaryNavItems = [
    { name: tNav("shop"), path: "/shop" },
    { name: tNav("about_us"), path: "/storia" },
    { name: tNav("frantoio"), path: "/produzione" },
    { name: tNav("degustazioni"), path: "/degustazioni" },
    { name: tNav("blog"), path: "/blog" },
    { name: tNav("contatti"), path: "/contatti" },
  ];

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${homeUrl}#website`,
        "url": homeUrl,
        "name": SITE_NAME,
        "description": homeDescription,
        "publisher": {
          "@id": `${homeUrl}#store`
        }
      },
      {
        "@type": "Store",
        "name": companyInfo.brandName,
        "description": homeDescription,
        "image": `${SITE_URL}/products/EVO-500ml-transparent.png`,
        "@id": `${homeUrl}#store`,
        "url": homeUrl,
        "telephone": companyInfo.phone,
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": companyInfo.postalAddress.streetAddress,
          "addressLocality": companyInfo.postalAddress.addressLocality,
          "addressRegion": companyInfo.postalAddress.addressRegion,
          "postalCode": companyInfo.postalAddress.postalCode,
          "addressCountry": companyInfo.postalAddress.addressCountry,
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": companyInfo.geo.latitude,
          "longitude": companyInfo.geo.longitude,
        },
        "sameAs": [
          "https://www.facebook.com/frantoiodelpasqua",
          "https://www.instagram.com/frantoiodelpasqua"
        ]
      },
      {
        "@type": "ItemList",
        "@id": `${homeUrl}#navigation`,
        "itemListElement": primaryNavItems.map((item, idx) => ({
          "@type": "SiteNavigationElement",
          "position": idx + 1,
          "name": item.name,
          "url": absoluteUrl(localizedPath(item.path, locale)),
        })),
      }
    ]
  };

  return (
    <div className="bg-zinc-50 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <HeroCarousel />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ShopHighlights initialProducts={products as any} />
      <HomeAboutFamily />
      <HomeAboutTerritory />
      <HomeUniqueness />
      <HomeProductShowcase />
      <HomeTastingsFeature />
      <HomeMillFeature />
      <DiscoverSection />
      <HomeTrustAndReviews />
      <HomeGallery images={galleryImages} />
      <BlogHighlights />
      <Footer />
    </div>
  );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function HomeWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const pageMessages = {
    Common: messages.Common,
    Cart: messages.Cart,
    HomePage: messages.HomePage,
    Products: messages.Products,
    StoriaPage: messages.StoriaPage,
  };
  return (
    <NextIntlClientProvider messages={pageMessages}>
      <Home {...props} />
    </NextIntlClientProvider>
  );
}
