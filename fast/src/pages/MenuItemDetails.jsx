import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { FaStar } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { getCart, saveCart } from "../utils/cartUtils";
import "../App.css"
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

    const updatedCart = existing
      ? cart.map((c) =>
          c._id === item._id
            ? { ...c, quantity: (c.quantity || 1) + 1 }
            : c
        )
      : [...cart, { ...item, quantity: 1 }];

    saveCart(updatedCart);
    navigate("/booking");
  };

  if (!item)
    return (
      <div className="text-center mt-5 text-muted fs-4">
        Loading item details…
      </div>
    );

  return (
    <>
      {/* TOP IMAGE HEADER */}
      <div className="menu-header">
        <img
          src={item.image || "https://via.placeholder.com/800x500?text=Food+Image"}
          alt={item.name}
          className="menu-header-img"
        />

        {/* OFFER BADGE */}
        <span className="offer-badge">FLAT 50% OFF</span>

        {/* BACK BUTTON */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
      </div>

      <div className="container py-4">
        <div className="menu-details">
          <h2 className="fw-bold">{item.name}</h2>

          {/* RATING */}
          <div className="d-flex align-items-center mt-2">
            <span className="rating-box">⭐ {item.rating || 4.3}</span>
            <span className="ms-2 text-muted">(500+ ratings)</span>
          </div>

          {/* PRICE */}
          <h3 className="price-text">₹{item.price}</h3>

          {/* DESCRIPTION */}
          <p className="text-muted mb-3">{item.description}</p>

          {/* VEG / NON-VEG TAG */}
          <div className="food-tag mt-2">
            <span className={item.isVeg ? "veg-dot" : "nonveg-dot"}></span>
            {item.isVeg ? "Veg" : "Non-Veg"}
          </div>
        </div>
      </div>

      {/* STICKY ADD TO CART BAR */}
      <div className="add-cart-bar">
        <div className="bar-left">
          <strong className="bar-price">₹{item.price}</strong>
        </div>

        <button className="add-cart-btn" onClick={handleAddToCart}>
          Add to Cart 🛒
        </button>
      </div>
    </>
  );
};

export default MenuItemDetails;
