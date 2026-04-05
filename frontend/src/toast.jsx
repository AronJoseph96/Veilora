import { useState, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// ─── Toast store (module-level so it works across files) ──────────────────────
let _setToasts = null
let _counter = 0

export function toast(message, type = 'info', duration = 4000) {
  if (!_setToasts) return
  const id = ++_counter
  _setToasts(prev => [...prev, { id, message, type, duration }])
}

toast.success = (msg, dur) => toast(msg, 'success', dur)
toast.error   = (msg, dur) => toast(msg, 'error', dur ?? 5000)
toast.info    = (msg, dur) => toast(msg, 'info', dur)
toast.warning = (msg, dur) => toast(msg, 'warning', dur)

// ─── Individual toast item ────────────────────────────────────────────────────
function ToastItem({ id, message, type, duration, onRemove, dark }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const timerRef = useRef(null)

  const dismiss = useCallback(() => {
    setLeaving(true)
    setTimeout(() => onRemove(id), 320)
  }, [id, onRemove])

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true))
    timerRef.current = setTimeout(dismiss, duration)
    return () => clearTimeout(timerRef.current)
  }, [dismiss, duration])

  const colors = {
    success: { bg: dark ? '#0f2a1a' : '#f0fdf4', border: dark ? '#166534' : '#bbf7d0', icon: '#22c55e', text: dark ? '#86efac' : '#15803d' },
    error:   { bg: dark ? '#2a0f0f' : '#fef2f2', border: dark ? '#991b1b' : '#fecaca', icon: '#ef4444', text: dark ? '#fca5a5' : '#dc2626' },
    warning: { bg: dark ? '#2a1f0f' : '#fffbeb', border: dark ? '#92400e' : '#fde68a', icon: '#f59e0b', text: dark ? '#fcd34d' : '#b45309' },
    info:    { bg: dark ? '#0f1a2a' : '#eff6ff', border: dark ? '#1e3a5f' : '#bfdbfe', icon: '#3b82f6', text: dark ? '#93c5fd' : '#1d4ed8' },
  }
  const c = colors[type] || colors.info

  const icons = {
    success: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    error:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
    warning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    info:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  }

  return (
    <div
      onMouseEnter={() => clearTimeout(timerRef.current)}
      onMouseLeave={() => { timerRef.current = setTimeout(dismiss, 1500) }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '13px 16px', borderRadius: 14,
        background: c.bg, border: `1px solid ${c.border}`,
        boxShadow: dark
          ? '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)'
          : '0 8px 32px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.9)',
        maxWidth: 360, width: '100%',
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? 'translateX(0) scale(1)' : 'translateX(24px) scale(0.97)',
        transition: 'opacity 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.3s cubic-bezier(0.22,1,0.36,1)',
        cursor: 'default',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0, marginTop: 1 }}>{icons[type]}</div>

      {/* Message */}
      <p style={{ flex: 1, fontSize: 14, fontWeight: 500, color: c.text, lineHeight: 1.5, margin: 0 }}>
        {message}
      </p>

      {/* Close button */}
      <button
        onClick={dismiss}
        style={{
          flexShrink: 0, marginTop: 1, background: 'none', border: 'none',
          cursor: 'pointer', padding: 2, color: c.icon, opacity: 0.6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}

// ─── Toaster container ────────────────────────────────────────────────────────
export function Toaster({ dark = false }) {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _setToasts = setToasts
    return () => { _setToasts = null }
  }, [])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  if (toasts.length === 0) return null

  return createPortal(
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
      pointerEvents: 'none',
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem {...t} onRemove={remove} dark={dark} />
        </div>
      ))}
    </div>,
    document.body
  )
}