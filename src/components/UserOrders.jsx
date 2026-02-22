"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Package, ExternalLink, RefreshCcw, AlertCircle } from "lucide-react";
import { fetchUserOrdersAction } from "@/app/actions/orders";

// Module-level cache — survives component unmount/remount cycles
// (Clerk's UserButton fully unmounts profile pages on dropdown close)
let _cachedOrders = null;
let _isFetching = false;

export default function UserOrders() {
    const [orders, setOrders] = useState(_cachedOrders || []);
    const [loading, setLoading] = useState(_cachedOrders === null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If we already have cached data, use it immediately
        if (_cachedOrders !== null) {
            setOrders(_cachedOrders);
            setLoading(false);
            return;
        }
        // If another instance is already fetching, wait for it
        if (_isFetching) return;

        _isFetching = true;
        const loadOrders = async () => {
            try {
                const result = await fetchUserOrdersAction();
                const fetched = result.orders || [];
                _cachedOrders = fetched; // Cache at module level
                setOrders(fetched);
                if (result.error && fetched.length === 0) {
                    setError(result.error);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
                _isFetching = false;
            }
        };
        loadOrders();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'CANCELLED':
                return 'bg-red-50 text-red-700 border-red-100';
            case 'REFUNDED':
                return 'bg-gray-50 text-gray-700 border-gray-100';
            default:
                return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-2">
                <h2 className="text-[1.125rem] font-bold text-[#11181C]">Orders</h2>
                <div className="mt-4 h-[1px] w-full bg-[#EEEEF0]" />
            </div>

            {/* Orders List */}
            <div className="space-y-1">
                {loading ? (
                    <div className="py-12 text-center">
                        <RefreshCcw className="w-6 h-6 text-gray-400 mx-auto animate-spin mb-2" />
                        <p className="text-[0.8125rem] text-gray-500">Loading your orders...</p>
                    </div>
                ) : error ? (
                    <div className="py-12 text-center">
                        <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                        <p className="text-[0.8125rem] text-red-500">{error}</p>
                        <p className="text-[0.75rem] text-gray-400 mt-1">Please sign in to view your orders.</p>
                    </div>
                ) : orders.length > 0 ? (
                    orders.map((order, index) => (
                        <div key={order.id} className="group">
                            <div className="flex flex-col py-6 sm:flex-row sm:items-start sm:gap-12">
                                <div className="w-full sm:w-1/3 mb-1 sm:mb-0">
                                    <p className="text-[0.8125rem] font-bold text-[#11181C] uppercase tracking-wider">
                                        {order.orderNumber}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="flex-1 flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <p className="text-[0.8125rem] font-bold text-[#11181C]">
                                                ₹{order.totalAmount.toLocaleString('en-IN')}
                                            </p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-[0.8125rem] text-[#687076] line-clamp-1 italic">
                                            {order.items.map(i => i.product?.name || "Product").join(", ")}
                                        </p>
                                    </div>
                                    <button className="p-2 -mr-2 text-[#687076] hover:text-[#11181C] transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {index !== orders.length - 1 && (
                                <div className="h-[1px] w-full bg-[#EEEEF0]" />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center border-2 border-dashed border-[#EEEEF0] rounded-2xl">
                        <ShoppingBag className="w-10 h-10 text-[#687076] mx-auto mb-3 opacity-20" />
                        <p className="text-[0.8125rem] font-medium text-[#687076]">No orders found yet.</p>
                        <p className="text-[0.75rem] text-gray-400 mt-1">Start shopping to see your history here.</p>
                    </div>
                )}
            </div>

            <div className="mt-8 h-[1px] w-full bg-[#EEEEF0]" />
            <div className="mt-8 flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-[0.75rem] text-[#687076] leading-relaxed">
                    Orders are typically processed within 24 hours. For tracking assistance or returns, please contact our 24/7 support team.
                </p>
            </div>
        </div>
    );
}
