'use client';

import { ArrowRight } from "lucide-react";

export default function SecondaryBanner() {
  return (
    <section className="w-full relative bg-black overflow-hidden mt-6">
      <div className="relative w-full h-[60vh] md:h-[85vh]">
        {/* Background Image */}
        <img
          src="/secondary-image.jpg"
          alt="Just in at B-Tashni"
          className="w-full h-full object-cover object-top"
        />
        {/* Content - Bottom Left to match Skims style */}
        <div className="absolute inset-0 bg-black/10" />{" "}
        {/* Slight overlay for text readability if needed */}
        <div className="absolute bottom-6 left-5 md:bottom-12 md:left-10 text-white z-10">
          <p className="text-base md:text-xl mb-1 font-normal">
            DROP 01
          </p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-2 uppercase">
            THE STREETS
          <br />
            HAVE  A
          <br />
            NEW
          <br />
            LANGUAGE.
          </h2>
          <p className="text-base md:text-xl font-normal">
            Oversized. Unisex. Built for people who let their
          </p>
          <p className="text-base md:text-xl mb-4 font-normal">
            clothes do the talking.
          </p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="border-b border-white pb-1 text-sm font-semibold tracking-wider hover:opacity-75 transition-opacity uppercase cursor-pointer inline-flex items-center gap-1.5"
          >
            WEAR IT <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
