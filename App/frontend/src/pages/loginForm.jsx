import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { AuthForm } from "../hooks/authForm";


const LoginForm = () => {
const { email, setEmail, password, setPassword, message, handleSubmit } = AuthForm("login");


    return (
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">
                    <p className="mb-4 text-lg font-semibold">Login</p>
                    <div className="flex flex-col">
                        <Input className="mb-2 w-60" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value) } />
                        <Input className="mb-2 w-60" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value) } />
                        <Button className="bg-secondary text-black shadow-md hover:text-white" onClick={handleSubmit}> Login </Button>
                        {message && <p className="text-black mt-2">{message}</p>}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LoginForm;