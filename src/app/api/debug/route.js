import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const count = await prisma.product.count();
        return NextResponse.json({ success: true, productCount: count, env: process.env.NODE_ENV });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
