import Hero from "@/components/Hero";
import TrendingCategories from "@/components/TrendingCategories";
import VideoBanner from "@/components/VideoBanner";
import VideoSection from "@/components/VideoSection";
import SecondaryBanner from "@/components/SecondaryBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ShippingStrip from "@/components/ShippingStrip";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <TrendingCategories />
      <VideoBanner />
      <VideoSection />
      <SecondaryBanner />
    </main>
  );
}
