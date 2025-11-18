import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PasswordRecoveryRoute = ({ children }) => {
    const { passwordRecovery } = useAuth();
    return passwordRecovery ? children : <Navigate to="/" replace />;
};

export default PasswordRecoveryRoute;
