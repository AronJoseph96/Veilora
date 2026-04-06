import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from '../toast'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../supabase'
import api from '../api'
import { encryptFile, decryptFile } from '../crypto'

// ─── Files cache (module-level, persists between navigations) ─────────────────
let _filesCache = null

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = {
  files:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  upload:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
  share:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  security: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  signout:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  trash:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  link:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  key:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  lock:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  eye:      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:   <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  cloud:    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
  menu:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
}

const NAV = [
  { id: 'files',    label: 'My Files',    icon: 'files' },
  { id: 'upload',   label: 'Upload',      icon: 'upload' },
  { id: 'share',    label: 'Share Links', icon: 'share' },
  { id: 'settings', label: 'Settings',    icon: 'settings' },
]

const QUOTA = 40 * 1024 * 1024

function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// ─── Password strength ────────────────────────────────────────────────────────
function getPasswordStrength(pw) {
  if (!pw) return null
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (pw.length >= 16) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 2) return { level: 0, label: 'Weak',   color: '#ef4444', width: '25%' }
  if (score <= 3) return { level: 1, label: 'Fair',   color: '#f59e0b', width: '50%' }
  if (score <= 5) return { level: 2, label: 'Good',   color: '#3b82f6', width: '75%' }
  return           { level: 3, label: 'Strong', color: '#22c55e', width: '100%' }
}

// ─── Download password modal ──────────────────────────────────────────────────
function DownloadModal({ file, onConfirm, onCancel, tokens }) {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const { card, cardBorder, textPrimary, textSecondary, accent, inputBg, inputBorder } = tokens
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)', animation:'fadeIn 0.2s ease' }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ background:card, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'28px 24px', width:'100%', maxWidth:380, boxShadow:'0 24px 64px rgba(0,0,0,0.3)', animation:'slideUp 0.25s cubic-bezier(0.22,1,0.36,1)', fontFamily:"'DM Sans',sans-serif" }}>
        <h3 style={{ fontSize:17, fontWeight:700, color:textPrimary, marginBottom:4 }}>Decrypt & Download</h3>
        <p style={{ fontSize:13, color:textSecondary, marginBottom:20 }}>Enter the password for <strong style={{color:textPrimary}}>{file.name}</strong></p>
        <div style={{ position:'relative', marginBottom:16 }}>
          <input autoFocus type={show ? 'text' : 'password'} placeholder="Encryption password"
            value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && pw && onConfirm(pw)}
            style={{ width:'100%', padding:'12px 44px 12px 14px', borderRadius:11, border:`1.5px solid ${inputBorder}`, background:inputBg, color:textPrimary, fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:'none' }} />
          <button onClick={() => setShow(!show)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:textSecondary, display:'flex' }}>
            {show ? Icon.eyeOff : Icon.eye}
          </button>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'11px', borderRadius:11, border:`1px solid ${cardBorder}`, background:'transparent', color:textSecondary, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={() => pw && onConfirm(pw)} disabled={!pw} style={{ flex:1, padding:'11px', borderRadius:11, border:'none', background:accent, color:'#fff', fontSize:14, fontWeight:700, cursor: pw ? 'pointer' : 'not-allowed', opacity: pw ? 1 : 0.5, fontFamily:"'DM Sans',sans-serif" }}>Download</button>
        </div>
      </div>
    </div>
  )
}

// ─── Share expiry modal ───────────────────────────────────────────────────────
function ShareModal({ onConfirm, onCancel, tokens }) {
  const [hours, setHours] = useState('')
  const { card, cardBorder, textPrimary, textSecondary, accent, inputBg, inputBorder } = tokens
  function submit() {
    const val = hours.trim() === '' ? null : parseFloat(hours)
    onConfirm(val)
  }
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)', animation:'fadeIn 0.2s ease' }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ background:card, border:`1px solid ${cardBorder}`, borderRadius:20, padding:'28px 24px', width:'100%', maxWidth:380, boxShadow:'0 24px 64px rgba(0,0,0,0.3)', animation:'slideUp 0.25s cubic-bezier(0.22,1,0.36,1)', fontFamily:"'DM Sans',sans-serif" }}>
        <h3 style={{ fontSize:17, fontWeight:700, color:textPrimary, marginBottom:4 }}>Create Share Link</h3>
        <p style={{ fontSize:13, color:textSecondary, marginBottom:20 }}>Set an optional expiry. Leave blank for a permanent link.</p>
        <label style={{ display:'block', fontSize:13, fontWeight:600, color:textPrimary, marginBottom:8 }}>Link expires after</label>
        <select value={hours} onChange={e => setHours(e.target.value)}
          style={{ width:'100%', padding:'12px 14px', borderRadius:11, border:`1.5px solid ${inputBorder}`, background:inputBg, color: hours === '' ? textSecondary : textPrimary, fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:'none', marginBottom:16, cursor:'pointer', appearance:'none',
            backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', paddingRight:36 }}>
          <option value="">Never (permanent link)</option>
          <optgroup label="Minutes">
            <option value="0.083">5 minutes</option>
            <option value="0.167">10 minutes</option>
            <option value="0.333">20 minutes</option>
            <option value="0.667">40 minutes</option>
          </optgroup>
          <optgroup label="Hours">
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="4">4 hours</option>
            <option value="7">7 hours</option>
            <option value="14">14 hours</option>
          </optgroup>
        </select>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'11px', borderRadius:11, border:`1px solid ${cardBorder}`, background:'transparent', color:textSecondary, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
          <button onClick={submit} style={{ flex:1, padding:'11px', borderRadius:11, border:'none', background:accent, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Generate</button>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow({ divider, d }) {
  return (
    <div style={{ padding:'14px 16px', borderBottom: divider, display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:38, height:38, borderRadius:11, background: d ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', flexShrink:0, animation:'shimmer 1.5s ease-in-out infinite' }}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ height:13, width:'45%', borderRadius:6, background: d ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', animation:'shimmer 1.5s ease-in-out infinite' }}/>
        <div style={{ height:11, width:'25%', borderRadius:6, background: d ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', animation:'shimmer 1.5s ease-in-out infinite' }}/>
      </div>
      <div style={{ display:'flex', gap:4 }}>
        {[...Array(3)].map((_, j) => (
          <div key={j} style={{ width:34, height:34, borderRadius:9, background: d ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', animation:'shimmer 1.5s ease-in-out infinite' }}/>
        ))}
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate()
  const [files, setFiles]                 = useState(_filesCache || [])
  const [loadingFiles, setLoadingFiles]   = useState(!_filesCache)
  const [password, setPassword]           = useState('')
  const [showPassword, setShowPassword]   = useState(false)
  const [uploading, setUploading]         = useState(false)
  const [shareLinks, setShareLinks]       = useState({})
  const [dark, setDark]                   = useState(() => localStorage.getItem('theme') === 'dark')
  const [user, setUser]                   = useState(null)
  const [deletingId, setDeletingId]       = useState(null)
  const [activeNav, setActiveNav]         = useState('files')
  const [sidebarOpen, setSidebarOpen]     = useState(() => window.innerWidth >= 900)
  const [downloadModal, setDownloadModal] = useState(null)
  const [shareModal, setShareModal]       = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    loadFiles()
    function onResize() { if (window.innerWidth < 900) setSidebarOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  async function loadFiles() {
    // Show cache instantly if available
    if (_filesCache) {
      setFiles(_filesCache)
      setLoadingFiles(false)
    } else {
      setLoadingFiles(true)
    }
    try {
      const { data } = await api.get('/api/files')
      _filesCache = data
      setFiles(data)
    } catch {}
    setLoadingFiles(false)
  }

  const onDrop = useCallback(async (accepted) => {
    if (!password) return toast.error('Enter an encryption password before uploading.')
    const file = accepted[0]
    setUploading(true)
    try {
      const { encryptedBlob, iv, salt } = await encryptFile(file, password)
      const { data } = await api.post('/api/files/upload-url', { name: file.name, size: file.size, mimeType: file.type, iv, salt })
      await fetch(data.signedUrl, { method: 'PUT', body: encryptedBlob, headers: { 'Content-Type': 'application/octet-stream', 'x-upsert': 'true' } })
      toast.success(`"${file.name}" encrypted & uploaded!`)
      setPassword('')
      _filesCache = null
      loadFiles()
      setActiveNav('files')
    } catch (e) {
      const msg = e.response?.data?.error || e.message
      if (msg?.toLowerCase().includes('quota')) {
        toast.error('🔒 Storage full — 40 MB free limit reached. Delete files to free up space.')
      } else {
        toast.error('Upload failed: ' + msg)
      }
    }
    setUploading(false)
  }, [password])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

  async function handleDownload(file, pw) {
    setDownloadModal(null)
    try {
      const { data } = await api.get(`/api/files/${file.id}/download-url`)
      const res = await fetch(data.signedUrl)
      const buf = await res.arrayBuffer()
      const blob = await decryptFile(buf, pw, file.iv, file.salt, file.mime_type)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = file.name
      document.body.appendChild(a); a.click()
      setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a) }, 2000)
      toast.success(`"${file.name}" downloaded!`)
    } catch { toast.error('Decryption failed — wrong password?') }
  }

  async function handleShare(fileId, expiresInHours) {
    setShareModal(null)
    try {
      const { data } = await api.post('/api/share', { fileId, expiresInHours })
      const link = `${window.location.origin}/share/${data.token}`
      setShareLinks(prev => ({ ...prev, [fileId]: link }))
      await navigator.clipboard.writeText(link).catch(() => {})
      toast.success(expiresInHours ? `Link expires in ${expiresInHours < 1 ? Math.round(expiresInHours*60)+'min' : expiresInHours+'h'} — copied!` : 'Permanent link created & copied!')
    } catch (e) { toast.error('Failed to create link: ' + e.message) }
  }

  async function deleteFile(id) {
    if (!confirm('Delete this file permanently?')) return
    setDeletingId(id)
    await api.delete(`/api/files/${id}`)
    const updated = files.filter(f => f.id !== id)
    _filesCache = updated
    setFiles(updated)
    setDeletingId(null)
    toast.success('File deleted.')
  }

  // ── Theme ──────────────────────────────────────────────────────────────────
  const d = dark
  const bg            = d ? '#0c0c12'                    : '#f5f0eb'
  const sidebar       = d ? '#111118'                    : '#ffffff'
  const sidebarBorder = d ? 'rgba(255,255,255,0.06)'     : 'rgba(0,0,0,0.07)'
  const card          = d ? '#17171f'                    : '#ffffff'
  const cardBorder    = d ? 'rgba(255,255,255,0.07)'     : 'rgba(0,0,0,0.07)'
  const textPrimary   = d ? '#eeeaf4'                    : '#1a1714'
  const textSecondary = d ? '#5e5b70'                    : '#9a9289'
  const textMuted     = d ? '#2e2b3a'                    : '#c8c0b8'
  const accent        = d ? '#6c63f5'                    : '#1a1714'
  const accentLight   = d ? 'rgba(108,99,245,0.12)'      : 'rgba(26,23,20,0.06)'
  const inputBg       = d ? '#0f0f17'                    : '#f9f7f5'
  const inputBorder   = d ? 'rgba(255,255,255,0.08)'     : 'rgba(0,0,0,0.08)'
  const divider       = d ? 'rgba(255,255,255,0.05)'     : 'rgba(0,0,0,0.06)'
  const hoverBg       = d ? 'rgba(255,255,255,0.04)'     : 'rgba(0,0,0,0.03)'
  const navActive     = d ? 'rgba(108,99,245,0.15)'      : 'rgba(26,23,20,0.07)'
  const navActiveL    = d ? '#6c63f5'                    : '#1a1714'
  const shadow        = d ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.06)'
  const tokens = { card, cardBorder, textPrimary, textSecondary, accent, accentLight, inputBg, inputBorder }

  const totalSize   = files.reduce((a, f) => a + (f.size || 0), 0)
  const usedPct     = Math.min((totalSize / QUOTA) * 100, 100)
  const isNearLimit = totalSize / QUOTA > 0.8
  const isFull      = totalSize >= QUOTA

  function navClick(id) {
    setActiveNav(id)
    if (window.innerWidth < 900) setSidebarOpen(false)
  }

  const inputStyle = { width:'100%', padding:'12px 14px', borderRadius:11, border:`1.5px solid ${inputBorder}`, background:inputBg, color:textPrimary, fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:'none' }

  // ── Storage bar ────────────────────────────────────────────────────────────
  const StorageBar = () => (
    <div style={{ background:card, border:`1px solid ${isFull ? '#ef4444' : isNearLimit ? '#f59e0b' : cardBorder}`, borderRadius:16, padding:'16px 18px', marginBottom:24, boxShadow:shadow }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <span style={{ fontSize:13, fontWeight:600, color:textPrimary }}>Storage Used</span>
        <span style={{ fontSize:13, fontWeight:600, color: isFull ? '#ef4444' : isNearLimit ? '#f59e0b' : textSecondary }}>
          {formatSize(totalSize)} <span style={{ fontWeight:400, color:textSecondary }}>/ 40 MB</span>
        </span>
      </div>
      <div style={{ height:7, background:inputBg, borderRadius:999, overflow:'hidden' }}>
        <div style={{
          height:'100%', borderRadius:999,
          width:`${usedPct}%`,
          background: isFull
            ? '#ef4444'
            : isNearLimit
              ? 'linear-gradient(90deg,#f59e0b,#ef4444)'
              : `linear-gradient(90deg,${accent},${d ? '#a5a0ff' : '#6b6b6b'})`,
          transition:'width 0.4s ease',
        }}/>
      </div>
      {isFull && <p style={{ fontSize:12, color:'#ef4444', marginTop:8 }}>🔒 Storage full — delete files to upload more.</p>}
      {!isFull && isNearLimit && <p style={{ fontSize:12, color:'#f59e0b', marginTop:8 }}>⚠ You're using over 80% of your free storage.</p>}
    </div>
  )

  // ── Content ────────────────────────────────────────────────────────────────
  const renderContent = () => {

    if (activeNav === 'upload') return (
      <div>
        <h2 style={{ fontSize:22, fontWeight:700, color:textPrimary, marginBottom:6, fontFamily:"'DM Serif Display',serif" }}>Upload a File</h2>
        <p style={{ fontSize:14, color:textSecondary, marginBottom:24 }}>Files are encrypted in your browser. The server never sees your data.</p>

        <StorageBar />

        <div style={{ background:card, border:`1px solid ${cardBorder}`, borderRadius:16, padding:24, marginBottom:20, boxShadow:shadow }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ color:accent }}>{Icon.key}</span>
            <span style={{ fontSize:14, fontWeight:600, color:textPrimary }}>Encryption Password</span>
          </div>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:textSecondary, display:'flex' }}>{Icon.lock}</span>
            <input type={showPassword ? 'text' : 'password'} placeholder="Password to encrypt / decrypt your files"
              value={password} onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingLeft:42, paddingRight:44 }} />
            <button onClick={() => setShowPassword(!showPassword)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:textSecondary, display:'flex' }}>
              {showPassword ? Icon.eyeOff : Icon.eye}
            </button>
          </div>

          {/* ── Password strength meter ── */}
          {(() => {
            const strength = getPasswordStrength(password)
            if (!strength) return (
              <p style={{ fontSize:12, color:textMuted, marginTop:10 }}>This password never leaves your browser — the server has zero knowledge of it.</p>
            )
            return (
              <div style={{ marginTop:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <span style={{ fontSize:12, color:textSecondary }}>Password strength</span>
                  <span style={{ fontSize:12, fontWeight:700, color:strength.color, transition:'color 0.3s' }}>{strength.label}</span>
                </div>
                <div style={{ height:5, background:inputBg, borderRadius:999, overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:999,
                    width: strength.width,
                    background: strength.color,
                    transition:'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease',
                  }}/>
                </div>
                {strength.level < 2 && (
                  <p style={{ fontSize:12, color: strength.color, marginTop:8, opacity:0.85 }}>
                    {strength.level === 0
                      ? 'Too weak — add uppercase, numbers, or symbols.'
                      : 'Could be stronger — try a longer or more complex password.'}
                  </p>
                )}
                {strength.level >= 2 && (
                  <p style={{ fontSize:12, color:textMuted, marginTop:8 }}>This password never leaves your browser — the server has zero knowledge of it.</p>
                )}
              </div>
            )
          })()}
        </div>

        <div {...getRootProps()} style={{
          background: isFull ? (d ? 'rgba(239,68,68,0.05)' : '#fef2f2') : isDragActive ? accentLight : card,
          border:`2px dashed ${isFull ? '#ef4444' : isDragActive ? accent : cardBorder}`,
          borderRadius:16, padding:'52px 24px', textAlign:'center',
          cursor: isFull ? 'not-allowed' : 'pointer',
          transition:'all 0.2s', boxShadow:shadow,
          pointerEvents: isFull ? 'none' : 'auto',
        }}>
          <input {...getInputProps()} disabled={isFull} />
          {uploading ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${accent}`, borderTopColor:'transparent', animation:'spin 0.9s linear infinite' }} />
              <p style={{ color:textPrimary, fontWeight:600 }}>Encrypting and uploading…</p>
            </div>
          ) : isFull ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>🔒</div>
              <p style={{ fontWeight:600, color:'#ef4444', fontSize:15 }}>Storage full</p>
              <p style={{ fontSize:13, color:textSecondary }}>Delete files to free up space</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:accentLight, display:'flex', alignItems:'center', justifyContent:'center', color:accent }}>{Icon.cloud}</div>
              <p style={{ fontWeight:600, color:textPrimary, fontSize:15 }}>{isDragActive ? 'Drop to encrypt & upload' : 'Drag & drop your file here'}</p>
              <p style={{ fontSize:13, color:textSecondary }}>or tap to browse — encrypted before leaving your device</p>
            </div>
          )}
        </div>
      </div>
    )

    if (activeNav === 'share') return (
      <div>
        <h2 style={{ fontSize:22, fontWeight:700, color:textPrimary, marginBottom:6, fontFamily:"'DM Serif Display',serif" }}>Share Links</h2>
        <p style={{ fontSize:14, color:textSecondary, marginBottom:24 }}>Generate secure share links. Recipients need your password to decrypt.</p>
        {files.length === 0 ? (
          <div style={{ background:card, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'48px 24px', textAlign:'center', boxShadow:shadow }}>
            <p style={{ color:textSecondary, fontSize:14 }}>Upload files first to create share links.</p>
          </div>
        ) : files.map(file => (
          <div key={file.id} style={{ background:card, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'16px 18px', boxShadow:shadow, marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:accentLight, display:'flex', alignItems:'center', justifyContent:'center', color:accent, flexShrink:0 }}>{Icon.files}</div>
                <div style={{ minWidth:0 }}>
                  <p style={{ fontWeight:600, color:textPrimary, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'min(200px,50vw)' }}>{file.name}</p>
                  <p style={{ fontSize:12, color:textSecondary }}>{formatSize(file.size)}</p>
                </div>
              </div>
              <button onClick={() => setShareModal(file.id)} style={{ padding:'8px 14px', borderRadius:10, border:`1px solid ${cardBorder}`, background:accentLight, color:accent, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap', flexShrink:0 }}>
                {Icon.link} Generate Link
              </button>
            </div>
            {shareLinks[file.id] && (
              <div style={{ marginTop:12, padding:'10px 14px', borderRadius:10, background:inputBg, border:`1px solid ${inputBorder}`, display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ color:accent, flexShrink:0 }}>{Icon.link}</span>
                <span style={{ fontSize:12, color:textSecondary, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{shareLinks[file.id]}</span>
                <button onClick={() => { navigator.clipboard.writeText(shareLinks[file.id]); toast.success('Copied!') }}
                  style={{ background:'none', border:'none', color:accent, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap' }}>Copy</button>
              </div>
            )}
          </div>
        ))}
      </div>
    )

    if (activeNav === 'security') return (
      <div>
        <h2 style={{ fontSize:22, fontWeight:700, color:textPrimary, marginBottom:6, fontFamily:"'DM Serif Display',serif" }}>Security Overview</h2>
        <p style={{ fontSize:14, color:textSecondary, marginBottom:24 }}>How Veilora keeps your data safe.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
          {[
            { title:'AES-256-GCM', desc:'Military-grade encryption applied in your browser before any data is sent.', badge:'Active' },
            { title:'Zero Knowledge', desc:'Your password never leaves your device. Server stores only encrypted blobs.', badge:'Verified' },
            { title:'PBKDF2 (310k iters)', desc:'310,000 SHA-256 iterations for key hardening against brute-force attacks.', badge:'Active' },
            { title:'Unique Salt & IV', desc:'Each file gets a cryptographically random salt and IV — identical files produce different ciphertext.', badge:'Per-file' },
          ].map(({ title, desc, badge }) => (
            <div key={title} style={{ background:card, border:`1px solid ${cardBorder}`, borderRadius:16, padding:22, boxShadow:shadow }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10, gap:8 }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:textPrimary }}>{title}</h3>
                <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:999, background:accentLight, color:accent, whiteSpace:'nowrap', flexShrink:0 }}>{badge}</span>
              </div>
              <p style={{ fontSize:13, color:textSecondary, lineHeight:1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    )

    if (activeNav === 'settings') return (
      <div>
        <h2 style={{ fontSize:22, fontWeight:700, color:textPrimary, marginBottom:6, fontFamily:"'DM Serif Display',serif" }}>Settings</h2>
        <p style={{ fontSize:14, color:textSecondary, marginBottom:24 }}>Manage your account and preferences.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:card, border:`1px solid ${cardBorder}`, borderRadius:16, padding:24, boxShadow:shadow }}>
            <p style={{ fontSize:12, fontWeight:700, color:textSecondary, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:14 }}>Account</p>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div>
                <p style={{ fontSize:14, fontWeight:600, color:textPrimary }}>{user?.email}</p>
                <p style={{ fontSize:12, color:textSecondary, marginTop:2 }}>via {user?.app_metadata?.provider || 'email'}</p>
              </div>
              <button onClick={() => supabase.auth.signOut()} style={{ padding:'9px 18px', borderRadius:10, border:`1px solid ${d?'rgba(239,68,68,0.3)':'#fecaca'}`, background:d?'rgba(239,68,68,0.08)':'#fef2f2', color:'#ef4444', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Sign out</button>
            </div>
          </div>
          <div style={{ background:card, border:`1px solid ${cardBorder}`, borderRadius:16, padding:24, boxShadow:shadow }}>
            <p style={{ fontSize:12, fontWeight:700, color:textSecondary, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:14 }}>Appearance</p>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
              <div>
                <p style={{ fontSize:14, fontWeight:600, color:textPrimary }}>{d ? 'Dark mode' : 'Light mode'}</p>
                <p style={{ fontSize:12, color:textSecondary, marginTop:2 }}>Toggle between light and dark theme</p>
              </div>
              <button onClick={() => setDark(!d)} style={{ width:52, height:28, borderRadius:999, border:'none', cursor:'pointer', background:d?accent:'#e2e0dc', position:'relative', transition:'background 0.3s', flexShrink:0 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:d?27:3, transition:'left 0.3s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )

    // ── My Files ───────────────────────────────────────────────────────────
    return (
      <div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12, marginBottom:16 }}>
          {[
            { label:'Encrypted Files', value: loadingFiles ? '—' : String(files.length) },
            { label:'Encryption',      value: 'AES-256-GCM' },
          ].map(({ label, value }) => (
            <div key={label} style={{ background:card, border:`1px solid ${cardBorder}`, borderRadius:16, padding:'16px 18px', boxShadow:shadow }}>
              <p style={{ fontSize:20, fontWeight:800, color:textPrimary, letterSpacing:'-0.5px', wordBreak:'break-word' }}>{value}</p>
              <p style={{ fontSize:12, color:textSecondary, marginTop:4 }}>{label}</p>
            </div>
          ))}
        </div>

        <StorageBar />

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:10 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:textPrimary }}>Your Files</h2>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:12, padding:'4px 12px', borderRadius:999, background:accentLight, color:accent, fontWeight:600 }}>{files.length} files</span>
            <button onClick={() => setActiveNav('upload')} style={{ padding:'8px 16px', borderRadius:10, border:'none', background:accent, color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>+ Upload</button>
          </div>
        </div>

        <div style={{ background:card, border:`1px solid ${cardBorder}`, borderRadius:16, overflow:'hidden', boxShadow:shadow }}>
          {loadingFiles ? (
            <>
              <SkeletonRow divider={`1px solid ${divider}`} d={d} />
              <SkeletonRow divider={`1px solid ${divider}`} d={d} />
              <SkeletonRow divider="none" d={d} />
            </>
          ) : files.length === 0 ? (
            <div style={{ padding:'56px 24px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:accentLight, display:'flex', alignItems:'center', justifyContent:'center', color:accent }}>{Icon.files}</div>
              <p style={{ color:textSecondary, fontSize:14 }}>No files uploaded yet</p>
              <button onClick={() => setActiveNav('upload')} style={{ padding:'9px 20px', borderRadius:10, border:'none', background:accent, color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Upload your first file</button>
            </div>
          ) : files.map((file, i) => (
            <div key={file.id} style={{ padding:'14px 16px', borderBottom: i < files.length - 1 ? `1px solid ${divider}` : 'none', transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = hoverBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:accentLight, display:'flex', alignItems:'center', justifyContent:'center', color:accent, flexShrink:0 }}>{Icon.files}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:textPrimary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</p>
                  <p style={{ fontSize:12, color:textSecondary, marginTop:2 }}>{formatSize(file.size)} · {new Date(file.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:2, flexShrink:0 }}>
                  {[
                    { ico: Icon.download, title:'Download', col: textPrimary, fn: () => setDownloadModal(file) },
                    { ico: Icon.link,     title:'Share',    col: accent,       fn: () => setShareModal(file.id) },
                    { ico: Icon.trash,    title:'Delete',   col: '#ef4444',    fn: () => deleteFile(file.id) },
                  ].map(({ ico, title, col, fn }, idx) => (
                    <button key={idx} onClick={fn} title={title}
                      style={{ width:34, height:34, borderRadius:9, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:textSecondary, transition:'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = col }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSecondary }}>
                      {deletingId === file.id && idx === 2
                        ? <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${textSecondary}`, borderTopColor:'transparent', animation:'spin 0.9s linear infinite' }} />
                        : ico}
                    </button>
                  ))}
                </div>
              </div>
              {shareLinks[file.id] && (
                <div style={{ marginTop:10, padding:'8px 12px', borderRadius:10, background:inputBg, border:`1px solid ${inputBorder}`, display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ color:accent, flexShrink:0, display:'flex' }}>{Icon.link}</span>
                  <span style={{ fontSize:11, color:textSecondary, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{shareLinks[file.id]}</span>
                  <button onClick={() => { navigator.clipboard.writeText(shareLinks[file.id]); toast.success('Copied!') }}
                    style={{ background:'none', border:'none', color:accent, fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap' }}>Copy</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const isMobile = window.innerWidth < 900

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:bg, fontFamily:"'DM Sans','Helvetica Neue',sans-serif", transition:'background 0.3s', overflow:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.4} }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:${d?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.1)'}; border-radius:99px; }
      `}</style>

      {sidebarOpen && isMobile && (
        <div onClick={() => setSidebarOpen(false)} style={{ position:'fixed', inset:0, zIndex:150, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)', animation:'fadeIn 0.2s ease' }} />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        position: isMobile ? 'fixed' : 'sticky',
        top:0, left:0, zIndex:160,
        width: sidebarOpen ? 240 : 0,
        height:'100vh', flexShrink:0,
        background:sidebar,
        borderRight: sidebarOpen ? `1px solid ${sidebarBorder}` : 'none',
        display:'flex', flexDirection:'column',
        overflow:'hidden',
        transition:'width 0.28s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: isMobile && sidebarOpen ? '4px 0 24px rgba(0,0,0,0.3)' : 'none',
      }}>
        <div style={{ width:240, height:'100%', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'18px 16px 14px', borderBottom:`1px solid ${sidebarBorder}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <img src="/logo.png" alt="Veilora" style={{ height:52, width:'auto', display:'block', filter: d ? 'brightness(0) invert(1)' : 'none' }} />
            <button onClick={() => setSidebarOpen(false)} style={{ width:32, height:32, borderRadius:9, border:'none', background:hoverBg, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:textSecondary, flexShrink:0 }}>
              {Icon.close}
            </button>
          </div>

          <nav style={{ flex:1, padding:'14px 10px', display:'flex', flexDirection:'column', gap:3, overflowY:'auto' }}>
            {NAV.map(({ id, label, icon }) => {
              const active = activeNav === id
              return (
                <button key={id} onClick={() => navClick(id)} style={{
                  width:'100%', display:'flex', alignItems:'center', gap:10,
                  padding:'11px 14px', borderRadius:11, border:'none', cursor:'pointer',
                  background: active ? navActive : 'transparent',
                  color: active ? (d ? '#a5a0ff' : '#1a1714') : textSecondary,
                  fontSize:14, fontWeight: active ? 700 : 500,
                  fontFamily:"'DM Sans',sans-serif", textAlign:'left', transition:'all 0.15s',
                  borderLeft: active ? `3px solid ${navActiveL}` : '3px solid transparent',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = hoverBg }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                  {Icon[icon]} {label}
                </button>
              )
            })}
          </nav>

          {/* Sidebar storage mini-bar */}
          <div style={{ padding:'12px 16px', borderTop:`1px solid ${sidebarBorder}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:11, color:textSecondary, fontWeight:600 }}>Storage</span>
              <span style={{ fontSize:11, color: isFull ? '#ef4444' : isNearLimit ? '#f59e0b' : textSecondary, fontWeight:600 }}>
                {formatSize(totalSize)} / 40 MB
              </span>
            </div>
            <div style={{ height:4, background:inputBg, borderRadius:999, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:999,
                width:`${usedPct}%`,
                background: isFull ? '#ef4444' : isNearLimit ? '#f59e0b' : accent,
                transition:'width 0.4s ease',
              }}/>
            </div>
          </div>

          <div style={{ padding:'0 10px 12px', flexShrink:0 }}>
            <button onClick={() => supabase.auth.signOut()} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:11, border:'none', cursor:'pointer', background:'transparent', color:textSecondary, fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif", transition:'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = d?'rgba(239,68,68,0.08)':'#fef2f2'; e.currentTarget.style.color='#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = textSecondary }}>
              {Icon.signout} Sign out
            </button>
            {user && (
              <div style={{ marginTop:6, padding:'10px 14px', borderRadius:11, background:hoverBg, display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:accentLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:accent, flexShrink:0 }}>
                  {(user.email?.[0] || '?').toUpperCase()}
                </div>
                <p style={{ fontSize:12, color:textSecondary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex:1, minWidth:0, overflowY:'auto', padding: isMobile ? '24px 16px' : '32px 40px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ width:38, height:38, borderRadius:10, border:`1px solid ${cardBorder}`, background:card, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:textSecondary, flexShrink:0, boxShadow:shadow, transition:'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = hoverBg}
            onMouseLeave={e => e.currentTarget.style.background = card}>
            {Icon.menu}
          </button>
          <button onClick={() => navigate('/')} title="Back to home"
            style={{ width:38, height:38, borderRadius:10, border:`1px solid ${cardBorder}`, background:card, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:textSecondary, flexShrink:0, boxShadow:shadow, transition:'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = textPrimary; e.currentTarget.style.transform='translateX(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = card; e.currentTarget.style.color = textSecondary; e.currentTarget.style.transform='translateX(0)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginLeft:'auto' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', flexShrink:0 }} />
            <span style={{ fontSize:13, color:textSecondary, fontWeight:500 }}>E2E encrypted</span>
          </div>
        </div>

        {renderContent()}
      </main>

      {downloadModal && (
        <DownloadModal file={downloadModal} tokens={tokens}
          onConfirm={pw => handleDownload(downloadModal, pw)}
          onCancel={() => setDownloadModal(null)} />
      )}
      {shareModal && (
        <ShareModal tokens={tokens}
          onConfirm={hours => handleShare(shareModal, hours)}
          onCancel={() => setShareModal(null)} />
      )}

      <Toaster dark={d} />
    </div>
  )
}