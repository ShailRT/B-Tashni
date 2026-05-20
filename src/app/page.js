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
      <section className="w-full mt-20 md:mt-16 px-4 md:px-6">
  <div className="text-center mb-1">
    <p className="text-sm md:text-base text-gray-600 font-medium">
      DROP 01 - NOW LIVE
    </p>
    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-1">
      Four Pieces. One Language. Yours.
    </h2>
  
  </div>
</section>
      <VideoSection products={videoProducts} />
      <SecondaryBanner />
    </main>
  );
}
