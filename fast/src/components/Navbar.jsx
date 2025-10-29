import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [cartCount, setCartCount] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  // ✅ Load saved location on mount
  useEffect(() => {
    const savedLoc = localStorage.getItem("userLocation");
    if (savedLoc) setUserLocation(JSON.parse(savedLoc));
  }, []);

  // ✅ Listen for location changes (triggered from LocationPicker)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedLoc = localStorage.getItem("userLocation");
      if (savedLoc) setUserLocation(JSON.parse(savedLoc));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Get correct cart per user (guest or logged in)
  const getCart = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const cartKey = currentUser ? `cart_${currentUser._id}` : "guest_cart";
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  };

  const updateCartCount = () => setCartCount(getCart().length);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
    document.body.style.paddingTop = "75px";
    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      document.body.style.paddingTop = "0";
    };
  }, []);

  const token = localStorage.getItem("token");
  const role = user?.role || "user";
  const name = user?.name || "Guest";

  // ✅ Handle logout and preserve guest cart
  const handleLogout = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const cartKey = currentUser ? `cart_${currentUser._id}` : null;
    const savedCart = cartKey ? localStorage.getItem(cartKey) : null;

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    if (savedCart) {
      localStorage.setItem("guest_cart", savedCart);
      localStorage.setItem("cart", savedCart);
    }

    setUser(null);
    navigate("/login");
    window.dispatchEvent(new Event("storage"));
  };

  // ✅ Smooth scroll for in-page About section
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
    else {
      navigate("/about");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 700);
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        data-aos="fade-down"
        className="py-3 shadow-sm"
        style={{
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(12px)",
          zIndex: 1000,
        }}
      >
        <Container>
          {/* 🍳 Brand */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-4 text-warning"
            style={{ letterSpacing: "0.5px" }}
          >
            🍳 Breakfast Booking
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" className="border-0" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto align-items-center">

              {/* Navigation Links */}
              <Nav.Link as={Link} to="/" className="text-light mx-2 nav-link-custom">
                Home
              </Nav.Link>

              <Nav.Link as={Link} to="/menu" className="text-light mx-2 nav-link-custom">
                Menu
              </Nav.Link>

              <Nav.Link
                onClick={() => scrollToSection("about-section")}
                className="text-light mx-2 nav-link-custom"
                style={{ cursor: "pointer" }}
              >
                About
              </Nav.Link>

              <Nav.Link as={Link} to="/contact" className="text-light mx-2 nav-link-custom">
                Contact
              </Nav.Link>

              {/* 📍 User Location */}
              <div
                className="text-light d-flex align-items-center mx-3 location-display"
                onClick={() => navigate("/location-picker")}
                style={{
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "5px 10px",
                }}
              >
                <FaMapMarkerAlt className="text-warning me-2" />
                <span className="small">
                  {userLocation
                    ? userLocation.address?.split(",")[0]
                    : "Set Location"}
                </span>
              </div>

              {/* 🛠 Admin Panel */}
              {role === "admin" && (
                <NavDropdown
                  title="Admin Panel"
                  id="admin-dropdown"
                  menuVariant="dark"
                  className="mx-2"
                >
                  <NavDropdown.Item as={Link} to="/admin/dashboard">
                    📊 Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/menu">
                    🍽 Manage Menu
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/bookings">
                    📅 Manage Bookings
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/users">
                    👥 Manage Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* 🛒 Cart for normal users */}
              {role !== "admin" && (
                <Nav.Link
                  as={Link}
                  to="/cart"
                  className="text-light position-relative d-flex align-items-center mx-2"
                >
                  <FaShoppingCart size={20} />
                  {cartCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>
              )}

              {/* 👤 Auth buttons */}
              {token ? (
                <>
                  <Nav.Link as={Link} to="/profile" className="text-light fw-semibold mx-2">
                    {name}
                  </Nav.Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline-warning ms-lg-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="text-light mx-2 nav-link-custom">
                    Login
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register" className="text-light mx-2 nav-link-custom">
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ✨ Hover + Animation Styles */}
      <style>{`
        .nav-link-custom {
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-link-custom:hover {
          color: #ffcc33 !important;
        }
        .nav-link-custom::after {
          content: "";
          position: absolute;
          width: 0%;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #ffcc33;
          transition: width 0.3s ease;
        }
        .nav-link-custom:hover::after {
          width: 100%;
        }
        .location-display:hover {
          background: rgba(255,255,255,0.2);
          transition: 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default NavBar;
