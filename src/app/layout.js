import { Inter, Oswald } from "next/font/google"; // Import Oswald
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ClerkProvider } from '@clerk/nextjs'
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" }); // Configure Oswald

export const metadata = {
  title: "B-Tashni | Elegance in Every Thread",
  description: "Discover the latest collection of premium apparel from B-Tashni.",
};

import UserSync from "@/components/UserSync";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${oswald.variable} font-sans`}>
        <ClerkProvider
          appearance={{
            variables: { colorPrimary: '#000000' },
            elements: {
              modalContent: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'auto',
                width: 'auto',
              },
            }
          }}
        >
          <UserSync />
          <CartProvider>
            <SearchProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </SearchProvider>
          </CartProvider>
        </ClerkProvider>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
