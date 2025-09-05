import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import RegistrationPage from './pages/registrationPage'
import LoginPage from './pages/loginPage'
import MainPage from './pages/mainPage'


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </>
  )
}

export default App
