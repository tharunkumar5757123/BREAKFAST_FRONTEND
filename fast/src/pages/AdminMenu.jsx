import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  // ✅ Restrict to admins
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (user?.role !== "admin") {
      alert("Access denied! Only admins can manage the menu.");
      navigate("/");
    }
  }, [user, navigate]);

  // ✅ Fetch menu items
  const fetchMenu = async () => {
    try {
      const res = await API.get("/menu");
      setMenuItems(res.data);
      setFilteredItems(res.data);
    } catch (error) {
      console.error("Failed to load menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // ✅ Input handling
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price) {
      alert("⚠️ Please fill all required fields.");
      return;
    }

    try {
      if (editingId) {
        await API.put(`/menu/${editingId}`, form);
        alert("✅ Menu item updated!");
      } else {
        await API.post("/menu", form);
        alert("✅ New menu item added!");
      }

      setForm({ name: "", description: "", price: "", image: "" });
      setEditingId(null);
      fetchMenu();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("❌ Failed to save item.");
    }
  };

  // ✅ Edit item
  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image || "",
    });
    setEditingId(item._id);
  };

  // ✅ Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/menu/${id}`);
      fetchMenu();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  // 🔍 Filter & Sort
  useEffect(() => {
    let items = [...menuItems];

    if (search.trim()) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "price-asc") items.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") items.sort((a, b) => b.price - a.price);
    if (sortBy === "name") items.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredItems(items);
  }, [search, sortBy, menuItems]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="warning" />
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background: "linear-gradient(135deg, #fff8e1, #ffe0b2)",
        animation: "fadeIn 0.8s ease-in-out",
      }}
    >
      <div className="container">
        <h2 className="text-center fw-bold mb-4 text-dark">
          🍳 Admin Menu Management
        </h2>

        {/* 🧾 Add / Edit Form */}
        <Card className="shadow-lg mb-5 border-0 rounded-4">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={3}>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Price (₹)"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={3}>
                  <Button
                    type="submit"
                    variant={editingId ? "warning" : "success"}
                    className="w-100 fw-semibold shadow-sm"
                  >
                    {editingId ? "Update Item ✏️" : "Add New Item ➕"}
                  </Button>
                </Col>
              </Row>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                placeholder="Enter item description..."
                value={form.description}
                onChange={handleChange}
                className="mt-3"
                required
              />
            </Form>
          </Card.Body>
        </Card>

        {/* 🔍 Search & Sort */}
        <Row className="align-items-center mb-4">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="🔍 Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="name">Name (A–Z)</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </Form.Select>
          </Col>
        </Row>

        {/* 🍕 Menu Grid */}
        <Row className="g-4">
          {filteredItems.length === 0 ? (
            <p className="text-center text-muted">No menu items found.</p>
          ) : (
            filteredItems.map((item) => (
              <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
                <Card className="menu-card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  <div
                    className="menu-img"
                    style={{
                      height: "180px",
                      backgroundImage: `url(${
                        item.image ||
                        "https://images.unsplash.com/photo-1605478371650-8b5c7a9b218d"
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-1 text-dark">{item.name}</h6>
                      <p className="text-muted small mb-1">
                        {item.description?.length > 70
                          ? item.description.slice(0, 70) + "..."
                          : item.description}
                      </p>
                      <p className="fw-semibold text-success mb-2">
                        ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Button
                        size="sm"
                        variant="outline-warning"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>

      {/* ✨ Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .menu-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .menu-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          }
          .menu-img {
            transition: transform 0.4s ease;
          }
          .menu-card:hover .menu-img {
            transform: scale(1.08);
          }
        `}
      </style>
    </div>
  );
};

export default AdminMenu;
