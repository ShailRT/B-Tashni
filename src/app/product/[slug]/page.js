import { getProductBySlug } from "@/data/products";
import ProductView from "@/components/ProductView";

export default async function Page({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="text-center">
          <h1 className="text-2xl font-light uppercase tracking-widest">
            Product Not Found
          </h1>
          <a href="/" className="text-xs underline mt-4 block">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <main>
      <ProductView product={product} />
    </main>
  );
}
