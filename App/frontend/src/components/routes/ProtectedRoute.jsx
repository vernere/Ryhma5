import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
    const { user, passwordRecovery } = useAuth();
    if (!user || passwordRecovery) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
