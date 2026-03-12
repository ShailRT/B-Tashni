import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

/**
 * Prisma Client with Neon Serverless Adapter (WebSocket)
 *
 * PrismaNeon accepts a connection config object and creates the pool internally.
 * Uses WebSocket (via ws in Node.js) for reliable Neon cold-start handling.
 */

function createPrismaClient() {
    // Required for Node.js environments (Next.js server-side)
    neonConfig.webSocketConstructor = ws;

    const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
}

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
