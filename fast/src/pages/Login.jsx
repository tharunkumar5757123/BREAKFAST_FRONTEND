import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {
  const [step, setStep] = useState("password");
  const [useOtp, setUseOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ error: "", success: "" });
  const [form, setForm] = useState({
    emailOrMobile: "",
    password: "",
    otp: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    try {
      setLoading(true);
      const id = form.emailOrMobile.trim();
      const payload = /^\d{10}$/.test(id)
        ? { phone: id }
        : { email: id };

      const res = await API.post("/otp/send", payload);
      setMsg({ success: res.data.message });
      setStep("otp");
      setTimer(30);
    } catch (err) {
      setMsg({ error: err.response?.data?.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const id = form.emailOrMobile.trim();
      const payload = {
        otp: form.otp,
        ...( /^\d{10}$/.test(id) ? { phone: id } : { email: id } )
      };

      const res = await API.post("/otp/verify", payload);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.removeItem("active_cart");

      window.dispatchEvent(new Event("storage"));
      alert(`OTP Verified! Welcome ${user.name}`);

      navigate(user.role === "admin" ? "/admin/dashboard" : "/location-picker");
    } catch {
      setMsg({ error: "Invalid OTP" });
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    try {
      setLoading(true);
      const res = await API.post("/login", {
        email: form.emailOrMobile,
        password: form.password,
      });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      alert(`Welcome ${user.name}!`);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/location-picker");
    } catch (err) {
      setMsg({ error: "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.75)),url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
  data-aos="fade-up"
  className="rounded-4 shadow-lg p-3"
  style={{
    maxWidth: 330,   // 🔥 Reduced from 420
    width: "92%",    // better mobile fit
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(12px)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.18)",
  }}
>
  <Card.Body>
    <div className="text-center mb-2">
      <img
        src="https://cdn-icons-png.flaticon.com/512/3595/3595455.png"
        width="48"   // 🔥 reduced from 70
        alt=""
      />
      <h5 className="fw-bold mt-2">Welcome Back 👨‍🍳</h5>
      <p className="text-light" style={{ fontSize: "13px", marginBottom: 8 }}>
        {useOtp ? "Login with OTP" : "Login with Password"}
      </p>
    </div>

    {msg.error && <Alert variant="danger">{msg.error}</Alert>}
    {msg.success && <Alert variant="success">{msg.success}</Alert>}

    {/* Password Login */}
    {!useOtp && step === "password" && (
      <>
        <Form.Control
          className="mb-2 bg-transparent text-white border-light"
          placeholder="Email or Mobile"
          name="emailOrMobile"
          onChange={handleChange}
          style={{ fontSize: "13px", padding: "6px 10px" }}
        />

        <Form.Control
          className="mb-2 bg-transparent text-white border-light"
          placeholder="Password"
          type="password"
          name="password"
          onChange={handleChange}
          style={{ fontSize: "13px", padding: "6px 10px" }}
        />

        <Button
          className="w-100 fw-bold"
          style={{ padding: "6px 0", fontSize: "14px" }}
          variant="warning"
          disabled={loading}
          onClick={loginUser}
        >
          {loading ? <Spinner size="sm" /> : "Login"}
        </Button>
      </>
    )}

    {/* Send OTP */}
    {useOtp && step === "password" && (
      <>
        <Form.Control
          className="mb-2 bg-transparent text-white border-light"
          placeholder="Email or Mobile"
          name="emailOrMobile"
          onChange={handleChange}
          style={{ fontSize: "13px", padding: "6px 10px" }}
        />

        <Button
          className="w-100 fw-bold"
          style={{ padding: "6px 0", fontSize: "14px" }}
          variant="info"
          disabled={loading}
          onClick={sendOtp}
        >
          {loading ? <Spinner size="sm" /> : "Send OTP"}
        </Button>
      </>
    )}

    {/* OTP Verification */}
    {step === "otp" && (
      <>
        <Form.Control
          className="mb-2 bg-transparent text-white border-light"
          placeholder="Enter OTP"
          name="otp"
          onChange={handleChange}
          style={{ fontSize: "13px", padding: "6px 10px" }}
        />

        <Button
          variant="link"
          disabled={timer > 0}
          onClick={sendOtp}
          className="text-light p-0 mb-2"
          style={{ fontSize: "12px" }}
        >
          {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
        </Button>

        <Button
          className="w-100 fw-bold"
          style={{ padding: "6px 0", fontSize: "14px" }}
          variant="success"
          disabled={loading}
          onClick={verifyOtp}
        >
          {loading ? <Spinner size="sm" /> : "Verify OTP"}
        </Button>
      </>
    )}

    <div className="text-center mt-2">
      <Button
        variant="link"
        className="text-light p-0"
        onClick={() => {
          setUseOtp(!useOtp);
          setStep("password");
          setMsg({ error: "", success: "" });
        }}
        style={{ fontSize: "13px" }}
      >
        {useOtp ? "🔑 Login with Password" : "📱 Login with OTP"}
      </Button>
    </div>

    <div className="text-center mt-1">
      <small className="text-white-50" style={{ fontSize: "12px" }}>
        Don't have an account?{" "}
        <Link to="/register" className="fw-bold" style={{ color: "#FFD700" }}>
          Register
        </Link>
      </small>
    </div>
  </Card.Body>
</Card>

    </div>
  );
};

export default Login;
