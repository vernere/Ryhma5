import {useEffect, useState} from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import RegistrationForm from './pages/registrationForm'
import LoginForm from './pages/loginForm'
import LandingPage from './pages/LandingPage'
import NotesPage from "./pages/notesPage";
import {supabase} from './lib/supabaseClient'

function App() {
    const [session, setSession] = useState(null)

    useEffect(() => {
        const fetchSession = async () => {
            const {data} = await supabase.auth.getSession()
            setSession(data.session);
        };

        fetchSession();

        const {data: listener} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);


    return (

        <div>
            <Routes>
                {session ? (
                    <Route path={"*"} element={<NotesPage/>}/>
                ) : (
                    <>
                        <Route path="/" element={<LandingPage/>}/>
                        <Route path="/register" element={<RegistrationForm/>}/>
                        <Route path="/login" element={<LoginForm/>}/>
                    </>
                )}
            </Routes>
        </div>
    );
}

export default App;
