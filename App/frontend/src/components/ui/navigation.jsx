import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { NotepadText, Heart } from "lucide-react";

const Navigation = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <div className=" px-4 py-3 border-b border-gray-200">
            <Button className={"w-20"} onClick={handleLogout}>
                Logout
            </Button>
        </div>
    );
};

export { Navigation };
