import React from "react";
import { Navigate } from "react-router-dom";

// 👑 Protects admin-only routes
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    alert("Access denied! Admins only.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
