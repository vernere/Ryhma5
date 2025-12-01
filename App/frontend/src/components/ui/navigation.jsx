import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { LanguageButton } from "@/components/ui/popups/LanguageDropdown";

const Navigation = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <>
            <div className="px-4 py-3 border-b border-gray-200 flex">
                <Button className={" border-gray-600 bg-gray-200 hover:bg-gray-300"} onClick={handleLogout}>
                    {t("common.logout")}
                </Button>
                <Button className={"underline text-blue-600 visited:text-purple-600 border-gray-600 bg-gray-200 hover:bg-gray-300"}>
                    <a href="https://github.com/vernere/Ryhma5" target="_blank" rel="noopener noreferrer">
                        {t("common.help")}
                    </a>
                </Button>
                <LanguageButton />

            </div>
        </>
    );
};

export { Navigation };
