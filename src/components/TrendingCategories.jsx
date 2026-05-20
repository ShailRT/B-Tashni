"use client";

import Image from "next/image";
import Link from "next/link";

const staticCategories = [
  {
    title: "TOPS",
    image:
      "https://skims-sanity.imgix.net/images/hfqi0zm0/production/6f96cbfe728f845e4a26313119e30b7c1fa49156-941x1176.webp?auto=format",
    href: "/collections/tops",
  },
  {
    title: "BOTTOMS",
    image:
      "https://skims-sanity.imgix.net/images/hfqi0zm0/production/f7aeb9d5c4fd1b4cbb5f4a975603161772ff9b97-941x1176.webp?auto=format",
    href: "/collections/bottoms",
  },
  {
    title: "SETS",
    image:
      "https://skims-sanity.imgix.net/images/hfqi0zm0/production/96b08f76b55b870e04370eb6b5c009938bb12e36-941x1176.webp?auto=format",
    href: "/collections/sets",
  },
  {
    title: "OUTERWEAR",
    image:
      "https://skims-sanity.imgix.net/images/hfqi0zm0/production/d80f009d15f78a2a134df3f8f2b866419e707e31-941x1176.webp?auto=format",
    href: "/collections/outerwear",
  },
];

export default function TrendingCategories({ products = [], useStatic = true }) {
  const displayItems =
    useStatic || products.length === 0
      ? staticCategories
      : products.map((product) => ({
        title: product.name,
        image: product.imageUrls?.[0] || "/placeholder.png",
        href: `/product/${product.slug}`,
      }));

  return (
    <section className="w-full mt-10 md:mt-16 mb-6 px-4 md:px-6">
      <div className="text-center mb-12 md:mb-16 space-y-2 md:space-y-3">
        <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-gray-400 uppercase block">
          Trending Selection
        </span>
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
          DROP 01 - NOW LIVE
        </h2>
        <div className="flex items-center justify-center gap-3 mt-1">
          <span className="h-[1px] w-6 md:w-10 bg-gray-300"></span>
          <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-semibold whitespace-nowrap">
            Four Pieces. One Language. Yours.
          </p>
          <span className="h-[1px] w-6 md:w-10 bg-gray-300"></span>
        </div>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
          {displayItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group block cursor-pointer"
            >
              <div className="relative aspect-[0.8] w-full bg-gray-50 overflow-hidden border border-gray-100/50 shadow-sm group-hover:shadow-md transition-shadow duration-500">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />


              </div>
              <h3 className="mt-4 text-sm font-extrabold uppercase tracking-wide text-[#2d2a26] group-hover:underline underline-offset-4 decoration-1">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
