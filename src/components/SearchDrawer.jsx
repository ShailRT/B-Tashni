"use client";

import { useSearch } from "@/context/SearchContext";
import { X, Search as SearchIcon, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchProductsAction, getProductsAction } from "@/app/actions/products";

export default function SearchDrawer() {
    const { isSearchOpen, setIsSearchOpen } = useSearch();
    const [query, setQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        // Load some default products on mount
        getProductsAction({ page: 1, limit: 4 }).then(products => {
            setFeaturedProducts(products);
        });
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length > 1) {
                setIsLoading(true);
                const results = await searchProductsAction(query.trim());
                setSuggestions(results);
                setIsLoading(false);
            } else {
                setSuggestions([]);
            }
        };

        const debounce = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(debounce);
    }, [query]);

    if (!mounted) return null;

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setIsSearchOpen(false);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const trendingSearches = ["Oversized", "90s", "T-Shirt", "kaleshi"];

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300 ${isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsSearchOpen(false)}
            />

            {/* Sidebar Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-[70] shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isSearchOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header & Search Bar */}
                <div className="flex flex-col border-b border-gray-100">
                    <div className="flex items-center justify-between px-6 py-5">
                        <h2 className="text-lg font-bold uppercase tracking-widest text-[#1c1c1c]">
                            Search
                        </h2>
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="p-2 -mr-2 text-gray-400 hover:text-black hover:rotate-90 transition-all duration-300 hover:cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="px-6 pb-6 pt-2">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="What are you looking for?"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-none py-4 px-12 text-sm font-medium focus:outline-none focus:border-black focus:ring-0 transition-colors uppercase tracking-widest placeholder:text-gray-400"
                                autoFocus={isSearchOpen}
                            />
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            {query.trim() && (
                                <button
                                    type="submit"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-black hover:text-gray-600 transition-colors"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                    {!query.trim() ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
                                    Trending Searches
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {trendingSearches.map((term) => (
                                        <button
                                            key={term}
                                            onClick={() => setQuery(term)}
                                            className="px-4 py-2 bg-gray-50 text-xs font-medium uppercase tracking-wider text-[#1c1c1c] hover:bg-black hover:text-white transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 mt-8">
                                    Featured Products
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {featuredProducts.slice(0, 4).map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.slug}`}
                                            onClick={() => setIsSearchOpen(false)}
                                            className="group block"
                                        >
                                            <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden mb-3">
                                                <img
                                                    src={product.imageUrls?.[0] || 'https://via.placeholder.com/150'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1c1c1c] leading-tight group-hover:underline">
                                                {product.name}
                                            </h4>
                                            <p className="text-[11px] font-medium tracking-wide text-gray-500 mt-1">
                                                INR {typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pointer-events-none">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
                                    Suggestions ({suggestions.length})
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {suggestions.slice(0, 6).map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={() => setIsSearchOpen(false)}
                                        className="group flex gap-4 items-center"
                                    >
                                        <div className="w-[60px] aspect-[3/4] bg-gray-50 relative overflow-hidden shrink-0">
                                            <img
                                                src={product.imageUrls?.[0] || 'https://via.placeholder.com/150'}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#1c1c1c] truncate group-hover:underline">
                                                {product.name}
                                            </h4>
                                            <p className="text-[11px] text-gray-500 uppercase tracking-widest font-medium mt-1">
                                                {product.category || 'Apparel'}
                                            </p>
                                        </div>
                                        <div className="text-[12px] font-medium tracking-wide text-[#1c1c1c] shrink-0">
                                            INR {typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {suggestions.length > 0 && (
                                <button
                                    onClick={handleSearch}
                                    className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#2d2a26] transition-colors mt-8"
                                >
                                    View All Results
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pb-20">
                            <SearchIcon className="w-8 h-8 text-gray-300" />
                            <p className="text-sm font-medium tracking-wide uppercase text-[#1c1c1c]">
                                No results found
                            </p>
                            <p className="text-xs text-gray-500 max-w-[200px] mx-auto uppercase tracking-wider">
                                We couldn't find anything matching "{query}"
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
