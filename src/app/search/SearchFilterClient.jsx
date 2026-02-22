"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Filter, X } from "lucide-react";

export default function SearchFilterClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    // Initial local states from URL
    const [localCategory, setLocalCategory] = useState(searchParams.get("category") || "");
    const [localMinPrice, setLocalMinPrice] = useState(searchParams.get("minPrice") || "0");
    const [localMaxPrice, setLocalMaxPrice] = useState(searchParams.get("maxPrice") || "20000");
    const [localSort, setLocalSort] = useState(searchParams.get("sort") || "");

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams);

        if (localCategory) params.set("category", localCategory);
        else params.delete("category");

        if (localMinPrice && localMinPrice !== "0") params.set("minPrice", localMinPrice);
        else params.delete("minPrice");

        if (localMaxPrice && localMaxPrice !== "20000") params.set("maxPrice", localMaxPrice);
        else params.delete("maxPrice");

        if (localSort) params.set("sort", localSort);
        else params.delete("sort");

        router.push(`/search?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setLocalCategory("");
        setLocalMinPrice("0");
        setLocalMaxPrice("20000");
        setLocalSort("");
        router.push("/search");
    };

    const categories = ["Apparel", "Electronics", "Footwear", "Accessories", "Home"];
    const sorts = [
        { label: "Newest", value: "newest" },
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    {isOpen ? "Hide Filters" : "Show Filters"}
                    {(localCategory || (localMinPrice !== "0") || (localMaxPrice !== "20000")) && (
                        <span className="w-2 h-2 bg-black rounded-full" />
                    )}
                </button>

                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium">
                    <span className="text-gray-500 hidden sm:inline">Sort:</span>
                    <select
                        value={localSort}
                        onChange={(e) => setLocalSort(e.target.value)}
                        className="bg-transparent border-none appearance-none focus:ring-0 cursor-pointer font-bold pr-2"
                    >
                        <option value="">Recommended</option>
                        {sorts.map((sort) => (
                            <option key={sort.value} value={sort.value}>
                                {sort.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isOpen && (
                <div className="pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4 text-gray-500">Category</h4>
                            <div className="flex flex-wrap gap-2">
                                {["All", ...categories].map((category) => {
                                    const value = category === "All" ? "" : category;
                                    const isActive = localCategory === value;
                                    return (
                                        <button
                                            key={category}
                                            onClick={() => setLocalCategory(value)}
                                            className={`text-[10px] uppercase tracking-wider px-3 py-1.5 border transition-all ${isActive
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-black border-gray-200 hover:border-black"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4 text-gray-500">Price Range</h4>
                            <div className="space-y-8 px-1">
                                <div className="relative h-1 w-full bg-gray-100 rounded-full mt-8">
                                    <div
                                        className="absolute h-full bg-black rounded-full"
                                        style={{
                                            left: `${(Number(localMinPrice) / 20000) * 100}%`,
                                            right: `${100 - (Number(localMaxPrice) / 20000) * 100}%`
                                        }}
                                    />

                                    <input
                                        type="range"
                                        min="0"
                                        max="20000"
                                        step="100"
                                        className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-20 slider-thumb-active"
                                        value={localMinPrice}
                                        onChange={(e) => setLocalMinPrice(Math.min(Number(e.target.value), Number(localMaxPrice) - 500).toString())}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="20000"
                                        step="100"
                                        className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none cursor-pointer z-10 slider-thumb-active"
                                        value={localMaxPrice}
                                        onChange={(e) => setLocalMaxPrice(Math.max(Number(e.target.value), Number(localMinPrice) + 500).toString())}
                                    />

                                    <div
                                        className="absolute -top-7 px-2 py-1 bg-black text-white text-[9px] rounded transform -translate-x-1/2 pointer-events-none"
                                        style={{ left: `${(Number(localMinPrice) / 20000) * 100}%` }}
                                    >
                                        ₹{localMinPrice}
                                    </div>
                                    <div
                                        className="absolute -top-7 px-2 py-1 bg-black text-white text-[9px] rounded transform -translate-x-1/2 pointer-events-none"
                                        style={{ left: `${(Number(localMaxPrice) / 20000) * 100}%` }}
                                    >
                                        ₹{localMaxPrice}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex-1 group">
                                        <label className="text-[8px] uppercase text-gray-400 block mb-1">From</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                className="w-full text-[11px] pl-5 pr-2 py-1.5 border border-gray-100 focus:outline-none focus:border-black transition-colors"
                                                value={localMinPrice}
                                                onChange={(e) => setLocalMinPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 group">
                                        <label className="text-[8px] uppercase text-gray-400 block mb-1">To</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                className="w-full text-[11px] pl-5 pr-2 py-1.5 border border-gray-100 focus:outline-none focus:border-black transition-colors"
                                                value={localMaxPrice}
                                                onChange={(e) => setLocalMaxPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                        <button
                            onClick={handleClearFilters}
                            className="text-[10px] uppercase tracking-widest font-bold hover:underline"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleApplyFilters}
                            className="bg-black text-white px-8 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
