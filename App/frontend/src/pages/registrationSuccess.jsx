import {Header} from "@/components/ui/Header";
import {Footer} from "@/components/ui/footer.jsx";
import {Button} from "@/components/ui/Button";
import {Link} from "react-router-dom";


const RegistrationSuccess = () => {

    return (
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header/>
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">

                    <p className="mb-4 text-lg font-semibold">Verify Your Account</p>
                    <p className="mb-6 text-gray-600">We’ve sent a confirmation link to your email.
                        <br/> Please verify your account to start using Notely.</p>
                    <div className="flex flex-col">
                        <Button asChild className="bg-secondary text-black shadow-md hover:text-white">
                            <Link to="/login">Go to Login</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>);
};

export default RegistrationSuccess;