import { Inter, Oswald } from "next/font/google"; // Import Oswald
import { CartProvider } from "@/context/CartContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" }); // Configure Oswald

export const metadata = {
  title: "SKIMS | Solutions For Every Body",
  description: "Shop the new collection of shapewear, lounge, and underwear.",
};

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
          <CartProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
