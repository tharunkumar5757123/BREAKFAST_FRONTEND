// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCart, saveCart, clearCart as clearLocalCart } from "../utils/cartUtils";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getCart());

  // 🧠 Sync cart whenever login/logout or other tab updates localStorage
  useEffect(() => {
    const syncCart = () => setCart(getCart());
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  // ✅ Add item to user’s own cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p._id === item._id);
      const updated = existing
        ? prevCart.map((p) =>
            p._id === item._id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
          )
        : [...prevCart, { ...item, quantity: 1 }];
      saveCart(updated);
      return updated;
    });
  };

  // ✅ Remove item from user’s own cart
  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    saveCart(updated);
    setCart(updated);
  };

  // ✅ Clear current user’s cart completely
  const clearCart = () => {
    clearLocalCart();
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
