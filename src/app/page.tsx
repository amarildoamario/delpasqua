import HeroCarousel from "@/components/HeroCarousel";
import HeroSplitEvo from "@/components/HeroSplitEvo"; // ✅ aggiungi
import ShopHighlights from "@/components/ShopHighlights";
import BioMethodSection from "@/components/BioMethodSection";
import DiscoverSection from "@/components/DiscoverSection";
import Footer from "@/components/Footer";
import HeritageBridge from "@/components/HeritageBridge";

export default function Home() {
  return (
    <div className="bg-zinc-50 font-sans dark:bg-black">
      <HeroCarousel />

      {/* ✅ NUOVO HERO SPLIT EVO */}
      

      <div className="h-10 md:h-14 bg-white dark:bg-black" />

      <ShopHighlights />
      
      <HeritageBridge />
      <HeroSplitEvo />
      <BioMethodSection />
      
      <DiscoverSection />
      <Footer />
    </div>
  );
}
