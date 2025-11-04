import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { validEmail, validPassword } from "@/utils/validation";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const RegistrationPage = () => {
    const { signUp, signOut } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();


    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        if (!validEmail(email)) {
            setError (t("register.errorEmail"));
            return;
        }
        if (!validPassword(password)) {
            setError(
                t("register.errorPassword")
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(t("register.errorMatch"));
            return;
        }

        try {
            await signUp(email, password);
            await signOut();
            navigate("/registrationSuccess");
        } catch (error) {
            setError(error?.message || t("register.errorGeneric"));
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">
                    <p className="mb-4 text-lg font-semibold">
                        {t("register.welcome")}
                    </p>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <div className="flex flex-col">
                        <Input
                            className="mb-2 w-60"
                            type="email"
                            placeholder={t("placeholders.email")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            data-cy="register-email"
                        />
                        <Input
                            className="mb-2 w-60"
                            type="password"
                            placeholder={t("placeholders.password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            data-cy="register-password"
                        />
                        <Input
                            className="mb-2 w-60"
                            type="password"
                            placeholder={t("placeholders.confirmPassword")}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            data-cy="register-confirm-password"
                        />
                        <Button
                            className="bg-secondary text-black shadow-md hover:text-white"
                            onClick={handleSignup}
                        >
                            {" "}
                            {t("register.createAccountButton")}{" "}
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RegistrationPage;