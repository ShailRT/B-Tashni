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
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-2 tracking-tight">
            Drop 01 Is Here
          </h2>
          <p className="text-base md:text-xl mb-4 font-normal">
            Oversized cotton styles built for everyday comfort.
          </p>
          <a
            href="#"
            className="text-sm md:text-base font-medium underline underline-offset-4 hover:text-gray-200 transition-colors"
          >
            Shop The Drop
          </a>
        </div>
      </div>
    </section>
  );
}
