import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const LoginPage = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signIn(email, password);
            navigate("/notes");
        } catch (err) {
            setError(err);
            setError("Invalid password or email");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">
                    <p className="mb-4 text-lg font-semibold">Login</p>
                    {error && (
                        <p style={{ color: "red" }}>
                            {"Invalid password or email"}
                        </p>
                    )}
                    <div className="flex flex-col">
                        <Input
                            className="mb-2 w-60"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            data-cy="login-email"
                        />
                        <Input
                            className="mb-2 w-60"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            data-cy="login-password"
                        />
                        <Button
                            className="bg-secondary text-black shadow-md hover:text-white"
                            onClick={handleLogin}
                        >
                            {" "}
                            Login{" "}
                        </Button>
                        <Button variant="link" asChild>
                            <Link to="/resetPassword">Forgot Password?</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;
