export const products = [
  {
    id: "ripped-effect-jumper",
    title: "RIPPED-EFFECT JUMPER",
    price: "4,350.00 INR",
    reference: "3166/400/681",
    description:
      "Loose-fitting jumper made of spun cotton fabric. Round neck and long sleeves. Ripped details. Ribbed trims.",
    color: "Burgundy",
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://static.zara.net/assets/public/945c/d53d/637e48c8ac93/74c682976cd1/03166400681-e1/03166400681-e1.jpg?ts=1768903698978&w=2400",
      "https://static.zara.net/assets/public/fb03/7ea5/1f334de4b536/ddf9af08fed7/03166400681-e2/03166400681-e2.jpg?ts=1768903700215&w=2400",
      "https://static.zara.net/assets/public/8958/d65b/f8b0454e8a6d/081a5658d796/03166400681-p/03166400681-p.jpg?ts=1768991989967&w=2400",
      "https://static.zara.net/assets/public/9733/1f22/3cea4c1aae52/260ed7402f97/03166400681-a1/03166400681-a1.jpg?ts=1768991987948&w=2400",
      "https://static.zara.net/assets/public/7cdb/1152/48124746a37f/0ce3e74ab825/03166400681-a2/03166400681-a2.jpg?ts=1768991987669&w=2400",
      "https://static.zara.net/assets/public/b7cf/ed30/0e66429b816d/f6f94bd90e11/03166400681-a3/03166400681-a3.jpg?ts=1768991989832&w=2400",
      "https://static.zara.net/assets/public/3ad7/9a48/b61f4e88a08d/2082b7406133/03166400681-a4/03166400681-a4.jpg?ts=1768991984653&w=2400",
    ],
    composition: {
      outerShell: "100% cotton",
      care: "Machine wash at max. 30ºC/86ºF with short spin cycle. Do not use bleach. Iron at a maximum of 110ºC/230ºF.",
    },
    matchWith: [
      {
        slug: "wide-leg-jeans",
        name: "WIDE LEG JEANS",
        image:
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1973&auto=format&fit=crop",
        price: "2,990.00 INR",
      },
      {
        slug: "leather-boots",
        name: "LEATHER BOOTS",
        image:
          "https://images.unsplash.com/photo-1542280756-74c2f5511915?q=80&w=2000&auto=format&fit=crop",
        price: "7,990.00 INR",
      },
    ],
  },
  {
    id: "wide-leg-jeans",
    title: "WIDE LEG JEANS",
    price: "2,990.00 INR",
    reference: "8273/102",
    description:
      "High-waist jeans with a five-pocket design. Faded effect. Seamless hem. Front zip and metal button closure.",
    color: "Blue",
    sizes: ["32", "34", "36", "38", "40"],
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1973&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584370848010-d7cc637703ef?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582562124811-28ec3290647e?q=80&w=1974&auto=format&fit=crop",
    ],
    composition: {
      outerShell: "100% cotton",
      care: "Machine wash max 40C.",
    },
    matchWith: [
      {
        slug: "ripped-effect-jumper",
        name: "RIPPED EFFECT JUMPER",
        image:
          "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
        price: "3,590.00 INR",
      },
    ],
  },
];

export function getProductBySlug(slug) {
  return products.find((p) => p.id === slug);
}
