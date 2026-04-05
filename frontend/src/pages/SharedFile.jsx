import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { decryptFile } from '../crypto'

function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function SharedFile() {
  const { token } = useParams()
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [statusMsg, setStatusMsg] = useState('')
  const [loadingInfo, setLoadingInfo] = useState(true)

  useEffect(() => {
    api.get(`/api/share/${token}`)
      .then(r => { setInfo(r.data); setLoadingInfo(false) })
      .catch(e => { setError(e.response?.data?.error || 'Invalid or expired link'); setLoadingInfo(false) })
  }, [token])

  async function download() {
    if (!password) { setStatus('error'); setStatusMsg('Please enter the decryption password.'); return }
    setStatus('loading'); setStatusMsg('')
    try {
      // Re-fetch a fresh download URL to avoid expiry issues
      const { data: fresh } = await api.get(`/api/share/${token}`)
      const res = await fetch(fresh.downloadUrl)
      if (!res.ok) throw new Error(`Failed to fetch file (${res.status})`)
      const buf = await res.arrayBuffer()
      const blob = await decryptFile(buf, password, fresh.file.iv, fresh.file.salt, fresh.file.mime_type)

      // Create a link, append to DOM, click, then clean up AFTER a delay
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fresh.file.name
      document.body.appendChild(a)
      a.click()
      // Delay revoke so browser has time to start the download
      setTimeout(() => {
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 2000)

      setStatus('success')
      setStatusMsg(`"${fresh.file.name}" decrypted and downloaded successfully.`)
    } catch (e) {
      setStatus('error')
      if (e.message?.includes('Failed to fetch') || e.message?.includes('NetworkError')) {
        setStatusMsg('Network error — the share link may have expired. Ask the owner to generate a new one.')
      } else if (e.name === 'OperationError' || e.message?.includes('decrypt')) {
        setStatusMsg('Decryption failed — wrong password. Please try again.')
      } else {
        setStatusMsg('Something went wrong: ' + e.message)
      }
    }
  }

  const accent = '#1a1714'
  const accentLight = 'rgba(26,23,20,0.06)'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg, #f5f0eb 0%, #ede8e0 40%, #e8e2d8 100%)',
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", padding: 20,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display@0;1&display=swap');
        * { box-sizing: border-box; }
        .sf-input {
          width: 100%; padding: 13px 44px 13px 16px;
          border-radius: 12px; border: 1.5px solid rgba(0,0,0,0.08);
          background: #f9f7f5; color: #1a1714; font-size: 14px;
          font-family: 'DM Sans', sans-serif; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sf-input:focus { border-color: #1a1714; box-shadow: 0 0 0 3px rgba(26,23,20,0.06); }
        .sf-input::placeholder { color: #9a9289; }
        .btn-dl {
          width: 100%; padding: 14px; border-radius: 12px; border: none;
          background: #1a1714; color: #fff; font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-dl:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
        .btn-dl:disabled { opacity: 0.6; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes cardIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 420, background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.07)', borderRadius: 24,
        padding: '40px 36px', animation: 'cardIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
        boxShadow: '0 24px 64px rgba(0,0,0,0.09)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <img src="/logo.png" alt="Veilora" style={{ height: 44, width: 'auto', marginBottom: 8 }} />
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1a1714', fontFamily: "'DM Serif Display', serif" }}>Veilora</span>
          <span style={{ fontSize: 12, color: '#9a9289', marginTop: 2 }}>Secure file sharing</span>
        </div>

        {/* Loading state */}
        {loadingInfo && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid #e8e2d8', borderTopColor: '#1a1714', animation: 'spin 0.9s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ color: '#9a9289', fontSize: 14 }}>Loading file info…</p>
          </div>
        )}

        {/* Link error */}
        {error && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <p style={{ color: '#ef4444', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Link unavailable</p>
            <p style={{ color: '#9a9289', fontSize: 13 }}>{error}</p>
          </div>
        )}

        {/* File info + decrypt */}
        {info && (
          <div>
            {/* File card */}
            <div style={{ background: '#f9f7f5', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1714" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, color: '#1a1714', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{info.file.name}</p>
                <p style={{ fontSize: 12, color: '#9a9289', marginTop: 3 }}>{formatSize(info.file.size)} · Encrypted</p>
              </div>
            </div>

            {/* Password input */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a1714', marginBottom: 8 }}>Decryption Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="sf-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter the password from the file owner"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setStatus('idle') }}
                  onKeyDown={e => e.key === 'Enter' && download()}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9a9289', display: 'flex', padding: 0 }}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Status message */}
            {status !== 'idle' && statusMsg && (
              <div style={{
                marginBottom: 14, padding: '11px 14px', borderRadius: 11, fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 9,
                background: status === 'success' ? '#f0fdf4' : status === 'error' ? '#fef2f2' : '#f9f7f5',
                border: `1px solid ${status === 'success' ? '#bbf7d0' : status === 'error' ? '#fecaca' : 'rgba(0,0,0,0.06)'}`,
                color: status === 'success' ? '#16a34a' : status === 'error' ? '#dc2626' : '#9a9289',
              }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}>
                  {status === 'success' ? '✓' : status === 'error' ? '✕' : ''}
                </span>
                {statusMsg}
              </div>
            )}

            {/* Download button */}
            <button className="btn-dl" onClick={download} disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.9s linear infinite' }} />
                  Decrypting…
                </>
              ) : status === 'success' ? (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Downloaded!
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Decrypt & Download
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#c0bbb4', marginTop: 16 }}>
              Decryption happens entirely in your browser. The password is never sent to the server.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}