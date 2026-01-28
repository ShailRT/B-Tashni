"use client";

import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const FREE_SHIPPING_THRESHOLD = 10000; // INR 10,000 for free shipping

export default function CartSidebar() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate Free Shipping Progress
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountLeft = FREE_SHIPPING_THRESHOLD - cartTotal;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-[70] shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold uppercase tracking-widest text-[#1c1c1c]">
                Cart
              </h2>
              <span className="text-gray-500 text-sm font-medium">
                ({cart.length})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 -mr-2 text-gray-400 hover:text-black hover:rotate-90 transition-all duration-300 hover:cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 pb-6 pt-2">
            <div className="flex items-center justify-center gap-1.5 mb-3 text-[11px] uppercase tracking-wider font-medium text-[#1c1c1c]">
              {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
                <>
                  <span aria-label="party popper" role="img">
                    🎉
                  </span>
                  <span>You've earned free shipping!</span>
                </>
              ) : (
                <>
                  <span>You are</span>
                  <span className="font-bold">
                    INR {amountLeft.toLocaleString("en-IN")}
                  </span>
                  <span>away from free shipping</span>
                </>
              )}
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pb-20">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium tracking-wide uppercase text-[#1c1c1c]">
                  Your cart is empty
                </p>
                <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                  Looks like you haven't added anything to your cart yet.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full max-w-[240px] bg-black text-white text-xs font-bold uppercase py-4 hover:opacity-90 transition-opacity tracking-[0.2em]"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize || "nosize"}`}
                  className="group flex gap-5 border-b border-gray-100 pb-6 last:border-0"
                >
                  <div className="w-[110px] aspect-[3/4] bg-gray-50 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <Link
                          href={`/product/${item.handle || "#"}`}
                          onClick={() => setIsCartOpen(false)}
                        >
                          <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#1c1c1c] hover:underline cursor-pointer leading-tight">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex flex-col gap-0.5 text-[11px] text-gray-500 uppercase tracking-widest font-medium">
                          {item.color && <span>{item.color}</span>}
                          {item.selectedSize && (
                            <span>Size: {item.selectedSize}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-[13px] font-medium tracking-wide text-[#1c1c1c]">
                        {item.price}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border border-gray-200 h-8">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[11px] font-bold w-8 text-center bg-transparent">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-6 bg-white border-t border-gray-100 space-y-4 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
          {/* Subtotal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold uppercase tracking-widest text-[#1c1c1c]">
                Subtotal
              </span>
              <span className="text-[13px] font-bold tracking-wide">
                INR{" "}
                {cartTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider text-right">
              Shipping & taxes calculated at checkout
            </p>
          </div>

          {/* Checkout Button */}
          <button
            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#2d2a26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cart.length === 0}
          >
            Check out
          </button>
        </div>
      </div>
    </>
  );
}
