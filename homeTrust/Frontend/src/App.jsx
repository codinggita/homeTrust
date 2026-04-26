import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SearchPage from "./components/SearchPage";
import RentalPage from "./components/RentalPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/report/search" element={<SearchPage />} />
      <Route path="/listings/browse" element={<RentalPage />} />
    </Routes>
  );
}
