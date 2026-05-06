'use client';

import { Search, Filter, Plus, MoreVertical, Loader2, Image as ImageIcon, Trash2, ExternalLink, Eye, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { getAdminProductsAction, deleteProductAction } from '@/app/actions/products';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('0');
    const [maxPrice, setMaxPrice] = useState('20000');
    const [sort, setSort] = useState('newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeDropdownId, setActiveDropdownId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);


    async function fetchProducts() {
        setLoading(true);
        const result = await getAdminProductsAction({
            search,
            minPrice: minPrice !== '0' ? minPrice : undefined,
            maxPrice: maxPrice !== '20000' ? maxPrice : undefined,
            sort
        });
        if (result && result.products) {
            setProducts(result.products);
        }
        setLoading(false);
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, minPrice, maxPrice, sort]);


    const handleDelete = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        setProductToDelete(id);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        setDeletingId(productToDelete);
        const result = await deleteProductAction(productToDelete);

        if (result.success) {
            setProducts(products.filter(p => p.id !== productToDelete));
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } else {
            alert(result.error || 'Failed to delete product');
        }

        setDeletingId(null);
        setProductToDelete(null);
        setActiveDropdownId(null);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdownId(null);
        if (activeDropdownId) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeDropdownId]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500">Manage your products and inventory</p>
                </div>
                <Link href="/admin/products/create" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm items-center">
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full h-11 pl-10 pr-3 border border-gray-200 rounded-xl text-sm bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            placeholder="Search products..."
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="block w-full sm:w-auto h-11 pl-3 pr-10 text-sm border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl border bg-gray-50/50 hover:bg-gray-100/50 transition-all cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>

                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`inline-flex items-center h-11 px-4 border border-gray-200 shadow-sm text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${isFilterOpen ? 'bg-gray-100 border-gray-400' : 'bg-gray-50/50 hover:bg-gray-100/50'}`}
                        >
                            <Filter className={`-ml-1 mr-2 h-4 w-4 ${isFilterOpen ? 'text-black' : 'text-gray-400'}`} />
                            <span className="hidden sm:inline">{isFilterOpen ? 'Hide Filters' : 'Price Filter'}</span>
                            <span className="sm:hidden">Filters</span>
                            {(minPrice !== '0' || maxPrice !== '20000') && (
                                <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                        </button>
                    </div>
                </div>


                {isFilterOpen && (
                    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-top-2 duration-200">
                        <div className="max-w-md">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-900">Price Range</h4>
                                <button
                                    onClick={() => { setMinPrice('0'); setMaxPrice('20000'); }}
                                    className="text-xs text-blue-600 hover:underline font-medium"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-8 px-2">
                                <div className="relative h-1.5 w-full bg-gray-100 rounded-full">
                                    <div
                                        className="absolute h-full bg-blue-600 rounded-full"
                                        style={{
                                            left: `${(Number(minPrice) / 20000) * 100}%`,
                                            right: `${100 - (Number(maxPrice) / 20000) * 100}%`
                                        }}
                                    />

                                    <input
                                        type="range"
                                        min="0"
                                        max="20000"
                                        step="100"
                                        className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none cursor-pointer z-20 accent-blue-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(Math.min(Number(e.target.value), Number(maxPrice) - 500).toString())}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="20000"
                                        step="100"
                                        className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none cursor-pointer z-10 accent-blue-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), Number(minPrice) + 500).toString())}
                                    />

                                    <div
                                        className="absolute -top-7 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded transform -translate-x-1/2 pointer-events-none"
                                        style={{ left: `${(Number(minPrice) / 20000) * 100}%` }}
                                    >
                                        ₹{minPrice}
                                    </div>
                                    <div
                                        className="absolute -top-7 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded transform -translate-x-1/2 pointer-events-none"
                                        style={{ left: `${(Number(maxPrice) / 20000) * 100}%` }}
                                    >
                                        ₹{maxPrice}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Min Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                className="w-full text-sm pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Max Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                className="w-full text-sm pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* Products Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Loading products...</p>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const mainImage = product.imageUrls?.[0] || product.images?.[0];
                        return (
                            <div key={product.id} className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-square w-full rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center relative">
                                    {mainImage ? (
                                        <Image
                                            src={mainImage}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <ImageIcon className="h-10 w-10 text-gray-300 mb-2" />
                                            <span className="text-gray-400 font-medium text-xs opacity-50 uppercase tracking-widest">Product</span>
                                        </div>
                                    )}
                                    {!product.isActive && (
                                        <div className="absolute top-2 right-2 bg-gray-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                                            DRAFT
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0 pr-2">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {product.name}
                                                </Link>
                                            </h3>
                                        </div>

                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setActiveDropdownId(activeDropdownId === product.id ? null : product.id);
                                                }}
                                                className="text-gray-400 hover:text-gray-500 z-10 relative p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                {deletingId === product.id ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <MoreVertical className="h-5 w-5" />
                                                )}
                                            </button>

                                            {activeDropdownId === product.id && (
                                                <div
                                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 overflow-hidden transition-all transform origin-top-right"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Link
                                                        href={`/product/${product.slug}`}
                                                        target="_blank"
                                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Eye className="mr-3 h-4 w-4" />
                                                        Visit Product
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Filter className="mr-3 h-4 w-4" />
                                                        Edit Details
                                                    </Link>
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    <button
                                                        onClick={(e) => handleDelete(e, product.id)}
                                                        disabled={deletingId === product.id}
                                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                    >
                                                        <Trash2 className="mr-3 h-4 w-4" />
                                                        Delete Product
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-lg font-bold text-gray-900">₹{product.price?.toLocaleString()}</p>
                                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' :
                                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                                        <span>{product.stock} units in stock</span>
                                    </div>
                                    {product.sizes && product.sizes.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {product.sizes.map(size => (
                                                <span key={size} className="bg-gray-100 text-gray-700 text-[10px] px-1.5 py-0.5 rounded border border-gray-200 uppercase">
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No products found. Add your first product to get started.</p>
                    <Link href="/admin/products/create" className="mt-4 inline-flex items-center text-blue-600 hover:underline">
                        <Plus className="h-4 w-4 mr-1" />
                        Create a product
                    </Link>
                </div>
            )}

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10">
                        <div className="bg-green-500 rounded-full p-1">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-bold">Success!</p>
                            <p className="text-xs text-gray-400">Product deleted successfully</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowSuccess(false)}
                            className="ml-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {productToDelete && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this product? This action cannot be undone and will remove the product from your store.
                            </p>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setProductToDelete(null)}
                                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={deletingId}
                                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {deletingId ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
