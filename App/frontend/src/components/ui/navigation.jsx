import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";



const Navigation = () => {

    const { signOut } = useAuth()
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    }

    return (
        <div className=" px-4 py-3 border-b border-gray-200">
            <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                    Search notes
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                    Tags
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                    Favorites
                </button>
                <Button className={"w-20"} onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    );
};

export { Navigation };