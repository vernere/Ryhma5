import './App.css';
import {Navigate, Route, Routes} from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import LandingPage from './pages/LandingPage';
import NotesPage from './pages/NotesPage';
import ResetPassword from './pages/resetPassword.jsx';
import ChangePassword from './pages/changePassword.jsx';
import {useAuth} from './hooks/useAuth';
import PasswordChanged from "@/pages/passwordChanged.jsx";
import RegistrationSuccess from './pages/registrationSuccess.jsx';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PasswordRecoveryRoute from './components/routes/PasswordRecoveryRoute';

function App() {
    const {user, passwordRecovery, loading} = useAuth();

    if (loading) return <p>Loading...</p>;

    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/register" element={<RegistrationForm/>}/>
            <Route path="/login" element={<LoginForm/>}/>
            <Route path="/resetPassword" element={<ResetPassword/>}/>
            <Route path="/passwordChanged" element={<PasswordChanged/>}/>
            <Route path="/registrationSuccess" element={<RegistrationSuccess/>}/>

            <Route path="/changePassword" element={<PasswordRecoveryRoute> <ChangePassword/> </PasswordRecoveryRoute>}/>
            <Route path="/notes" element={<ProtectedRoute> <NotesPage/> </ProtectedRoute>}/>

            <Route path="*" element={<Navigate to={user && !passwordRecovery ? "/notes" : "/"} replace/>}/>
        </Routes>);
}

export default App;
