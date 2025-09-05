import {useState} from "react";
import {supabase} from "../supabase-client";
import {validPassword, validEmail} from "../lib/validation";

export const AuthForm = (mode) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");


    const validate = () => {
        if (!email || !password) {
            setMessage("Please fill in both email and password fields.")
            return false;
        }

        if (!validEmail(email)) {
            setMessage("Please enter a valid email address.");
            return false;
        }

        if (mode === "register") {
            if (!validPassword(password)) {
                setMessage("Password must contain at least one number, one uppercase letter, and be at least 7 characters long.");
                return false;
            }
        }
        return true;
    }


    const handleSubmit = async () => {
        if (!validate()) return;

        let result;
        if (mode === "register") {
            result = await supabase.auth.signUp({email, password});
            setMessage(result.error ? result.error.message : "Registration successful! A confirmation link has been sent to your email.");


        } else if (mode === "login") {
            result = await supabase.auth.signInWithPassword({email, password});
            setMessage(result.error ? "Wrong email or password." : "");
        }
    };

    return {email, setEmail, password, setPassword, message, handleSubmit};
};

