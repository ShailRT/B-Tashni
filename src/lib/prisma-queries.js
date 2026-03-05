/**
 * Prisma Query Examples for B-Tashni E-commerce
 * 
 * This file contains common database operations you'll need.
 * Import prisma from '@/lib/prisma' to use these patterns.
 */

import prisma from '@/lib/prisma';

// ==================== USER OPERATIONS ====================

/**
 * Create user record when they sign up via Clerk
 * Only stores clerkId and role - Clerk manages all other user data (name, email, image)
 */
/**
 * Sync user record when they sign up or log in
 * We use the Clerk ID as our internal primary key ID
 */
export async function syncUserFromClerk(clerkUser) {
    const { id, emailAddresses, firstName, lastName, imageUrl } = clerkUser;
    const email = emailAddresses?.[0]?.emailAddress;

    return await prisma.user.upsert({
        where: { id: id },
        update: {
            email,
            firstName: firstName,
            lastName: lastName,
            imageUrl: imageUrl,
        },
        create: {
            id: id,
            email,
            firstName: firstName,
            lastName: lastName,
            imageUrl: imageUrl,
            role: 'CUSTOMER',
        },
    });
}

/**
 * Get user by ID with their orders
 */
export async function getUserById(id) {
    return await prisma.user.findUnique({
        where: { id },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                take: 5,
            },
        },
    });
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(id) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: { role: true },
    });
    return user?.role === 'ADMIN';
}

// ==================== PRODUCT OPERATIONS ====================

/**
 * Get all active products with pagination
 */
export async function getProducts({ page = 1, limit = 12 } = {}) {
    const skip = (page - 1) * limit;

    const where = {
        isActive: true,
    };

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
    };
}

/**
 * Get multiple products by their IDs
 */
export async function getProductsByIds(ids) {
    if (!ids || ids.length === 0) return [];
    return await prisma.product.findMany({
        where: {
            id: { in: ids },
            isActive: true
        }
    });
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(slug) {
    if (!slug) return null;
    return await prisma.product.findUnique({
        where: { slug: String(slug) },
    });
}

/**
 * Create new product (admin only)
 */
export async function createProduct(data) {
    return await prisma.product.create({
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            price: parseFloat(data.price),
            compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
            sizes: data.sizes || [],
            stock: parseInt(data.stock),
            imageUrls: data.imageUrls,
            videoUrl: data.videoUrl,
            trendingSection: data.trendingSection || false,
            homeVideoSection: data.homeVideoSection || false,
        },
    });
}

/**
 * Update product stock
 */
export async function updateProductStock(productId, quantity, operation = 'decrement') {
    return await prisma.product.update({
        where: { id: productId },
        data: {
            stock: {
                [operation]: quantity,
            },
        },
    });
}

/**
 * Get single product by ID
 */
export async function getProductById(id) {
    return await prisma.product.findUnique({
        where: { id },
    });
}

/**
 * Update existing product (admin only)
 */
export async function updateProduct(id, data) {
    return await prisma.product.update({
        where: { id },
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            price: parseFloat(data.price),
            compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
            sizes: data.sizes || [],
            stock: parseInt(data.stock),
            imageUrls: data.imageUrls,
            videoUrl: data.videoUrl,
            isActive: data.isActive,
            trendingSection: data.trendingSection,
            homeVideoSection: data.homeVideoSection,
        },
    });
}

/**
 * Delete product (admin only)
 */
export async function deleteProduct(id) {
    return await prisma.product.delete({
        where: { id },
    });
}

/**
 * Get all products for admin view (including inactive ones)
 */
export async function getProductsAdmin({ page = 1, limit = 50, search = '' } = {}) {
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ],
    } : {};

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
    };
}

/**
 * Search products
 */
export async function searchProducts(query, filters = {}) {
    const { minPrice, maxPrice, sort } = filters;

    const where = {
        isActive: true,
        ...(query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
        } : {}),
        ...(minPrice || maxPrice ? {
            price: {
                ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
                ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
            }
        } : {})
    };

    let orderBy = {};
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    return await prisma.product.findMany({
        where,
        orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
        take: 50,
    });
}



// ==================== ORDER OPERATIONS ====================

/**
 * Create new order with items
 */
export async function createOrder(userId, orderData) {
    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Verify all products exist before creating order (Prevents P2003 from stale storage)
    const productIds = orderData.items.map((item) => item.originalId || item.productId);
    const uniqueIds = [...new Set(productIds)];
    const existingProducts = await prisma.product.findMany({
        where: { id: { in: uniqueIds } },
        select: { id: true },
    });

    if (existingProducts.length !== uniqueIds.length) {
        throw new Error("One or more products in your cart are no longer available. Please clear your cart and try again.");
    }

    return await prisma.$transaction(async (tx) => {
        // Create the order with items
        const order = await tx.order.create({
            data: {
                orderNumber,
                totalAmount: orderData.totalAmount,
                // Use the relation shorthand for better handling of guest checkouts
                ...(userId && { user: { connect: { id: userId } } }),
                shippingAddress: orderData.shippingAddress,
                billingAddress: orderData.billingAddress,
                razorpayOrderId: orderData.razorpayOrderId,
                razorpayPaymentId: orderData.razorpayPaymentId,
                paymentMethod: orderData.paymentMethod,
                items: {
                    create: orderData.items.map((item) => ({
                        productId: item.originalId || item.productId, // Use originalId if available, otherwise productId
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        // Decrease stock for each product
        for (const item of orderData.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: {
                    stock: { decrement: item.quantity },
                },
            });
        }

        return order;
    });
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
        }),
        prisma.order.count({ where: { userId } }),
    ]);

    return {
        orders,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
    };
}


/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(orderId, status, trackingNumber = null) {
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            status,
            ...(trackingNumber && { trackingNumber }),
        },
    });
}

/**
 * Update order status based on ID
 */
export async function updateOrderStatusById(orderId, status) {
    return await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });
}

/**
 * Update order with refund information
 */
export async function updateOrderRefund(orderId, refundData) {
    const { refundId, refundStatus, status } = refundData;
    return await prisma.order.update({
        where: { id: orderId },
        data: {
            refundId,
            refundStatus,
            paymentStatus: refundStatus === 'FULL' ? 'REFUNDED' : 'PAID',
            status: status || undefined,
        },
    });
}


/**
 * Get order by ID
 */
export async function getOrderById(id) {
    return await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            items: {
                include: { product: true },
            },
        },
    });
}

/**
 * Update order status based on Razorpay Order ID
 * @param {string} razorpayOrderId - Razorpay Order ID
 * @param {object} updateData - Data to update (status, paymentId, etc)
 */
export async function updateOrderStatusByRazorpayId(razorpayOrderId, updateData) {
    const { status, paymentId } = updateData;

    return await prisma.order.update({
        where: { razorpayOrderId },
        data: {
            paymentStatus: status, // status here is PAID from webhook
            ...(paymentId && { razorpayPaymentId: paymentId }),
            ...(status === 'PAID' && { status: 'PROCESSING' }), // Move from PENDING to PROCESSING if paid
        },
    });
}

/**
 * Update order address based on Razorpay Order ID (for Magic Checkout)
 * @param {string} razorpayOrderId - Razorpay Order ID
 * @param {object} addressData - Detailed address data
 */
export async function updateOrderAddressByRazorpayId(razorpayOrderId, addressData) {
    return await prisma.order.update({
        where: { razorpayOrderId },
        data: {
            shippingAddress: addressData,
        },
    });
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders({ page = 1, limit = 20, status = null } = {}) {
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                user: true,
                items: {
                    include: { product: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
        }),
        prisma.order.count({ where }),
    ]);

    console.log(`getAllOrders: status=${status}, found=${orders.length}, total=${total}`);
    return {
        orders,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
    };
}


// ==================== ANALYTICS & STATS ====================

/**
 * Get dashboard stats (admin only)
 */
export async function getDashboardStats() {
    const [
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        lowStockProducts,
    ] = await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.order.aggregate({
            where: { paymentStatus: 'PAID' },
            _sum: { totalAmount: true },
        }),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.product.count({
            where: {
                isActive: true,
                stock: { lte: 10 },
            },
        }),
    ]);

    return {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingOrders,
        lowStockProducts,
    };
}

/**
 * Get recent orders (admin dashboard)
 */
export async function getRecentOrders(limit = 5) {
    return await prisma.order.findMany({
        include: {
            user: true,
            items: {
                include: { product: true },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}

/**
 * Get top selling products
 */
export async function getTopSellingProducts(limit = 10) {
    const result = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: 'desc',
            },
        },
        take: limit,
    });

    // Fetch product details
    const productIds = result.map((item) => item.productId);
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
    });

    // Combine results
    return result.map((item) => ({
        product: products.find((p) => p.id === item.productId),
        totalSold: item._sum.quantity,
    }));
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check if slug is unique
 */
export async function isSlugUnique(slug, model = 'product', excludeId = null) {
    const where = {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
    };

    const count = await prisma[model].count({ where });
    return count === 0;
}

/**
 * Generate unique slug
 */
export async function generateUniqueSlug(name, model = 'product') {
    let slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    let counter = 1;
    let uniqueSlug = slug;

    while (!(await isSlugUnique(uniqueSlug, model))) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}


