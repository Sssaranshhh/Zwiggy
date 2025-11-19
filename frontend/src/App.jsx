import React from 'react'
import {Routes, Route} from "react-router-dom"
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import './index.css'
import ForgotPassword from './pages/ForgotPassword'
export const serverUrl = "http://localhost:3000"

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
    </Routes>
  )
}