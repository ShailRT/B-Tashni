'use server';
import { updateOrderStatusById, getAllOrders, getOrderById, getUserOrders } from '@/lib/prisma-queries';
import { auth } from '@clerk/nextjs/server';

/**
 * Fetch orders for the current logged-in user
 */
export async function fetchUserOrdersAction(params = {}) {
    try {
        const { userId } = await auth();
        console.log("[fetchUserOrdersAction] userId:", userId);
        if (!userId) throw new Error("Unauthorized");

        const result = await getUserOrders(userId, params);
        console.log("[fetchUserOrdersAction] result.orders count:", result.orders?.length);
        return result;
    } catch (error) {
        console.error("[fetchUserOrdersAction] Error:", error.message);
        return { orders: [], total: 0, error: error.message };
    }
}

/**
 * Update order status (Admin only)
 */
export async function updateOrderAdmin(orderId, status, trackingNumber = null) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        // TODO: Add proper admin check here

        await updateOrderStatusById(orderId, status);

        return { success: true };
    } catch (error) {
        console.error("Update Order Error:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetch all orders for admin dashboard
 */
export async function fetchAllOrders(params) {
    try {
        const { userId } = await auth();
        console.log("[fetchAllOrders] userId:", userId);
        if (!userId) throw new Error("Unauthorized - not signed in");

        const result = await getAllOrders(params);
        console.log("[fetchAllOrders] orders count:", result.orders?.length);
        return result;
    } catch (error) {
        console.error("[fetchAllOrders] Error:", error.message);
        return { success: false, error: error.message, orders: [], total: 0 };
    }
}
