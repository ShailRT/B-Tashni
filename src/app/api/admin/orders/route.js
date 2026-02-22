import { NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/prisma-queries';

// NOTE: For MVP/dev purposes auth check is relaxed here.
// Add proper admin role check before going to production.
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status') || null;

        const result = await getAllOrders({ page, limit, status });
        return NextResponse.json(result);
    } catch (error) {
        console.error('[API /api/admin/orders] Error:', error.message);
        return NextResponse.json({ error: error.message, orders: [], total: 0 }, { status: 500 });
    }
}
