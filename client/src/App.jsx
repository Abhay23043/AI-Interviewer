import React, { useEffect } from 'react'
import '../src/App.css'
import { Route, Routes } from 'react-router-dom'
import Home from '../src/Pages/Home.jsx'
import Login from '../src/Pages/Login.jsx'
import Register from '../src/Pages/Register.jsx'
import Auth from '../src/Pages/Auth.jsx'
import Logout from './Pages/Logout.jsx'
import History from './Pages/History.jsx'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice.js'
import Step1Setup from './components/Step1Setup.jsx'
import InterviewPage from './Pages/InterviewPage.jsx'
import Pricing from './Pages/Pricing.jsx'
import InterviewReport from './Pages/InterviewReport.jsx'

export const ServerUrl = import.meta.env.VITE_API_URL

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        dispatch(setUserData(null))
        return
      }
      try {
        const result = await axios.get(`${ServerUrl}/api/user/getMe`);
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error.message)
        localStorage.removeItem("token")
        delete axios.defaults.headers.common.Authorization
        dispatch(setUserData(null))
      }
    }
    getUser()
  },[dispatch])
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Register />} />
      <Route path='/google' element={<Auth />} />
      <Route path='/logout' element={<Logout />} />
      <Route path='/history' element={<History />} />
      <Route path='/interview' element={<InterviewPage />} />
      <Route path='/pricing' element={<Pricing />} />
      <Route path='/report/:id' element={<InterviewReport />} />

    </Routes>
  )
}

export default App