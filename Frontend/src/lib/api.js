/**
 * src/lib/api.js
 * Central Axios API client.
 * - Injects JWT from localStorage on every request
 * - On 401 → clears auth and redirects to /login
 * - Base URL reads from VITE_API_URL env var
 * - Implements retry logic for 503 (Render cold starts)
 */

import axios from "axios";
import { toast } from "sonner";

// Backend URL from .env (Strictly priority to Env)
const API_URL =
  import.meta.env.VITE_API_URL || "https://hometrust.onrender.com";

// Axios instance
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 45000, // Increased for heavy report generation
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach JWT token ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ht_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 & retry logic ────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // 1. Handle 401 Unauthorized
    if (response?.status === 401) {
      localStorage.removeItem("ht_token");
      localStorage.removeItem("ht_user");

      // Only redirect if not already on login/signup
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/signup")) {
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`;
      }
    }

    // 2. Handle Retries for 503 (Render Cold Start) or Network Errors
    // We only retry GET requests to prevent accidental double-posts
    if (config && (response?.status === 503 || !response) && config.method === "get" && !config._retry) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;

      if (config._retryCount <= 2) {
        // Exponential backoff: 1s, 2s
        const delay = config._retryCount * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(config);
      }
    }

    // 3. Global Error Notification for 500s (optional but helpful)
    if (response?.status >= 500) {
       console.error("Server Error:", response.data);
    }

    return Promise.reject(error);
  }
);

// ─── Auth API ──────────────────────────────────────────────────────
export const authApi = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ─── Neighborhood Reports API ─────────────────────────────────────
export const reportApi = {
  getReport: (pincode) => api.get(`/report/${pincode}`),
  saveReport: (pincode) => api.post("/report/save", { pincode }),
  getSavedReports: () => api.get("/report/saved"),
  deleteSaved: (id) => api.delete(`/report/saved/${id}`),
  compare: (pincodes) => api.post("/report/compare", { pincodes }),
};

// ─── Listings API ──────────────────────────────────────────────────
export const listingApi = {
  getAll: (params) => api.get("/listings", { params }),
  getById: (id) => api.get(`/listings/${id}`),

  create: (formData) =>
    api.post("/listings", formData), // Let Axios set Content-Type for FormData

  update: (id, data) => api.put(`/listings/${id}`, data),
  remove: (id) => api.delete(`/listings/${id}`),
  report: (id, data) => api.post(`/listings/${id}/report`, data),
  visit: (id) => api.post(`/listings/${id}/visit`),
};

// ─── Broker API ────────────────────────────────────────────────────
export const brokerApi = {
  getStats: () => api.get("/broker/stats"),
  getListings: (params) => api.get("/broker/listings", { params }),

  uploadDoc: (formData) =>
    api.post("/broker/verify-document", formData), // Let Axios set Content-Type
};

// ─── Admin API ─────────────────────────────────────────────────────
export const adminApi = {
  getReported: (params) => api.get("/admin/reported", { params }),

  resolveReport: (id, data) =>
    api.post(`/admin/reported/${id}/resolve`, data),

  getVerificationQueue: (params) =>
    api.get("/admin/verification-queue", { params }),

  verifyListing: (id, data) =>
    api.post(`/admin/verify-listing/${id}`, data),

  getAnalytics: () => api.get("/admin/analytics"),
};