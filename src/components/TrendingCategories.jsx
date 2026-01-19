"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
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

export default function TrendingCategories() {
  return (
    <section className="w-full mt-6">
      <div className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group block cursor-pointer"
            >
              <div className="relative aspect-[0.8] w-full bg-gray-100 mb-2 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-sm font-extrabold uppercase tracking-wide text-[#2d2a26] pl-2 group-hover:underline underline-offset-4 decoration-1">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
