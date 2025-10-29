// src/utils/cartUtils.js
export const getCartKey = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? `cart_${user._id}` : "guest_cart"; // ✅ each user gets unique key
};

export const getCart = () => {
  const key = getCartKey();
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const saveCart = (cart) => {
  const key = getCartKey();
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("storage")); // ✅ update other tabs/components
};

export const clearCart = () => {
  const key = getCartKey();
  localStorage.removeItem(key);
  window.dispatchEvent(new Event("storage"));
};
