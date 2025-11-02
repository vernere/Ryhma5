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
import { useTranslation } from "react-i18next";

function App() {
    const { user, passwordRecovery, loading } = useAuth();
    const { t } = useTranslation();

    if (loading) return <p>{t("common.loading")}</p>;

    return (
        <Routes>
            <Route path="/" element={<ProfileProvider><LandingPage /></ProfileProvider>} />
            <Route path="/register" element={<ProfileProvider><RegistrationPage /></ProfileProvider>} />
            <Route path="/login" element={<ProfileProvider><LoginPage /></ProfileProvider>} />
            <Route path="/resetPassword" element={<ProfileProvider><ResetPassword /></ProfileProvider>} />
            <Route path="/passwordChanged" element={<ProfileProvider><PasswordChanged /></ProfileProvider>} />
            <Route
                path="/registrationSuccess"
                element={<ProfileProvider><RegistrationSuccess /></ProfileProvider>}
            />

            <Route
                path="/changePassword"
                element={
                    <ProfileProvider>
                        <PasswordRecoveryRoute>
                            {" "}
                            <ChangePassword />{" "}
                        </PasswordRecoveryRoute>
                    </ProfileProvider>

                }
            />

            <Route
                path="/onboarding"
                element={
                    <ProtectedRoute>
                        <ProfileProvider>
                            <OnboardingPage />
                        </ProfileProvider>
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
                    <ProfileProvider>
                        <Navigate
                            to={user && !passwordRecovery ? "/notes" : "/"}
                            replace
                        />
                    </ProfileProvider>

                }
            />
        </Routes>
    );
}

export default App;
