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
    <section className="w-full relative bg-black mt-16 md:mt-24 overflow-hidden h-[65vh] md:h-[75vh] flex items-center justify-center text-center px-4">
      {/* Background Video (Full Width & Height) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/video-home.mp4"
        loop
        muted
        playsInline
        autoPlay
      />

      {/* Dark Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-black/55 z-10"></div>

      {/* Center Content: Manifesto */}
      <div className="relative z-20 max-w-3xl mx-auto text-white flex flex-col items-center justify-center px-4 space-y-4">

        {/* Rotating Badge Header */}
        <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center mb-1">
          {/* SVG Text Path */}
          <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_20s_linear_infinite]">
            <defs>
              <path
                id="circlePath"
                d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
              />
            </defs>
            <text className="fill-white text-[11px] font-bold tracking-[0.25em] uppercase">
              <textPath href="#circlePath" startOffset="0%">
                BTASHNI • NOT A LABEL • IT'S A LANGUAGE • NOW LIVE •
              </textPath>
            </text>
          </svg>

          {/* Center Logo/Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/icon-white.png"
              alt="Brand Logo B"
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase">
          WHAT WE STAND FOR
        </span>

        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase text-white leading-tight max-w-2xl">
          BTASHNI IS NOT A LABEL.<br />
          <span className="text-zinc-400">IT'S A LANGUAGE.</span>
        </h2>

        <div className="w-12 h-[1px] bg-white opacity-30 my-1" />

        <div className="space-y-3 max-w-xl mx-auto">
          <p className="text-xs md:text-sm text-zinc-300 font-light leading-relaxed">
            You don't wear clothes to cover yourself. You wear them to show the world who you are — before you even open your mouth. That's BTASHNI.
          </p>
          <p className="text-xs md:text-sm text-zinc-300 font-medium tracking-wide">
            Made for everyone. Built for nobody ordinary.
          </p>
        </div>

        <div className="pt-2">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center text-[10px] md:text-xs font-bold tracking-widest uppercase border border-white/30 rounded-full px-5 py-2.5 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
          >
            EXPLORE THE DROP
          </a>
        </div>
      </div>
    </section>
  );
}
