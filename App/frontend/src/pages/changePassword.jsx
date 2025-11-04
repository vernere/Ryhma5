import { Header } from "@/components/ui/header.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Footer } from "@/components/ui/footer.jsx";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { validPassword } from "@/utils/validation.js";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
    const { changePassword, signOut, passwordRecovery } = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (!passwordRecovery) {
            navigate("/");
        }
    }, [passwordRecovery, navigate]);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError("");

        if (!validPassword(password)) {
            setError(t("password.change.validPasswordError"));
            return;
        }

        if (password !== confirmPassword) {
            setError(t("password.change.passwordMatchError"));
            return;
        }

        try {
            await changePassword(password);
            await signOut();
            navigate("/passwordChanged");
        } catch (err) {
            setError(err);
            setError(t("password.change.updateError"));
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">
                    <p className="mb-4 text-lg font-semibold">
                        {t("password.change.title")}
                    </p>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <div className="flex flex-col">
                        <Input
                            className="mb-2 w-60"
                            type="password"
                            placeholder={t("placeholders.newPassword")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Input
                            className="mb-2 w-60"
                            type="password"
                            placeholder={t("placeholders.confirmPassword")}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            className="bg-secondary text-black shadow-md hover:text-white"
                            onClick={handleUpdatePassword}
                        >
                            {t("password.change.updateButton")}
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChangePassword;
