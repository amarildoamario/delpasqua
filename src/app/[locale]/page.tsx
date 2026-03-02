import HeroCarousel from "@/components/HeroCarousel";
import HeroSplitEvo from "@/components/HeroSplitEvo"; // ✅ aggiungi
import ShopHighlights from "@/components/ShopHighlights";
import BioMethodSection from "@/components/BioMethodSection";
import DiscoverSection from "@/components/DiscoverSection";
import Footer from "@/components/Footer";
import HeritageBridge from "@/components/HeritageBridge";
import BlogHighlights from "@/components/BlogHighlights";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans">
      <HeroCarousel />

      {/* ✅ NUOVO HERO SPLIT EVO */}




      <ShopHighlights />

      <HeritageBridge />
      <HeroSplitEvo />
      <BioMethodSection />

      <DiscoverSection />
      <BlogHighlights />
      <Footer />
    </div>
  );
}
