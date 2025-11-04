import { Footer } from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { CgUser, CgSearch, CgCode } from "react-icons/cg";
import { useTranslation } from "react-i18next";


const LandingPage = () => {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen w-full flex-col font-roboto bg-no-repeat bg-cover bg-center ">
            <div className="sticky top-0 z-50 bg-white border border-gray-200">
                <Header />
            </div>
            <div className="bg-white p-16 flex flex-col items-center mx-10 text-center">
                <div>
                    <span className="text-7xl ">{t("landing.h1")}</span>
                </div>
                <div className="mt-6">
                    <span className="text-2xl ">{t("landing.h2")}</span>
                </div>
            </div>
            <div className="flex justify-center text-xl p-6">{t("landing.features")}</div>
            <div className="flex flex-row justify-center pb-10">
                <div className="px-4 max-w-50 text-center">
                    <CgUser className="text-gray-600 mx-auto" />
                    <h1 className="text-lg">{t("landing.collaboration")}</h1>
                    <span>{t("landing.collaborationText")}</span>
                </div>
                <div className="h-40 w-px bg-gray-300"></div>
                <div className="px-4 max-w-50 text-center">
                    <CgSearch className="text-gray-600 mx-auto" />
                    <h1 className="text-lg">{t("landing.search")}</h1>
                    <span>{t("landing.searchText")}</span>
                </div>
                <div className="h-40 w-px bg-gray-300"></div>
                <div className="px-4 max-w-50 text-center">
                    <CgCode className="text-gray-600 mx-auto" />
                    <h1 className="text-lg">{t("landing.code")}</h1>
                    <span>{t("landing.codeText")}</span>
                </div>
            </div>
            <div className=" bg-white border border-gray-200">
                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;