import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 900, once: true });

    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/signup", form);
      alert("✅ Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        height: "100vh",
        width: "100vw",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.60), rgba(0,0,0,0.75)), url('https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=1920&q=60')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <Card
        data-aos="zoom-in"
        className="shadow-lg border-0 rounded-4"
        style={{
          maxWidth: "300px",              // smaller card
          width: "90%",
          padding: "14px",
          background: "rgba(255, 255, 255, 0.10)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "#fff",
        }}
      >
        <Card.Body>
          <div className="text-center mb-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
              alt="Chef"
              width="42"                   // smaller icon
              className="mb-2"
            />
            <h6 className="fw-bold text-white">Create Your Account</h6>
            <p className="text-light mb-2" style={{ fontSize: "12px" }}>
              Start your foodie journey! 🍕✨
            </p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label className="text-white small">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
                className="bg-transparent text-white border-light"
                style={{ fontSize: "12px", padding: "5px 8px" }}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="text-white small">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="bg-transparent text-white border-light"
                style={{ fontSize: "12px", padding: "5px 8px" }}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="text-white small">Mobile</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile number"
                required
                className="bg-transparent text-white border-light"
                style={{ fontSize: "12px", padding: "5px 8px" }}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="text-white small">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create password"
                required
                className="bg-transparent text-white border-light"
                style={{ fontSize: "12px", padding: "5px 8px" }}
              />
            </Form.Group>

            <Button
              variant="warning"
              type="submit"
              disabled={loading}
              className="w-100 fw-bold mt-2"
              style={{
                background: "linear-gradient(90deg, #ff9800, #ff5722)",
                border: "none",
                fontSize: "13px",
                padding: "6px 0",
              }}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form>

          <div className="text-center mt-2">
            <small className="text-white-50" style={{ fontSize: "11px" }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="fw-semibold"
                style={{ color: "#FFD700", textDecoration: "none" }}
              >
                Login
              </Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
