import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "SHAPEWEAR",
    slug: "shapewear",
    image:
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?q=80&w=1000&auto=format&fit=crop",
    description: "Sculpt & Smooth",
  },
  {
    id: 2,
    name: "UNDERWEAR",
    slug: "underwear",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34c85b67?q=80&w=1000&auto=format&fit=crop",
    description: "Everyday Essentials",
  },
  {
    id: 3,
    name: "LOUNGEWEAR",
    slug: "lounge",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
    description: "Comfort Redefined",
  },
  {
    id: 4,
    name: "SWIM",
    slug: "swim",
    image:
      "https://images.unsplash.com/photo-1582639590011-f5a8416d1101?q=80&w=1000&auto=format&fit=crop",
    description: "Make A Splash",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <h3 className="text-xl font-bold uppercase tracking-tight mb-8">
          Shop By Category
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/collections/${category.slug}`}
              className="group relative overflow-hidden aspect-3/4 block"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

              {/* Text */}
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs font-medium tracking-widest mb-1 opacity-90">
                  {category.description}
                </p>
                <h4 className="text-2xl font-black uppercase tracking-tighter">
                  {category.name}
                </h4>
                <div className="mt-3 border-b border-white w-12 group-hover:w-20 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
