import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { useState } from 'react'
import {supabase } from "../supabase-client";


const RegistrationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");


    const handleRegister = async () => {
        const {  error } = await supabase.auth.signUp({
            email,
            password,
        });

        if(error) {
            setError(error.message);
        } else {
            alert("Registration successful!")
        }

    }


    return (
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">
                    <p className="mb-4 text-lg font-semibold">Registration</p>
                    <div className="flex flex-col">
                        <Input className="mb-2 w-60" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input className="mb-2 w-60" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  />
                        <Button className="bg-secondary text-black shadow-md hover:text-white" onClick={handleRegister}> Register </Button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RegistrationForm;