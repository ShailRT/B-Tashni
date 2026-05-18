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
          src="/video-home.mp4"
          loop
          muted
          playsInline
          autoPlay
        />

        {/* Overlay Darken (optional, btashni is quite clear but maybe slight tint) */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Centered Rotating Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
            {/* SVG Text Path */}
            <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_10s_linear_infinite]">
              <defs>
                <path
                  id="circlePath"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                />
              </defs>
              <text className="fill-white text-[12px] font-bold tracking-[0.2em] uppercase">
                <textPath href="#circlePath" startOffset="0%">
                  BTASHNI IS NOT A LABEL. IT'S A LANGUAGE. NOW LIVE
                </textPath>
              </text>
            </svg>

            {/* Center Logo/Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/icon-white.png"
                alt="Brand Logo B"
                className="w-16 h-16 md:w-24 md:h-24 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
