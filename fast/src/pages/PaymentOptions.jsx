import React, { useState, useEffect } from "react";
import { Card, Button, ListGroup, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

const paymentMethods = [
  { id: "gpay", name: "Google Pay", logo: "./gp.jpg" },
  { id: "phonepe", name: "PhonePe", logo: "./pp.jpg" },
  { id: "paytm", name: "Paytm", logo: "./paytm.jpg" },
  { id: "card", name: "Credit / Debit Card", logo: "./c and d.jpg" },
  { id: "cod", name: "Cash on Delivery", logo: "./cod.jpg" }, // optional
];

const PaymentOptions = () => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [cart, setCart] = useState([]);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const cartKey = storedUser ? `cart_${storedUser._id}` : "guest_cart";
    const savedCart =
      JSON.parse(localStorage.getItem(cartKey)) ||
      JSON.parse(localStorage.getItem("guest_cart")) ||
      JSON.parse(localStorage.getItem("last_cart")) ||
      [];
    if (savedCart.length > 0) {
      setCart(savedCart);
      localStorage.setItem("last_cart", JSON.stringify(savedCart));
    }

    const savedLoc = JSON.parse(localStorage.getItem("userLocation"));
    if (savedLoc) setLocation(savedLoc);
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("last_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const getCartTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id || storedUser?.id;

      if (!storedUser || !userId) {
        alert("⚠️ Please login first!");
        navigate("/login");
        return;
      }

      const currentCart =
        cart.length > 0
          ? cart
          : JSON.parse(localStorage.getItem("last_cart")) || [];

      if (!currentCart.length) {
        alert("🛒 Your cart is empty!");
        navigate("/menu");
        return;
      }

      if (!selected) {
        alert("⚠️ Please select a payment method!");
        return;
      }

      localStorage.setItem("selectedPaymentMethod", selected);

      const orderData = {
        cart: currentCart,
        userId,
        location: location || null,
      };

      const res = await API.post("/payments/create-checkout-session", orderData);

      if (res.data?.url) {
        localStorage.setItem("lastOrder", JSON.stringify(orderData));
        window.location.href = res.data.url;
      } else {
        alert("⚠️ Failed to start payment session.");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert(err.response?.data?.message || "Payment initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fade-in py-4"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f9fafb 0%, #f0f0f0 100%)",
      }}
    >
      <div className="container" style={{ maxWidth: "650px" }}>
        {/* 🧭 Progress Header */}
        <div className="text-center mb-4">
          <span className="fw-semibold text-secondary">
            Cart → <span className="text-dark">Payment</span> → Success
          </span>
        </div>

        <h3 className="text-center fw-bold mb-4 text-dark">
          💳 Choose a Payment Method
        </h3>

        {/* 📍 Delivery Location */}
        {location && (
          <Card className="shadow-sm border-0 rounded-4 p-3 mb-4">
            <h6 className="fw-bold text-dark mb-2">📍 Delivering to</h6>
            <p className="text-muted small mb-2">{location.address}</p>
            <Button
              variant="outline-secondary"
              size="sm"
              className="fw-semibold"
              onClick={() => {
                localStorage.removeItem("userLocation");
                setLocation(null);
              }}
            >
              Change Location
            </Button>
          </Card>
        )}

        {/* 🧾 Order Summary */}
        {cart.length > 0 && (
          <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Body>
              <h5 className="fw-bold">🧾 Order Summary</h5>
              <ListGroup variant="flush">
                {cart.map((item) => (
                  <ListGroup.Item
                    key={item._id}
                    className="d-flex justify-content-between border-0 px-0"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <hr />
              <h6 className="fw-bold text-end">Total: ₹{getCartTotal()}</h6>
              <p className="text-muted text-end small mb-0">
                ⏱️ Estimated delivery: 20–25 mins
              </p>
            </Card.Body>
          </Card>
        )}

        {/* 💳 Payment Methods (Swiggy-like Inline Cards) */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              onClick={() => !loading && setSelected(method.id)}
              className={`text-center shadow-sm p-3 ${
                selected === method.id
                  ? "border border-success bg-light scale-up"
                  : "border-0"
              }`}
              style={{
                width: "130px",
                borderRadius: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <img
                src={method.logo}
                alt={method.name}
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
                className="mb-2"
              />
              <small className="fw-semibold text-dark">{method.name}</small>
              {selected === method.id && (
                <div className="text-success mt-1 fw-bold small">✔</div>
              )}
            </Card>
          ))}
        </div>

        {/* 🎯 Pay Button */}
        <div className="text-center">
          <Button
            variant="success"
            disabled={!selected || loading || !cart.length}
            onClick={handlePayment}
            className="px-5 py-2 fw-bold shadow-sm"
            style={{ borderRadius: "30px", fontSize: "16px" }}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Processing...
              </>
            ) : !cart.length ? (
              "🛒 Cart is Empty"
            ) : (
              `Pay ₹${getCartTotal()} with ${
                selected ? selected.toUpperCase() : "..."
              }`
            )}
          </Button>

          <div className="mt-4 d-flex justify-content-center gap-3">
            <Button
              variant="outline-dark"
              onClick={() => navigate("/cart")}
              className="fw-bold"
              style={{ borderRadius: "25px" }}
            >
              ← Back to Cart
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/menu")}
              className="fw-bold"
              style={{ borderRadius: "25px" }}
            >
              🍽 Continue Shopping
            </Button>
          </div>
        </div>
      </div>

      {/* 🌈 Small Styles */}
      <style>{`
        .scale-up {
          transform: scale(1.05);
        }
        .fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PaymentOptions;
