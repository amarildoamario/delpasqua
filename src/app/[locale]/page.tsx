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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return pageMetadata({
    title: locale === "en" ? "Frantoio Del Pasqua" : "Frantoio Del Pasqua",
    description:
      locale === "en"
        ? "Extra virgin olive oil, Tuscan mill tradition and selected Del Pasqua products."
        : "Olio extravergine di oliva, tradizione del frantoio toscano e prodotti selezionati Del Pasqua.",
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
        "publisher": {
          "@id": `${homeUrl}#store`
        }
      },
      {
        "@type": "Store",
        "name": companyInfo.brandName,
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
