import { useProfile } from "@/utils/ProfileContext";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

export const LanguageDropdown = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { i18n } = useTranslation();
    if (!isOpen) return null;

    const languages = {
        EN: "English",
        VN: "Vietnamese",
        AR: "Arabic",
    };

    const handleSelectLanguage = async (code) => {
        console.log("Selected language code:", code);
        const { error } = await supabase
            .from("users")
            .update({ language: code })
            .eq("id", user.id);
        if (error) {
            console.error("Error updating user language:", error);
        }
        i18n.changeLanguage(code);
        onClose();
    };

    return (
        <div className="bg-white rounded-lg shadow-xl max-w-md w-fit mx-4 absolute left-0 bottom-8 z-50">
            <div className="p-4">
                <ul className="mt-2">
                    {languages &&
                        Object.entries(languages).map(([code, name]) => (
                            <li
                                key={code}
                                onClick={() => handleSelectLanguage(code)}
                                className="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                            >
                                {name}
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export const LanguageButton = () => {
    const { profile } = useProfile();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <button
                onClick={() => handleOpen()}
                className="ml-4 px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
                {profile?.language?.toUpperCase() || "LANG"}
            </button>

            {isOpen && <LanguageDropdown isOpen={isOpen} onClose={handleOpen} />}
        </div>
    );
};
