import Link from "next/link";
import { XCircle, ShoppingBag, ArrowLeft } from "lucide-react";

export default function OrderCancelPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-white px-6">
            <div className="max-w-xl mx-auto text-center space-y-8">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-[#1c1c1c]">
                        Order Cancelled
                    </h1>
                    <p className="text-gray-500 text-sm tracking-wide">
                        The checkout process was cancelled. No payment has been debited from your account.
                    </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg text-left max-w-sm mx-auto">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#1c1c1c] mb-2">
                        Possible reasons:
                    </p>
                    <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                        <li>Payment window was closed manually</li>
                        <li>Authentication failure at your bank</li>
                        <li>Insufficient funds or card decline</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-10">
                    <Link
                        href="/checkout"
                        className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#2d2a26] transition-colors"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Return to Cart
                    </Link>
                    <Link
                        href="/"
                        className="w-full border border-gray-200 text-[#1c1c1c] py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
