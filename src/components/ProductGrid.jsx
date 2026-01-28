"use client";

import { products } from "@/data/products";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductGrid({ items, title = "Trending Now" }) {
  const displayProducts = items || products.slice(0, 4);
  const { addToCart } = useCart();

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <h3 className="text-xl font-bold uppercase tracking-tight mb-8">
          {title}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
          {displayProducts.map((product) => (
            <Link
              href={`/product/${product.slug || product.id}`}
              key={product.id || product.slug}
              className="group cursor-pointer block"
            >
              <div className="relative aspect-3/4 w-full bg-gray-100 mb-4 overflow-hidden">
                <img
                  src={product.image || product.images?.[0]}
                  alt={product.name || product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {product.scent && (
                  <span className="absolute top-2 left-2 bg-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide">
                    {product.scent}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault(); // prevent navigation
                    addToCart(product);
                  }}
                  className="absolute bottom-0 left-0 right-0 bg-white/90 py-3 text-xs font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-black hover:text-white"
                >
                  Quick Add
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wide">
                  {product.name || product.title}
                </h4>
                <p className="text-xs text-gray-500">{product.color}</p>
                <p className="text-xs font-medium">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
