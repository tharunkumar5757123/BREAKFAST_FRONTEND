import React, { useEffect, useState } from "react";
import { Button, Carousel, Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import API from "../services/api";
import "../App.css";
import LocationPicker from "./LocationPicker";

const Home = () => {
  const [menu, setMenu] = useState([]);
  const [showScroll, setShowScroll] = useState(false);
  const [userLocation, setUserLocation] = useState(
    JSON.parse(localStorage.getItem("userLocation")) || null
  );
  const [loading, setLoading] = useState(true);

  // 🧠 Initialize animations, listeners, and data
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);

    // 👂 Update location when changed in LocationPicker
    const onStorage = () => {
      const saved = JSON.parse(localStorage.getItem("userLocation"));
      setUserLocation(saved);
    };
    window.addEventListener("storage", onStorage);

    fetchMenu();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // 🍳 Load menu
  const fetchMenu = async () => {
    try {
      const { data } = await API.get("/menu");
      setMenu(data);
    } catch (error) {
      console.error("Error loading menu:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🎡 Hero slides (10)
  const heroSlides = [
    {
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      title: "Fuel Your Day with Goodness ☕",
      subtitle: "Start strong with nutritious and tasty meals.",
    },
    {
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      title: "Hot Meals, Cool Mornings 🌤️",
      subtitle: "Perfectly brewed coffee and comforting bites every morning.",
    },
    {
      img: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a",
      title: "Wake Up to Flavor ☀️",
      subtitle: "From fluffy pancakes to smoothie bowls — made fresh daily.",
    },
    {
      img: "https://images.unsplash.com/photo-1528712306091-ed0763094c98",
      title: "Your Morning, Made Delicious 🍳",
      subtitle: "Fresh breakfast, delivered warm and fast.",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-17144efb9c50",
      title: "Breakfast on the Go 🚴‍♂️",
      subtitle: "Quick, tasty, and energizing meals for your busy mornings.",
    },
    {
      img: "https://images.unsplash.com/photo-1516685018646-549d8e5c63c7",
      title: "Fresh from the Kitchen 🍞",
      subtitle: "Warm croissants, buttered toast, and joy in every bite.",
    },
    {
      img: "https://images.unsplash.com/photo-1604908810005-3c4b64a5c48b",
      title: "A Healthier Start 🥗",
      subtitle: "Wholesome bowls, fruits, and smoothies for a balanced morning.",
    },
    {
      img: "https://images.unsplash.com/photo-1589307004173-3c95204d00d1",
      title: "Lazy Sunday Vibes ☕🥐",
      subtitle: "Relax, we’ve got your breakfast cravings covered.",
    },
    {
      img: "https://images.unsplash.com/photo-1606756790138-0f20dedb29df",
      title: "Tastes Like Home ❤️",
      subtitle: "Homestyle breakfasts that make mornings special.",
    },
    {
      img: "https://images.unsplash.com/photo-1543353071-087092ec393f",
      title: "Rise, Shine & Dine 🌞",
      subtitle: "Delicious food, fresh ingredients, and happy mornings await.",
    },
  ];

  const chefs = [
    { name: "Chef Arjun Mehta", role: "Head Breakfast Chef", img: "./male.jpg" },
    { name: "Chef Priya Sharma", role: "Pastry & Dessert Specialist", img: "./female.jpg" },
    { name: "Chef Rohan Das", role: "Healthy Bowl Expert", img: "./male1.jpg" },
    { name: "Chef Sneha Rao", role: "Continental Breakfast Chef", img: "./female1.jpg" },
  ];

  const testimonials = [
    { name: "Ananya", text: "The pancakes were heavenly! Perfect start to my day ☀️" },
    { name: "Rahul", text: "Super fast delivery and everything was still warm 🔥" },
    { name: "Meera", text: "Healthy options that actually taste great 😋" },
  ];

  // 🚦If no location — show picker
  if (!userLocation) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div>
          <h4 className="text-center mb-4 fw-bold text-dark">
            📍 Choose your delivery location
          </h4>
          <LocationPicker />
        </div>
      </div>
    );
  }

  // 🏠 Main Home UI after selecting location
  return (
    <div className="home-page">
      {/* 📍 Sticky location bar */}
      {userLocation && (
        <div
          className="w-100 text-center bg-warning text-dark py-2 fw-semibold sticky-top shadow-sm"
          style={{ zIndex: 1050 }}
        >
          📍 Delivering to:{" "}
          <span className="fw-bold">
            {userLocation.address?.split(",")[0] || "Your Location"}
          </span>
          <Button
            variant="link"
            size="sm"
            className="text-dark text-decoration-none ms-2 fw-semibold"
            onClick={() => {
              localStorage.removeItem("userLocation");
              setUserLocation(null);
            }}
          >
            Change
          </Button>
        </div>
      )}

      {/* 🌅 Hero Carousel */}
      <section className="hero-carousel position-relative">
        <Carousel fade controls={false} indicators={false} interval={8000} pause={false}>
          {heroSlides.map((slide, i) => (
            <Carousel.Item key={i}>
              <div
                className="d-flex flex-column justify-content-center align-items-center text-white text-center"
                style={{
                  height: "90vh",
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${slide.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Container>
                  <h1 className="display-4 fw-bold mb-3" data-aos="fade-down">
                    {slide.title}
                  </h1>
                  <p className="lead mb-5" data-aos="fade-up">
                    {slide.subtitle}
                  </p>
                  <Button
                    as={Link}
                    to="/menu"
                    variant="warning"
                    size="lg"
                    className="px-4 py-2 rounded-pill fw-semibold"
                  >
                    Explore Menu 🍽️
                  </Button>
                </Container>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* 🥞 Special Picks */}
      <section className="py-5 bg-white" data-aos="fade-up">
        <Container>
          <h2 className="text-center fw-bold mb-5">✨ Special Breakfast Picks</h2>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="warning" />
            </div>
          ) : (
            <Carousel indicators={false} interval={5000} pause="hover">
              {menu.slice(0, 10).map((item) => (
                <Carousel.Item key={item._id}>
                  <Row className="justify-content-center align-items-center">
                    <Col md={5} className="text-center">
                      <img
                        src={item.image || "https://via.placeholder.com/400x250?text=Food+Image"}
                        alt={item.name}
                        className="img-fluid rounded-4 shadow-lg"
                        style={{ height: "260px", width: "100%", objectFit: "cover" }}
                      />
                    </Col>
                    <Col md={6}>
                      <h4 className="fw-bold mb-2">{item.name}</h4>
                      <p className="text-muted mb-2">{item.description}</p>
                      <h6 className="fw-bold text-warning mb-3">₹{item.price}</h6>
                      <Button
                        as={Link}
                        to={`/menu/${item._id}`}
                        variant="dark"
                        className="px-3 py-2 rounded-pill"
                      >
                        Order Now 🍳
                      </Button>
                    </Col>
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Container>
      </section>

      {/* 🔥 Trending Breakfast */}
      <section className="py-5 bg-light" data-aos="fade-up">
        <Container>
          <h2 className="text-center fw-bold mb-5">🔥 Trending Breakfast</h2>
          <Row className="g-4">
            {menu.slice(0, 4).map((item) => (
              <Col key={item._id} md={3} sm={6}>
                <Card className="shadow-sm border-0 rounded-4 h-100 text-center">
                  <Card.Img
                    src={item.image || "https://via.placeholder.com/300x200"}
                    alt={item.name}
                    style={{ height: "200px", objectFit: "cover" }}
                    className="rounded-top-4"
                  />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text className="text-muted small">{item.description}</Card.Text>
                    <h6 className="text-warning fw-bold mb-2">₹{item.price}</h6>
                    <Button
                      as={Link}
                      to={`/menu/${item._id}`}
                      variant="warning"
                      size="sm"
                      className="fw-semibold"
                    >
                      Order Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 👨‍🍳 Chefs */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-5">Meet Our Master Chefs 👨‍🍳</h2>
          <Row className="g-4">
            {chefs.map((chef, i) => (
              <Col key={i} md={3} sm={6} data-aos="zoom-in">
                <Card className="text-center border-0 shadow-lg rounded-4 h-100">
                  <Card.Img src={chef.img} alt={chef.name} style={{ height: "280px", objectFit: "cover" }} />
                  <Card.Body>
                    <Card.Title>{chef.name}</Card.Title>
                    <Card.Text className="text-muted">{chef.role}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 💬 Testimonials */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5">What Our Customers Say 💬</h2>
          <Row className="g-4">
            {testimonials.map((r, i) => (
              <Col key={i} md={4}>
                <Card className="shadow-sm border-0 rounded-4 p-4 h-100 text-center">
                  <p className="text-muted fst-italic mb-3">“{r.text}”</p>
                  <h6 className="fw-bold text-dark">— {r.name}</h6>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 🔝 Scroll to Top */}
      {showScroll && (
        <Button
          variant="warning"
          className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg"
          style={{ width: "55px", height: "55px", fontSize: "1.3rem" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </Button>
      )}

      <style>{`
        html, body {
          overflow-x: hidden !important;
          scroll-behavior: smooth;
        }
        .home-page {
          overflow-x: hidden !important;
        }
      `}</style>
    </div>
  );
};

export default Home;
