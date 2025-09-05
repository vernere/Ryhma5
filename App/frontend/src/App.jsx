import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegistrationForm from './pages/registrationForm';
import LoginForm from './pages/loginForm';
import LandingPage from './pages/LandingPage';
import NotesPage from './pages/notesPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      {user ? (
        <Route path="*" element={<NotesPage />} />
      ) : (
        <>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
