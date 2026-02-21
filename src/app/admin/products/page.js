'use client';

import { Search, Filter, Plus, MoreVertical, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getAdminProductsAction } from '@/app/actions/products';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const result = await getAdminProductsAction({ search });
            if (result && result.products) {
                setProducts(result.products);
            }
            setLoading(false);
        }
        fetchProducts();
    }, [search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Products</h1>
                <Link href="/admin/products/create" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Plus className="-ml-1 mr-2 h-4 w-4" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition duration-150 ease-in-out"
                        placeholder="Search products..."
                    />
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Filter className="-ml-1 mr-2 h-4 w-4 text-gray-400" />
                    More Filters
                </button>
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
                                            <span className="text-gray-400 font-medium text-xs opacity-50 uppercase tracking-widest">{product.category || 'Product'}</span>
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
                                            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-500 z-10 relative">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
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

                                    <div className="mt-2 text-xs text-gray-500">
                                        {product.stock} units in stock
                                    </div>
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
        </div>
    );
}
