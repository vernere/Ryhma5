import { Header } from "@/components/ui/Header";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Footer} from "@/components/ui/footer.jsx";
import { useAuth } from "../hooks/useAuth"
import {useState} from "react";
import {validPassword} from "@/utils/validation.js";
import { useNavigate } from "react-router";


const ChangePassword = () => {
    const { changePassword, signOut } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!validPassword(password)) {
            setError('Password must be at least 7 characters, contain an uppercase letter and a number.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await changePassword(password);
            navigate("/passwordChanged");
            await signOut();


        } catch (err) {
            setError(err)
            setError("Error updating password.");
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">
                    <p className="mb-4 text-lg font-semibold">Create a new password</p>
                    {(error || message) && (
                        <p className={`mb-2 text-sm ${error ? 'text-red-500' : 'text-green-500'}`}>
                            {error || message}
                        </p>
                    )}
                    <div className="flex flex-col">
                        <Input className="mb-2 w-60" type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Input className="mb-2 w-60" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <Button className="bg-secondary text-black shadow-md hover:text-white" onClick={handleUpdatePassword}>Update</Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChangePassword;