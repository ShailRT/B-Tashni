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
import fs from 'fs';
import path from 'path';

async function uploadFiles(formData, fieldName = 'images') {
    const files = formData.getAll(fieldName);
    const uploadedUrls = [];
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files) {
        if (file && typeof file === 'object' && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const filepath = path.join(uploadDir, filename);
            fs.writeFileSync(filepath, buffer);
            uploadedUrls.push(`/uploads/${filename}`);
        }
    }
    return uploadedUrls;
}

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

export async function createProductAction(formData) {
    try {
        const name = formData.get('name');
        const description = formData.get('description');
        const price = formData.get('price');
        const stock = formData.get('stock');
        const category = formData.get('category');
        const videoUrl = formData.get('videoUrl');
        const sizesStr = formData.get('sizes') || '';
        const sizes = sizesStr.split(',').map(s => s.trim()).filter(Boolean);

        const images = await uploadFiles(formData, 'images');
        const videos = await uploadFiles(formData, 'video');
        const finalVideoUrl = videos.length > 0 ? videos[0] : videoUrl;

        const isActive = formData.get('status') === 'Active';
        const slug = await generateUniqueSlug(name);

        const product = await createProduct({
            name,
            slug,
            description,
            price,
            stock,
            category,
            sizes,
            imageUrls: images,
            videoUrl: finalVideoUrl,
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
        const sizesStr = formData.get('sizes') || '';
        const sizes = sizesStr.split(',').map(s => s.trim()).filter(Boolean);

        const existingImageUrls = JSON.parse(formData.get('existingImageUrls') || '[]');
        const uploadedImages = await uploadFiles(formData, 'images');
        const imageUrls = [...existingImageUrls, ...uploadedImages];

        const uploadedVideos = await uploadFiles(formData, 'video');
        const finalVideoUrl = uploadedVideos.length > 0 ? uploadedVideos[0] : videoUrl;

        const isActive = formData.get('status') === 'Active';
        const slug = formData.get('slug') || await generateUniqueSlug(name);

        const product = await updateProduct(id, {
            name,
            slug,
            description,
            price,
            stock,
            category,
            sizes,
            imageUrls,
            videoUrl: finalVideoUrl,
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
