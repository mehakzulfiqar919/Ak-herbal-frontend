import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("ak_herbal_admin");
    if (stored) {
      const admin = JSON.parse(stored);
      if (admin?.token) {
        config.headers.Authorization = `Bearer ${admin.token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

export default api;
