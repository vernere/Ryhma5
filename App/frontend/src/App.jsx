import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import RegistrationPage from "./pages/registrationPage";
import LoginPage from "./pages/loginPage";
import LandingPage from "./pages/landingPage";
import NotesPage from "./pages/notesPage";
import ResetPassword from "./pages/resetPassword.jsx";
import ChangePassword from "./pages/changePassword.jsx";
import { useAuth } from "./hooks/useAuth";
import PasswordChanged from "@/pages/passwordChanged.jsx";
import RegistrationSuccess from "./pages/registrationSuccess.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import PasswordRecoveryRoute from "./components/routes/PasswordRecoveryRoute";
import OnboardingGuard from "./components/routes/OnboardingGuard";
import OnboardingPage from "./pages/onboardingPage";
import { ProfileProvider } from "./utils/ProfileContext";


function App() {
    const { user, passwordRecovery, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return (

        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/passwordChanged" element={<PasswordChanged />} />
            <Route
                path="/registrationSuccess"
                element={<RegistrationSuccess />}
            />

            <Route
                path="/changePassword"
                element={
                    <PasswordRecoveryRoute>
                        {" "}
                        <ChangePassword />{" "}
                    </PasswordRecoveryRoute>
                }
            />

            <Route
                path="/onboarding"
                element={
                    <ProtectedRoute>
                        <OnboardingPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/notes"
                element={
                    <ProtectedRoute>
                        <ProfileProvider>
                            <OnboardingGuard>
                                <NotesPage />
                            </OnboardingGuard>
                        </ProfileProvider>
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to={user && !passwordRecovery ? "/notes" : "/"}
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default App;
