"use client";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover object-center"
          src="/herovideo.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Soft bottom-heavy gradient overlay to keep center video bright while ensuring text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent z-10" />
      </div>

      {/* Content Overlay (Bottom Left) */}
      <div className="absolute bottom-10 left-6 md:bottom-16 md:left-16 text-white z-20 max-w-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        {/* Tagline */}
        <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-zinc-300 uppercase mb-3">
          BTASHNI • DROP 01
        </p>

        {/* Scaled-down title */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
          NO EXPLANATION
          <br />
          NEEDED
        </h1>

        {/* Action Button */}
        <div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center text-xs font-bold tracking-[0.2em] uppercase border border-white/40 px-6 py-3 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
          >
            SHOP DROP 01 <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>

      {/* Floating Rotating Brand Seal (Bottom Right) */}
      <div className="absolute bottom-10 right-6 md:bottom-16 md:right-16 z-20 hidden md:block">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* SVG Text Path */}
          <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_25s_linear_infinite]">
            <defs>
              <path
                id="circlePathHero"
                d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
              />
            </defs>
            <text className="fill-white/60 text-[10.5px] font-bold tracking-[0.3em] uppercase">
              <textPath href="#circlePathHero" startOffset="0%">
                BTASHNI • NOT A LABEL • IT'S A LANGUAGE • NOW LIVE •
              </textPath>
            </text>
          </svg>

          {/* Center Logo/Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/icon-white.png"
              alt="Brand Logo B"
              className="w-10 h-10 object-contain opacity-85"
            />
          </div>
        </div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1.5 opacity-40">
        <div className="w-[18px] h-[30px] border border-white rounded-full flex items-start justify-center p-1">
          <div className="w-[2px] h-[6px] bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
