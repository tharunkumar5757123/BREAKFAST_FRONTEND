import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ✅ Logged-in user info
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // 🚫 Restrict non-admin access
  useEffect(() => {
    if (role !== "admin") {
      alert("Access denied! Admins only.");
      navigate("/");
    }
  }, [role, navigate]);

  // 📦 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");

      const safeUsers = res.data.map((u) => ({
        ...u,
        role: u.role || "user",
      }));

      setUsers(safeUsers);
      setFiltered(safeUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      if (error.response?.status === 403) {
        alert("Your session expired or you're not an admin.");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔄 Promote / Demote user
  const toggleRole = async (id, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";
      await API.put(`/users/${id}/role`, { role: newRole });
      alert(`User role updated to ${newRole.toUpperCase()}`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to change user role.");
    }
  };

  // 🗑 Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      alert("User deleted successfully.");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  // 🔍 Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(users);
    } else {
      const term = search.toLowerCase();
      setFiltered(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
        )
      );
    }
  }, [search, users]);

  if (loading) {
    return (
      <div className="text-center text-gray-600 mt-10 text-lg">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-50 py-10">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-xl p-8 border border-orange-100">
        <h2 className="text-3xl font-bold mb-8 text-center text-orange-700">
          👥 Admin User Management
        </h2>

        {/* 🔍 Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="🔍 Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* 🧾 Table */}
        {filtered.length === 0 ? (
          <p className="text-gray-600 text-center">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm sm:text-base rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-orange-200 text-gray-800">
                  <th className="border p-3 font-semibold">Name</th>
                  <th className="border p-3 font-semibold">Email</th>
                  <th className="border p-3 font-semibold">Role</th>
                  <th className="border p-3 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-orange-50 transition-all border-b last:border-b-0"
                  >
                    <td className="p-3 font-medium text-gray-800">{u.name}</td>
                    <td className="p-3 text-gray-600">{u.email}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          u.role === "admin"
                            ? "bg-blue-600 text-white"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        {u.role?.toUpperCase() || "USER"}
                      </span>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => toggleRole(u._id, u.role)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-all"
                      >
                        {u.role === "admin" ? "Demote" : "Promote"}
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
