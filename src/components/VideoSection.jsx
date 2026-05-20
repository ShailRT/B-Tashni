"use client";

import Link from "next/link";

const staticVideos = [
  {
    id: 1,
    name: "BEYOND BLUE",
    videoUrl:
      "https://skims.imgix.net/videos/c/o/v/e3f5015232904c5296620036ae2b78ef.mp4?fm=mp4&video-bitrate=3M&video-thumbnail=auto",
    slug: "beyond-blue", // Default slug for static
  },
  {
    id: 2,
    name: "TOPS",
    videoUrl:
      "https://skims.imgix.net/videos/c/o/v/d521b6c3e9564b8e80101df77ab18950.mp4?fm=mp4&video-bitrate=3M&video-thumbnail=auto",
    slug: "tops",
  },
  {
    id: 3,
    name: "LEGGINGS",
    videoUrl:
      "https://skims.imgix.net/videos/c/o/v/29d03ecc6d7f41f29f850190229253ff.mp4?fm=mp4&video-bitrate=3M&video-thumbnail=auto",
    slug: "leggings",
  },
  {
    id: 4,
    name: "ACCESSORIES",
    videoUrl:
      "https://skims.imgix.net/videos/c/o/v/5ed3c5c36f0446b89583d30c81093ae4.mp4?fm=mp4&video-bitrate=3M&video-thumbnail=auto",
    slug: "accessories",
  },
];

function VideoCard({ product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block cursor-pointer">
      <div className="relative aspect-[0.8] w-full bg-gray-100 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={product.videoUrl}
          loop
          muted
          playsInline
          autoPlay
          crossOrigin="anonymous"
        />
      </div>
      <h3 className="mt-4 text-sm font-extrabold uppercase tracking-wide text-[#2d2a26] pl-2 group-hover:underline underline-offset-4 decoration-1">
        {product.name}
      </h3>
    </Link>
  );
}

export default function VideoSection({ products = [] }) {
  const useStatic = false;
  // Use static fallback only when explicitly set OR when no DB products available
  const displayProducts = useStatic || products.length === 0
    ? staticVideos
    : products;

  return (
    <section className="w-full bg-white pt-12 pb-0 overflow-hidden">
      <div className="text-center mb-12 md:mb-16 space-y-2 md:space-y-3">
        <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-gray-400 uppercase block">
          Campaign Looks
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
          PIECES IN MOTION
        </h2>
        <div className="flex items-center justify-center gap-3 mt-1">
          <span className="h-[1px] w-6 md:w-10 bg-gray-300"></span>
          <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-semibold whitespace-nowrap">
            Watch the flow. Feel the weight.
          </p>
          <span className="h-[1px] w-6 md:w-10 bg-gray-300"></span>
        </div>
      </div>
      <div className="w-full">
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <VideoCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
