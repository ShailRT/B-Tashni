"use client";

import { useEffect, useRef } from "react";

export default function VideoBanner() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video play failed:", error);
      });
    }
  }, []);

  return (
    <section className="w-full relative bg-black overflow-hidden mt-6">
      {/* Video Container */}
      <div className="relative w-full h-[60vh] md:h-[85vh]">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="https://cdn.shopify.com/videos/c/o/v/4942729919de4fcba876b6645b6ecb50.mp4"
          loop
          muted
          playsInline
          autoPlay
        />

        {/* Overlay Darken (optional, Bluorng is quite clear but maybe slight tint) */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Centered Rotating Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative md:w-40 md:h-40 flex items-center justify-center animate-[spin_10s_linear_infinite]">
            {/* SVG Text Path */}
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <path
                  id="circlePath"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                />
              </defs>
              <text className="fill-white text-[12px] font-bold tracking-[0.2em] uppercase">
                <textPath href="#circlePath" startOffset="0%">
                  EXTENSION OF YOUR EXPRESSION ~ BLUORNG ~ EXTENSION OF YOUR
                  EXPRESSION ~ BLUORNG ~
                </textPath>
              </text>
            </svg>

            {/* Center Logo/Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-12 h-12 md:w-20 md:h-20 fill-white"
              >
                {/* Left Claw */}
                <path d="M25,20 C30,35 30,60 20,85 L32,80 C40,55 40,30 30,15 Z" />
                {/* Middle Claw */}
                <path d="M50,10 C58,30 58,70 45,95 L60,90 C70,60 70,25 58,5 Z" />
                {/* Right Claw */}
                <path d="M75,20 C80,35 75,60 70,85 L85,80 C90,55 95,30 82,15 Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
