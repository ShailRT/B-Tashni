import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import { searchProducts } from "@/lib/prisma-queries";
import SearchFilterClient from "./SearchFilterClient";

async function SearchResults({ query, filters }) {
    const filteredProducts = (query.trim() || Object.keys(filters).length > 0) ? await searchProducts(query.trim(), filters) : [];

    return (
        <div className="pt-32 min-h-screen bg-white">
            <div className="container mx-auto px-6 mb-8 lg:px-6">
                <SearchFilterClient />
                <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-[#1c1c1c]">
                    Search Results for "{query}"
                </h1>
                <p className="text-sm text-gray-500 mt-2 uppercase tracking-wide">
                    {filteredProducts.length} results found
                </p>
            </div>

            {filteredProducts.length > 0 ? (
                <ProductGrid items={filteredProducts} title="" />
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
