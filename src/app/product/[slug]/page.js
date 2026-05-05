"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getProductBySlugAction, getProductsAction } from "@/app/actions/products";
import { notFound, useParams } from "next/navigation";
import { Bookmark, ChevronDown, ChevronUp, Share2, Ruler, ShieldCheck, Truck } from "lucide-react";
import SizeGuidePopup from "@/components/SizeGuidePopup";

export default function Page() {
  const params = useParams();
  const slug = params?.slug;

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showDescription, setShowDescription] = useState(true);
  const { addToCart, isSizeGuideOpen, setIsSizeGuideOpen } = useCart();

  useEffect(() => {
    if (!slug) return;

    async function fetchProduct() {
      setLoading(true);
      try {
        const data = await getProductBySlugAction(slug);
        if (data) {
          setProduct(data);
          // Fetch recommendations
          const products = await getProductsAction({ limit: 12 });
          setRecommendations(products.filter(p => p.slug !== slug).slice(0, 6));
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-5 h-5 border-[1px] border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const title = product.name || product.title;
  const images = product.imageUrls || product.images || [];
  const price = product.price;
  const id = product.id;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      id: `${id}-${selectedSize}`,
      originalId: id,
      name: title,
      price: price,
      image: images[0],
      color: product.color,
      selectedSize: selectedSize,
      handle: product.id,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-32 pt-32 selection:bg-black selection:text-white antialiased">
      <div className="flex flex-col lg:flex-row w-full max-w-[2400px] mx-auto overflow-hidden px-0 lg:px-[8vw] xl:px-[12vw]">

        {/* Image Gallery - Left Side (Zara's signature 2/3 scroll with grid) */}
        <div className="w-full lg:w-[65%] grid grid-cols-1 lg:grid-cols-2 gap-[1px] lg:gap-[4px] bg-transparent pt-10 lg:py-16">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative w-full h-[calc(100vh-300px)] lg:h-[calc(100vh-100px)] bg-transparent flex items-center justify-center overflow-hidden group ${idx < 2 ? "lg:col-span-2" : "lg:col-span-1 h-[60vh] lg:h-[75vh]"
                }`}
            >
              <Image
                src={img}
                alt={`${title} - view ${idx + 1}`}
                fill
                className="object-contain"
                sizes={idx < 2 ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 1024px) 100vw, 27vw"}
                priority={idx < 2}
              />
              {/* Subtle index indicator */}
              <div className="absolute top-8 left-8 text-[9px] font-bold tracking-[0.2em] opacity-20 pointer-events-none">
                {String(idx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* Info Container - Right Side (Sticky) */}
        <div className="w-full lg:w-[35%] px-6 lg:pl-12 lg:pr-10 xl:pl-16 xl:pr-16 py-12 lg:py-20 relative">
          <div className="lg:sticky lg:top-32 lg:self-start lg:w-full space-y-12">

            {/* Title Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-start items-center group">
                <h1 className="text-[18px] lg:text-[20px] font-light leading-[1.1] uppercase tracking-[0.08em] text-balance">
                  {title}
                </h1>
              </div>

              <div className="space-y-1">
                <p className="text-[14px] font-medium tracking-[0.03em]">
                  INR {typeof price === 'number' ? price.toLocaleString('en-IN') : price}
                </p>
                <p className="text-[9px] text-gray-400 uppercase tracking-[0.1em] font-light">
                  MRP incl. of all taxes
                </p>
              </div>
            </div>

            {/* Summary / Description */}
            <div className="space-y-4">
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.15em] border-b border-black/10 pb-3 group"
              >
                <span>Description & Materials</span>
                {showDescription ? <ChevronUp className="w-3 h-3 text-black/40 group-hover:text-black" /> : <ChevronDown className="w-3 h-3 text-black/40 group-hover:text-black" />}
              </button>
              {showDescription && (
                <div className="space-y-4 animate-in fade-in duration-700">
                  <p className="text-[13px] font-light leading-[1.7] text-black/70">
                    {product.description || "Thoughtfully designed for versatility and timeless appeal. This piece transition effortlessly from day to night, crafted from premium fabrics that ensure durable comfort."}
                  </p>
                  <div className="flex flex-col gap-1 text-[9px] uppercase tracking-widest text-gray-400">
                    <span>Color: {product.color || "Jet Black"}</span>
                    <span>Art. No: {product.sku || (id?.slice(-8).toUpperCase() || "B-TASHNI")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest">Select Size</span>
                <button 
                  onClick={() => setIsSizeGuideOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 text-[10px] uppercase underline underline-offset-4 tracking-widest font-light hover:text-gray-500 transition-colors"
                >
                  <Ruler className="w-3 h-3" />
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-1 divide-y divide-black/5 border-t border-b border-black/5">
                {(product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-full cursor-pointer group py-4 px-1 text-left transition-all duration-300 flex justify-between items-center ${selectedSize === size ? "bg-black/2" : "hover:bg-black/[0.01]"}`}
                  >
                    <span className={`text-[12px] uppercase tracking-[0.1em] transition-all transform ${selectedSize === size ? "font-bold translate-x-1" : "font-light"}`}>
                      {size}
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full bg-black transition-all duration-500 ${selectedSize === size ? "opacity-100 scale-100 shadow-[0_0_8px_rgba(0,0,0,0.1)]" : "opacity-0 scale-0"}`}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sticky Action Bar Overlay for Mobile (UX boost) */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="w-full cursor-pointer bg-black text-white hover:bg-[#111] py-5 px-8 text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-500 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.98]"
              >
                Add to Cart
              </button>
              <p className="text-[9px] text-center text-gray-500 uppercase tracking-widest font-light">
                Free delivery for all orders above ₹2999
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Match With Section */}
      {recommendations && recommendations.length > 0 && (
        <div className="px-6 lg:px-20 max-w-[2000px] mx-auto border-t border-black/5 pt-10 pb-10">
          <div className="space-y-16">
            <header className="space-y-4">
              <h2 className="text-[16px] font-bold uppercase tracking-[0.3em] text-black">
                You May Also Like
              </h2>
              <div className="w-8 h-[1px] bg-black"></div>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-[2px] lg:gap-x-10 gap-y-20">
              {recommendations.map((item, i) => (
                <Link
                  href={`/product/${item.slug}`}
                  key={i}
                  className="group flex flex-col gap-6"
                >
                  <div className="relative aspect-[10/14] overflow-hidden bg-[#f8f8f8]">
                    <Image
                      src={item.imageUrls?.[0] || "/placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 15vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors" />
                  </div>

                  <div className="flex flex-col items-center gap-2 px-2 text-center">
                    <p className="text-[11px] lg:text-[12px] uppercase font-light tracking-tight group-hover:underline underline-offset-[10px] decoration-black/10 transition-all">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest">
                      INR {item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
