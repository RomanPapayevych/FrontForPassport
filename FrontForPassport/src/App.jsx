import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/login.jsx'
import Profile from './components/profile.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './components/registration.jsx'
import CreatePassport from './components/createPassport.jsx'
import DetailsPass from './components/detailsPass.jsx'
import DeleteOrder from './components/deleteOrder.jsx'
import ControlPanel from './components/controlPanel.jsx'
import ControlDeletePassport from './components/controlDeletePassport.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to ="/login"/>}/>  
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/registration' element={<Registration/>}/>
        <Route path='/createPassport' element={<CreatePassport/>}/>
        <Route path='/detailsPass' element={<DetailsPass/>}/>
        <Route path='/deleteOrder' element={<DeleteOrder/>}/>
        <Route path='/controlPanel' element={<ControlPanel/>}/>
        <Route path='/controlDeletePassport' element={<ControlDeletePassport/>}/>
        <Route path='*' element={<div>NotFound</div>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
