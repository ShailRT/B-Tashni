/**
 * B-Tashni Product Seed Script
 * Zara-inspired women's fashion collection with Indian pricing
 * Uses royalty-free Unsplash images
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const products = [
    // ─── DRESSES ───────────────────────────────────────────────────────────────
    {
        name: "Minimal Linen Slip Dress",
        slug: "minimal-linen-slip-dress",
        description: "Clean silhouette slip dress crafted from premium linen blend. Features adjustable shoulder straps, a relaxed fit and a midi length hem. The natural texture of the linen gives it a sophisticated, effortless look perfect for both day and evening.",
        price: 3490,
        compareAtPrice: 4990,
        imageUrls: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
        ],
        stock: 45,
        category: "dresses",
        sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
        name: "Satin Midi Wrap Dress",
        slug: "satin-midi-wrap-dress",
        description: "Luxurious satin wrap dress with a draped V-neckline and adjustable tie waist. The fluid fabric moves beautifully and the midi length creates an elegant silhouette. Available in a rich, versatile shade.",
        price: 4290,
        compareAtPrice: 5990,
        imageUrls: [
            "https://images.unsplash.com/photo-1566479179817-aba4f7a69fba?w=800&q=80",
            "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
        ],
        stock: 38,
        category: "dresses",
        sizes: ["XS", "S", "M", "L"],
    },
    {
        name: "Structured Blazer Dress",
        slug: "structured-blazer-dress",
        description: "Power meets femininity in this tailored blazer dress. Features a single-button fastening, notch lapels and side pockets. The feminine cut and sharp structure make it ideal for the office or an evening out.",
        price: 5990,
        compareAtPrice: 7990,
        imageUrls: [
            "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
            "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
        ],
        stock: 25,
        category: "dresses",
        sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
        name: "Floral Midi Chiffon Dress",
        slug: "floral-midi-chiffon-dress",
        description: "Romantic chiffon dress adorned with a delicate floral print. The flowing silhouette features a V-neckline, puff sleeves and a tiered skirt that creates beautiful movement. A feminine statement piece for any occasion.",
        price: 3990,
        compareAtPrice: 5490,
        imageUrls: [
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
        ],
        stock: 30,
        category: "dresses",
        sizes: ["XS", "S", "M", "L", "XL"],
    },

    // ─── TOPS ──────────────────────────────────────────────────────────────────
    {
        name: "Ribbed Knit Cropped Top",
        slug: "ribbed-knit-cropped-top",
        description: "Minimalist ribbed knit crop top with a scoop neckline and short sleeves. The stretch fabric hugs the body for a sleek, sculpted look. Pairs perfectly with high-waisted trousers or midi skirts.",
        price: 1490,
        compareAtPrice: 1990,
        imageUrls: [
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
            "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80",
        ],
        stock: 80,
        category: "tops",
        sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
        name: "Oversized Linen Shirt",
        slug: "oversized-linen-shirt",
        description: "Easy-breezy oversized shirt in 100% linen. Features a classic collar, front button placket, chest pocket and long sleeves with roll-up option. The relaxed fit makes it ideal to wear open over a slip dress or tucked into tailored trousers.",
        price: 2490,
        compareAtPrice: 3290,
        imageUrls: [
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
        ],
        stock: 60,
        category: "tops",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
        name: "Balloon Sleeve Blouse",
        slug: "balloon-sleeve-blouse",
        description: "Feminine blouse featuring dramatically puffed balloon sleeves and a relaxed body. The ruffled cuffs add a luxurious finish. Made from lightweight fabric that drapes beautifully and keeps you cool.",
        price: 2190,
        compareAtPrice: 2990,
        imageUrls: [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        ],
        stock: 42,
        category: "tops",
        sizes: ["XS", "S", "M", "L"],
    },
    {
        name: "Knit Turtleneck Sweater",
        slug: "knit-turtleneck-sweater",
        description: "Classic ribbed turtleneck sweater in a soft, warm knit blend. The fitted silhouette and high collar make it an essential layering piece. Pairs beautifully with everything from denim to wide-leg trousers.",
        price: 2990,
        compareAtPrice: 3990,
        imageUrls: [
            "https://images.unsplash.com/photo-1608228088998-57828365d486?w=800&q=80",
            "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&q=80",
        ],
        stock: 55,
        category: "tops",
        sizes: ["XS", "S", "M", "L", "XL"],
    },

    // ─── BOTTOMS ───────────────────────────────────────────────────────────────
    {
        name: "Wide Leg Linen Trousers",
        slug: "wide-leg-linen-trousers",
        description: "Effortlessly chic wide-leg trousers in breathable linen. High waist cut with a relaxed, fluid leg that creates an elongated, elegant silhouette. Features a hidden side zip and two side pockets.",
        price: 3290,
        compareAtPrice: 4490,
        imageUrls: [
            "https://images.unsplash.com/photo-1594938374182-0e3f3e6e2c83?w=800&q=80",
            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
        ],
        stock: 48,
        category: "bottoms",
        sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
        name: "Straight Leg High Waist Jeans",
        slug: "straight-leg-high-waist-jeans",
        description: "Premium denim straight leg jeans with a high waist cut. The clean, minimal design features a five-pocket construction and a subtle mid-wash that pairs easily with every top in your wardrobe.",
        price: 3990,
        compareAtPrice: 5290,
        imageUrls: [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
            "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80",
        ],
        stock: 70,
        category: "bottoms",
        sizes: ["24", "26", "28", "30", "32", "34"],
    },
    {
        name: "Satin Pleated Midi Skirt",
        slug: "satin-pleated-midi-skirt",
        description: "Elegant pleated midi skirt in lustrous satin fabric. The accordion pleats create beautiful movement and a luxurious drape. An elastic waistband provides comfort while maintaining a polished silhouette.",
        price: 2790,
        compareAtPrice: 3790,
        imageUrls: [
            "https://images.unsplash.com/photo-1583496661160-fb5218afa9a3?w=800&q=80",
            "https://images.unsplash.com/photo-1594938374182-0e3f3e6e2c83?w=800&q=80",
        ],
        stock: 35,
        category: "bottoms",
        sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
        name: "Tailored Slim Fit Trousers",
        slug: "tailored-slim-fit-trousers",
        description: "Sharp, tailored trousers with a slim, straight cut. A mid-rise waistband, front crease and two front slash pockets give these a refined, office-ready look. The stretch fabric ensures all-day comfort.",
        price: 2990,
        compareAtPrice: 3990,
        imageUrls: [
            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
        ],
        stock: 52,
        category: "bottoms",
        sizes: ["XS", "S", "M", "L", "XL"],
    },

    // ─── OUTERWEAR ─────────────────────────────────────────────────────────────
    {
        name: "Double Breasted Wool Coat",
        slug: "double-breasted-wool-coat",
        description: "Timeless double-breasted coat in a premium wool-blend fabric. Features a notch collar, structured shoulders and a belted waist for a classic, polished silhouette. An investment piece that transcends seasons.",
        price: 9990,
        compareAtPrice: 13990,
        imageUrls: [
            "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
        ],
        stock: 20,
        category: "outerwear",
        sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
        name: "Oversized Blazer",
        slug: "oversized-blazer",
        description: "An elevated wardrobe essential — this oversized blazer features a relaxed fit, notch lapels and a single-button fastening. The slightly padded shoulders and clean cut give it a strong, modern silhouette.",
        price: 5490,
        compareAtPrice: 7290,
        imageUrls: [
            "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
            "https://images.unsplash.com/photo-1548624149-f9f6db541d5a?w=800&q=80",
        ],
        stock: 30,
        category: "outerwear",
        sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
        name: "Faux Leather Biker Jacket",
        slug: "faux-leather-biker-jacket",
        description: "An iconic edge — this faux leather biker jacket features asymmetric zip fastening, moto-inspired hardware and a fitted silhouette. The premium faux leather is both cruelty-free and incredibly durable.",
        price: 6990,
        compareAtPrice: 9490,
        imageUrls: [
            "https://images.unsplash.com/photo-1548624149-f9f6db541d5a?w=800&q=80",
            "https://images.unsplash.com/photo-1571945192236-98f6fc6b7a82?w=800&q=80",
        ],
        stock: 25,
        category: "outerwear",
        sizes: ["XS", "S", "M", "L", "XL"],
    },

    // ─── CO-ORDS & SETS ────────────────────────────────────────────────────────
    {
        name: "Linen Blazer & Trouser Co-ord",
        slug: "linen-blazer-trouser-coord",
        description: "Effortlessly put-together co-ord set consisting of a tailored single-button blazer and matching wide-leg trousers in breathable linen. Wear as a set for a polished look or mix with other pieces.",
        price: 7490,
        compareAtPrice: 9990,
        imageUrls: [
            "https://images.unsplash.com/photo-1594938374182-0e3f3e6e2c83?w=800&q=80",
            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
        ],
        stock: 20,
        category: "co-ords",
        sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
        name: "Knit Tank & Cardigan Set",
        slug: "knit-tank-cardigan-set",
        description: "A versatile two-piece set featuring a ribbed tank and a matching open-front cardigan. Each piece works independently or together for a cohesive, effortlessly styled look. In a soft, stretchy knit blend.",
        price: 4290,
        compareAtPrice: 5990,
        imageUrls: [
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
            "https://images.unsplash.com/photo-1608228088998-57828365d486?w=800&q=80",
        ],
        stock: 40,
        category: "co-ords",
        sizes: ["XS", "S", "M", "L"],
    },

    // ─── LOUNGEWEAR ────────────────────────────────────────────────────────────
    {
        name: "Relaxed Fit Joggers",
        slug: "relaxed-fit-joggers",
        description: "Premium brushed-fleece joggers with a relaxed, tapered silhouette. Features an elasticated drawstring waist, side seam pockets and ribbed cuffs. Ultra-soft and cosy for lounging or low-key days out.",
        price: 2490,
        compareAtPrice: 3290,
        imageUrls: [
            "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
            "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&q=80",
        ],
        stock: 90,
        category: "lounge",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
        name: "Oversized Hoodie",
        slug: "oversized-hoodie",
        description: "The ultimate cosy staple — an oversized hoodie in heavyweight fleece. A kangaroo front pocket, adjustable drawstring hood and ribbed trims make this a wardrobe essential. Slightly dropped shoulders for a relaxed fit.",
        price: 2990,
        compareAtPrice: 3990,
        imageUrls: [
            "https://images.unsplash.com/photo-1614251055880-ee96e4803393?w=800&q=80",
            "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
        ],
        stock: 75,
        category: "lounge",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },

    // ─── ACCESSORIES ───────────────────────────────────────────────────────────
    {
        name: "Structured Mini Tote Bag",
        slug: "structured-mini-tote-bag",
        description: "A compact, structured tote in pebble-grain PU leather. Features a top handle, a detachable and adjustable shoulder strap, a main zip compartment and an interior slip pocket. Versatile enough to go from day to evening.",
        price: 2990,
        compareAtPrice: 3990,
        imageUrls: [
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
        ],
        stock: 50,
        category: "accessories",
        sizes: ["ONE SIZE"],
    },
    {
        name: "Ribbed Knit Beanie",
        slug: "ribbed-knit-beanie",
        description: "A classic ribbed beanie in a soft, warm acrylic knit. The slouchy, turned-up design sits comfortably on the head and keeps you warm through the cooler months. A versatile accessory that completes any look.",
        price: 790,
        compareAtPrice: 990,
        imageUrls: [
            "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80",
            "https://images.unsplash.com/photo-1542327897-4141b355e8b3?w=800&q=80",
        ],
        stock: 100,
        category: "accessories",
        sizes: ["ONE SIZE"],
    },
];

async function main() {
    console.log(`\n🌱 Seeding ${products.length} products...\n`);

    let created = 0;
    let skipped = 0;

    for (const product of products) {
        try {
            const existing = await prisma.product.findUnique({
                where: { slug: product.slug },
            });

            if (existing) {
                console.log(`⏭  Skipped (already exists): ${product.name}`);
                skipped++;
                continue;
            }

            await prisma.product.create({ data: product });
            console.log(`✅ Created: ${product.name} — INR ${product.price.toLocaleString('en-IN')}`);
            created++;
        } catch (err) {
            console.error(`❌ Failed: ${product.name} — ${err.message}`);
        }
    }

    console.log(`\n✨ Done! Created: ${created}, Skipped: ${skipped}\n`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
