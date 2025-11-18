import { useProfile } from "@/utils/ProfileContext";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

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

OnboardingGuard.propTypes = {
  children: PropTypes.node.isRequired,
};