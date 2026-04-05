import { useState, useEffect, useCallback } from 'react'
import { toast, Toaster } from '../toast'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../supabase'
import api from '../api'
import { encryptFile, decryptFile } from '../crypto'

const ICONS = {
  files: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  upload: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
    </svg>
  ),
  share: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  security: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  signout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  trash: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  ),
  key: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  ),
  sun: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  lock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  eye: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  eyeOff: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  cloud: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
    </svg>
  ),
}

function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const NAV = [
  { id: 'files', label: 'My Files', icon: 'files' },
  { id: 'upload', label: 'Upload', icon: 'upload' },
  { id: 'share', label: 'Share Links', icon: 'share' },
  { id: 'security', label: 'Security', icon: 'security' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

export default function Dashboard() {
  const [files, setFiles] = useState([])
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [shareLinks, setShareLinks] = useState({})
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [user, setUser] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [activeNav, setActiveNav] = useState('files')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    loadFiles()
  }, [])

  async function loadFiles() {
    try { const { data } = await api.get('/api/files'); setFiles(data) } catch {}
  }

  const onDrop = useCallback(async (accepted) => {
    if (!password) return toast.error('Enter an encryption password before uploading.')
    const file = accepted[0]
    setUploading(true); setMsg({ text: '', type: '' })
    try {
      const { encryptedBlob, iv, salt } = await encryptFile(file, password)
      const { data } = await api.post('/api/files/upload-url', { name: file.name, size: file.size, mimeType: file.type, iv, salt })
      await fetch(data.signedUrl, { method: 'PUT', body: encryptedBlob, headers: { 'Content-Type': 'application/octet-stream', 'x-upsert': 'true' } })
      toast.success(`"${file.name}" encrypted and uploaded!`)
      loadFiles(); setActiveNav('files')
    } catch (e) { toast.error('Upload failed: ' + e.message) }
    setUploading(false)
  }, [password])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

  async function downloadFile(file) {
    const pw = prompt(`Enter decryption password for "${file.name}"`)
    if (!pw) return
    try {
      const { data } = await api.get(`/api/files/${file.id}/download-url`)
      const res = await fetch(data.signedUrl)
      const buf = await res.arrayBuffer()
      const blob = await decryptFile(buf, pw, file.iv, file.salt, file.mime_type)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = file.name; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Decryption failed — wrong password?') }
  }

  async function createShareLink(fileId) {
    const hours = prompt('Expire after how many hours? (leave blank = never)')
    const { data } = await api.post('/api/share', { fileId, expiresInHours: hours ? parseInt(hours) : null })
    const link = `${window.location.origin}/share/${data.token}`
    setShareLinks(prev => ({ ...prev, [fileId]: link }))
    navigator.clipboard.writeText(link).catch(() => {})
    toast.success('Share link copied to clipboard!')
  }

  async function deleteFile(id) {
    if (!confirm('Delete this file permanently?')) return
    setDeletingId(id); await api.delete(`/api/files/${id}`)
    setFiles(prev => prev.filter(f => f.id !== id)); setDeletingId(null)
    toast.success('File deleted successfully.')
  }

  // Theme tokens — warm light matching login, deep dark
  const d = dark
  const bg = d ? '#0c0c12' : '#f5f0eb'
  const sidebar = d ? '#111118' : '#ffffff'
  const sidebarBorder = d ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
  const main = d ? '#0f0f17' : '#f5f0eb'
  const card = d ? '#17171f' : '#ffffff'
  const cardBorder = d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const textPrimary = d ? '#eeeaf4' : '#1a1714'
  const textSecondary = d ? '#5e5b70' : '#9a9289'
  const textMuted = d ? '#2e2b3a' : '#c8c0b8'
  const accent = d ? '#6c63f5' : '#1a1714'
  const accentLight = d ? 'rgba(108,99,245,0.12)' : 'rgba(26,23,20,0.06)'
  const inputBg = d ? '#0f0f17' : '#f9f7f5'
  const inputBorder = d ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const divider = d ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'
  const hoverBg = d ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
  const navActive = d ? 'rgba(108,99,245,0.15)' : 'rgba(26,23,20,0.07)'
  const navActiveBorder = d ? '#6c63f5' : '#1a1714'
  const shadow = d ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.06)'

  const totalSize = files.reduce((a, f) => a + (f.size || 0), 0)

  // Content panels
  const renderContent = () => {
    if (activeNav === 'upload') return (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: textPrimary, marginBottom: 6, fontFamily: "'DM Serif Display', serif" }}>Upload a File</h2>
        <p style={{ fontSize: 14, color: textSecondary, marginBottom: 28 }}>Files are encrypted in your browser before upload. The server never sees your data.</p>

        {/* Password field */}
        <div style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ color: accent }}>{ICONS.key}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>Encryption Password</span>
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: textSecondary, display: 'flex' }}>{ICONS.lock}</span>
            <input className="dash-input" type={showPassword ? 'text' : 'password'}
              placeholder="Password to encrypt / decrypt your files"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ paddingLeft: 42, paddingRight: 44 }} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, display: 'flex' }}>
              {showPassword ? ICONS.eyeOff : ICONS.eye}
            </button>
          </div>
          <p style={{ fontSize: 12, color: textMuted, marginTop: 10 }}>This password never leaves your browser — the server has zero knowledge of it.</p>
        </div>

        {/* Dropzone */}
        <div {...getRootProps()} style={{
          background: card, border: `2px dashed ${isDragActive ? accent : cardBorder}`,
          borderRadius: 16, padding: '56px 32px', textAlign: 'center', cursor: 'pointer',
          transition: 'all 0.2s ease', boxShadow: shadow,
          background: isDragActive ? accentLight : card,
        }}>
          <input {...getInputProps()} />
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', border: `3px solid ${accent}`, borderTopColor: 'transparent', animation: 'spin 0.9s linear infinite' }} />
              <p style={{ color: textPrimary, fontWeight: 600 }}>Encrypting and uploading…</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
                {ICONS.cloud}
              </div>
              <div>
                <p style={{ fontWeight: 600, color: textPrimary, fontSize: 15 }}>{isDragActive ? 'Drop to encrypt & upload' : 'Drag & drop your file here'}</p>
                <p style={{ fontSize: 13, color: textSecondary, marginTop: 4 }}>or click to browse — encrypted before leaving your device</p>
              </div>
            </div>
          )}
        </div>


      </div>
    )

    if (activeNav === 'share') return (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: textPrimary, marginBottom: 6, fontFamily: "'DM Serif Display', serif" }}>Share Links</h2>
        <p style={{ fontSize: 14, color: textSecondary, marginBottom: 28 }}>Generate secure share links for your encrypted files. Recipients need your password to decrypt.</p>
        {files.length === 0 ? (
          <div style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: '48px 32px', textAlign: 'center', boxShadow: shadow }}>
            <p style={{ color: textSecondary, fontSize: 14 }}>Upload files first to create share links.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {files.map(file => (
              <div key={file.id} style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: '18px 20px', boxShadow: shadow }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, flexShrink: 0 }}>{ICONS.files}</div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: textPrimary, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                      <p style={{ fontSize: 12, color: textSecondary }}>{formatSize(file.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => createShareLink(file.id)} style={{
                    padding: '8px 16px', borderRadius: 10, border: `1px solid ${cardBorder}`,
                    background: accentLight, color: accent, fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                  }}>
                    {ICONS.link} Generate Link
                  </button>
                </div>
                {shareLinks[file.id] && (
                  <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: inputBg, border: `1px solid ${inputBorder}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: accent, flexShrink: 0 }}>{ICONS.link}</span>
                    <span style={{ fontSize: 12, color: textSecondary, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shareLinks[file.id]}</span>
                    <button onClick={() => navigator.clipboard.writeText(shareLinks[file.id])} style={{ background: 'none', border: 'none', color: accent, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>Copy</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )

    if (activeNav === 'security') return (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: textPrimary, marginBottom: 6, fontFamily: "'DM Serif Display', serif" }}>Security Overview</h2>
        <p style={{ fontSize: 14, color: textSecondary, marginBottom: 28 }}>How Veilora keeps your data safe.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { title: 'AES-256-GCM', desc: 'Military-grade encryption applied in your browser before any data is sent.', badge: 'Active' },
            { title: 'Zero Knowledge', desc: 'Your password never leaves your device. The server stores only encrypted blobs.', badge: 'Verified' },
            { title: 'PBKDF2 Key Derivation', desc: '310,000 iterations using SHA-256 for key hardening against brute-force attacks.', badge: 'Active' },
            { title: 'Unique Salt & IV', desc: 'Each file gets a cryptographically random salt and IV — identical files produce different ciphertext.', badge: 'Per-file' },
          ].map(({ title, desc, badge }) => (
            <div key={title} style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 24, boxShadow: shadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: textPrimary }}>{title}</h3>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: accentLight, color: accent }}>{badge}</span>
              </div>
              <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    )

    if (activeNav === 'settings') return (
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: textPrimary, marginBottom: 6, fontFamily: "'DM Serif Display', serif" }}>Settings</h2>
        <p style={{ fontSize: 14, color: textSecondary, marginBottom: 28 }}>Manage your account and preferences.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 24, boxShadow: shadow }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Account</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{user?.email}</p>
                <p style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>Authenticated via {user?.app_metadata?.provider || 'email'}</p>
              </div>
              <button onClick={() => supabase.auth.signOut()} style={{ padding: '9px 18px', borderRadius: 10, border: `1px solid ${d ? 'rgba(239,68,68,0.3)' : '#fecaca'}`, background: d ? 'rgba(239,68,68,0.08)' : '#fef2f2', color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Sign out</button>
            </div>
          </div>
          <div style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 24, boxShadow: shadow }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Appearance</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: textPrimary }}>{d ? 'Dark mode' : 'Light mode'}</p>
                <p style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>Toggle between light and dark theme</p>
              </div>
              <button onClick={() => setDark(!d)} style={{
                width: 52, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer',
                background: d ? accent : '#e2e0dc', position: 'relative', transition: 'background 0.3s',
              }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: d ? 27 : 3, transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )

    // Default: My Files
    return (
      <div>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Encrypted Files', value: files.length },
            { label: 'Total Stored', value: formatSize(totalSize) },
            { label: 'Encryption', value: 'AES-256-GCM' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: '18px 20px', boxShadow: shadow }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: textPrimary, letterSpacing: '-0.5px' }}>{value}</p>
              <p style={{ fontSize: 12, color: textSecondary, marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* File list header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: textPrimary }}>Your Files</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 999, background: accentLight, color: accent, fontWeight: 600 }}>{files.length} files</span>
            <button onClick={() => setActiveNav('upload')} style={{
              padding: '8px 16px', borderRadius: 10, border: 'none',
              background: accent, color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 6,
            }}>
              + Upload
            </button>
          </div>
        </div>

        {/* File list */}
        <div style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, overflow: 'hidden', boxShadow: shadow }}>
          {files.length === 0 ? (
            <div style={{ padding: '64px 32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>{ICONS.files}</div>
              <p style={{ color: textSecondary, fontSize: 14 }}>No files uploaded yet</p>
              <button onClick={() => setActiveNav('upload')} style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: accent, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Upload your first file</button>
            </div>
          ) : files.map((file, i) => (
            <div key={file.id} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < files.length - 1 ? `1px solid ${divider}` : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = hoverBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, flexShrink: 0 }}>{ICONS.files}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                <p style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>{formatSize(file.size)} · {new Date(file.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                {[
                  { icon: ICONS.download, title: 'Download & decrypt', onClick: () => downloadFile(file), hoverColor: textPrimary },
                  { icon: ICONS.link, title: 'Share', onClick: () => createShareLink(file.id), hoverColor: accent },
                  { icon: deletingId === file.id ? null : ICONS.trash, title: 'Delete', onClick: () => deleteFile(file.id), hoverColor: '#ef4444' },
                ].map(({ icon, title, onClick, hoverColor }, idx) => (
                  <button key={idx} onClick={onClick} title={title}
                    style={{ width: 34, height: 34, borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSecondary, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = hoverColor }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSecondary }}>
                    {deletingId === file.id && idx === 2
                      ? <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${textSecondary}`, borderTopColor: 'transparent', animation: 'spin 0.9s linear infinite' }} />
                      : icon}
                  </button>
                ))}
              </div>
              {shareLinks[file.id] && (
                <div style={{ position: 'absolute', marginTop: 60 }} />
              )}
            </div>
          ))}
        </div>

        {/* Share links below file list */}
        {files.some(f => shareLinks[f.id]) && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {files.filter(f => shareLinks[f.id]).map(file => (
              <div key={file.id} style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: shadow }}>
                <span style={{ color: accent, flexShrink: 0, fontSize: 12 }}>{ICONS.link}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: textSecondary, flexShrink: 0 }}>{file.name}:</span>
                <span style={{ fontSize: 12, color: textSecondary, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shareLinks[file.id]}</span>
                <button onClick={() => navigator.clipboard.writeText(shareLinks[file.id])} style={{ background: 'none', border: 'none', color: accent, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Copy</button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", transition: 'background 0.3s' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dash-input {
          width: 100%; padding: 13px 16px; border-radius: 12px;
          border: 1.5px solid ${inputBorder}; background: ${inputBg};
          color: ${textPrimary}; font-size: 14px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .dash-input::placeholder { color: ${textSecondary}; }
        .dash-input:focus { border-color: ${accent}; box-shadow: 0 0 0 3px ${accentLight}; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${d ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}; border-radius: 99px; }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0, background: sidebar,
        borderRight: `1px solid ${sidebarBorder}`,
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflow: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${sidebarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="Veilora" style={{ height: 36, width: 'auto', filter: d ? 'brightness(0) invert(1)' : 'none' }} />
            <span style={{ fontSize: 28, fontWeight: 900, color: textPrimary, letterSpacing: '-0.3px', fontFamily: "'DM Serif Display', serif" }}></span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(({ id, label, icon }) => {
            const isActive = activeNav === id
            return (
              <button key={id} onClick={() => setActiveNav(id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 11, border: 'none', cursor: 'pointer',
                background: isActive ? navActive : 'transparent',
                color: isActive ? (d ? '#a5a0ff' : '#1a1714') : textSecondary,
                fontSize: 14, fontWeight: isActive ? 700 : 500,
                fontFamily: "'DM Sans', sans-serif", textAlign: 'left',
                transition: 'all 0.15s',
                borderLeft: isActive ? `3px solid ${navActiveBorder}` : '3px solid transparent',
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = hoverBg }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}>
                {ICONS[icon]} {label}
              </button>
            )
          })}
        </nav>

        {/* Bottom — user + toggle */}
        <div style={{ padding: '16px 12px', borderTop: `1px solid ${sidebarBorder}` }}>
          {/* Dark/light toggle */}
          <button onClick={() => setDark(!d)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 11, border: 'none', cursor: 'pointer',
            background: 'transparent', color: textSecondary, fontSize: 14, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", marginBottom: 6, transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = hoverBg}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            {d ? ICONS.sun : ICONS.moon}
            {d ? 'Light mode' : 'Dark mode'}
          </button>

          {/* Sign out */}
          <button onClick={() => supabase.auth.signOut()} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 11, border: 'none', cursor: 'pointer',
            background: 'transparent', color: textSecondary, fontSize: 14, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", transition: 'background 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = d ? 'rgba(239,68,68,0.08)' : '#fef2f2'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSecondary }}>
            {ICONS.signout} Sign out
          </button>

          {/* User pill */}
          {user && (
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 11, background: hoverBg, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: accent, flexShrink: 0 }}>
                {(user.email?.[0] || '?').toUpperCase()}
              </div>
              <p style={{ fontSize: 12, color: textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto', maxWidth: 860 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, color: textSecondary, fontWeight: 500 }}>End-to-end encrypted</span>
          </div>
        </div>

        {renderContent()}
      </main>
      <Toaster dark={d} />
    </div>
  )
}