'use client';

import { ArrowLeft, Save, Package, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProductAction } from '@/app/actions/products';

export default function CreateProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newImages = files.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
            setSelectedImages(prev => [...prev, ...newImages]);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (selectedVideo?.preview) {
                URL.revokeObjectURL(selectedVideo.preview);
            }
            const videoWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file)
            });
            setSelectedVideo(videoWithPreview);
        }
    };

    const removeImage = (index) => {
        const imageToRemove = selectedImages[index];
        if (imageToRemove?.preview) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeVideo = () => {
        if (selectedVideo?.preview) {
            URL.revokeObjectURL(selectedVideo.preview);
        }
        setSelectedVideo(null);
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            selectedImages.forEach(file => {
                if (file.preview) URL.revokeObjectURL(file.preview);
            });
            if (selectedVideo?.preview) {
                URL.revokeObjectURL(selectedVideo.preview);
            }
        };
    }, [selectedImages, selectedVideo]);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        selectedImages.forEach((file) => {
            formData.append('images', file);
        });

        if (selectedVideo) {
            formData.append('video', selectedVideo);
        }

        const result = await createProductAction(formData);

        if (result.success) {
            router.push('/admin/products');
        } else {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add New Product</h1>
                </div>
                {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Product Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center">
                            <Package className="mr-2 h-4 w-4 text-gray-500" />
                            <h3 className="font-semibold text-gray-900">Product Information</h3>
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
                                    placeholder="e.g. Premium Cotton T-Shirt"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Product description..."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
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
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">INR</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Sizes (comma separated)</label>
                                <input
                                    type="text"
                                    id="sizes"
                                    name="sizes"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="S, M, L, XL"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Organization & Media */}
                <div className="space-y-6">
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
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Active">Active</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
                                <input
                                    type="text"
                                    id="sku"
                                    name="sku"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="SKU-12345"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Product Images</h3>
                        </div>
                        <div className="p-6 space-y-4">
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
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors h-48"
                            >
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Click to upload image</span>
                            </div>

                            {selectedImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    {selectedImages.map((file, idx) => {
                                        return (
                                            <div key={idx} className="aspect-square relative bg-gray-100 rounded-lg group overflow-hidden border border-gray-200">
                                                <img
                                                    src={file.preview}
                                                    alt="preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white truncate px-1 py-0.5">
                                                    {file.name}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-gray-900">Product Video</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label htmlFor="video-url" className="block text-sm font-medium text-gray-700">Video URL</label>
                                <input
                                    type="text"
                                    id="video-url"
                                    name="videoUrl"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                            {selectedVideo ? (
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-2">
                                    <video
                                        src={selectedVideo.preview}
                                        className="w-full h-48 object-cover rounded-md"
                                        controls
                                    />
                                    <button
                                        type="button"
                                        onClick={removeVideo}
                                        className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <div className="mt-2 flex items-center justify-between px-2">
                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                            {selectedVideo.name}
                                        </p>
                                        <span className="text-[10px] font-medium bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                            Ready to upload
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => videoInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors h-32"
                                >
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Click to upload video</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="lg:col-span-3 flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Link
                        href="/admin/products"
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="-ml-1 mr-2 h-4 w-4" />
                                Create Product
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
