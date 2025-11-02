import { useTranslation } from "react-i18next";
import { LanguageButton } from "@/components/ui/popups/LanguageDropdown";

export const Footer = ({ className }) => {
    const { t } = useTranslation();

    return (

        <>
            <div
                className={`bg-secondary w-full text-black font-roboto-slab p-2 text-center ${className}`}
            >
                <p>
                    <strong>© 2025 Notely</strong>{t("footer.trademark")}
                </p>
                <LanguageButton />

            </div>
        </>
    );
};
