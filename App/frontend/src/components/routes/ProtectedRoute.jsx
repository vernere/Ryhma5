import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PropTypes from 'prop-types'

const ProtectedRoute = ({ children }) => {
    const { user, passwordRecovery } = useAuth();
    if (!user || passwordRecovery) {
        return <Navigate to="/" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;
