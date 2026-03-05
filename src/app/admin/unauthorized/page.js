import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-center">
                    <div className="p-4 bg-red-50 rounded-full">
                        <ShieldAlert className="w-12 h-12 text-red-600" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-[20px] font-bold uppercase tracking-[0.2em] text-black">
                        Access Restricted
                    </h1>
                    <p className="text-[13px] text-gray-500 font-light leading-relaxed">
                        You do not have administrative privileges to access this area. If you believe this is an error, please contact the system administrator.
                    </p>
                </div>

                <div className="flex flex-col gap-4 pt-8">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-black/90 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>
                    <button
                        className="text-[10px] text-gray-400 uppercase tracking-widest font-light hover:text-black transition-colors"
                        onClick={() => window.location.href = '/sign-in'}
                    >
                        Try another account
                    </button>
                </div>
            </div>
        </div>
    );
}
