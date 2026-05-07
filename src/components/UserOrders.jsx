"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Package,
  ExternalLink,
  RefreshCcw,
  AlertCircle,
  XCircle,
  CreditCard,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { fetchUserOrdersAction } from "../app/actions/orders";

// Module-level cache — survives component unmount/remount cycles
// (Clerk's UserButton fully unmounts profile pages on dropdown close)
let _cachedOrders = null;
let _isFetching = false;
let _selectedOrder = null;

export default function UserOrders() {
  const [orders, setOrders] = useState(_cachedOrders || []);
  const [loading, setLoading] = useState(_cachedOrders === null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_cachedOrders !== null) {
      setOrders(_cachedOrders);
      setLoading(false);
      return; // Don't fetch if we have cached data
    }

    const loadOrders = async () => {
      if (_isFetching) return; // Prevent duplicate fetches
      _isFetching = true;
      
      try {
        const result = await fetchUserOrdersAction();
        const fetched = result.orders || [];
        _cachedOrders = fetched; // Update cache
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

  const [selectedOrder, setSelectedOrderState] = useState(_selectedOrder);

  const setSelectedOrder = (order) => {
    _selectedOrder = order;
    setSelectedOrderState(order);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-50 text-green-700 border-green-100";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-100";
      case "REFUNDED":
        return "bg-gray-50 text-gray-700 border-gray-100";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  if (selectedOrder) {
    return (
      <div className="w-full animate-in fade-in duration-200">
        <div className="mb-2 flex items-center gap-4">
          <button 
            onClick={() => setSelectedOrder(null)}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-black flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-[1.125rem] font-bold text-[#11181C]">Order {selectedOrder.orderNumber}</h2>
        </div>
        <div className="mt-4 mb-6 h-[1px] w-full bg-[#EEEEF0]" />

        <div className="space-y-6 pb-8">
          {/* Order Status Summary */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border ${getStatusStyles(selectedOrder.status)}`}>
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 leading-none mb-1">Status</p>
                <p className="text-xs font-bold text-[#11181C]">{selectedOrder.status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 leading-none mb-1">Placed on</p>
              <p className="text-xs font-bold text-[#11181C]">
                {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <ShoppingBag className="w-3 h-3" /> Items ({selectedOrder.items.length})
            </h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all">
                  <div className="w-14 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                    <img 
                      src={item.product?.imageUrls?.[0] || ""} 
                      alt="" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <button 
                      onClick={() => {
                        setSelectedOrder(null);
                        window.location.href = `/product/${item.product?.slug || ""}`;
                      }}
                      className="hover:underline text-left"
                    >
                      <p className="text-xs font-bold text-[#11181C] uppercase tracking-tight">{item.product?.name || "Product"}</p>
                    </button>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-[#11181C]">₹{(item.quantity * item.price).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Grid: Shipping & Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Shipping Info */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Shipping Address
              </h3>
              <div className="text-xs text-[#11181C] leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100 h-[140px]">
                <p className="font-bold mb-1">
                  {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                </p>
                <p>{selectedOrder.shippingAddress?.address}</p>
                {selectedOrder.shippingAddress?.apartment && (
                  <p>{selectedOrder.shippingAddress.apartment}</p>
                )}
                <p>
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.pincode}
                </p>
                <p className="mt-2 text-gray-500 font-medium">{selectedOrder.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> Payment Details
              </h3>
              <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100 h-[140px]">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total Amount</p>
                  <p className="text-xs font-bold text-[#11181C]">₹{selectedOrder.totalAmount.toLocaleString("en-IN")}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Status</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${selectedOrder.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Method</p>
                  <p className="text-[10px] font-bold uppercase">{selectedOrder.paymentMethod || 'Online Payment'}</p>
                </div>
                {selectedOrder.razorpayPaymentId && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Payment ID</p>
                    <p className="text-[10px] font-mono text-gray-400">{selectedOrder.razorpayPaymentId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-[0.8125rem] text-gray-500">
              Loading your orders...
            </p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-[0.8125rem] text-red-500">{error}</p>
            <p className="text-[0.75rem] text-gray-400 mt-1">
              Please sign in to view your orders.
            </p>
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
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex-1 flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-[0.8125rem] font-bold text-[#11181C]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border ${getStatusStyles(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[0.8125rem] text-[#687076] line-clamp-1 italic">
                      {order.items
                        .map((i) => i.product?.name || "Product")
                        .join(", ")}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 -mr-2 text-[#687076] hover:text-[#11181C] transition-colors"
                  >
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
            <p className="text-[0.8125rem] font-medium text-[#687076]">
              No orders found yet.
            </p>
            <p className="text-[0.75rem] text-gray-400 mt-1">
              Start shopping to see your history here.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
        <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <p className="text-[0.75rem] text-[#687076] leading-relaxed">
          Orders are typically processed within 24 hours. For tracking
          assistance or returns, please contact our 24/7 support team.
        </p>
      </div>
    </div>
  );
}
