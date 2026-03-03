import Hero from "@/components/Hero";
import TrendingCategories from "@/components/TrendingCategories";
import VideoBanner from "@/components/VideoBanner";
import VideoSection from "@/components/VideoSection";
import SecondaryBanner from "@/components/SecondaryBanner";
import { getProductsAction } from "@/app/actions/products";

export default async function Home() {
  // Toggle this to true if you want to force static products
  const useStaticProducts = false;

  // Fetch dynamic products from DB
  const allProducts = await getProductsAction({ limit: 100 });
  const videoProducts = allProducts.filter(p => p.videoUrl);

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <TrendingCategories />
      <VideoBanner />
      <VideoSection products={videoProducts} useStatic={useStaticProducts} />
      <SecondaryBanner />
    </main>
  );
}
