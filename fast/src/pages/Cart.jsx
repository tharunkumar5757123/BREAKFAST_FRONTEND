// src/pages/Cart.jsx
import React from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext"; // ✅ use context instead of utils
import "../App.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, clearCart } = useCart(); // ✅ from context

  // ➕ Increase quantity
  const handleIncrease = (id) => {
    const item = cart.find((p) => p._id === id);
    if (item) addToCart(item); // ✅ just reuse addToCart from context
  };

  // ➖ Decrease quantity
  const handleDecrease = (id) => {
    const item = cart.find((p) => p._id === id);
    if (item && item.quantity > 1) {
      const updated = cart.map((p) =>
        p._id === id ? { ...p, quantity: p.quantity - 1 } : p
      );
      localStorage.setItem(
        `cart_${JSON.parse(localStorage.getItem("user"))?._id || "guest"}`,
        JSON.stringify(updated)
      );
      window.dispatchEvent(new Event("storage"));
    } else {
      handleRemove(id);
    }
  };

  // ❌ Remove item
  const handleRemove = (id) => {
    removeFromCart(id);
  };

  // 🧹 Clear cart for current user only
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  // 💰 Calculate total
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  // 🕳 Empty cart UI
  if (cart.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh", backgroundColor: "#f8f9fa" }}
      >
        <Alert variant="info" className="text-center shadow-lg p-4 fade-in">
          🛒 <strong>Your cart is empty!</strong>
          <div className="mt-3">
            <Button variant="warning" onClick={() => navigate("/menu")}>
              Go to Menu 🍽
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div
      className="py-4 fade-in"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div className="container">
        <h3 className="text-center mb-4 fw-bold text-dark">🛒 Your Cart</h3>

        {cart.map((item) => (
          <Card
            key={item._id}
            className="mb-3 shadow-sm border-0 rounded-4 cart-card"
          >
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-3 me-3 d-flex align-items-center justify-content-center bg-light overflow-hidden"
                  style={{ width: "80px", height: "80px", fontSize: "24px" }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "🍳"
                  )}
                </div>
                <div>
                  <h5 className="mb-1">{item.name}</h5>
                  <p className="mb-0 text-muted">₹{item.price}</p>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleDecrease(item._id)}
                >
                  −
                </Button>
                <span className="mx-2 fw-bold">{item.quantity || 1}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleIncrease(item._id)}
                >
                  +
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-3"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}

        <Card className="mt-4 shadow-sm border-0 rounded-4">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Total Amount</h5>
              <small className="text-muted">Including all taxes</small>
            </div>
            <h4 className="text-success mb-0 fw-bold">₹{total.toFixed(2)}</h4>
          </Card.Body>
        </Card>

        <div className="d-flex flex-wrap justify-content-between mt-4 gap-3">
          <Button variant="outline-danger" onClick={handleClearCart}>
            Clear Cart 🗑️
          </Button>
          <Button variant="outline-dark" onClick={() => navigate("/menu")}>
            Continue Shopping 🍳
          </Button>
          <Button
            variant="success"
            className="fw-bold"
            onClick={() => navigate("/payment-options")}
          >
            Proceed to Payment 💳
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
