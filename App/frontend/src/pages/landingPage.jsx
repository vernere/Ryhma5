import { Footer } from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { CgUser, CgSearch, CgCode } from "react-icons/cg";

const LandingPage = () => {
    return (
        <div className="flex min-h-screen w-full flex-col font-roboto bg-no-repeat bg-cover bg-center ">
            <div className="sticky top-0 z-50 bg-white border border-gray-200">
                <Header />
            </div>
            <div className="bg-white p-16 flex flex-col items-center mx-10 text-center">
                <div>
                    <span className="text-7xl ">The note application for tech enthusiasts</span>
                </div>
                <div className="mt-6">
                    <span className="text-2xl ">Get all the functionality of a traditional note taking application, with added benefits like collaborative features, tagged notes for easy search and easy to add code snippets.</span>
                </div>
            </div>
            <div className="flex justify-center text-xl p-6">Features</div>
            <div className="flex flex-row justify-center pb-10">
                <div className="px-4 max-w-50 text-center">
                    <CgUser className="text-gray-600 mx-auto" />
                    <h1 className="text-lg">Collaboration</h1>
                    <span>Collaborative features that allow users to invite other users to shared notes for easy and seamless teamwork.</span>
                </div>
                <div className="h-40 w-px bg-gray-300"></div>
                <div className="px-4 max-w-50 text-center">
                    <CgSearch className="text-gray-600 mx-auto" />
                    <h1 className="text-lg">Search and tagging</h1>
                    <span>Tagging of notes and advanced search gives you control over what things you want to have handy, and organize your notes accordingly.</span>
                </div>
                <div className="h-40 w-px bg-gray-300"></div>
                <div className="px-4 max-w-50 text-center">
                    <CgCode className="text-gray-600 mx-auto" />
                    <h1 className="text-lg">Code editing</h1>
                    <span>Code pasting and formatting has never been easier, with in applictaion syntax highlighting and formatting giving you control over what you display. </span>
                </div>
            </div>
            <div className=" bg-white border border-gray-200">
                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;