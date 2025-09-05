import { Header } from '../components/header'
import { Footer } from '../components/footer'


const LandingPage = () => {

    return (
        <div>
            <Header></Header>
            <div className="min-h-screen w-full flex-col font-roboto bg-no-repeat bg-cover bg-center bg-[url('/src/assets/IMG_9931.jpg')]"></div>
            <Footer></Footer>
        </div>
    );
};

export default LandingPage;