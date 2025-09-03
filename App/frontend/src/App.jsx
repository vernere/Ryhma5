import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import RegistrationForm from './pages/registrationForm'
import LoginForm from './pages/loginForm'
import LandingPage from './pages/LandingPage'

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </>
  )
}

export default App
