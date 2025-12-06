import axios from "axios";

const api = axios.create({
  // Local ke liye change kar sakte ho, abhi host backend use kar rahe:
  baseURL: "https://file-sharing-app-b.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
