import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { getCart, saveCart } from "../utils/cartUtils";
import "../App.css"
const MenuItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

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

  const handleAddToCart = () => {
    if (!item) return;

    const cart = getCart();
    const existing = cart.find((c) => c._id === item._id);

    const updatedCart = existing
      ? cart.map((c) =>
          c._id === item._id ? { ...c, quantity: (c.quantity || 1) + 1 } : c
        )
      : [...cart, { ...item, quantity: 1 }];

    saveCart(updatedCart);
    navigate("/booking");
  };

  if (!item)
    return (
      <div className="text-center mt-5 text-muted fs-4">
        Loading item…
      </div>
    );

  return (
    <>
      {/* HEADER IMAGE */}
      <div className="menu-header">
        <img
          src={item.image || "https://via.placeholder.com/800x500?text=Food+Image"}
          alt={item.name}
          className="menu-header-img"
        />

        {/* OFFER BADGE */}
        <span className="offer-badge">FLAT 50% OFF</span>
      </div>

      <div className="container py-4">
        <div className="menu-content">
          {/* TITLE + RATING */}
          <h2 className="fw-bold">{item.name}</h2>

          <div className="rating-row">
            <span className="rating-box">⭐ {item.rating || 4.3}</span>
            <span className="rating-votes ms-2">(500+ ratings)</span>
          </div>

          {/* PRICE */}
          <h3 className="price-text">₹{item.price.toFixed(2)}</h3>

          {/* DESCRIPTION */}
          <p className="text-muted">{item.description}</p>

          {/* TAGS */}
          <div className="food-tag">
            <span className={item.isVeg ? "veg-dot" : "nonveg-dot"}></span>
            {item.isVeg ? "Veg" : "Non-Veg"}
          </div>
        </div>
      </div>

      {/* STICKY ADD TO CART BAR */}
      <div className="add-cart-bar">
        <div className="add-cart-left">
          <strong className="bar-price">₹{item.price.toFixed(2)}</strong>
        </div>

        <button className="add-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </>
  );
};

export default MenuItem;
