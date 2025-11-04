import {Header} from "@/components/ui/header";
import {Footer} from "@/components/ui/footer.jsx";
import {Button} from "@/components/ui/button";
import {Link} from "react-router-dom";
import { useTranslation } from "react-i18next";

const RegistrationSuccess = () => {
    const { t } = useTranslation();

    return (
        
        <div className="min-h-screen flex flex-col bg-gray-400">
            <Header/>
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md flex-col justify-items-center">

                    <p className="mb-4 text-lg font-semibold">{t("register.verify")}</p>
                    <p className="mb-6 text-gray-600">{t("register.sentLink")}
                        <br/> {t("register.start")}</p>
                    <div className="flex flex-col">
                        <Button asChild className="bg-secondary text-black shadow-md hover:text-white">
                            <Link to="/login">{t("register.goToLogin")}</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>);
};

export default RegistrationSuccess;