import { Navigate, useLocation } from "react-router-dom";
import { useUserRow } from "../../hooks/useAuth";

export default function OnboardingGuard({ children }) {
  const { userRow, loadingUserRow } = useUserRow();
  const location = useLocation();

  if (loadingUserRow) return null; 

  if (userRow && userRow.is_onboarded === false) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return children;
}
