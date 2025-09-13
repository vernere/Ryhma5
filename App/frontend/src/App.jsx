import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import LandingPage from './pages/LandingPage';
import NotesPage from './pages/NotesPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/notes" element={<NotesPage />} />
          <Route path="*" element={<Navigate to="/notes" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
