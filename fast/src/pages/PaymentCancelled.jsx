import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center fade-in"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffe6e6, #fffafa)",
      }}
    >
      <div
        className="p-5 bg-white shadow-lg rounded-4"
        style={{ maxWidth: "480px", width: "90%" }}
      >
        {/* ❌ Cancelled Icon */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/463/463612.png"
          alt="Payment Cancelled"
          width="80"
          className="mb-3 shake"
        />

        <h2 className="text-danger fw-bold mb-2">Payment Cancelled</h2>
        <p className="text-muted mb-4">
          Your payment wasn’t completed. You can retry the payment or review your cart
          before proceeding.
        </p>

        {/* 🔘 Buttons */}
        <div className="d-flex flex-column gap-3">
          <button
            className="btn btn-danger fw-semibold py-2"
            onClick={() => navigate("/payment")}
          >
            🔁 Retry Payment
          </button>

          <button
            className="btn btn-outline-danger fw-semibold py-2"
            onClick={() => navigate("/cart")}
          >
            🛒 Back to Cart
          </button>

          <button
            className="btn btn-outline-dark fw-semibold py-2"
            onClick={() => navigate("/")}
          >
            🏠 Go Home
          </button>
        </div>
      </div>

      {/* ⚡ Decorative red stripe animation */}
      <div className="cancel-stripe"></div>

      <style>{`
        .fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .shake {
          animation: shake 0.8s ease-in-out infinite alternate;
        }
        @keyframes shake {
          from { transform: rotate(-2deg); }
          to { transform: rotate(2deg); }
        }
        .cancel-stripe {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: repeating-linear-gradient(
            45deg,
            #ff4d4d,
            #ff4d4d 12px,
            #ffeaea 12px,
            #ffeaea 24px
          );
          animation: slideDown 1s ease-out;
        }
        @keyframes slideDown {
          from { height: 0; opacity: 0; }
          to { height: 100px; opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PaymentCancelled;
