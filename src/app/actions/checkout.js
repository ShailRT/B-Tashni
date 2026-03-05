'use server';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { updateOrderStatusByRazorpayId, createOrder, updateOrderRefund } from '@/lib/prisma-queries';
import { auth } from '@clerk/nextjs/server';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Initializes a Razorpay order
 * @param {number} amount - Amount in INR
 * @returns {Promise<{success: boolean, orderId?: string, error?: string}>}
 */
export async function createRazorpayOrder(amount) {
    try {
        if (!amount || amount <= 0) {
            throw new Error("Invalid amount");
        }

        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        };

        const order = await razorpay.orders.create(options);

        return {
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        };
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Verifies Razorpay payment signature and completes the order
 * @param {object} paymentData - Data from Razorpay checkout handler
 */
export async function verifyAndCompleteOrder(paymentData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        try {
            // Update order in database
            await updateOrderStatusByRazorpayId(razorpay_order_id, {
                status: "PAID",
                paymentId: razorpay_payment_id,
            });

            return { success: true };
        } catch (error) {
            console.error("Order Update Error:", error);
            return { success: false, error: "Payment verified but database update failed." };
        }
    } else {
        return { success: false, error: "Invalid payment signature" };
    }
}

/**
 * Initiates checkout by creating a Razorpay order and a Prisma order
 */
export async function initiateCheckout(orderData) {
    try {
        const { userId } = await auth();
        // Removed: if (!userId) throw new Error("Unauthorized");

        // 1. Create Razorpay Order
        const rzpResult = await createRazorpayOrder(orderData.totalAmount);
        if (!rzpResult.success) throw new Error(rzpResult.error);

        // 2. Create Order in DB
        const fullOrderData = {
            ...orderData,
            razorpayOrderId: rzpResult.orderId,
            paymentMethod: 'razorpay',
        };

        // If userId is null, it will be stored as a guest order
        const dbOrder = await createOrder(userId || null, fullOrderData);

        return {
            success: true,
            orderId: rzpResult.orderId,
            dbOrderId: dbOrder.id,
            amount: rzpResult.amount,
            currency: rzpResult.currency
        };
    } catch (error) {
        console.error("Checkout Initiation Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Processes a refund for an order via Razorpay
 */
export async function processRefund(orderId, razorpayPaymentId, amount = null) {
    try {
        const { userId } = await auth();
        // Here we should check if user is admin, but for now just check if logged in
        if (!userId) throw new Error("Unauthorized");

        const options = {
            ...(amount && { amount: Math.round(amount * 100) }), // amount in paise
        };

        const refund = await razorpay.payments.refund(razorpayPaymentId, options);

        // Update DB
        await updateOrderRefund(orderId, {
            refundId: refund.id,
            refundStatus: amount ? 'PARTIAL' : 'FULL',
            status: amount ? undefined : 'REFUNDED',
        });

        return { success: true, refundId: refund.id };
    } catch (error) {
        console.error("Refund Error:", error);
        return { success: false, error: error.message };
    }
}
