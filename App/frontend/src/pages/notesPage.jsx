import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";

const NotesPage = () => {
    const { signOut } = useAuth() 

    return (
        <div>
            <h1>Notes</h1>
            <Button onClick={signOut}>Logout</Button>
        </div>
    );
};

export default NotesPage;
