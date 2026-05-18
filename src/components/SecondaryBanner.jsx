import { ArrowRight } from "lucide-react";

export default function SecondaryBanner() {
  return (
    <section className="w-full relative bg-black overflow-hidden mt-6">
      <div className="relative w-full h-[60vh] md:h-[85vh]">
        {/* Background Image */}
        <img
          src="/banner-home.png"
          alt="Just in at B-Tashni"
          className="w-full h-full object-cover object-center"
        />
        {/* Content - Bottom Left to match Skims style */}
        <div className="absolute inset-0 bg-black/10" />{" "}
        {/* Slight overlay for text readability if needed */}
        <div className="absolute bottom-6 left-5 md:bottom-12 md:left-10 text-white z-10">
          <p className="text-base md:text-xl mb-1 font-normal">
            DROP 01
          </p>
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-2 tracking-tight">
            THE STREETS HAVE A NEW LANGUAGE.
          </h2>
          <p className="text-base md:text-xl mb-4 font-normal">
            Oversized. Unisex. Built for people who let their clothes do the talking.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm md:text-base font-medium underline underline-offset-4 hover:text-gray-200 transition-colors"
          >
            WEAR IT <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
