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
import { pageMetadata } from "@/lib/seo";

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

export default function Home() {
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

  return (
    <div className="bg-zinc-50 font-sans">
      <HeroCarousel />
      <ShopHighlights />
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
