import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AOS from "aos";
import "aos/dist/aos.css";
import "../App.css"

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, bookings: 0, menu: 0 });
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name || "Admin";
  const role = user?.role;

  // 🚫 Restrict access
  useEffect(() => {
    if (role !== "admin") {
      alert("Access denied! Admins only.");
      navigate("/");
    }
  }, [role, navigate]);

  // ✨ Initialize animation on scroll
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // 📊 Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, bookingsRes, menuRes] = await Promise.all([
          API.get("/users"),
          API.get("/bookings/all"),
          API.get("/menu"),
        ]);

        setStats({
          users: usersRes.data.length,
          bookings: bookingsRes.data.length,
          menu: menuRes.data.length,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background: "linear-gradient(135deg, #fff8e1, #ffe0b2)",
      }}
    >
      <div className="container">
        <h2 className="text-center mb-3 fw-bold" data-aos="fade-down">
          👨‍💼 Welcome, {name}!
        </h2>
        <p
          className="text-center text-muted mb-5"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Manage your restaurant efficiently using the tools below.
        </p>

        {/* 📈 Dashboard Summary Cards */}
        <Row className="g-4 mb-5">
          <Col md={4} data-aos="fade-up">
            <Card className="text-center shadow border-0 bg-primary text-light rounded-4 hover-zoom">
              <Card.Body>
                <h2>{stats.users}</h2>
                <p>Registered Users</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} data-aos="fade-up" data-aos-delay="100">
            <Card className="text-center shadow border-0 bg-success text-light rounded-4 hover-zoom">
              <Card.Body>
                <h2>{stats.bookings}</h2>
                <p>Total Bookings</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} data-aos="fade-up" data-aos-delay="200">
            <Card className="text-center shadow border-0 bg-warning text-dark rounded-4 hover-zoom">
              <Card.Body>
                <h2>{stats.menu}</h2>
                <p>Menu Items</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ⚙️ Management Sections */}
        <Row className="g-4">
          <Col md={4} data-aos="fade-up">
            <Card className="shadow-sm border-0 rounded-4 hover-card">
              <Card.Body className="text-center">
                <h5>👥 Manage Users</h5>
                <p className="text-muted">Monitor and manage user accounts.</p>
                <Button
                  variant="primary"
                  className="fw-semibold"
                  onClick={() => navigate("/admin/users")}
                >
                  Go to Users
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} data-aos="fade-up" data-aos-delay="100">
            <Card className="shadow-sm border-0 rounded-4 hover-card">
              <Card.Body className="text-center">
                <h5>📅 Manage Bookings</h5>
                <p className="text-muted">
                  View and control all customer bookings.
                </p>
                <Button
                  variant="success"
                  className="fw-semibold"
                  onClick={() => navigate("/admin/bookings")}
                >
                  Go to Bookings
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} data-aos="fade-up" data-aos-delay="200">
            <Card className="shadow-sm border-0 rounded-4 hover-card">
              <Card.Body className="text-center">
                <h5>🍽 Manage Menu</h5>
                <p className="text-muted">
                  Add, edit, or remove breakfast items.
                </p>
                <Button
                  variant="warning"
                  className="fw-semibold text-dark"
                  onClick={() => navigate("/admin/menu")}
                >
                  Go to Menu
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
