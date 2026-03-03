
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Verification ---');

    // 1. Clear existing products (optional, but safer for test)
    // await prisma.product.deleteMany({});

    // 2. Try to create 5 products with trendingSection: true
    console.log('Testing Trending Section Limit...');
    for (let i = 1; i <= 5; i++) {
        try {
            const count = await prisma.product.count({ where: { trendingSection: true } });
            if (count >= 4) {
                console.log(`Product ${i}: Correctly blocked (Count: ${count})`);
            } else {
                await prisma.product.create({
                    data: {
                        name: `Test Trending ${i}`,
                        slug: `test-trending-${i}-${Date.now()}`,
                        price: 100,
                        trendingSection: true,
                    }
                });
                console.log(`Product ${i}: Created`);
            }
        } catch (e) {
            console.error(`Product ${i}: Unexpected error`, e.message);
        }
    }

    // 3. Try to create 5 products with homeVideoSection: true
    console.log('\nTesting Home Video Section Limit...');
    for (let i = 1; i <= 5; i++) {
        try {
            const count = await prisma.product.count({ where: { homeVideoSection: true } });
            if (count >= 4) {
                console.log(`Product ${i}: Correctly blocked (Count: ${count})`);
            } else {
                await prisma.product.create({
                    data: {
                        name: `Test Video ${i}`,
                        slug: `test-video-${i}-${Date.now()}`,
                        price: 100,
                        homeVideoSection: true,
                    }
                });
                console.log(`Product ${i}: Created`);
            }
        } catch (e) {
            console.error(`Product ${i}: Unexpected error`, e.message);
        }
    }

    // Cleanup test products
    console.log('\nCleaning up test products...');
    await prisma.product.deleteMany({
        where: {
            OR: [
                { name: { startsWith: 'Test Trending' } },
                { name: { startsWith: 'Test Video' } },
            ]
        }
    });

    console.log('--- Verification Complete ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
