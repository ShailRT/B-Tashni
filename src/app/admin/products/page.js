'use client';

import { Search, Filter, Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductsPage() {
    const [products] = useState([
        { id: 'ripped-effect-jumper', name: 'RIPPED-EFFECT JUMPER', category: 'Apparel', price: '₹4,350.00', stock: 50, status: 'In Stock', imageUrl: "https://static.zara.net/assets/public/945c/d53d/637e48c8ac93/74c682976cd1/03166400681-e1/03166400681-e1.jpg?ts=1768903698978&w=2400" },
        { id: 1, name: 'Premium Cotton T-Shirt', category: 'Apparel', price: '₹45.00', stock: 120, status: 'In Stock', image: 'bg-blue-100' },
        { id: 2, name: 'Slim Fit Jeans', category: 'Apparel', price: '₹120.00', stock: 45, status: 'Low Stock', image: 'bg-indigo-100' },
        { id: 3, name: 'Wireless Headphones', category: 'Electronics', price: '₹250.00', stock: 0, status: 'Out of Stock', image: 'bg-purple-100' },
        { id: 4, name: 'Leather Wallet', category: 'Accessories', price: '₹65.00', stock: 80, status: 'In Stock', image: 'bg-orange-100' },
        { id: 5, name: 'Running Shoes', category: 'Footwear', price: '₹110.00', stock: 32, status: 'Low Stock', image: 'bg-green-100' },
        { id: 6, name: 'Smart Watch', category: 'Electronics', price: '₹350.00', stock: 15, status: 'In Stock', image: 'bg-teal-100' },
        { id: 7, name: 'Ceramic Mug', category: 'Home', price: '₹25.00', stock: 200, status: 'In Stock', image: 'bg-red-100' },
        { id: 8, name: 'Backpack', category: 'Accessories', price: '₹85.00', stock: 55, status: 'In Stock', image: 'bg-yellow-100' },
    ]);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        {/* Image Placeholder or Actual Image */}
                        <div className={`aspect-square w-full rounded-t-xl overflow-hidden ${product.imageUrl ? '' : product.image} flex items-center justify-center relative`}>
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 font-medium text-lg opacity-50">{product.category}</span>
                            )}
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
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
                                <p className="text-lg font-bold text-gray-900">{product.price}</p>
                                <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${product.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                                    product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {product.status}
                                </span>
                            </div>

                            <div className="mt-2 text-xs text-gray-500">
                                {product.stock} units in stock
                            </div>
                        </div>

                        {/* Actions overlay on hover (optional enhancement - currently just card link) */}
                    </div>
                ))}
            </div>
        </div>
    );
}
