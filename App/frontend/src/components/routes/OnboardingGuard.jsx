import { useProfile } from "@/utils/ProfileContext";
import { Navigate, useLocation } from "react-router-dom";

export default function OnboardingGuard({ children }) {
  const { profile } = useProfile();
  const location = useLocation();
  if (!profile || profile === undefined) {
    return null;
  } 

  if (profile.is_onboarded === false) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  return children;
}
