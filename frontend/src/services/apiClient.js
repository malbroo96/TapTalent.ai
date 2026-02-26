import axios from "axios";

// Centralized HTTP client keeps credentials + error mapping consistent.
const normalizeBaseUrl = () => {
  const raw = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";
  const base = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  return base.endsWith("/api") ? base : `${base}/api`;
};

const apiClient = axios.create({
  baseURL: normalizeBaseUrl(),
  withCredentials: true,
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
