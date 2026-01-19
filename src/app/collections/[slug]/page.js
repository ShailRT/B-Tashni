import { products } from "@/data/products";
import ProductGrid from "@/components/ProductGrid";
import { notFound } from "next/navigation";

export default async function CollectionPage({ params }) {
  const { slug } = await params;

  // Filter products
  const filteredProducts = products.filter((p) => p.categories.includes(slug));

  // Optional: validation to check if category is valid (e.g. against a known list)
  // But for now, just checking if we have any products or if the user typed random stuff.
  // Actually, let's show an empty state if no products, rather than 404, unless we want strict category validation.

  return (
    <main className="min-h-screen pt-24 bg-white">
      <div className="container mx-auto px-6 mb-12 pt-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
          {slug.replace("-", " ")}
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Shop our latest collection of {slug.replace("-", " ")}. Discover the
          perfect pieces for every body.
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid
          items={filteredProducts}
          title={`Shop ${slug.replace("-", " ")}`}
        />
      ) : (
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-xl text-gray-400">
            No products found in this collection.
          </p>
        </div>
      )}
    </main>
  );
}
