import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminMenu from "./pages/AdminMenu";
import AdminBookings from "./pages/AdminBookings";
import AdminUsers from "./pages/AdminUsers";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import CartBar from "./components/CartBar";
import Cart from "./pages/Cart";
import PaymentOptions from "./pages/PaymentOptions";
import MenuItemDetails from "./pages/MenuItemDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import AOS from "aos";
import "aos/dist/aos.css";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";
import LocationPicker from "./pages/LocationPicker";




const isAuthenticated = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return !!user;
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" replace />;

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role === "admin" ? children : <Navigate to="/" replace />;
};

const App = () => {
  const location = useLocation();
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    // Load user once on startup
    const user = JSON.parse(localStorage.getItem("user"));
    setUserLoaded(true);
  }, []);

  useEffect(() => {
    // Initialize AOS once
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    // ✅ Refresh AOS + Scroll to top whenever route changes
    window.scrollTo(0, 0);
    setTimeout(() => {
      AOS.refreshHard();
    }, 300);
  }, [location.pathname]);

  if (!userLoaded) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#111",
          color: "#fff",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  // Routes where nav/footer/cart are hidden
  const hideNavRoutes = ["/login", "/register"];
  const hideCartBarRoutes = [
    "/login",
    "/register",
    "/admin",
    "/admin/dashboard",
    "/admin/menu",
    "/admin/bookings",
    "/admin/users",
  ];

  const shouldShowNav = !hideNavRoutes.includes(location.pathname);
  const shouldShowFooter = !hideNavRoutes.includes(location.pathname);
  const shouldShowCartBar = !hideCartBarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {shouldShowNav && <NavBar />}

      <div style={{ minHeight: "85vh" }}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu/:id" element={<MenuItemDetails />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/thankyou" element={<ThankYou />} />
<Route path="/location-picker" element={<LocationPicker/>} />

          {/* User */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home key={location.key} /> {/* ✅ Forces re-render on route change */}
              </PrivateRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <PrivateRoute>
                <Menu />
              </PrivateRoute>
            }
          />
          <Route
            path="/booking/:menuItemId?"
            element={
              <PrivateRoute>
                <Booking />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <AdminRoute>
                <AdminMenu />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          {/* Payment + Not Found */}
          <Route path="/payment-options" element={<PaymentOptions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {shouldShowCartBar && <CartBar />}
      {shouldShowFooter && <Footer />}
    </>
  );
};

export default App;
