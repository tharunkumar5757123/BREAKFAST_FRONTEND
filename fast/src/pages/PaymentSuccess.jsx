import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId =
    searchParams.get("session_id") || searchParams.get("sessionId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          setError("Invalid or expired session. Please try again.");
          setLoading(false);
          return;
        }

        const res = await API.get(`/payments/verify/${sessionId}`);
        setPaymentData(res.data);

        ["cart", "selectedMenuItem", "selectedPaymentMethod"].forEach((key) =>
          localStorage.removeItem(key)
        );
        window.dispatchEvent(new Event("storage"));
      } catch (err) {
        console.error("❌ Payment verification error:", err);
        setError("Something went wrong verifying your payment.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-success mb-3" role="status" />
        <h5 className="fw-semibold text-muted">Verifying your payment... 💳</h5>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-5">
        <h3 className="text-danger">{error}</h3>
        <button
          className="btn btn-outline-danger mt-3"
          onClick={() => navigate("/cart")}
        >
          Back to Cart 🛒
        </button>
      </div>
    );

  const savedLocation = JSON.parse(localStorage.getItem("userLocation"));

  return (
    <div
      className="text-center py-5 fade-in"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0ffe0, #f8fff6)",
      }}
    >
      <div
        className="p-5 shadow-lg bg-white rounded-4 mx-auto"
        style={{ maxWidth: "550px" }}
      >
        <div className="mb-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
            alt="Success"
            width="90"
            className="mb-2 bounce"
          />
          <h2 className="text-success fw-bold">Payment Successful!</h2>
          <p className="text-muted mb-4">
            Your delicious breakfast is on its way 🍳
          </p>
        </div>

        {paymentData && (
          <>
            {/* 🛍️ Order Summary */}
            <div className="bg-light p-3 rounded-3 border text-start mb-3">
              <h5 className="fw-semibold mb-2">🧾 Order Summary</h5>
              {paymentData.items?.map((item, index) => (
                <p key={index} className="mb-1 small">
                  {item.name} × {item.quantity} — ₹{item.amount}
                </p>
              ))}
              <hr />
              <h6 className="fw-bold text-end text-success">
                Total: ₹{paymentData.payment?.amount}
              </h6>
            </div>

            {/* 💰 Payment Details */}
            <div className="bg-light p-3 rounded-3 border text-start mb-3">
              <p className="mb-1">
                <strong>Transaction ID:</strong> {paymentData.payment?.id}
              </p>
              <p className="mb-1">
                <strong>Status:</strong>{" "}
                <span className="text-success fw-semibold">
                  {paymentData.payment?.status?.toUpperCase()}
                </span>
              </p>
              {paymentData.payment?.receiptUrl && (
                <a
                  href={paymentData.payment.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success btn-sm w-100 mt-2"
                >
                  📄 View / Download Receipt
                </a>
              )}
            </div>

            {/* 📍 Location Map */}
            {savedLocation && (
              <div className="rounded-3 overflow-hidden mb-3">
                <iframe
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${savedLocation.lat},${savedLocation.lng}&z=15&output=embed`}
                ></iframe>
                <p className="small text-muted mt-2">
                  Delivering to: {savedLocation.address}
                </p>
              </div>
            )}
          </>
        )}

        {/* 🎯 Action Buttons */}
        <div className="d-flex justify-content-center gap-3 mt-3">
          <button
            className="btn btn-outline-dark px-4 fw-semibold"
            onClick={() => navigate("/")}
          >
            🏠 Home
          </button>
          <button
            className="btn btn-success px-4 fw-semibold"
            onClick={() => navigate("/profile")}
          >
            👤 My Profile
          </button>
        </div>
      </div>

      {/* 🎉 Small Confetti Animation */}
      <div className="confetti"></div>

      <style>{`
        .fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bounce {
          animation: bounce 1s infinite alternate;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-8px); }
        }
        .confetti {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 0;
          background: repeating-linear-gradient(
            90deg,
            #ff6b6b,
            #ff6b6b 10px,
            #feca57 10px,
            #feca57 20px,
            #48dbfb 20px,
            #48dbfb 30px,
            #1dd1a1 30px,
            #1dd1a1 40px
          );
          animation: confetti 1.5s ease-out;
        }
        @keyframes confetti {
          from { height: 0; }
          to { height: 120px; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
