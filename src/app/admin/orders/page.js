"use client";

import { useEffect, useState } from "react";
import { updateOrderAdmin } from "@/app/actions/orders";
import { processRefund } from "@/app/actions/checkout";
import {
    Package,
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Truck,
    RefreshCcw,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const loadOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "10",
                ...(status !== "all" && { status }),
            });
            const res = await fetch(`/api/admin/orders?${params}`);
            const result = await res.json();
            if (!res.ok) {
                setError(result.error || "Failed to load orders");
            } else {
                setOrders(result.orders || []);
                setTotal(result.total || 0);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [page, status]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        const result = await updateOrderAdmin(orderId, newStatus);
        if (result.success) {
            loadOrders();
            if (selectedOrder?.id === orderId) setSelectedOrder(null);
        } else {
            alert(result.error);
        }
    };

    const handleRefund = async (order) => {
        if (!confirm("Are you sure you want to refund this order? This will process the refund via Razorpay.")) return;

        const result = await processRefund(order.id, order.razorpayPaymentId);
        if (result.success) {
            alert("Refund processed successfully!");
            loadOrders();
        } else {
            alert(result.error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING": return "bg-yellow-100 text-yellow-800";
            case "PROCESSING": return "bg-blue-100 text-blue-800";
            case "SHIPPED": return "bg-purple-100 text-purple-800";
            case "DELIVERED": return "bg-green-100 text-green-800";
            case "CANCELLED": return "bg-red-100 text-red-800";
            case "REFUNDED": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
                    <p className="text-sm text-gray-500">Manage and track customer purchases</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm items-center">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="block w-full h-11 pl-10 pr-10 border border-gray-200 rounded-xl text-sm bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all"
                    />
                </div>

                <div className="relative min-w-[160px]">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="appearance-none block w-full h-11 pl-10 pr-10 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-gray-50/50 hover:bg-gray-100/50 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="REFUNDED">Refunded</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                                            <p>Loading orders...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-red-500">Error: {error}</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No orders found</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900">{order.orderNumber}</span>
                                                <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900">{order.user?.firstName || "Guest"} {order.user?.lastName || ""}</span>
                                                <span className="text-sm text-gray-500">{order.user?.email || "No Email"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                            ₹{order.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page * 10 >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{orders.length}</span> of <span className="font-medium">{total}</span> orders
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    disabled={page * 10 >= total}
                                    onClick={() => setPage(p => p + 1)}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedOrder(null)} />

                    <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-[#1c1c1c]">Order {selectedOrder.orderNumber}</h2>
                                <p className="text-xs text-gray-500">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <XCircle className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {/* Items */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                <img src={item.product?.imageUrls?.[0] || ""} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-[#1c1c1c]">{item.product?.name || "Deleted Product"}</p>
                                                <p className="text-[10px] text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                            </div>
                                            <p className="text-sm font-medium">₹{(item.quantity * item.price).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status Controls */}
                            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Change Status</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleUpdateStatus(selectedOrder.id, 'PROCESSING')}
                                            className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-bold uppercase tracking-tighter hover:bg-blue-100 transition-colors"
                                        >
                                            <Truck className="w-4 h-4" /> Processing
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPED')}
                                            className="flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-xl text-[10px] font-bold uppercase tracking-tighter hover:bg-purple-100 transition-colors"
                                        >
                                            <Package className="w-4 h-4" /> Shipped
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedOrder.id, 'DELIVERED')}
                                            className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-[10px] font-bold uppercase tracking-tighter hover:bg-green-100 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Delivered
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                                            className="flex items-center justify-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-[10px] font-bold uppercase tracking-tighter hover:bg-red-100 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" /> Cancel
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Payments</h3>
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                            Status: <span className="font-bold text-black">{selectedOrder.paymentStatus}</span>
                                        </p>
                                        {selectedOrder.refundStatus && (
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                                Refund: <span className="font-bold text-blue-600">{selectedOrder.refundStatus}</span>
                                            </p>
                                        )}

                                        {selectedOrder.paymentStatus === 'PAID' && (
                                            <button
                                                onClick={() => handleRefund(selectedOrder)}
                                                className="w-full flex items-center justify-center gap-2 p-3 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-black transition-colors"
                                            >
                                                <RefreshCcw className="w-4 h-4" /> Issue Full Refund
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
