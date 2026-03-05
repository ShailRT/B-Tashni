'use client';

import { ArrowLeft, Save, Trash2, Image as ImageIcon, Video, Upload, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getProductByIdAction, updateProductAction, deleteProductAction } from '@/app/actions/products';

import { upload } from '@vercel/blob/client';

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const [newSelectedImages, setNewSelectedImages] = useState([]);
    const [existingImageUrls, setExistingImageUrls] = useState([]);
    const [newSelectedVideo, setNewSelectedVideo] = useState(null);
    const [videoUrlInput, setVideoUrlInput] = useState('');
    const [videoUrlError, setVideoUrlError] = useState(false);

    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newImages = files.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
            setNewSelectedImages(prev => [...prev, ...newImages]);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (newSelectedVideo?.preview) {
                URL.revokeObjectURL(newSelectedVideo.preview);
            }
            const videoWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file)
            });
            setNewSelectedVideo(videoWithPreview);
        }
    };

    const removeNewImage = (index) => {
        setNewSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewVideo = () => {
        if (newSelectedVideo?.preview) {
            URL.revokeObjectURL(newSelectedVideo.preview);
        }
        setNewSelectedVideo(null);
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    const removeExistingVideo = () => {
        setVideoUrlInput('');
        setVideoUrlError(false);
    };

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            const data = await getProductByIdAction(productId);
            if (data) {
                console.log(data)
                setProduct(data);
                setExistingImageUrls(data.imageUrls || []);
                setVideoUrlInput(data.videoUrl || '');
            } else {
                setError('Product not found');
            }
            setLoading(false);
        }
        fetchProduct();
    }, [productId, uploading]);

    // Cleanup object URLs
    useEffect(() => {
        return () => {
            newSelectedImages.forEach(file => {
                if (file.preview) URL.revokeObjectURL(file.preview);
            });
            if (newSelectedVideo?.preview) {
                URL.revokeObjectURL(newSelectedVideo.preview);
            }
        };
    }, [newSelectedImages, newSelectedVideo]);

    async function handleUpdate(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);

            // 1. Upload new images to Vercel Blob
            setUploading(true);
            const uploadedImageUrls = [];
            for (const file of newSelectedImages) {
                const blob = await upload(file.name, file, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                uploadedImageUrls.push(blob.url);
            }

            // 2. Combine with remaining existing images
            const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls];

            // 3. Upload video if new one selected
            let finalVideoUrl = formData.get('videoUrl') || product.videoUrl || '';
            if (newSelectedVideo) {
                const blob = await upload(newSelectedVideo.name, newSelectedVideo, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                finalVideoUrl = blob.url;
            }
            setUploading(false);

            // 4. Prepare data for server action
            const productData = {
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')),
                sizesStr: formData.get('sizes'),
                trendingSection: formData.get('trendingSection') === 'true',
                homeVideoSection: formData.get('homeVideoSection') === 'true',
                imageUrls: finalImageUrls,
                videoUrl: finalVideoUrl,
                status: formData.get('status'),
                slug: product.slug
            };

            const result = await updateProductAction(productId, productData);

            if (result.success) {
                setProduct(result.product);
                setNewSelectedImages([]);
                setNewSelectedVideo(null);
                alert('Product updated successfully');
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Update failed:', err);
            setError('Failed to upload files. Please try again.');
            setUploading(false);
        } finally {
            setSaving(false);
        }
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
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                {uploading ? 'Uploading Files...' : 'Saving Changes...'}
                            </>
                        ) : (
                            <>
                                <Save className="-ml-1 mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
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

                            <div>
                                <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Sizes (comma separated)</label>
                                <input
                                    type="text"
                                    id="sizes"
                                    name="sizes"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    defaultValue={product.sizes ? product.sizes.join(', ') : ''}
                                    placeholder="S, M, L, XL"
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
                                    {existingImageUrls.map((img, idx) => (
                                        <div key={`existing-${idx}`} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative group">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <span className="text-[10px] text-white font-medium">Existing Image</span>
                                            </div>
                                        </div>
                                    ))}
                                    {/* New Images */}
                                    {newSelectedImages.map((file, idx) => {
                                        return (
                                            <div key={`new-${idx}`} className="aspect-square relative bg-gray-100 rounded-lg border border-blue-200 overflow-hidden group">
                                                <img
                                                    src={file.preview}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
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
                                        value={videoUrlInput}
                                        onChange={(e) => { setVideoUrlInput(e.target.value); setVideoUrlError(false); }}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="https://..."
                                    />
                                </div>

                                <input
                                    type="file"
                                    ref={videoInputRef}
                                    onChange={handleVideoChange}
                                    accept="video/*"
                                    className="hidden"
                                />

                                {/* Upload zone — always visible */}
                                <div
                                    onClick={() => videoInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors h-28"
                                >
                                    <Upload className="h-6 w-6 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">
                                        {newSelectedVideo ? 'Change video file' : (product.videoUrl ? 'Replace current video' : 'Upload video file')}
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">File overrides URL above</span>
                                </div>

                                {/* Preview card — file takes priority over URL */}
                                {(newSelectedVideo || videoUrlInput) && (
                                    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group">
                                        {!videoUrlError ? (
                                            <video
                                                key={newSelectedVideo ? newSelectedVideo.preview : videoUrlInput}
                                                src={newSelectedVideo ? newSelectedVideo.preview : videoUrlInput}
                                                className="w-full h-48"
                                                controls
                                                playsInline
                                                crossOrigin="anonymous"
                                                onError={() => !newSelectedVideo && setVideoUrlError(true)}
                                            />
                                        ) : (
                                            <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-200 text-gray-500 text-sm gap-2">
                                                <span>⚠️ Cannot preview this URL in browser</span>
                                                <a
                                                    href={videoUrlInput}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline text-xs truncate max-w-[80%]"
                                                >
                                                    Open video in new tab
                                                </a>
                                            </div>
                                        )}
                                        {/* Remove button for existing video (only if no new video selected) */}
                                        {!newSelectedVideo && videoUrlInput && (
                                            <button
                                                type="button"
                                                onClick={removeExistingVideo}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                        {/* Remove button for NEW video */}
                                        {newSelectedVideo && (
                                            <button
                                                type="button"
                                                onClick={removeNewVideo}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white truncate px-2 py-1">
                                            {newSelectedVideo ? `New: ${newSelectedVideo.name}` : `Currently: ${videoUrlInput}`}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Organization & Sections */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Organization & Sections</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Home Page Sections</label>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            id="trending-section"
                                            name="trendingSection"
                                            type="checkbox"
                                            value="true"
                                            defaultChecked={product.trendingSection}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="trending-section" className="ml-2 block text-sm text-gray-900">
                                            Show in Trending Section
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="home-video-section"
                                            name="homeVideoSection"
                                            type="checkbox"
                                            value="true"
                                            defaultChecked={product.homeVideoSection}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="home-video-section" className="ml-2 block text-sm text-gray-900">
                                            Show in Home Video Section
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 italic">
                                        Note: A maximum of 4 products can be active in each section.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
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
