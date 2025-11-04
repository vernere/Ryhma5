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
            <div className=" px-4 py-3 border-b border-gray-200 flex relative">
                <Button className={"w-20"} onClick={handleLogout}>
                    {t("common.logout")}
                </Button>

                <LanguageButton/>
            </div>
        </>
    );
};

export { Navigation };
