import React, { useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div
      className="thankyou-page d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
        url('https://images.unsplash.com/photo-1600891963937-b2233d82fbc7?auto=format&fit=crop&w=1600&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
      }}
    >
      <Container data-aos="zoom-in">
        <div
          className="bg-dark bg-opacity-50 p-5 rounded-4 shadow-lg"
          style={{ maxWidth: "600px" }}
        >
          <h1 className="display-4 fw-bold mb-3">Thank You! 🧡</h1>
          <p className="lead mb-4">
            Your message has been received. We’ll get back to you as soon as possible!
          </p>

          <div data-aos="fade-up" data-aos-delay="300">
            <img
              src="https://cdn-icons-png.flaticon.com/512/148/148767.png"
              alt="success"
              width="100"
              height="100"
              className="mb-4"
            />
          </div>

          <div data-aos="fade-up" data-aos-delay="500">
            <Button
              variant="warning"
              size="lg"
              className="fw-semibold px-4 me-2"
              onClick={() => navigate("/")}
            >
              Go to Home 🏠
            </Button>
            <Button
              variant="outline-light"
              size="lg"
              className="fw-semibold px-4"
              onClick={() => navigate("/menu")}
            >
              Explore Menu 🍳
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ThankYou;
