import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center text-white"
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <h1 className="display-3 fw-bold mb-3">404</h1>
      <h2 className="mb-3">Oops! Page Not Found</h2>
      <p className="lead mb-4">
        Looks like the page you’re trying to reach doesn’t exist.
      </p>
      <Button as={Link} to="/" variant="warning" size="lg" className="fw-bold">
        🍳 Go Back Home
      </Button>
    </div>
  );
};

export default NotFound;
