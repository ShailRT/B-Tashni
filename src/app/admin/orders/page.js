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
    ChevronRight
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
            case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "PROCESSING": return "bg-blue-100 text-blue-700 border-blue-200";
            case "SHIPPED": return "bg-purple-100 text-purple-700 border-purple-200";
            case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
            case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
            case "REFUNDED": return "bg-gray-100 text-gray-700 border-gray-200";
            default: return "bg-gray-100 text-gray-700 border-gray-100";
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#1c1c1c]">Orders</h1>
                    <p className="text-sm text-gray-500">Manage and track customer purchases</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-black transition-all"
                    />
                </div>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-black transition-all"
                >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="REFUNDED">Refunded</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Order</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Customer</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Total</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading orders...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-red-500">Error: {error}</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No orders found</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#1c1c1c]">{order.orderNumber}</span>
                                                <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-600">{order.user?.firstName || "Unknown"} {order.user?.lastName || ""}</span>
                                                <span className="text-[10px] text-gray-400">{order.user?.email || "No Email"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">₹{order.totalAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <p className="text-xs text-gray-500">Showing {orders.length} of {total} orders</p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page * 10 >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 border border-gray-200 rounded-lg disabled:opacity-30 hover:bg-white transition-all shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
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
