import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useAuthStore } from "./stores";
import { authApi } from "./lib/api";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AboutPage from "./pages/AboutPage";
import ReportSearchPage from "./pages/ReportSearchPage";
import ReportResultPage from "./pages/ReportResultPage";
import SavedReportsPage from "./pages/SavedReportsPage";
import CompareLocalitiesPage from "./pages/CompareLocalitiesPage";
import ListingsBrowsePage from "./pages/ListingsBrowsePage";
import ListingDetailPage from "./pages/ListingDetailPage";
import BrokerDashboardPage from "./pages/BrokerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProfilePage from "./pages/ProfilePage";
import PersonalProfilePage from "./pages/PersonalProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

import PropertyComparisonPage from "./pages/PropertyComparisonPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { isLoggedIn, token, logout, setUser } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn && token) {
      authApi.me()
        .then(({ data }) => setUser(data.user))
        .catch(() => logout());
    }
  }, [isLoggedIn, token, logout, setUser]);

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/report/search" element={<ReportSearchPage />} />
          <Route path="/report/result" element={<ReportResultPage />} />
          <Route path="/report/compare" element={<CompareLocalitiesPage />} />
          <Route
            path="/report/saved"
            element={
              <ProtectedRoute>
                <SavedReportsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/listings/browse" element={<ListingsBrowsePage />} />
          <Route path="/listings/compare" element={<PropertyComparisonPage />} />

          <Route path="/listings/:id" element={<ListingDetailPage />} />

          <Route
            path="/broker/dashboard"
            element={
              <ProtectedRoute roles={["broker", "admin"]}>
                <BrokerDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PersonalProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/settings"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}
