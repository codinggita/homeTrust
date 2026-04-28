/**
 * src/lib/api.js
 * Central Axios API client.
 * - Injects JWT from localStorage on every request
 * - On 401 → clears auth and redirects to /login
 * - Base URL reads from VITE_API_URL env var (defaults to localhost:5000)
 */
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach token ────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ht_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: handle 401 ────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("ht_token");
      localStorage.removeItem("ht_user");
      // Soft redirect — avoid hard reload when possible
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────
export const authApi = {
  signup: (data) => api.post("/auth/signup", data),
  login:  (data) => api.post("/auth/login", data),
  me:     ()     => api.get("/auth/me"),
};

// ─── Neighborhood Reports ─────────────────────────────────────────
export const reportApi = {
  getReport:       (pincode) => api.get(`/report/${pincode}`),
  saveReport:      (pincode) => api.post("/report/save", { pincode }),
  getSavedReports: ()        => api.get("/report/saved"),
  deleteSaved:     (id)      => api.delete(`/report/saved/${id}`),
  compare:         (pincodes) => api.post("/report/compare", { pincodes }),
};

// ─── Listings ─────────────────────────────────────────────────────
export const listingApi = {
  getAll:   (params) => api.get("/listings", { params }),
  getById:  (id)     => api.get(`/listings/${id}`),
  create:   (formData) =>
    api.post("/listings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update:   (id, data) => api.put(`/listings/${id}`, data),
  remove:   (id)       => api.delete(`/listings/${id}`),
  report:   (id, data) => api.post(`/listings/${id}/report`, data),
  visit:    (id)       => api.post(`/listings/${id}/visit`),
};

// ─── Broker ───────────────────────────────────────────────────────
export const brokerApi = {
  getStats:    () => api.get("/broker/stats"),
  getListings: (params) => api.get("/broker/listings", { params }),
  uploadDoc:   (formData) =>
    api.post("/broker/verify-document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

// ─── Admin ────────────────────────────────────────────────────────
export const adminApi = {
  getReported:         (params) => api.get("/admin/reported", { params }),
  resolveReport:       (id, data) => api.post(`/admin/reported/${id}/resolve`, data),
  getVerificationQueue: (params) => api.get("/admin/verification-queue", { params }),
  verifyListing:       (id, data) => api.post(`/admin/verify-listing/${id}`, data),
  getAnalytics:        () => api.get("/admin/analytics"),
};
