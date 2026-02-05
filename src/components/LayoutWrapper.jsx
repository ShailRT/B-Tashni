'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdmin = pathname && pathname.startsWith('/admin');

    return (
        <>
            {!isAdmin && <Navbar />}
            {!isAdmin && <CartSidebar />}
            {children}
            {!isAdmin && <Footer />}
        </>
    );
}
