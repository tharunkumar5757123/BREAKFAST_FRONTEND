import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Extract role correctly from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // 🚫 Restrict non-admin access
  useEffect(() => {
    if (role !== "admin") {
      alert("Access denied! Admins only.");
      navigate("/");
    }
  }, [role, navigate]);

  // 📦 Fetch all bookings
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/all");
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Mark booking as completed
  const handleComplete = async (id) => {
    try {
      await API.put(`/bookings/${id}/complete`);
      fetchBookings();
    } catch (error) {
      console.error("Error completing booking:", error);
      alert("Failed to update booking.");
    }
  };

  // ✅ Cancel booking
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading all bookings...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-10 px-4 bg-linear-to-br from-yellow-50 to-orange-100"
      style={{ animation: "fadeIn 0.6s ease-in-out" }}
    >
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          📅 All Customer Bookings
        </h2>

        {bookings.length === 0 ? (
          <p className="text-gray-600 text-center">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className="bg-orange-100 text-left text-gray-700 uppercase text-sm">
                  <th className="border p-3">User</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Time</th>
                  <th className="border p-3 text-center">Guests</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-orange-50 transition-all duration-200"
                  >
                    <td className="border p-3 font-medium text-gray-800">
                      {b.user?.name || "Unknown"}
                    </td>
                    <td className="border p-3 text-gray-600">
                      {b.user?.email || "-"}
                    </td>
                    <td className="border p-3">
                      {new Date(b.date).toLocaleDateString()}
                    </td>
                    <td className="border p-3">{b.time}</td>
                    <td className="border p-3 text-center">{b.guests}</td>
                    <td className="border p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                          b.status === "booked"
                            ? "bg-green-600"
                            : b.status === "completed"
                            ? "bg-blue-600"
                            : "bg-red-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="border p-3 text-center space-x-2">
                      {b.status === "booked" ? (
                        <>
                          <button
                            onClick={() => handleComplete(b._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleCancel(b._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-500 italic text-sm">
                          No actions
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 💫 Fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default AdminBookings;
