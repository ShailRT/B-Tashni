"use client";

import { ShoppingBag, Package, ExternalLink } from "lucide-react";

/**
 * Mock data for the orders matching the style of Clerk's account settings.
 */
const MOCK_ORDERS = [
    {
        id: "ORD-7721",
        date: "Feb 1, 2024",
        total: "$128.00",
        status: "Delivered",
        items: "Fits Everybody T-Shirt, Cotton Jersey Boy Short",
    },
    {
        id: "ORD-8812",
        date: "Jan 15, 2024",
        total: "$85.00",
        status: "Shipped",
        items: "Soft Lounge Long Sleeve Dress",
    },
];

export default function UserOrders() {
    return (
        <div className="w-full">
            {/* Header section matching Clerk style */}
            <div className="mb-2">
                <h2 className="text-[1.125rem] font-bold text-[#11181C]">Orders</h2>
                <div className="mt-4 h-[1px] w-full bg-[#EEEEF0]" />
            </div>

            {/* Orders List */}
            <div className="space-y-1">
                {MOCK_ORDERS.length > 0 ? (
                    MOCK_ORDERS.map((order, index) => (
                        <div key={order.id} className="group">
                            <div className="flex flex-col py-4 sm:flex-row sm:items-start sm:gap-12">
                                {/* Label / ID column */}
                                <div className="w-full sm:w-1/3 mb-1 sm:mb-0">
                                    <p className="text-[0.8125rem] font-medium text-[#11181C]">
                                        Order {order.id}
                                    </p>
                                </div>

                                {/* Content column */}
                                <div className="flex-1 flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-[0.8125rem] text-[#687076]">
                                                {order.date} • {order.total}
                                            </p>
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${order.status === 'Delivered'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-[0.8125rem] text-[#687076] line-clamp-1">
                                            {order.items}
                                        </p>
                                    </div>

                                    <button className="p-2 -mr-2 text-[#687076] hover:text-[#11181C] transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Divider - show for all but last if wanted, but Clerk usually has them all except maybe the very last section */}
                            {index !== MOCK_ORDERS.length - 1 && (
                                <div className="h-[1px] w-full bg-[#EEEEF0]" />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center border-2 border-dashed border-[#EEEEF0] rounded-lg">
                        <ShoppingBag className="w-8 h-8 text-[#687076] mx-auto mb-2 opacity-50" />
                        <p className="text-[0.8125rem] text-[#687076]">No orders found yet.</p>
                    </div>
                )}
            </div>

            {/* Footer Divider (Clerk style) */}
            <div className="mt-8 h-[1px] w-full bg-[#EEEEF0]" />

            <div className="mt-8">
                <p className="text-[0.75rem] text-[#687076]">
                    For order assistance, please reach out to our support team.
                </p>
            </div>
        </div>
    );
}
