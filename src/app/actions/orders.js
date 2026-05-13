'use server';
import { updateOrderStatusById, getAllOrders, getOrderById, getUserOrders } from '@/lib/prisma-queries';
import { auth } from '@clerk/nextjs/server';

/**
 * Fetch orders for the current logged-in user with automatic Shiprocket sync
 */
export async function fetchUserOrdersAction(params = {}) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const result = await getUserOrders(userId, params);
        
        // Identify orders that need syncing
        const ordersToSync = result.orders.filter(o => 
            o.shiprocketOrderId && 
            ['PROCESSING', 'SHIPPED'].includes(o.status)
        );

        if (ordersToSync.length > 0) {
            try {
                const { getShiprocketToken, getShiprocketOrderStatus } = await import('@/lib/shiprocket');
                const { updateOrderStatusByShiprocketId } = await import('@/lib/prisma-queries');
                
                const token = await getShiprocketToken();
                if (token) {
                    await Promise.allSettled(ordersToSync.map(async (order) => {
                        const statusResult = await getShiprocketOrderStatus(order.shiprocketOrderId, token);
                        if (statusResult.success) {
                            let orderStatus;
                            switch (Number(statusResult.statusCode)) {
                                case 6: case 7: case 24: orderStatus = 'SHIPPED'; break;
                                case 8: orderStatus = 'DELIVERED'; break;
                                case 9: orderStatus = 'CANCELLED'; break;
                                case 25: orderStatus = 'PENDING'; break;
                                default: orderStatus = 'PROCESSING'; break;
                            }
                            
                            if (orderStatus !== order.status) {
                                await updateOrderStatusByShiprocketId(order.shiprocketOrderId, orderStatus, statusResult.trackingNumber);
                                order.status = orderStatus;
                                if (statusResult.trackingNumber) order.trackingNumber = statusResult.trackingNumber;
                            }
                        }
                    }));
                }
            } catch (syncError) {
                console.error("Background sync error in fetchUserOrdersAction:", syncError);
            }
        }

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
 * Fetch all orders for admin dashboard with automatic Shiprocket sync
 */
export async function fetchAllOrders(params) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized - not signed in");

        const result = await getAllOrders(params);
        
        // Identify orders that need syncing (active status and has Shiprocket ID)
        const ordersToSync = result.orders.filter(o => 
            o.shiprocketOrderId && 
            ['PROCESSING', 'SHIPPED'].includes(o.status)
        );

        let syncedCount = 0;
        if (ordersToSync.length > 0) {
            try {
                const { getShiprocketToken, getShiprocketOrderStatus } = await import('@/lib/shiprocket');
                const { updateOrderStatusByShiprocketId } = await import('@/lib/prisma-queries');
                
                const token = await getShiprocketToken();
                if (token) {
                    const syncResults = await Promise.allSettled(ordersToSync.map(async (order) => {
                        const statusResult = await getShiprocketOrderStatus(order.shiprocketOrderId, token);
                        if (statusResult.success) {
                            let orderStatus;
                            switch (Number(statusResult.statusCode)) {
                                case 6: case 7: case 24: orderStatus = 'SHIPPED'; break;
                                case 8: orderStatus = 'DELIVERED'; break;
                                case 9: orderStatus = 'CANCELLED'; break;
                                case 25: orderStatus = 'PENDING'; break;
                                default: orderStatus = 'PROCESSING'; break;
                            }
                            
                            if (orderStatus !== order.status) {
                                await updateOrderStatusByShiprocketId(order.shiprocketOrderId, orderStatus, statusResult.trackingNumber);
                                order.status = orderStatus;
                                if (statusResult.trackingNumber) order.trackingNumber = statusResult.trackingNumber;
                                return true;
                            }
                        }
                        return false;
                    }));

                    syncedCount = syncResults.filter(r => r.status === 'fulfilled' && r.value === true).length;
                }
            } catch (syncError) {
                console.error("Background sync error in fetchAllOrders:", syncError);
            }
        }

        return { ...result, syncedCount };
    } catch (error) {
        console.error("[fetchAllOrders] Error:", error.message);
        return { success: false, error: error.message, orders: [], total: 0, syncedCount: -1 };
    }
}

/**
 * Sync order status with Shiprocket manually
 */
export async function syncOrderWithShiprocket(orderId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const { getShiprocketToken, getShiprocketOrderStatus } = await import('@/lib/shiprocket');
        const { getOrderById, updateOrderStatusByShiprocketId } = await import('@/lib/prisma-queries');

        const order = await getOrderById(orderId);
        if (!order || !order.shiprocketOrderId) {
            throw new Error("Order not found or not synced with Shiprocket");
        }

        const token = await getShiprocketToken();
        if (!token) throw new Error("Failed to authenticate with Shiprocket");

        const result = await getShiprocketOrderStatus(order.shiprocketOrderId, token);
        if (!result.success) throw new Error(result.error);

        // Map status
        let orderStatus;
        switch (Number(result.statusCode)) {
            case 6: case 7: case 24: orderStatus = 'SHIPPED'; break;
            case 8: orderStatus = 'DELIVERED'; break;
            case 9: orderStatus = 'CANCELLED'; break;
            case 25: orderStatus = 'PENDING'; break;
            default: orderStatus = 'PROCESSING'; break;
        }

        await updateOrderStatusByShiprocketId(order.shiprocketOrderId, orderStatus, result.trackingNumber);

        return { success: true, status: orderStatus };
    } catch (error) {
        console.error("Sync Shiprocket Error:", error);
        return { success: false, error: error.message };
    }
}
