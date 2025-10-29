import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { getCart, saveCart } from "../utils/cartUtils"; // ✅ use your localStorage helpers

const MenuItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await API.get(`/menu/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error("Error fetching menu item:", err);
      }
    };
    fetchItem();
  }, [id]);

  // ✅ Add to per-user cart
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
    navigate("/booking"); // redirect to booking page
  };

  if (!item)
    return <div className="text-center mt-5 text-muted">Loading item...</div>;

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 rounded-4 mx-auto" style={{ maxWidth: "600px" }}>
        <img
          src={item.image || "https://via.placeholder.com/600x400?text=Food+Image"}
          alt={item.name}
          className="card-img-top rounded-top-4"
        />
        <div className="card-body">
          <h3 className="fw-bold">{item.name}</h3>
          <p className="text-muted">{item.description}</p>
          <h5 className="text-success fw-semibold mb-4">₹{item.price.toFixed(2)}</h5>

          <button
            onClick={handleAddToCart}
            className="btn btn-success px-4 fw-semibold"
          >
            Add to Cart & Book 🍳
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
