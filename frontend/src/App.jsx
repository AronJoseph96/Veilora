// App.jsx — add these imports
import LoadingScreen from './pages/LoadingScreen'
import { useRef } from 'react'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [showLoader, setShowLoader] = useState(false)
  const prevSession = useRef(null)
  const dark = localStorage.getItem('theme') === 'dark'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    supabase.auth.onAuthStateChange((event, s) => {
      // Show loader only on fresh sign-in (null → session)
      if (!prevSession.current && s) {
        setShowLoader(true)
        setTimeout(() => setShowLoader(false), 2200) // matches animation duration
      }
      prevSession.current = s
      setSession(s)
    })
  }, [])

  if (session === undefined) return <LoadingScreen dark={dark} />
  if (showLoader)            return <LoadingScreen dark={dark} />

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