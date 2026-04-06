import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fn = isSignup ? supabase.auth.signUp : supabase.auth.signInWithPassword
    const { error } = await fn.call(supabase.auth, { email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  const bg = dark
    ? 'linear-gradient(145deg, #0f0f14 0%, #15151f 50%, #0f0f14 100%)'
    : 'linear-gradient(145deg, #f5f0eb 0%, #ede8e0 40%, #e8e2d8 100%)'

  const cardBg = dark ? '#1a1a24' : '#ffffff'
  const cardBorder = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'
  const textPrimary = dark ? '#f0ece8' : '#1a1714'
  const textSecondary = dark ? '#6b6878' : '#8a847c'
  const inputBg = dark ? '#111118' : '#f9f7f5'
  const inputBorder = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const inputFocusBorder = dark ? '#6c63f5' : '#1a1714'
  const dividerColor = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const toggleBg = dark ? '#1f1f2e' : '#f0ece8'
  const toggleBorder = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: bg,
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      padding: '20px',
      transition: 'background 0.4s ease',
      position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        .login-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border-radius: 12px;
          border: 1.5px solid ${inputBorder};
          background: ${inputBg};
          color: ${textPrimary};
          font-size: 14.5px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .login-input::placeholder { color: ${textSecondary}; }
        .login-input:focus { border-color: ${inputFocusBorder}; box-shadow: 0 0 0 3px ${dark ? 'rgba(108,99,245,0.12)' : 'rgba(26,23,20,0.06)'}; }
        .btn-main {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: ${dark ? 'linear-gradient(135deg, #6c63f5, #4f46e5)' : '#1a1714'};
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.01em;
        }
        .btn-main:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px ${dark ? 'rgba(108,99,245,0.35)' : 'rgba(0,0,0,0.25)'}; }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-google {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          border: 1.5px solid ${inputBorder};
          background: ${inputBg};
          color: ${textPrimary};
          font-size: 14.5px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }
        .btn-google:hover { background: ${dark ? 'rgba(255,255,255,0.05)' : '#f5f2ef'}; transform: translateY(-1px); }
        .toggle-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1.5px solid ${toggleBorder};
          background: ${toggleBg};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: ${textSecondary};
          z-index: 100;
        }
        .toggle-btn:hover { transform: scale(1.05); color: ${textPrimary}; }
        .switch-link {
          background: none;
          border: none;
          color: ${dark ? '#6c63f5' : '#1a1714'};
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          text-decoration: underline;
          text-decoration-color: transparent;
          transition: text-decoration-color 0.2s;
        }
        .switch-link:hover { text-decoration-color: currentColor; }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .card-enter { animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes cardIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Dark/Light Toggle */}
      <button className="toggle-btn" onClick={() => setDark(!dark)} title="Toggle theme">
        {dark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        )}
      </button>

      {/* Back to Home */}
      <button
        onClick={() => navigate('/')}
        title="Back to home"
        style={{
          position: 'fixed', top: 20, left: 20, zIndex: 100,
          width: 44, height: 44, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'}`,
          cursor: 'pointer', color: dark ? '#fff' : '#1a1714',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateX(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateX(0)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      {/* Card */}
      <div className="card-enter" style={{
        width: '100%',
        maxWidth: 420,
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 24,
        padding: '40px 36px',
        boxShadow: dark
          ? '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)'
          : '0 24px 64px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)',
        transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
      }}>

        {/* Logo + Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <img
            src="/logo.png"
            alt="Veilora"
            style={{
              height: 72,
              width: 'auto',
              marginBottom: 8,
              filter: dark ? 'brightness(0) invert(1)' : 'none',
            }}
          />
          <span style={{ fontSize: 13, color: textSecondary, marginTop: 2 }}>Zero-knowledge file sharing</span>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: textPrimary, margin: 0, letterSpacing: '-0.4px', fontFamily: "'DM Serif Display', serif" }}>
            {isSignup ? 'Create an account' : 'Welcome back'}
          </h1>
          <p style={{ fontSize: 14, color: textSecondary, marginTop: 6 }}>
            {isSignup ? 'Start sharing files with zero compromise' : 'Sign in to your secure vault'}
          </p>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
          {/* Email */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: textSecondary, pointerEvents: 'none', display: 'flex' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3"/><polyline points="2,4 12,13 22,4"/>
              </svg>
            </span>
            <input
              className="login-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: textSecondary, pointerEvents: 'none', display: 'flex' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </span>
            <input
              className="login-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, display: 'flex', padding: 0 }}
            >
              {showPassword ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Main CTA */}
        <button className="btn-main" onClick={handleSubmit} disabled={loading} style={{ marginBottom: 12 }}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Please wait…
            </span>
          ) : isSignup ? 'Create account' : 'Sign in'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: dividerColor }}/>
          <span style={{ fontSize: 12, color: textSecondary, whiteSpace: 'nowrap' }}>or</span>
          <div style={{ flex: 1, height: 1, background: dividerColor }}/>
        </div>

        {/* Google */}
        <button className="btn-google" onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        {/* Switch */}
        <p style={{ textAlign: 'center', fontSize: 14, color: textSecondary, marginTop: 22, margin: '22px 0 0' }}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button className="switch-link" onClick={() => { setIsSignup(!isSignup); setError('') }}>
            {isSignup ? 'Login' : 'Sign up'}
          </button>
        </p>

        <p style={{ textAlign: 'center', fontSize: 12, color: dark ? '#38384a' : '#c0bbb4', marginTop: 16 }}>
          Files are encrypted in your browser. We never see your data.
        </p>
      </div>
    </div>
  )
}