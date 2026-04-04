import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SharedFile from './pages/SharedFile'
import Landing from './pages/Landing'

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    supabase.auth.onAuthStateChange((_, s) => setSession(s))
  }, [])

  if (session === undefined) return (
    <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/share/:token" element={<SharedFile />} />
      </Routes>
    </BrowserRouter>
  )
}