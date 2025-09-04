import { supabase } from "../supabase-client";
import { Button } from "@/components/ui/button";

const NotesPage = () => {

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error.message);
        } else {
            console.log("Logged out successfully");
        }
    };

    return (
        <div>
            <h1>Notes</h1>
            <Button onClick={handleLogout}>Logout</Button>

        </div>
    );
};

export default NotesPage;
