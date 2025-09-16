import { Footer } from "@/components/ui/footer";
import Header from "@/components/ui/feader";

const LandingPage = () => {
    return (
        <div className="flex min-h-screen w-full flex-col font-roboto bg-no-repeat bg-cover bg-center bg-[url('/src/assets/IMG_9931.jpg')]">
            <Header/>
            <div className="min-h-screen"></div>
            <Footer/>
        </div>
    );
};

export default LandingPage;