import { NextResponse } from 'next/server';
import { updateOrderStatusByShiprocketId } from '@/lib/prisma-queries';

/**
 * Shiprocket Webhook Handler
 * This endpoint receives status updates from Shiprocket
 * You must configure this URL in Shiprocket Dashboard -> Settings -> API -> Webhooks
 */
export async function POST(req) {
    try {
        const body = await req.json();
        console.log('Shiprocket Webhook Received:', body);

        // Shiprocket sends status updates in this format:
        // {
        //   "order_id": "123456",
        //   "shipment_id": "789012",
        //   "status": "shipped",
        //   "status_code": 6,
        //   "tracking_number": "AWB123456",
        //   ...
        // }

        const { order_id, status_code, tracking_number } = body;

        if (!order_id) {
            return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
        }

        // Map Shiprocket status codes to our OrderStatus enum
        let orderStatus;
        
        switch (Number(status_code)) {
            case 6: // Shipped
            case 7: // Out for Delivery
            case 24: // In Transit
                orderStatus = 'SHIPPED';
                break;
            case 8: // Delivered
                orderStatus = 'DELIVERED';
                break;
            case 9: // Cancelled
                orderStatus = 'CANCELLED';
                break;
            case 25: // Pending
                orderStatus = 'PENDING';
                break;
            default:
                // For other statuses, we might want to keep it as PROCESSING 
                // or just ignore if it's already at a further stage
                orderStatus = 'PROCESSING';
                break;
        }

        // Update the order in our database
        await updateOrderStatusByShiprocketId(order_id, orderStatus, tracking_number);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Shiprocket Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
