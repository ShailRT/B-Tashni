import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();
    for (const product of products) {
        if (product.imageUrls.some(u => u.includes('1523381235212-d70207b7485f'))) {
            const fixedUrls = product.imageUrls.map(u => u.replace('1523381235212-d70207b7485f', '1515886657613-9f3515b0c78f'));
            await prisma.product.update({
                where: { id: product.id },
                data: { imageUrls: fixedUrls }
            });
            console.log(`Updated product: ${product.name}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
