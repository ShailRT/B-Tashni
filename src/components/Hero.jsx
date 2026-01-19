"use client";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover object-center"
          src="https://cdn.shopify.com/videos/c/o/v/bf861138015a4c0caf95384ac27b20d7.mp4"
          poster="https://cdn.shopify.com/videos/c/o/v/bf861138015a4c0caf95384ac27b20d7.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Subtle Overlay to ensure text readability if needed, but keeping it minimal for that 'raw' look */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-10 left-6 md:bottom-20 md:left-12 text-white z-10 max-w-lg">
        <h2 className="text-xl md:text-2xl font-medium tracking-wide mb-2 uppercase">
          Just In
        </h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
          Soft Lounge
        </h1>
        <div className="flex gap-6">
          <a
            href="#"
            className="border-b border-white pb-1 text-sm font-semibold tracking-widest hover:opacity-75 transition-opacity uppercase"
          >
            Shop Women
          </a>
          <a
            href="#"
            className="border-b border-white pb-1 text-sm font-semibold tracking-widest hover:opacity-75 transition-opacity uppercase"
          >
            Shop Men
          </a>
        </div>
      </div>
    </section>
  );
}
