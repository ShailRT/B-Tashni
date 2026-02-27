const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products`);
    products.forEach(p => {
        console.log(`Product: ${p.name}, Images: ${JSON.stringify(p.imageUrls)}, Price: ${p.price}`);
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
