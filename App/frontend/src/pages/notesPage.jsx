import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useNavigate } from "react-router";

const NotesPage = () => {
    const { signOut } = useAuth()
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    }

    return (
        <div>
            <h1>Notes</h1>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default NotesPage;
