import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { t } = useTranslation();


    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signIn(email, password);
            navigate("/notes");
        } catch (err) {
            setError(err);
            setError(t("login.error"));
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">
                    <p className="mb-4 text-lg font-semibold">{t("login.loginHeader")}</p>
                    {error && (
                        <p style={{ color: "red" }}>
                            {t("login.error")}
                        </p>
                    )}
                    <div className="flex flex-col">
                        <Input
                            className="mb-2 w-60"
                            type="email"
                            placeholder={t("placeholders.email")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            data-cy="login-email"
                        />
                        <Input
                            className="mb-2 w-60"
                            type="password"
                            placeholder={t("placeholders.password")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            data-cy="login-password"
                        />
                        <Button
                            className="bg-secondary text-black shadow-md hover:text-white"
                            onClick={handleLogin}
                        >
                            {" "}
                            {t("login.loginHeader")}{" "}
                        </Button>
                        <Button variant="link" asChild data-cy="resetPasswordButton">
                            <Link to="/resetPassword">{t("login.forgot")}</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;
