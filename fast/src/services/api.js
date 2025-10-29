// src/services/api.js
import axios from "axios";

// ✅ Configure Axios base URL (backend on port 5000)
const API = axios.create({
  // baseURL: "http://localhost:5000/api",
    baseURL:"https://breakfast-backend-vi4j.onrender.com/api",
});

// ✅ Automatically attach token if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
