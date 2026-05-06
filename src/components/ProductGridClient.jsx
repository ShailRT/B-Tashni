"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductGridClient({ products, title }) {
    const { addToCart } = useCart();

    if (!products || products.length === 0) {
        return (
            <section className="py-20 px-6">
                <div className="container mx-auto">
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-8">{title}</h3>
                    <p className="text-gray-400 text-sm uppercase tracking-widest text-center py-20">No products found.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8">
            <div className="container mx-auto px-6">
                {title && <h3 className="text-xl font-bold uppercase tracking-tight mb-8">{title}</h3>}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">

                    {products.map((product) => (
                        <Link
                            href={`/product/${product.slug || product.id}`}
                            key={product.id || product.slug}
                            className="group cursor-pointer block"
                        >
                            <div className="relative aspect-[3/4] w-full bg-gray-100 mb-4 overflow-hidden">

                                <img
                                    src={product.image || product.imageUrls?.[0] || product.images?.[0] || 'https://via.placeholder.com/300x400'}
                                    alt={product.name || product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                                {product.compareAtPrice && product.compareAtPrice > product.price && (
                                    <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide">
                                        Sale
                                    </span>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (product.stock <= 0) return;
                                        addToCart({
                                            id: product.id,
                                            originalId: product.id,
                                            name: product.name || product.title,
                                            price: product.price,
                                            image: product.imageUrls?.[0] || product.images?.[0] || product.image,
                                            slug: product.slug,
                                        });
                                    }}
                                    disabled={product.stock <= 0}
                                    className={`absolute bottom-0 left-0 right-0 bg-white/90 py-3 text-xs font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${product.stock <= 0 ? "opacity-80 cursor-not-allowed text-gray-500" : "hover:bg-black hover:text-white"}`}
                                >
                                    {product.stock <= 0 ? "Out of Stock" : "Quick Add"}
                                </button>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-xs font-bold uppercase tracking-wide">
                                    {product.name || product.title}
                                </h4>
                                <p className="text-xs text-gray-500">{product.category}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-medium">
                                        INR {typeof product.price === 'number' ? product.price.toLocaleString('en-IN') : product.price}
                                    </p>
                                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                                        <p className="text-xs text-gray-400 line-through">
                                            INR {product.compareAtPrice.toLocaleString('en-IN')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
