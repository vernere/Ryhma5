
import {Navigate} from "react-router-dom";
import {useAuth} from "../../hooks/useAuth";
import PropTypes from "prop-types";


const PasswordRecoveryRoute = ({ children }) => {
    const { passwordRecovery } = useAuth();
    return passwordRecovery ? children : <Navigate to="/" replace />;
};

PasswordRecoveryRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default PasswordRecoveryRoute;
