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
    AOS.init({ duration: 1000, once: true });

    // 🧱 Apply full-screen layout & hide scroll temporarily
    document.documentElement.style.height = "100%";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";

    // ✅ Restore scroll when leaving the Register page
    return () => {
      document.body.style.overflow = "auto";
    };
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
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        data-aos="zoom-in"
        className="shadow-lg border-0 p-4 rounded-4"
        style={{
          maxWidth: "420px",
          width: "90%",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          color: "#fff",
        }}
      >
        <Card.Body>
          <div className="text-center mb-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
              alt="Chef Hat"
              width="70"
              className="mb-3"
            />
            <h3 className="fw-bold text-white">Join Our Breakfast Club</h3>
            <p className="text-light mb-4">
              Start your day with a delicious morning! ☀️
            </p>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="bg-transparent text-white border-light"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="bg-transparent text-white border-light"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white">Mobile</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
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
                placeholder="Create a password"
                required
                className="bg-transparent text-white border-light"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              {/* <Form.Label className="text-white">Role</Form.Label> */}
              {/* <Form.Select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="bg-transparent text-white border-light"
              > */}
                {/* <option value="user">User</option>
                <option value="admin">Admin</option> */}
              {/* </Form.Select> */}
            </Form.Group>

            <Button
              variant="warning"
              type="submit"
              disabled={loading}
              className="w-100 fw-bold mt-2 py-2"
              style={{
                background: "linear-gradient(90deg, #ff9966, #ff5e62)",
                border: "none",
                color: "#fff",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background =
                  "linear-gradient(90deg, #ff5e62, #ff9966)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background =
                  "linear-gradient(90deg, #ff9966, #ff5e62)")
              }
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small className="text-white-50">
              Already have an account?{" "}
              <Link
                to="/login"
                className="fw-semibold"
                style={{ color: "#FFD700", textDecoration: "none" }}
              >
                Login here
              </Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
