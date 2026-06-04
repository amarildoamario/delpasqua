import fs from "fs";
import path from "path";
import BlogHighlights from "@/components/BlogHighlights";
import DiscoverSection from "@/components/DiscoverSection";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import HomeAboutFamily from "@/components/HomeAboutFamily";
import HomeAboutTerritory from "@/components/HomeAboutTerritory";
import HomeGallery from "@/components/HomeGallery";
import HomeMillFeature from "@/components/HomeMillFeature";
import HomeProductShowcase from "@/components/HomeProductShowcase";
import HomeTastingsFeature from "@/components/HomeTastingsFeature";
import HomeTrustAndReviews from "@/components/HomeTrustAndReviews";
import HomeUniqueness from "@/components/HomeUniqueness";
import ShopHighlights from "@/components/ShopHighlights";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { companyInfo } from "@/lib/companyInfo";
import { readCatalogWithMerch } from "@/lib/server/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const products = await readCatalogWithMerch();

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

  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": companyInfo.brandName,
    "image": `${SITE_URL}/products/EVO-750-ml-gpt.png`,
    "@id": `${SITE_URL}/${locale === "it" ? "" : locale + "/"}#store`,
    "url": `${SITE_URL}/${locale === "it" ? "" : locale + "/"}`,
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
  };

  return (
    <div className="bg-zinc-50 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <HeroCarousel />
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
