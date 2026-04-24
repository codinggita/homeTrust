import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores";

export default function ProtectedRoute({ children, roles }) {
  const { isLoggedIn, role } = useAuthStore();
  const loc = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(loc.pathname)}`}
        replace
      />
    );
  }
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
