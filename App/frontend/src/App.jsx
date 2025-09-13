import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import LandingPage from './pages/LandingPage';
import NotesPage from './pages/NotesPage';
import ResetPassword from './pages/resetPassword.jsx';
import ChangePassword from './pages/changePassword.jsx';
import { useAuth } from './hooks/useAuth';
import PasswordChanged from "@/pages/passwordChanged.jsx";
import RegistrationSuccess from './pages/registrationSuccess.jsx';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/passwordChanged" element={<PasswordChanged />} />
          <Route path="*" element={<Navigate to="/notes" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/passwordChanged" element={<PasswordChanged />} />
          <Route path="/registrationSuccess" element={<RegistrationSuccess />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
