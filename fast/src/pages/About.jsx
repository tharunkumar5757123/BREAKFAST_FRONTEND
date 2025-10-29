import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="about-page bg-light">
      {/* 🧡 Hero Section */}
      <section
        className="text-white text-center d-flex flex-column justify-content-center align-items-center"
        style={{
          height: "60vh",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
          url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="display-4 fw-bold mb-3" data-aos="fade-down">
          About Us 🍳
        </h1>
        <p className="lead" data-aos="fade-up">
          Serving happiness, one breakfast at a time.
        </p>
      </section>

      {/* 🥐 Our Story */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col md={6} data-aos="fade-right">
              <img
                src="https://images.unsplash.com/photo-1580933895285-c97b5e44bc52?auto=format&fit=crop&w=800&q=80"
                alt="Our story"
                className="img-fluid rounded-4 shadow-lg"
              />
            </Col>
            <Col md={6} data-aos="fade-left">
              <h2 className="fw-bold mb-3">Our Story</h2>
              <p className="text-muted">
                Breakfast Booking App was born from a simple idea — mornings should be stress-free,
                flavorful, and full of energy! We’re a passionate team of food lovers, chefs, and
                techies who came together to bring breakfast to your doorstep — fast, fresh, and warm.
              </p>
              <p className="text-muted">
                Whether you crave traditional Indian poha, a classic English breakfast, or a
                protein-packed smoothie bowl, we’ve got something that’ll brighten your morning. 🌅
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 👨‍🍳 Our Mission */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-5" data-aos="fade-up">
            Our Mission & Values 🌟
          </h2>
          <Row className="g-4">
            {[
              {
                title: "Freshness First",
                text: "We use only the freshest ingredients, sourced daily from trusted local vendors.",
                icon: "🥗",
              },
              {
                title: "Fast & Reliable",
                text: "We ensure your breakfast arrives hot and on time — every single day.",
                icon: "⏰",
              },
              {
                title: "Customer Happiness",
                text: "Your satisfaction is our biggest reward. We’re here to make your mornings better.",
                icon: "😊",
              },
            ].map((item, index) => (
              <Col md={4} key={index} data-aos="zoom-in" data-aos-delay={index * 150}>
                <Card className="border-0 shadow-lg rounded-4 text-center h-100 p-4">
                  <Card.Body>
                    <div className="fs-1 mb-3">{item.icon}</div>
                    <h5 className="fw-bold">{item.title}</h5>
                    <p className="text-muted">{item.text}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 👩‍🍳 Meet Our Team */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5" data-aos="fade-up">
            Meet Our Team 👨‍🍳
          </h2>
          <Row className="g-4 justify-content-center">
            {[
              {
                name: "Aarav Sharma",
                role: "Founder & Head Chef",
                img: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Priya Patel",
                role: "Operations Manager",
                img: "https://randomuser.me/api/portraits/women/65.jpg",
              },
              {
                name: "Ravi Kumar",
                role: "Delivery Coordinator",
                img: "https://randomuser.me/api/portraits/men/75.jpg",
              },
            ].map((member, index) => (
              <Col md={4} key={index} data-aos="fade-up" data-aos-delay={index * 150}>
                <Card className="border-0 shadow-lg rounded-4 text-center h-100">
                  <Card.Img
                    variant="top"
                    src={member.img}
                    className="rounded-top-4"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <h5 className="fw-bold">{member.name}</h5>
                    <p className="text-muted">{member.role}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 🗺️ Our Location */}
      <section className="py-5 bg-dark text-light text-center">
        <Container>
          <h2 className="fw-bold mb-4">Find Us Here 📍</h2>
          <iframe
            title="our-location"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: "15px" }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${
              import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            }&q=Breakfast+Restaurant`}
          ></iframe>
        </Container>
      </section>

      {/* 🚀 CTA Section */}
      <section className="py-5 text-center bg-warning text-dark">
        <Container>
          <h3 className="fw-bold mb-3">Ready to start your morning right?</h3>
          <p>Order your favorite breakfast now or reach out to us for any inquiries.</p>
          <a href="/menu" className="btn btn-dark mx-2 rounded-pill px-4">
            View Menu 🍽️
          </a>
          <a href="/contact" className="btn btn-outline-dark mx-2 rounded-pill px-4">
            Contact Us ✉️
          </a>
        </Container>
      </section>
    </div>
  );
};

export default About;
