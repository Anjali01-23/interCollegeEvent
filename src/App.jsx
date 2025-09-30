import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AllEvents from './pages/AllEvents'
import AdminDashboard from './pages/AdminDashboard'
import Home from './pages/Home'
const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/events' element={<AllEvents/>}/>
      <Route path='/admindashboard' element={<AdminDashboard/>}/>
      
      <Route/>
    </Routes>
    </>
  )
}

export default App
