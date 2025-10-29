// src/pages/Menu.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Card, Button, Row, Col, Form, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useCart } from "../context/cartContext"; // ✅ use context instead of utils
import "../App.css";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();
  const { addToCart } = useCart(); // ✅ from context

  // ✅ Fetch menu items from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await API.get("/menu");
        setMenu(res.data);
        setFilteredMenu(res.data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, []);

  // 🔍 Filter + sort menu
  useEffect(() => {
    let items = [...menu];

    if (search.trim()) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "price-asc") items.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") items.sort((a, b) => b.price - a.price);
    if (sortBy === "name") items.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredMenu(items);
    setCurrentPage(1);
  }, [search, sortBy, menu]);

  // 🧮 Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredMenu.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);

  // ⭐ Render star ratings
  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        color={i < rating ? "#facc15" : "#e5e7eb"}
        className="me-1"
      />
    ));

  // 🛒 Add to cart via context
  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`${item.name} added to your cart 🛒`);
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold text-primary">
        🍳 Our Breakfast Menu
      </h2>

      {/* 🔍 Search + Sort */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <Form.Control
          type="text"
          placeholder="🔍 Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "350px" }}
          className="shadow-sm"
        />

        <Form.Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ maxWidth: "200px" }}
          className="shadow-sm"
        >
          <option value="">Sort by</option>
          <option value="name">Name (A–Z)</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </Form.Select>
      </div>

      {/* 🍽️ Menu Grid */}
      <Row xs={1} md={3} className="g-4">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <Col key={item._id}>
              <Card className="menu-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="image-container">
                  <Card.Img
                    variant="top"
                    src={
                      item.image ||
                      "https://via.placeholder.com/400x250?text=Delicious+Food"
                    }
                    alt={item.name}
                    className="menu-img"
                  />
                  <span className="price-tag">₹{item.price.toFixed(2)}</span>
                </div>

                <Card.Body>
                  <Card.Title className="fw-bold text-dark">
                    {item.name}
                  </Card.Title>

                  <div className="d-flex align-items-center mb-2">
                    {renderStars(item.rating || 4)}
                    <span
                      className="text-muted ms-1"
                      style={{ fontSize: "0.9rem" }}
                    >
                      ({item.rating || 4}/5)
                    </span>
                  </div>

                  <Card.Text
                    className="text-muted"
                    style={{ minHeight: "60px" }}
                  >
                    {item.description?.slice(0, 80)}...
                  </Card.Text>

                  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="primary"
                      className="px-3 fw-semibold"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart 🛒
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="fw-semibold"
                      onClick={() => navigate(`/menu/${item._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center text-muted mt-4">No menu items found.</p>
        )}
      </Row>

      {/* 📄 Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Menu;
