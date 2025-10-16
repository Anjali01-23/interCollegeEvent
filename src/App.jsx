import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AllEvents from './pages/AllEvents'
import Home from './pages/Home'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'
import ParticipantDashboard from './pages/ParticipantDashboard'
import MyRegistrations from './pages/MyRegistrations'
const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={
       <ProtectedRoute allowedRoles={["College Admin"]}>
        <Dashboard/>
       </ProtectedRoute>
        }/>
      <Route path='/events' element={
        <ProtectedRoute allowedRoles={["Student"]}>
        <AllEvents/>
       </ProtectedRoute>
        }/>
      <Route path='/unauthorized' element={<Unauthorized/>}/>
      <Route path='/participant-dashboard' element={ <ProtectedRoute allowedRoles={["College Admin"]}>
        <ParticipantDashboard/>
       </ProtectedRoute>}/>
      <Route/>
      <Route path='/myregistrations' element={ <ProtectedRoute allowedRoles={["Student"]}>
        <MyRegistrations/>
       </ProtectedRoute>}/>
      <Route/>
    </Routes>
    </>
  )
}

export default App
