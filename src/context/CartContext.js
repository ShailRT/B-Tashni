"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error("Failed to parse cart from local storage:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const stockLimit = Number(product.stock ?? product.available ?? Infinity);
      const maxQuantity = Number.isFinite(stockLimit) ? Math.max(0, stockLimit) : Infinity;

      if (existingItem) {
        if (existingItem.quantity >= maxQuantity) {
          return prevCart;
        }

        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, maxQuantity) }
            : item,
        );
      }

      if (maxQuantity < 1) {
        return prevCart;
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== productId) return item;
        const stockLimit = Number(item.stock ?? item.available ?? Infinity);
        const maxQuantity = Number.isFinite(stockLimit) ? Math.max(0, stockLimit) : Infinity;
        const updatedQuantity = Math.min(quantity, maxQuantity);
        return { ...item, quantity: updatedQuantity };
      }),
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = (Array.isArray(cart) ? cart : []).reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartTotal = (Array.isArray(cart) ? cart : []).reduce((total, item) => {
    const priceString = String(item.price);
    // Remove "INR", spaces, commas to get raw number string (e.g. "4500.00")
    const cleanPriceString = priceString.replace(/[^0-9.]/g, "");
    const price = parseFloat(cleanPriceString);
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
