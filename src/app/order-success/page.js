"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@clerk/nextjs";

function SuccessContent() {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear the cart on successful order
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen pt-32 pb-20 bg-white px-6">
            <div className="max-w-xl mx-auto text-center space-y-8">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-[#1c1c1c]">
                        Payment Successful
                    </h1>
                    <p className="text-gray-500 text-sm tracking-wide">
                        Thank you for your purchase. Your order has been received and is being processed.
                    </p>
                </div>

                {orderId && (
                    <div className="bg-gray-50 p-6 rounded-lg space-y-2 inline-block w-full max-w-sm">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                            Order ID
                        </p>
                        <p className="text-sm font-mono font-bold text-[#1c1c1c] break-all">
                            {orderId}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 pt-10">
                    {user && (
                        <Link
                            href="/account/orders"
                            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#2d2a26] transition-colors"
                        >
                            <Package className="w-4 h-4" />
                            View My Orders
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="w-full border border-gray-200 text-[#1c1c1c] py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        Continue Shopping
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="pt-32 text-center uppercase tracking-widest font-bold">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
