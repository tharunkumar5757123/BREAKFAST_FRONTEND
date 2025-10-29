  import React, { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import API from "../services/api";
  import { Button } from "react-bootstrap";
  import { FaStar } from "react-icons/fa";
  import { getCart, saveCart } from "../utils/cartUtils";

  const MenuItemDetails = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchItem = async () => {
        try {
          const res = await API.get(`/menu/${id}`);
          setItem(res.data);
        } catch (err) {
          console.error("Error fetching item details:", err);
        }
      };
      fetchItem();
    }, [id]);

    const handleAddToCart = () => {
      if (!item) return;

      const cart = getCart();
      const existing = cart.find((c) => c._id === item._id);
      let updatedCart;

      if (existing) {
        updatedCart = cart.map((c) =>
          c._id === item._id
            ? { ...c, quantity: (c.quantity || 1) + 1 }
            : c
        );
      } else {
        updatedCart = [...cart, { ...item, quantity: 1 }];
      }

      saveCart(updatedCart);
      alert(`${item.name} added to your cart 🛒`);
    };

    if (!item) return <div className="text-center mt-5">Loading item details...</div>;

    return (
      <div className="container my-5">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        <div className="row mt-4">
          <div className="col-md-6">
            <img
              src={item.image || "https://via.placeholder.com/600x400?text=Food+Image"}
              alt={item.name}
              className="img-fluid rounded-4 shadow"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">{item.name}</h2>
            <div className="d-flex align-items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < (item.rating || 4) ? "#facc15" : "#e5e7eb"}
                />
              ))}
              <span className="ms-2 text-muted">({item.rating || 4}/5)</span>
            </div>
            <p className="text-muted mb-3">{item.description}</p>
            <h4 className="fw-bold text-primary mb-4">₹{item.price}</h4>
            <Button variant="success" onClick={handleAddToCart}>
              Add to Cart 🛒
            </Button>
          </div>
        </div>
      </div>
    );
  };

  export default MenuItemDetails;
