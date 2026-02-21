'use server';

import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsAdmin,
    getProductById,
    generateUniqueSlug
} from '@/lib/prisma-queries';
import { revalidatePath } from 'next/cache';

export async function createProductAction(formData) {
    try {
        const name = formData.get('name');
        const description = formData.get('description');
        const price = formData.get('price');
        const stock = formData.get('stock');
        const category = formData.get('category');
        const videoUrl = formData.get('videoUrl');
        const imageUrls = JSON.parse(formData.get('imageUrls') || '[]');
        const isActive = formData.get('status') === 'Active';

        const slug = await generateUniqueSlug(name);

        const product = await createProduct({
            name,
            slug,
            description,
            price,
            stock,
            category,
            imageUrls,
            videoUrl,
            isActive
        });

        revalidatePath('/admin/products');
        return { success: true, product };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: error.message };
    }
}

export async function updateProductAction(id, formData) {
    try {
        const name = formData.get('name');
        const description = formData.get('description');
        const price = formData.get('price');
        const stock = formData.get('stock');
        const category = formData.get('category');
        const videoUrl = formData.get('videoUrl');
        const imageUrls = JSON.parse(formData.get('imageUrls') || '[]');
        const isActive = formData.get('status') === 'Active';
        const slug = formData.get('slug') || await generateUniqueSlug(name);

        const product = await updateProduct(id, {
            name,
            slug,
            description,
            price,
            stock,
            category,
            imageUrls,
            videoUrl,
            isActive
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
