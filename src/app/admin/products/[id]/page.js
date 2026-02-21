'use client';

import { ArrowLeft, Save, Trash2, Image as ImageIcon, Video, Upload, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getProductByIdAction, updateProductAction, deleteProductAction } from '@/app/actions/products';

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const [newSelectedImages, setNewSelectedImages] = useState([]);
    const [newSelectedVideo, setNewSelectedVideo] = useState(null);

    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setNewSelectedImages(prev => [...prev, ...files]);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewSelectedVideo(file);
        }
    };

    const removeNewImage = (index) => {
        setNewSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            const data = await getProductByIdAction(productId);
            if (data) {
                setProduct(data);
            } else {
                setError('Product not found');
            }
            setLoading(false);
        }
        fetchProduct();
    }, [productId]);

    async function handleUpdate(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        // Map UI status to isActive
        const status = formData.get('status');
        formData.set('status', status === 'Active' || status === 'In Stock' ? 'Active' : 'Draft');

        // Combine existing and new mock images
        const existingImages = product.imageUrls || [];
        const mockNewImages = newSelectedImages.map(() => 'https://images.unsplash.com/photo-1523381235212-d70207b7485f?auto=format&fit=crop&q=80&w=2000');

        formData.append('imageUrls', JSON.stringify([...existingImages, ...mockNewImages]));
        formData.append('slug', product.slug);

        const result = await updateProductAction(productId, formData);

        if (result.success) {
            setProduct(result.product);
            setNewSelectedImages([]);
            setNewSelectedVideo(null);
            alert('Product updated successfully');
        } else {
            setError(result.error);
        }
        setSaving(false);
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        setDeleting(true);
        const result = await deleteProductAction(productId);

        if (result.success) {
            router.push('/admin/products');
        } else {
            setError(result.error);
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Loading product details...</p>
            </div>
        );
    }

    if (!product && !loading) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Product not found.</p>
                <Link href="/admin/products" className="text-blue-600 hover:underline mt-4 inline-block">
                    Back to products
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleUpdate} className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Product</h1>
                </div>
                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting || saving}
                        className="inline-flex items-center px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 disabled:opacity-50"
                    >
                        {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="-ml-1 mr-2 h-4 w-4" />}
                        Delete
                    </button>
                    <button
                        type="submit"
                        disabled={saving || deleting}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="-ml-1 mr-2 h-4 w-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Product Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">General Information</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    id="product-name"
                                    name="name"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    defaultValue={product.name}
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    defaultValue={product.description || ''}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Pricing & Inventory</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Base Price</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        required
                                        step="0.01"
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                                        placeholder="0.00"
                                        defaultValue={product.price}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">INR</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
                                <input
                                    type="text"
                                    id="sku"
                                    name="sku"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    defaultValue={product.sku || ''}
                                />
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    defaultValue={product.stock}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Media & Organization */}
                <div className="space-y-6">
                    {/* Media */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Product Media</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Images Section */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Images</label>
                                <input
                                    type="file"
                                    ref={imageInputRef}
                                    onChange={handleImageChange}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div
                                    onClick={() => imageInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors h-40"
                                >
                                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Click to upload images</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {/* Existing Images */}
                                    {product.imageUrls && product.imageUrls.map((img, idx) => (
                                        <div key={`existing-${idx}`} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative group">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] text-white font-medium">Existing</span>
                                            </div>
                                        </div>
                                    ))}
                                    {/* New Images */}
                                    {newSelectedImages.map((file, idx) => {
                                        const url = URL.createObjectURL(file);
                                        return (
                                            <div key={`new-${idx}`} className="aspect-square relative bg-gray-100 rounded-lg border border-blue-200 overflow-hidden group">
                                                <img
                                                    src={url}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                    onLoad={() => URL.revokeObjectURL(url)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-[10px] text-white truncate px-1 py-0.5">
                                                    New: {file.name}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Video Section */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700">Video</label>
                                <div>
                                    <label htmlFor="video-url" className="block text-xs text-gray-500 mb-1">Video URL</label>
                                    <input
                                        type="text"
                                        id="video-url"
                                        name="videoUrl"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="https://..."
                                        defaultValue={product.videoUrl || ''}
                                    />
                                </div>
                                <input
                                    type="file"
                                    ref={videoInputRef}
                                    onChange={handleVideoChange}
                                    accept="video/*"
                                    className="hidden"
                                />
                                <div
                                    onClick={() => videoInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors h-28"
                                >
                                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">
                                        {newSelectedVideo ? `New: ${newSelectedVideo.name}` : (product.videoUrl ? 'Replace current video' : 'Upload video file')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Organization</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                                    defaultValue={product.category || 'Apparel'}
                                >
                                    <option value="Apparel">Apparel</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Footwear">Footwear</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Home">Home</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                                    defaultValue={product.isActive ? 'Active' : 'Draft'}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Draft">Draft</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
