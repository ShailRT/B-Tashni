'use server';

import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsAdmin,
    getProductBySlug,
    getProductById,
    getProductsByIds,
    generateUniqueSlug,
    searchProducts,
    getProducts
} from '@/lib/prisma-queries';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

// Removed uploadFiles logic as we now use cloud storage (Vercel Blob)

export async function searchProductsAction(query, filters = {}) {
    try {
        if (!query && Object.keys(filters).length === 0) return [];
        return await searchProducts(query, filters);
    } catch (error) {
        console.error('Error in searchProductsAction:', error);
        return [];
    }
}

export async function getProductsAction(params = {}) {
    try {
        const { products } = await getProducts(params);
        return products || [];
    } catch (error) {
        console.error('Error in getProductsAction:', error);
        return [];
    }
}

async function generateUniqueSku(name) {
    const cleanName = name ? name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() : 'PROD';
    let sku = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 15) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
        sku = `${cleanName}-${randomNum}-${randomSuffix}`;

        const existing = await prisma.product.findUnique({
            where: { sku }
        });
        if (!existing) {
            isUnique = true;
        }
        attempts++;
    }

    if (!isUnique) {
        sku = `${cleanName}-${Date.now()}`;
    }
    return sku;
}

export async function createProductAction(data) {
    try {
        const {
            name,
            description,
            price,
            stock,
            sizesStr,
            trendingSection,
            homeVideoSection,
            imageUrls,
            videoUrl,
            status
        } = data;

        const sizes = sizesStr ? sizesStr.split(',').map(s => s.trim()).filter(Boolean) : [];

        // Validation: Max 4 products per section
        if (trendingSection) {
            const count = await prisma.product.count({ where: { trendingSection: true } });
            if (count >= 4) {
                return { success: false, error: 'Maximum 4 products allowed in Trending Section' };
            }
        }

        if (homeVideoSection) {
            const count = await prisma.product.count({ where: { homeVideoSection: true } });
            if (count >= 4) {
                return { success: false, error: 'Maximum 4 products allowed in Home Video Section' };
            }
        }

        const isActive = status === 'Active';
        const slug = await generateUniqueSlug(name);
        const finalSku = await generateUniqueSku(name);

        const product = await createProduct({
            name,
            slug,
            description,
            price,
            stock,
            sizes,
            imageUrls,
            videoUrl,
            isActive,
            trendingSection,
            homeVideoSection,
            sku: finalSku
        });

        revalidatePath('/admin/products');
        return { success: true, product };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: error.message };
    }
}

export async function updateProductAction(id, data) {
    try {
        const {
            name,
            description,
            price,
            stock,
            sizesStr,
            trendingSection,
            homeVideoSection,
            imageUrls,
            videoUrl,
            status,
            slug: existingSlug,
            sku
        } = data;

        const sizes = sizesStr ? sizesStr.split(',').map(s => s.trim()).filter(Boolean) : [];

        // Validation: Max 4 products per section
        if (trendingSection) {
            const count = await prisma.product.count({
                where: {
                    trendingSection: true,
                    id: { not: id }
                }
            });
            if (count >= 4) {
                return { success: false, error: 'Maximum 4 products allowed in Trending Section' };
            }
        }

        if (homeVideoSection) {
            const count = await prisma.product.count({
                where: {
                    homeVideoSection: true,
                    id: { not: id }
                }
            });
            if (count >= 4) {
                return { success: false, error: 'Maximum 4 products allowed in Home Video Section' };
            }
        }

        const isActive = status === 'Active';
        const slug = existingSlug || await generateUniqueSlug(name);

        const product = await updateProduct(id, {
            name,
            slug,
            description,
            price,
            stock,
            sizes,
            imageUrls,
            videoUrl,
            isActive,
            trendingSection,
            homeVideoSection,
            sku
        });

        revalidatePath('/admin/products');
        revalidatePath(`/admin/products/${id}`);
        return { success: true, product };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteProductAction(id) {
    try {
        await deleteProduct(id);
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: error.message };
    }
}

export async function getAdminProductsAction(params) {
    try {
        return await getProductsAdmin(params);
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: error.message };
    }
}

export async function getProductByIdAction(id) {
    try {
        return await getProductById(id);
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function getProductBySlugAction(slug) {
    try {
        return await getProductBySlug(slug);
    } catch (error) {
        console.error('Error fetching product by slug:', error);
        return null;
    }
}

export async function getProductsByIdsAction(ids) {
    try {
        return await getProductsByIds(ids);
    } catch (error) {
        console.error('Error in getProductsByIdsAction:', error);
        return [];
    }
}
