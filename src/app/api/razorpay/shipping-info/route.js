import { NextResponse } from 'next/server';
import { updateOrderAddressByRazorpayId } from '@/lib/prisma-queries';

/**
 * Razorpay Magic Checkout Shipping Info API
 * This endpoint is called by Razorpay when a user selects or adds an address
 * It allows us to save the address and provide shipping options
 */
export async function POST(req) {
    try {
        const data = await req.json();
        console.log("Razorpay Shipping Info received:", JSON.stringify(data, null, 2));

        // razorpayOrderId is standard, but some versions might use order_id
        const razorpayOrderId = data.order_id || data.razorpay_order_id;
        const shippingAddress = data.shipping_address;

        if (!razorpayOrderId || !shippingAddress) {
            return NextResponse.json({ error: "Missing order_id or shipping_address" }, { status: 400 });
        }

        // 1. Map the address to our preferred format or just store it as is (since shippingAddress is Json in Prisma)
        const formattedAddress = {
            fullName: `${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}`.trim(),
            email: shippingAddress.email,
            phone: shippingAddress.contact,
            addressLine1: shippingAddress.line1,
            addressLine2: shippingAddress.line2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            country: shippingAddress.country,
            pincode: shippingAddress.pincode,
            type: shippingAddress.type, // e.g., 'home', 'work'
        };

        // 2. Update the order in our database
        await updateOrderAddressByRazorpayId(razorpayOrderId, formattedAddress);

        // 3. Respond with shipping options as per Razorpay requirements
        // You can customize these based on the address (e.g., zip code based pricing)
        return NextResponse.json({
            shipping_options: [
                {
                    id: "standard",
                    name: "Standard Delivery",
                    amount: 0, // In paise (0 = Free)
                    description: "Delivered in 3-5 business days"
                },
                {
                    id: "express",
                    name: "Express Delivery",
                    amount: 15000, // INR 150.00 in paise
                    description: "Delivered in 1-2 business days"
                }
            ],
            cod_available: true // Set to false if you don't want to support COD for this address
        });
    } catch (error) {
        console.error("Razorpay Shipping Info API Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}
