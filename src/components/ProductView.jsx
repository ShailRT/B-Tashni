"use client";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function ProductView({ product }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      id: `${product.id}-${selectedSize}`,
      originalId: product.id,
      name: product.title,
      price: product.price,
      image: product.images[0],
      color: product.color,
      selectedSize: selectedSize,
      handle: product.id,
      quantity: 1,
    });
  };

  // Split images into primary (large vertical scroll) and others if needed
  // Zara usually creates a vertical stream of all images.

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-20 pt-20 lg:pt-24">
      <div className="flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto">
        {/* Left Column: Image Gallery */}
        {/* On Desktop: Vertical scroll of images, occupying ~67% width */}
        <div className="w-full lg:w-[67%] flex flex-col gap-1 px-0 pb-8">
          {product.images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-full aspect-[3/4] lg:aspect-[3.5/5]"
            >
              <Image
                src={img}
                alt={`${product.title} - view ${idx + 1}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 70vw"
                priority={idx < 2}
              />
            </div>
          ))}
        </div>

        {/* Right Column: Sticky Product Details */}
        <div className="w-full lg:w-[33%] px-5 lg:px-12 mt-6 lg:mt-0 relative">
          <div className="lg:sticky lg:top-32 lg:self-start lg:w-full h-fit flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h1 className="text-[18px] font-light uppercase tracking-tight leading-none">
                  {product.title}
                </h1>
                {/* Save Icon helper could go here */}
              </div>

              <div className="flex flex-col gap-0.5 mt-2">
                <p className="text-[11px] font-light uppercase tracking-wide">
                  {product.price}
                </p>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">
                  MRP incl. of all taxes
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="text-[13px] text-black font-light leading-snug">
              <p>{product.description}</p>
            </div>

            {/* Color & Reference */}
            <div className="text-[11px] text-black font-light uppercase">
              <p>
                {product.color} | {product.reference}
              </p>
            </div>

            {/* Size Selector */}
            <div className="border-t border-b border-black/10 py-3 my-1">
              <div className="flex flex-col">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`text-left text-[11px] uppercase py-1.5 px-2 hover:bg-gray-50 transition-colors flex justify-between items-center group relative ${selectedSize === size ? "font-bold" : "font-light"}`}
                  >
                    <span>{size}</span>
                    {selectedSize === size && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-black rounded-full -ml-2"></span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-[10px] underline cursor-pointer hover:text-gray-600 uppercase tracking-wider">
                Size Guide
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-black border border-black py-3 px-6 text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                disabled={!selectedSize}
              >
                Add
              </button>

              <button className="w-full text-black hover:underline py-2 px-6 text-[10px] uppercase tracking-widest text-center">
                Process Order
              </button>
            </div>

            {/* Footer Links */}
            <div className="pt-6 space-y-2 text-[10px] uppercase tracking-wide text-gray-500 font-light">
              <div className="flex justify-between cursor-pointer hover:text-black transition-colors">
                <span>Check In-store Availability</span>
              </div>
              <div className="flex justify-between cursor-pointer hover:text-black transition-colors">
                <span>Shipping, Exchanges and Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matches Section if available */}
      {product.matchWith && product.matchWith.length > 0 && (
        <div className="px-5 lg:px-12 mt-32 mb-10 max-w-[1920px] mx-auto">
          <h3 className="text-[13px] font-bold uppercase tracking-wider mb-6">
            Match With
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2">
            {product.matchWith.map((item, i) => (
              <a
                href={`/product/${item.slug}`}
                key={i}
                className="flex flex-col gap-2 cursor-pointer group"
              >
                <div className="relative aspect-[3/4.5] overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[10px] uppercase font-light">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-500 font-light">
                    {item.price}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
