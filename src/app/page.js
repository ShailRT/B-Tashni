import Hero from "@/components/Hero";
import TrendingCategories from "@/components/TrendingCategories";
import VideoBanner from "@/components/VideoBanner";
import VideoSection from "@/components/VideoSection";
import SecondaryBanner from "@/components/SecondaryBanner";
import { getProductsAction } from "@/app/actions/products";

export default async function Home() {
  const useStatic = false;
  // Fetch dynamic products from DB
  const allProducts = await getProductsAction({ limit: 100 });
  const videoProducts = allProducts.filter(p => p.videoUrl && p.homeVideoSection);
  const trendingProducts = allProducts.filter(p => p.trendingSection);

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <TrendingCategories products={trendingProducts} useStatic={useStatic} />
      <VideoBanner />
      <VideoSection products={videoProducts} />
      <SecondaryBanner />
    </main>
  );
}
