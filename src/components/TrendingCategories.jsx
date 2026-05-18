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
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-2">
          DROP 01 - NOW LIVE
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-medium">
          Four Pieces. One Language. Yours.
        </p>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
          {displayItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group block cursor-pointer"
            >
              <div className="relative aspect-[0.8] w-full bg-gray-100 mb-2 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-sm font-extrabold uppercase tracking-wide text-[#2d2a26] pl-2 group-hover:underline underline-offset-4 decoration-1">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
