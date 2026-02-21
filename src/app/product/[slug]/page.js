import { getProductBySlug } from "@/lib/prisma-queries";
import ProductView from "@/components/ProductView";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  return (
    <main>
      <ProductView product={product} />
    </main>
  );
}
