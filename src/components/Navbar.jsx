"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const ANNOUNCEMENTS = [
    "FREE SHIPPING ON ALL DOMESTIC ORDERS",
    "EXTENSION OF YOUR EXPRESSION BLUORNG NEW DROP - NOW LIVE",
    "WORLDWIDE SHIPPING AVAILABLE",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setIsAnimating(false);
      }, 700); // Match this with the CSS duration
    }, 4000);
    return () => clearInterval(interval);
  }, [ANNOUNCEMENTS.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white text-[#2d2a26] shadow-sm"
          : "bg-transparent text-[#2d2a26] lg:text-white"
      } ${
        /* Note: Text color on Hero needs to be white, but on other pages or scrolled it is black.
           Our Hero text is white. Navbar is transparent.
           However, on the collection page, the background is white. 
           So transparent navbar on white background = invisible white text.
           This is a design issue.
           For now, let's just make it always black on scroll, and white on top ONLY if we are on home. 
           But easier fix: "mix-blend-difference" or just use a dark navbar.
           Let's stick to the current logic but be aware.
           The original code had `text-white`. I will keep it for now but maybe I should check if we are on home page?
           */
        ""
      }`}
    >
      <div className="bg-black text-white text-[10px] font-bold text-center tracking-widest uppercase w-full overflow-hidden h-8 relative z-50">
        <div
          className={`flex flex-col transition-transform ease-out ${
            isAnimating
              ? "duration-700 -translate-y-1/2"
              : "duration-0 translate-y-0"
          }`}
        >
          <div className="h-8 flex items-center justify-center w-full">
            {ANNOUNCEMENTS[currentAnnouncement]}
          </div>
          <div className="h-8 flex items-center justify-center w-full">
            {ANNOUNCEMENTS[(currentAnnouncement + 1) % ANNOUNCEMENTS.length]}
          </div>
        </div>
      </div>

      <div
        className={`container mx-auto px-6 flex items-center justify-between transition-all duration-300 ${
          isScrolled ? "py-4" : "py-6"
        } ${!isScrolled ? "text-white mix-blend-difference" : ""}`}
      >
        {/* using mix-blend-difference to make it visible on both dark and light if possible, or just simplistic approach: text-black always? 
          Original was text-white on top. Let's keep it. 
       */}
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 lg:hidden cursor-pointer" />
          <Link
            href="/"
            className="text-2xl font-black uppercase tracking-tighter"
          >
            SKIMS
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide-custom">
          {[
            "NEW",
            "BESTSELLERS",
            "SHAPEWEAR",
            "UNDERWEAR",
            "LOUNGE",
            "CLOTHING",
          ].map((item) => (
            <Link
              key={item}
              href={`/collections/${item.toLowerCase()}`}
              className="hover:opacity-75 transition-opacity"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right: Utility Icons */}
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 cursor-pointer hover:opacity-75 transition-opacity" />
          <User className="w-5 h-5 cursor-pointer hover:opacity-75 transition-opacity" />
          <div
            className="relative cursor-pointer hover:opacity-75 transition-opacity"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
