import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { useAuth } from "../hooks/useAuth"
import { useState } from "react";
import { validEmail } from "@/utils/validation";
import { validPassword } from "@/utils/validation";

const RegistrationForm = () => {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        if (!validEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!validPassword(password)) {
            setError('Password must be at least 7 characters, contain an uppercase letter and a number.');
            return;
        }
        try {
            await signUp(email, password);
            alert('Signed up!');
        } catch (error) {
            setError(error?.message || 'Registration failed.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">
                    <p className="mb-4 text-lg font-semibold">Registration</p>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="flex flex-col">
                        <Input className="mb-2 w-60" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input className="mb-2 w-60" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button className="bg-secondary text-black shadow-md hover:text-white" onClick={handleSignup}> Register </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RegistrationForm;