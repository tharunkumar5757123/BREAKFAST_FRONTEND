import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="text-light pt-5 pb-3 mt-5"
      style={{
        background: "linear-gradient(135deg, #ffbb33, #ff8800)",
        boxShadow: "0 -2px 15px rgba(0,0,0,0.15)",
        borderTopLeftRadius: "30px",
        borderTopRightRadius: "30px",
      }}
    >
      <Container>
        <Row className="text-center text-md-start">
          {/* 🍳 Brand Info */}
          <Col md={3} sm={6} className="mb-4">
            <h5 className="fw-bold mb-3">🍳 Breakfast Booking</h5>
            <p className="small">
              Start your day right with fresh, tasty, and healthy breakfast options — delivered fast and warm.
            </p>
          </Col>

          {/* 🔗 Quick Links */}
          <Col md={3} sm={6} className="mb-4">
            <h6 className="fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li>
                <Link to="/" className="text-light text-decoration-none footer-link">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="text-light text-decoration-none footer-link">Menu</Link>
              </li>
              <li>
                <Link to="/about" className="text-light text-decoration-none footer-link">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-light text-decoration-none footer-link">Contact</Link>
              </li>
            </ul>
          </Col>

          {/* 📍 About Us */}
          <Col md={3} sm={6} className="mb-4">
            <h6 className="fw-semibold mb-3">About Us</h6>
            <p className="small">
              We’re passionate food lovers bringing you handcrafted breakfast from the city’s best kitchens — made with love and care ❤️
            </p>
          </Col>

          {/* ☎️ Contact Info */}
          <Col md={3} sm={6} className="mb-4">
            <h6 className="fw-semibold mb-3">Contact</h6>
            <p className="small mb-1">
              <FaEnvelope className="me-2" /> support@breakfastapp.com
            </p>
            <p className="small mb-1">
              <FaPhoneAlt className="me-2" /> +91 98765 43210
            </p>
            <p className="small mb-3">
              <FaMapMarkerAlt className="me-2" /> Hyderabad, India
            </p>

            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <a href="#" className="text-light fs-5 footer-icon" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="text-light fs-5 footer-icon" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="text-light fs-5 footer-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="border-light my-4" />

        <div className="text-center small">
          © {new Date().getFullYear()} <strong>Breakfast Booking App</strong> 🍽️ — 
          Made with 🧡 by <span className="fw-semibold">You</span>
        </div>
      </Container>

      <style>{`
        .footer-link:hover {
          text-decoration: underline;
          color: #fffbe6;
        }
        .footer-icon {
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .footer-icon:hover {
          transform: translateY(-3px);
          color: #fffbe6;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
