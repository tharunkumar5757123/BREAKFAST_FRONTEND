import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Card, Button, Alert, Spinner, Table } from "react-bootstrap";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 📦 Fetch user bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Cancel booking
  const cancelBooking = async (id) => {
    try {
      await API.patch(`/bookings/${id}`, { status: "cancelled" });
      setMessage("Booking cancelled successfully!");
      fetchBookings();
    } catch (err) {
      setError("Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: "800px" }}>
      <Card.Body>
        <h3 className="text-center mb-4">My Bookings</h3>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-center">No bookings yet.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td>{b.guests}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.status === "cancelled"
                          ? "bg-danger"
                          : b.status === "completed"
                          ? "bg-success"
                          : "bg-primary"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {b.status === "booked" ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => cancelBooking(b._id)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled>
                        N/A
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default BookingList;
