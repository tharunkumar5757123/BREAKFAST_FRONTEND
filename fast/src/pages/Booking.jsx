import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Card, Button, Form, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const Booking = () => {
  const navigate = useNavigate();
  const { menuItemId } = useParams();
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  // 🥐 Load selected menu item (from localStorage)
  useEffect(() => {
    const item = localStorage.getItem("selectedMenuItem");
    if (item) {
      setSelectedMenuItem(JSON.parse(item));
    } else {
      setError("Please select a menu item from the menu first.");
    }
  }, [menuItemId]);

  // 🗓 Fetch available slots
  const fetchAvailability = async (selectedDate) => {
    try {
      const res = await API.get(`/bookings/availability?date=${selectedDate}`);
      setSlots(res.data.slots);
    } catch {
      setError("Failed to load availability.");
    }
  };

  // 📅 Handle date change
  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedTime("");
    setMessage("");
    fetchAvailability(e.target.value);
  };

  // 🧾 Submit booking
  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await API.post("/bookings", {
        date,
        time: selectedTime,
        guests,
        menuItem: selectedMenuItem?._id || null,
      });

      setMessage("Booking successful! 🎉");
      localStorage.removeItem("selectedMenuItem");
      setTimeout(() => navigate("/profile"), 2000); // redirect to profile or bookings list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    }
  };

  // 🔒 Prevent direct access
  if (!selectedMenuItem) {
    return (
      <Card className="mx-auto mt-5 shadow text-center p-4" style={{ maxWidth: "600px" }}>
        <h4>🍽 Please select a menu item first!</h4>
        <p className="text-muted">Go to the menu and add an item to book your breakfast.</p>
        <Button variant="primary" onClick={() => navigate("/menu")}>
          Go to Menu
        </Button>
      </Card>
    );
  }

  return (
    <Card className="mx-auto mt-5 shadow" style={{ maxWidth: "600px" }}>
      <Card.Body>
        <h3 className="text-center mb-4">Book Your Breakfast 🍳</h3>

        {/* Selected Menu Item */}
        <div className="border rounded p-3 mb-4 bg-light d-flex align-items-center">
          <img
            src={selectedMenuItem.image || "https://via.placeholder.com/80"}
            alt={selectedMenuItem.name}
            className="rounded me-3"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
          <div>
            <h5 className="mb-1">{selectedMenuItem.name}</h5>
            <p className="mb-0 text-muted">
              ${selectedMenuItem.price} — {selectedMenuItem.description}
            </p>
          </div>
        </div>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleBooking}>
          <Form.Group className="mb-3">
            <Form.Label>Select Date</Form.Label>
            <Form.Control type="date" value={date} onChange={handleDateChange} required />
          </Form.Group>

          {slots.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Available Time Slots</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={
                      selectedTime === slot.time
                        ? "primary"
                        : slot.remaining > 0
                        ? "outline-primary"
                        : "secondary"
                    }
                    disabled={slot.remaining === 0}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time} ({slot.remaining} left)
                  </Button>
                ))}
              </div>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Number of Guests</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="10"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="success"
            className="w-100"
            disabled={!selectedTime || !date}
          >
            Confirm Booking
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Booking;
