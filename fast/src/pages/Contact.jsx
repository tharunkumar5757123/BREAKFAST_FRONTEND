// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
// import AOS from "aos";
// import "aos/dist/aos.css";

// const Contact = () => {
//   const [form, setForm] = useState({ name: "", email: "", message: "" });

//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Thank you for contacting us! We'll get back soon 😊");
//     setForm({ name: "", email: "", message: "" });
//   };

//   return (
//     <div className="contact-page bg-light">
//       {/* 🧡 Hero Section */}
//       <section
//         className="text-white text-center d-flex flex-column justify-content-center align-items-center"
//         style={{
//           height: "60vh",
//           backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
//           url('https://images.unsplash.com/photo-1559628233-018fb1b0c6a7?auto=format&fit=crop&w=1600&q=80')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <h1 className="display-4 fw-bold mb-3" data-aos="fade-down">
//           Contact Us ☕
//         </h1>
//         <p className="lead" data-aos="fade-up">
//           We’d love to hear from you — let’s make mornings better together!
//         </p>
//       </section>

//       {/* 📬 Contact Form */}
//       <section className="py-5">
//         <Container>
//           <Row className="align-items-center g-5">
//             <Col md={6} data-aos="fade-right">
//               <Card className="shadow-lg border-0 rounded-4 p-4">
//                 <Card.Body>
//                   <h4 className="fw-bold mb-4 text-center text-warning">Send a Message</h4>
//                   <Form onSubmit={handleSubmit}>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="name"
//                         placeholder="Your name"
//                         value={form.name}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Email</Form.Label>
//                       <Form.Control
//                         type="email"
//                         name="email"
//                         placeholder="Your email"
//                         value={form.email}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>Message</Form.Label>
//                       <Form.Control
//                         as="textarea"
//                         name="message"
//                         rows={4}
//                         placeholder="Your message"
//                         value={form.message}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                     <div className="text-center">
//                       <Button variant="warning" type="submit" className="px-4 fw-semibold">
//                         Submit ✉️
//                       </Button>
//                     </div>
//                   </Form>
//                 </Card.Body>
//               </Card>
//             </Col>

//             {/* 📍 Contact Info */}
//             <Col md={6} data-aos="fade-left">
//               <h3 className="fw-bold mb-3">Get in Touch</h3>
//               <p className="text-muted">
//                 Have a question, feedback, or partnership idea? We’re always happy to connect over coffee ☕
//               </p>
//               <ul className="list-unstyled text-muted">
//                 <li>📧 support@breakfastapp.com</li>
//                 <li>📞 +91 98765 43210</li>
//                 <li>📍 Hyderabad, India</li>
//               </ul>
//               <img
//                 src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
//                 alt="contact"
//                 className="img-fluid rounded-4 shadow-lg mt-3"
//               />
//             </Col>
//           </Row>
//         </Container>
//       </section>
//     </div>
//   );
// };

// export default Contact;




import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Toast } from "react-bootstrap";
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div
      className="contact-page text-light"
      style={{
        background: "linear-gradient(135deg, #1b1b1b 0%, #2a2a2a 100%)",
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "80px",
      }}
    >
      <Container>
        {/* 🌟 Header Section */}
        <div className="text-center mb-5" data-aos="fade-down">
          <h2 className="text-warning fw-bold">📞 Contact Us</h2>
          <p className="text-secondary mt-2">
            Let’s connect over breakfast ☕ — we’d love to hear from you!
          </p>
        </div>

        <Row className="align-items-start g-4">
          {/* Left: Info + Map */}
          <Col md={6} data-aos="fade-right">
            <Card
              className="p-4 bg-dark text-light border-0 shadow-lg rounded-4 hover-glow"
              style={{ minHeight: "450px" }}
            >
              <h4 className="text-warning mb-3">Get in Touch</h4>
              <p>
                Have questions, feedback, or suggestions? Whether it’s about
                your booking, breakfast ideas, or business partnerships — we’re
                all ears!
              </p>

              <div className="mt-3">
                <p className="mb-1">
                  📍 <strong>Address:</strong> 123 Morning Street, Food City, IN
                </p>
                <p className="mb-1">
                  📞 <strong>Phone:</strong> +91 98765 43210
                </p>
                <p className="mb-3">
                  📧 <strong>Email:</strong> support@breakfastbooking.com
                </p>
              </div>

              {/* Google Map */}
              <div className="map-container mt-3 rounded-4 overflow-hidden shadow">
                <iframe
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.8909420102247!2d80.24389651481965!3d12.98667049084648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267124c1f9a5b%3A0x927b5f9e5015c40!2sBreakfast%20Cafe!5e0!3m2!1sen!2sin!4v1698304935903!5m2!1sen!2sin"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </Card>
          </Col>

          {/* Right: Form */}
          <Col md={6} data-aos="fade-left">
            <Card className="p-4 bg-dark text-light border-0 shadow-lg rounded-4 hover-glow">
              <h4 className="text-warning mb-3">Send a Message</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Your Name"
                    required
                    className="bg-secondary text-light border-0"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Your Email"
                    required
                    className="bg-secondary text-light border-0"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Your Message"
                    required
                    className="bg-secondary text-light border-0"
                  />
                </Form.Group>

                <Button
                  variant="warning"
                  type="submit"
                  className="w-100 fw-semibold rounded-pill"
                >
                  Send Message ✉️
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Social Media */}
        <div className="text-center mt-5" data-aos="fade-up">
          <h5 className="text-warning fw-bold mb-3">Follow Us</h5>
          <div className="d-flex justify-content-center gap-4">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon linkedin"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-secondary mt-5 small">
          © {new Date().getFullYear()} Breakfast Booking. All rights reserved.
        </footer>

        {/* Toast message */}
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="success"
          className="position-fixed bottom-0 end-0 m-4 text-white"
        >
          <Toast.Body>✅ Message sent successfully!</Toast.Body>
        </Toast>
      </Container>

      {/* Custom Styles */}
      <style>{`
        .hover-glow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 15px rgba(255, 193, 7, 0.3);
          transition: all 0.3s ease;
        }
        .social-icon {
          font-size: 1.6rem;
          color: #fff;
          transition: all 0.3s ease;
        }
        .social-icon:hover {
          transform: scale(1.2);
          color: #ffc107;
          text-shadow: 0 0 8px rgba(255, 193, 7, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Contact;

