import Link from "next/link";
import { getProducts } from "@/lib/prisma-queries";
import ProductGridClient from "./ProductGridClient";

// Server component — fetches real products when no items prop is passed
export default async function ProductGrid({ items, title = "Trending Now" }) {
  let displayProducts = items;

  if (!displayProducts) {
    const result = await getProducts({ limit: 8 });
    displayProducts = result.products || [];
  }

  return <ProductGridClient products={displayProducts} title={title} />;
}
