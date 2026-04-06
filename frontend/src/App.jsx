import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { supabase } from './supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SharedFile from './pages/SharedFile'
import Landing from './pages/Landing'
import LoadingScreen from './pages/LoadingScreen'

export default function App() {
  const [session, setSession] = useState(undefined)   // undefined = not yet checked
  const [showLoader, setShowLoader] = useState(false)  // post-login loader
  const prevSession = useRef(null)
  const dark = localStorage.getItem('theme') === 'dark'

  useEffect(() => {
    // 1. Get current session on mount
    supabase.auth.getSession().then(({ data }) => {
      prevSession.current = data.session
      setSession(data.session)
    })

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      // Only trigger the post-login loader on a fresh sign-in
      if (event === 'SIGNED_IN' && !prevSession.current) {
        setShowLoader(true)
        setTimeout(() => setShowLoader(false), 2200)
      }
      prevSession.current = s
      setSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Still resolving auth — show loader
  if (session === undefined) return <LoadingScreen dark={dark} />

  // Fresh login — show loader before dashboard
  if (showLoader) return <LoadingScreen dark={dark} />

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