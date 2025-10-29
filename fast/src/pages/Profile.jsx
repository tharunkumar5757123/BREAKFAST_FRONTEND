import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Modal, Button, Form } from "react-bootstrap";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    date: "",
    time: "",
    guests: 1,
  });

  // ✅ Fetch profile info
  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      setUser(res.data.user);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  // ✅ Fetch user's bookings
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cancel booking
  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await API.put(`/bookings/cancel/${id}`);
      fetchBookings();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Unable to cancel booking. Try again.");
    }
  };

  // ✅ Delete booking
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    try {
      await API.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      console.error("Failed to delete booking:", error);
      alert("Unable to delete booking. Try again.");
    }
  };

  // ✅ Edit booking (open modal)
  const handleEditClick = (b) => {
    setSelectedBooking(b);
    setEditForm({
      date: b.date,
      time: b.time,
      guests: b.guests,
    });
    setShowEditModal(true);
  };

  // ✅ Save booking updates
  const handleEditSubmit = async () => {
    try {
      await API.put(`/bookings/update/${selectedBooking._id}`, editForm);
      setShowEditModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Failed to update booking:", error);
      alert("Unable to update booking. Try again.");
    }
  };

  // ✅ Auto refresh on mount
  useEffect(() => {
    fetchProfile();
    fetchBookings();
  }, []);

  // ✅ Auto-refresh after successful payment
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (sessionId) {
      API.get(`/payments/session/${sessionId}`)
        .then(() => fetchBookings())
        .catch((err) => console.error("Payment verify failed:", err));
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-600 mt-10 animate-pulse">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-8 border border-blue-100 animate-fadeIn">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          👤 My Profile
        </h2>

        {user && (
          <div className="bg-blue-50 p-5 rounded-xl shadow-sm mb-8 border border-blue-100">
            <p className="text-lg mb-1">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-lg mb-1">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-lg">
              <strong>Role:</strong>{" "}
              <span className="capitalize text-blue-600">{user.role}</span>
            </p>
          </div>
        )}

        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          📅 My Bookings
        </h3>

        {bookings.length === 0 ? (
          <p className="text-gray-600 text-center">No bookings yet.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p><strong>Date:</strong> {b.date}</p>
                    <p><strong>Time:</strong> {b.time}</p>
                    <p><strong>Guests:</strong> {b.guests}</p>
                    <p
                      className={`font-medium mt-1 ${
                        b.status === "cancelled"
                          ? "text-red-500"
                          : b.status === "completed"
                          ? "text-blue-600"
                          : b.status === "pending-payment"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      Status: {b.status.replace("-", " ")}
                    </p>
                  </div>

                  <div className="space-x-2">
                    {b.status === "booked" && (
                      <>
                        <button
                          onClick={() => handleEditClick(b)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => cancelBooking(b._id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {b.status === "pending-payment" && (
                      <span className="text-sm text-yellow-600 font-semibold">
                        Waiting for payment confirmation...
                      </span>
                    )}

                    <button
                      onClick={() => deleteBooking(b._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✨ Edit Booking Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editForm.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={editForm.time}
                onChange={(e) =>
                  setEditForm({ ...editForm, time: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Guests</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={editForm.guests}
                onChange={(e) =>
                  setEditForm({ ...editForm, guests: Number(e.target.value) })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
