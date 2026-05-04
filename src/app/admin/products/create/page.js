'use client';

import { ArrowLeft, Save, Package, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProductAction } from '@/app/actions/products';

import { upload } from '@vercel/blob/client';

export default function CreateProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoUrlInput, setVideoUrlInput] = useState('');
    const [videoUrlError, setVideoUrlError] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});


    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const duplicates = files.filter(file =>
                selectedImages.some(existing => existing.name === file.name && existing.size === file.size)
            );

            if (duplicates.length > 0) {
                setFieldErrors(prev => ({ ...prev, images: `Image "${duplicates[0].name}" is already selected.` }));
                return;
            }

            // Clear image error if any
            setFieldErrors(prev => ({ ...prev, images: null }));

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
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);

        // Re-validate image requirement on removal
        if (updatedImages.length === 0) {
            setFieldErrors(prev => ({ ...prev, images: 'At least one product image is required.' }));
        } else {
            setFieldErrors(prev => ({ ...prev, images: null }));
        }
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

        try {
            const formData = new FormData(e.currentTarget);
            setFieldErrors({});

            // Validation logic
            const errors = {};
            const name = formData.get('name');
            const description = formData.get('description');
            const price = formData.get('price');
            const stock = formData.get('stock');
            const sizes = formData.get('sizes');
            const sku = formData.get('sku');

            if (!name || name.trim().length < 3) errors.name = 'Product name must be at least 3 characters.';
            if (!description || description.trim().length < 10) errors.description = 'Description must be at least 10 characters.';
            if (!price || parseFloat(price) <= 0) errors.price = 'Price must be a positive number.';
            if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) errors.stock = 'Stock cannot be negative.';
            if (!sizes || sizes.trim().length === 0) errors.sizes = 'At least one size is required (e.g. S, M, L).';
            if (!sku || sku.trim().length === 0) errors.sku = 'SKU is required.';
            if (selectedImages.length === 0) errors.images = 'At least one product image is required.';

            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                setLoading(false);
                return;
            }


            // Check for duplicate filenames in the selection before uploading
            const filenames = selectedImages.map(f => f.name);
            const hasDuplicates = filenames.some((name, index) => filenames.indexOf(name) !== index);
            if (hasDuplicates) {
                setError('Duplicate filenames detected. Please ensure all selected images have unique names.');
                setLoading(false);
                return;
            }

            // 1. Upload images to Vercel Blob
            setUploading(true);
            const imageUrls = [];
            for (const file of selectedImages) {
                const blob = await upload(file.name, file, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                imageUrls.push(blob.url);
            }

            // 2. Upload video if exists
            let finalVideoUrl = formData.get('videoUrl') || '';
            if (selectedVideo) {
                const blob = await upload(selectedVideo.name, selectedVideo, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                finalVideoUrl = blob.url;
            }
            setUploading(false);

            // 3. Prepare data for server action
            const productData = {
                name: formData.get('name'),
                description: formData.get('description'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')),
                sizesStr: formData.get('sizes'),
                trendingSection: formData.get('trendingSection') === 'true',
                homeVideoSection: formData.get('homeVideoSection') === 'true',
                imageUrls,
                videoUrl: finalVideoUrl,
                status: formData.get('status')
            };

            const result = await createProductAction(productData);

            if (result.success) {
                router.push('/admin/products');
            } else {
                setError(result.error);
                setLoading(false);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            // More specific error message for potential duplicates
            setError('Upload failed. This usually happens if same image already exists');
            setLoading(false);
            setUploading(false);
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
                                    onChange={() => setFieldErrors(prev => ({ ...prev, name: null }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

                                    placeholder="e.g. Premium Cotton T-Shirt"
                                />
                                {fieldErrors.name && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.name}</p>}
                            </div>


                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    onChange={() => setFieldErrors(prev => ({ ...prev, description: null }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

                                    placeholder="Product description..."
                                />
                                {fieldErrors.description && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.description}</p>}
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
                                            onChange={() => setFieldErrors(prev => ({ ...prev, price: null }))}
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"

                                            placeholder="0.00"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">INR</span>
                                        </div>
                                    </div>
                                    {fieldErrors.price && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.price}</p>}
                                </div>


                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        required
                                        onChange={() => setFieldErrors(prev => ({ ...prev, stock: null }))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="0"
                                    />
                                    {fieldErrors.stock && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.stock}</p>}
                                </div>

                            </div>

                            <div>
                                <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Sizes (comma separated)</label>
                                <input
                                    type="text"
                                    id="sizes"
                                    name="sizes"
                                    onChange={() => setFieldErrors(prev => ({ ...prev, sizes: null }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

                                    placeholder="S, M, L, XL"
                                />
                                {fieldErrors.sizes && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.sizes}</p>}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column - Organization & Media */}
                <div className="space-y-6">
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
                                    onChange={() => setFieldErrors(prev => ({ ...prev, sku: null }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"

                                    placeholder="SKU-12345"
                                />
                                {fieldErrors.sku && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.sku}</p>}
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
                                {fieldErrors.images && <p className="mt-2 text-xs text-red-500 font-medium">{fieldErrors.images}</p>}
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
                                    value={videoUrlInput}
                                    onChange={(e) => { setVideoUrlInput(e.target.value); setVideoUrlError(false); }}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Reset error when URL changes */}
                            {/* videoUrlError resets automatically via key change on video element */}

                            <input
                                type="file"
                                ref={videoInputRef}
                                onChange={handleVideoChange}
                                accept="video/*"
                                className="hidden"
                            />

                            {/* Upload zone — always visible, same as image section */}
                            <div
                                onClick={() => videoInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors h-32"
                            >
                                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">Click to upload video file</span>
                                <span className="text-xs text-gray-400 mt-1">File overrides URL above</span>
                            </div>

                            {/* Preview card — same style as image grid cards */}
                            {(selectedVideo || videoUrlInput) && (
                                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 group">
                                    {!videoUrlError ? (
                                        <video
                                            key={selectedVideo ? selectedVideo.preview : videoUrlInput}
                                            src={selectedVideo ? selectedVideo.preview : videoUrlInput}
                                            className="w-full h-48"
                                            controls
                                            playsInline
                                            crossOrigin="anonymous"
                                            onError={() => !selectedVideo && setVideoUrlError(true)}
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
                                    {selectedVideo && (
                                        <button
                                            type="button"
                                            onClick={removeVideo}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white truncate px-2 py-1">
                                        {selectedVideo ? selectedVideo.name : videoUrlInput}
                                    </div>
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
                        disabled={loading || Object.values(fieldErrors).some(error => error !== null)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (

                            <>
                                <Loader2 className="-ml-1 mr-2 h-4 w-4 animate-spin" />
                                {uploading ? 'Uploading Files...' : 'Creating...'}
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
