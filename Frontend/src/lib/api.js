/**
 * src/lib/api.js
 * Central Axios API client.
 * - Injects JWT from localStorage on every request
 * - On 401 → clears auth and redirects to /login
 * - Base URL reads from VITE_API_URL env var
 */

import axios from "axios";

// Backend URL from .env
const API_URL =
  import.meta.env.VITE_API_URL || "https://hometrust.onrender.com";

// Axios instance
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
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

// ── Response interceptor: handle 401 unauthorized ─────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ht_token");
      localStorage.removeItem("ht_user");

      window.location.href = `/login?redirect=${encodeURIComponent(
        window.location.pathname
      )}`;
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
    api.post("/listings", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

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
    api.post("/broker/verify-document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
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