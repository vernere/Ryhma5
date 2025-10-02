import {Header} from "@/components/ui/header";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Footer} from "@/components/ui/footer.jsx";
import {useAuth} from "@/hooks/useAuth.js";
import {useState} from "react";

const ResetPassword = () => {
    const {resetPassword} = useAuth();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await resetPassword(email);
            setMessage("Check our email");
        } catch (err) {
            setError(err);
            setError("Error sending reset link");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header/>
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">
                    <p className="mb-4 text-lg font-semibold">Forgot your password?</p>
                    {error && <p data-cy="sendResetPassowrdLinkError" style={{color: 'red'}}>{"Invalid email"}</p>}
                    {message && <p className="text-green-500">{message}</p>}
                    <div className="flex flex-col">
                        <Input className="mb-2 w-60" type="email" placeholder="Email" value={email} data-cy="resetPasswordEmail"
                               onChange={(e) => setEmail(e.target.value)}/>
                        <Button className="bg-secondary text-black shadow-md hover:text-white" data-cy="sendResetPasswordLink"
                                onClick={handleResetPassword}> Send reset link to email </Button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>);
};

export default ResetPassword;