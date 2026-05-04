import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { searchProducts } from "@/lib/prisma-queries";
import SearchFilterClient from "./SearchFilterClient";

async function SearchResults({ query, filters }) {
    const filteredProducts = (query.trim() || Object.keys(filters).length > 0) ? await searchProducts(query.trim(), filters) : [];

    return (
        <div className="pt-32 md:pt-40 min-h-screen bg-white">
            <div className="container mx-auto px-6">
                <div className="mb-10">
                    <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-[#1c1c1c] mb-2">
                        Search Results
                    </h1>
                    <p className="text-[11px] md:text-xs text-gray-400 uppercase tracking-[0.2em] font-medium">
                        {filteredProducts.length} items found for "{query}"
                    </p>
                </div>
                
                <div className="border-t border-gray-100 py-6 mb-2">
                    <SearchFilterClient />
                </div>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="-mt-10">
                    <ProductGrid items={filteredProducts} title="" />
                </div>
            ) : (
                <div className="container mx-auto px-6 py-20 text-center">
                    <p className="text-lg font-medium text-gray-500 uppercase tracking-widest">
                        No products match your search.
                    </p>
                </div>
            )}

        </div>
    );
}

export default async function SearchPage({ searchParams }) {
    const params = await searchParams;
    const query = params.q || "";
    const filters = {
        minPrice: params.minPrice || "",
        maxPrice: params.maxPrice || "",
        sort: params.sort || "",
    };

    return (
        <Suspense fallback={<div className="pt-32 text-center uppercase tracking-widest font-bold">Loading results...</div>}>
            <SearchResults query={query} filters={filters} />
        </Suspense>
    );
}
