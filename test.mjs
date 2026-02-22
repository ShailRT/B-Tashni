import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();
    console.log(products.map(p => ({ id: p.id, imageUrls: p.imageUrls })));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
