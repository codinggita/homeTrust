import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}
