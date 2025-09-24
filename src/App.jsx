import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AllEvents from './pages/AllEvents'
const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Navigate to="/dashboard"/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/events' element={<AllEvents/>}/>
    </Routes>
    </>
  )
}

export default App
