import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Account from './pages/Account'
import Analytics from './pages/Analytics'
import Dashboard from './pages/Dashboard'
import TicketManagement from './pages/Tickets'

// export const backendUrl = "https://xchnagetechsecom-backend.onrender.com"
export const backendUrl = "https://xchnagetechsecom-main-15-12-2024-2.onrender.com"
export const currency = '₹'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className=' min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<Dashboard token={token} />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/account' element={<Account />} />
                <Route path='/analytics' element={<Analytics />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/ticket-management' element={<TicketManagement token={token} />}/>
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App
