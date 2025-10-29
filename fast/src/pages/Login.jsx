import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {
  const [step, setStep] = useState("password");
  const [form, setForm] = useState({
    emailOrMobile: "",
    password: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [useOtpLogin, setUseOtpLogin] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // ✅ Initialize AOS + disable scroll
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  // ✅ OTP timer
  useEffect(() => {
    if (timer <= 0) return;
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ PASSWORD LOGIN
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/login", {
        email: form.emailOrMobile,
        password: form.password,
      });

      const { token, user } = res.data;
      if (!user || !user.role) throw new Error("Invalid user data");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.removeItem("active_cart");

      window.dispatchEvent(new Event("storage"));

      alert(`✅ Welcome ${user.name}! You are logged in as ${user.role}.`);

      // ✅ First go to location picker after login
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/location-picker");
    } catch (err) {
      console.error("Login Error:", err);
      setError(
        err.response?.data?.message || "Invalid credentials or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const identifier = form.emailOrMobile.trim();
      const payload = {};
      if (/^\d{10,}$/.test(identifier)) payload.phone = identifier;
      else payload.email = identifier;

      const res = await API.post("/otp/send", payload);
      setMessage(res.data.message || "OTP sent successfully!");
      setStep("otp");
      setTimer(30);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const identifier = form.emailOrMobile.trim();
      const payload = { otp: form.otp };
      if (/^\d{10,}$/.test(identifier)) payload.phone = identifier;
      else payload.email = identifier;

      const res = await API.post("/otp/verify", payload);
      const { token, user } = res.data;
      if (!user || !user.role) throw new Error("Invalid user data");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.removeItem("active_cart");

      window.dispatchEvent(new Event("storage"));

      alert(`✅ OTP verified! Welcome ${user.name} (${user.role})`);

      // ✅ After OTP login also → go to location picker first
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/location-picker");
    } catch (err) {
      console.error("OTP Verify Error:", err);
      setError(err.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    await handleSendOtp({ preventDefault: () => {} });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        data-aos="fade-up"
        className="shadow-lg border-0 p-4 rounded-4"
        style={{
          maxWidth: "420px",
          width: "90%",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          color: "#fff",
        }}
      >
        <Card.Body>
          <div className="text-center mb-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
              alt="Breakfast Icon"
              width="70"
              className="mb-3"
            />
            <h3 className="fw-bold text-white">Welcome Back 👨‍🍳</h3>
            <p className="text-light mb-4">
              {useOtpLogin
                ? "Login with OTP using email or mobile"
                : "Login using your email/mobile + password"}
            </p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          {/* PASSWORD LOGIN */}
          {!useOtpLogin && step === "password" && (
            <Form onSubmit={handlePasswordLogin}>
              <Form.Group className="mb-3">
                <Form.Label className="text-white">Email or Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="emailOrMobile"
                  value={form.emailOrMobile}
                  onChange={handleChange}
                  placeholder="Enter your email or mobile"
                  required
                  className="bg-transparent text-white border-light"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="bg-transparent text-white border-light"
                />
              </Form.Group>
              <Button
                type="submit"
                variant="warning"
                className="w-100 fw-bold py-2 mt-2"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Login"}
              </Button>
            </Form>
          )}

          {/* OTP SEND */}
          {useOtpLogin && step === "password" && (
            <Form onSubmit={handleSendOtp}>
              <Form.Group className="mb-3">
                <Form.Label className="text-white">Email or Mobile</Form.Label>
                <Form.Control
                  type="text"
                  name="emailOrMobile"
                  value={form.emailOrMobile}
                  onChange={handleChange}
                  placeholder="Enter your email or mobile"
                  required
                  className="bg-transparent text-white border-light"
                />
              </Form.Group>
              <Button
                type="submit"
                variant="info"
                className="w-100 fw-bold py-2 mt-2"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Send OTP"}
              </Button>
            </Form>
          )}

          {/* OTP VERIFY */}
          {step === "otp" && (
            <Form onSubmit={handleVerifyOtp}>
              <Form.Group className="mb-3">
                <Form.Label className="text-white">Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  required
                  className="bg-transparent text-white border-light"
                />
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Button
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={timer > 0 || loading}
                  className="p-0 text-light fw-semibold"
                >
                  {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </Button>
              </div>
              <Button
                type="submit"
                variant="success"
                className="w-100 fw-bold py-2 mt-2"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Verify OTP"}
              </Button>
            </Form>
          )}

          {/* SWITCH LOGIN METHOD */}
          <div className="text-center mt-3">
            <Button
              variant="link"
              className="text-decoration-none fw-semibold text-light"
              onClick={() => {
                setUseOtpLogin(!useOtpLogin);
                setStep("password");
                setError("");
                setMessage("");
              }}
            >
              {useOtpLogin
                ? "🔑 Login with Password Instead"
                : "📱 Login with OTP Instead"}
            </Button>
          </div>

          {/* REGISTER LINK */}
          <div className="text-center mt-2">
            <small className="text-white-50">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="fw-semibold"
                style={{ color: "#FFD700", textDecoration: "none" }}
              >
                Register here
              </Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
