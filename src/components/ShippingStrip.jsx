"use client";

import { useEffect, useState } from "react";

export default function ShippingStrip() {
  return (
    <div className="w-full bg-black py-3 overflow-hidden border-t-2 border-b-2 border-black">
      <div className="relative w-full flex whitespace-nowrap">
        {/* First Marquee Set */}
        <div className="animate-marquee flex whitespace-nowrap">
          {Array(10)
            .fill("SHIPPING WORLDWIDE")
            .map((text, i) => (
              <span
                key={i}
                className="text-white text-[11px] font-bold uppercase tracking-widest mx-8"
              >
                {text}
              </span>
            ))}
        </div>

        {/* Second Marquee Set (for seamless looping) */}
        <div className="animate-marquee2 absolute top-0 flex whitespace-nowrap">
          {Array(10)
            .fill("SHIPPING WORLDWIDE")
            .map((text, i) => (
              <span
                key={i + 10}
                className="text-white text-[11px] font-bold uppercase tracking-widest mx-8"
              >
                {text}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
