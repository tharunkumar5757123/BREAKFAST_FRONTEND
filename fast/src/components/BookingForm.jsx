import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../services/api";

const BookingForm = () => {
  const cartItem = useSelector((state) => state.cart.item);

  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: 1,
  });

  // ✅ Automatically set today's date and current time (rounded to nearest 15 min)
  useEffect(() => {
    const now = new Date();

    // Format date (YYYY-MM-DD)
    const today = now.toISOString().split("T")[0];

    // Round time to nearest 15 minutes
    const minutes = Math.round(now.getMinutes() / 15) * 15;
    now.setMinutes(minutes);
    now.setSeconds(0);

    // Convert 24h → 12h format with AM/PM
    const hours = now.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(now.getMinutes()).padStart(2, "0");
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

    setForm({
      date: today,
      time: formattedTime,
      guests: 1,
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Save booking data for payment flow
      localStorage.setItem("bookingData", JSON.stringify(form));

      await API.post("/bookings", form);

      alert(`Booking confirmed for ${cartItem?.name || "your order"}!`);
    } catch (err) {
      console.error(err);
      alert("Booking failed!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        🗓️ Book Your Table
      </h2>

      {cartItem && (
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <p><strong>Item:</strong> {cartItem.name}</p>
          <p><strong>Price:</strong> ₹{cartItem.price}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          placeholder="Enter time (e.g., 12:00 PM)"
        />

        <input
          type="number"
          name="guests"
          min="1"
          value={form.guests}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
