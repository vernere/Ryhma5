import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function OnboardingGuard({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user || user === undefined) return null;

  if (user.is_onboarded === false) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return children;
}
