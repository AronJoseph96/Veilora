import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const SECTIONS = [
  {
    id: 'overview',
    title: 'Overview',
    content: `Veilora is built on a single principle: we cannot read your files, and we never will. This is not a promise — it is a mathematical guarantee enforced by your browser before any data leaves your device.

This Privacy Policy explains what little data we do collect, why we collect it, and how it is handled. We have worked hard to keep this list short.`
  },
  {
    id: 'what-we-collect',
    title: 'What We Collect',
    items: [
      { label: 'Account email', desc: 'Required for authentication and account recovery. Stored by Supabase Auth.' },
      { label: 'Authentication provider', desc: 'Whether you signed in via email/password or Google OAuth.' },
      { label: 'File metadata', desc: 'File name, size, upload timestamp, and MIME type. We store this so your file list works. We do not store file contents in readable form.' },
      { label: 'Encrypted ciphertext', desc: 'The output of AES-256-GCM encryption that ran entirely in your browser. This blob is unreadable to us without your password, which we never receive.' },
      { label: 'Share link records', desc: 'Token, expiry time, and revocation status. No file content is attached to share records.' },
    ]
  },
  {
    id: 'what-we-never-collect',
    title: 'What We Never Collect',
    never: [
      'Your encryption password — it never leaves your browser.',
      'Decryption keys of any kind.',
      'File contents in plaintext.',
      'IP addresses beyond what Supabase infrastructure logs by default.',
      'Cookies for tracking or advertising.',
      'Behavioural analytics, telemetry, or usage fingerprinting.',
    ]
  },
  {
    id: 'how-encryption-works',
    title: 'How Encryption Works',
    content: `When you upload a file, your browser generates a unique cryptographic salt and IV, then derives an AES-256-GCM key from your password using PBKDF2 with 310,000 SHA-256 iterations via the Web Crypto API. The file is encrypted locally. Only the resulting ciphertext is sent to our servers.

Your password is used exclusively within your browser's memory and is discarded immediately after the key is derived. No network request — not even an encrypted one — carries your password.

When a recipient downloads a file, their browser performs the reverse operation locally. Our server serves only the ciphertext; decryption happens entirely on the recipient's device.`
  },
  {
    id: 'third-parties',
    title: 'Third-Party Services',
    items: [
      { label: 'Supabase', desc: 'Provides authentication, database, and object storage infrastructure. Encrypted file blobs are stored in Supabase Storage. Supabase processes data under their own privacy policy and EU Standard Contractual Clauses.' },
      { label: 'Google OAuth', desc: 'If you choose to sign in with Google, Google processes your authentication. We receive only your email address and a unique identifier from Google.' },
      { label: 'Disify API', desc: 'Used during sign-up to check whether an email domain is a known disposable address. Your full email is sent to Disify only once, at the moment of account creation.' },
      { label: 'Google Fonts', desc: 'Loaded from Google\'s CDN for typography. Standard CDN access logs may apply.' },
    ]
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    content: `Files and their associated metadata are retained until you delete them or close your account. Share links are retained until revoked or expired.

Account data (email, authentication records) is retained for the lifetime of your account. Upon account deletion, we will remove your files, metadata, and share links. Residual data in database backups may persist for up to 30 days.`
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    content: `You have the right to access, correct, export, or delete your personal data at any time. Because we cannot decrypt your files, "access to your data" means access to metadata — file names, sizes, and timestamps.

To exercise any of these rights, contact us at the address below. We will respond within 30 days.`
  },
  {
    id: 'gdpr',
    title: 'GDPR & International Users',
    content: `Veilora is designed with GDPR principles in mind: data minimisation, purpose limitation, and privacy by default. We collect only what is strictly necessary and we do not sell, rent, or trade your data to any third party.

If you are located in the European Economic Area, your data is processed under the legitimate interest of providing the service you have signed up for, and where applicable, your explicit consent.`
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: `If we make material changes to this policy, we will notify you by email at least 14 days before the changes take effect. The "Last Updated" date at the top of this page will always reflect the current version.`
  },
  {
    id: 'contact',
    title: 'Contact',
    content: `For privacy-related questions or data requests, contact us at:\n\nprivacy@veilora.app\n\nWe take every inquiry seriously and aim to respond within 5 business days.`
  },
]

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom > 120) { setActiveSection(s.id); break }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ background: '#08090f', minHeight: '100vh', fontFamily: "'Sora', sans-serif", color: '#c9cfe8' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(99,102,241,0.35); color: #fff; }

        .nav-pill {
          display: block; width: 100%; text-align: left;
          padding: 9px 14px; border-radius: 8px; border: none;
          background: transparent; cursor: pointer;
          font-family: 'Sora', sans-serif; font-size: 12.5px; font-weight: 500;
          color: #4a4f6a; transition: all 0.2s ease;
          border-left: 2px solid transparent;
        }
        .nav-pill:hover { color: #8b92c4; background: rgba(255,255,255,0.03); }
        .nav-pill.active { color: #a5b4fc; background: rgba(99,102,241,0.08); border-left-color: #6366f1; }

        .section-block { margin-bottom: 64px; scroll-margin-top: 100px; }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 700;
          color: #eef0fc; margin-bottom: 20px;
          letter-spacing: -0.3px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .section-text {
          font-size: 15px; line-height: 1.85;
          color: #8a90b8; white-space: pre-wrap;
        }
        .item-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 18px 20px;
          margin-bottom: 10px; display: flex; gap: 16px; align-items: flex-start;
          transition: background 0.2s;
        }
        .item-card:hover { background: rgba(99,102,241,0.05); }
        .item-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #6366f1; flex-shrink: 0; margin-top: 6px;
        }
        .item-label { font-size: 13.5px; font-weight: 600; color: #c5cbec; margin-bottom: 4px; }
        .item-desc { font-size: 13.5px; color: #6b7299; line-height: 1.7; }
        .never-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 14px; color: #8a90b8; line-height: 1.6;
        }
        .never-item:last-child { border-bottom: none; }
        .never-check {
          width: 18px; height: 18px; border-radius: 50%;
          background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.2);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
        }
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 999px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          font-size: 11px; font-weight: 600; color: #818cf8; letter-spacing: 0.04em; text-transform: uppercase;
        }
        .back-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 10px 16px; cursor: pointer;
          color: #6b7299; font-size: 13px; font-family: 'Sora', sans-serif;
          font-weight: 500; transition: all 0.2s ease;
        }
        .back-btn:hover { background: rgba(255,255,255,0.07); color: #c9cfe8; transform: translateX(-2px); }

        .top-bar {
          position: fixed; top: 0; width: 100%; z-index: 50;
          transition: all 0.3s ease;
        }
        .top-bar.scrolled {
          background: rgba(8,9,15,0.9); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        @media (max-width: 900px) {
          .sidebar { display: none !important; }
          .content-area { padding: 0 20px !important; }
        }

        .glow { position: fixed; pointer-events: none; z-index: 0;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%);
          top: -100px; right: -200px;
        }
      `}</style>

      <div className="glow" />

      {/* Top bar */}
      <div className={`top-bar ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="back-btn" onClick={() => navigate('/')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back to Veilora
            </button>
          </div>
          <button
            onClick={() => navigate('/terms')}
            style={{ background: 'none', border: 'none', color: '#4a4f6a', fontSize: 13, cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#a5b4fc'}
            onMouseLeave={e => e.target.style.color = '#4a4f6a'}
          >
            Terms of Service →
          </button>
        </div>
      </div>

      {/* Page layout */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 64, paddingTop: 100 }}>

        {/* Sidebar TOC */}
        <aside className="sidebar" style={{ width: 220, flexShrink: 0, position: 'sticky', top: 100, height: 'fit-content', paddingTop: 40 }}>
          <p style={{ fontSize: 10.5, fontWeight: 700, color: '#2e3250', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Contents</p>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              className={`nav-pill ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.title}
            </button>
          ))}
          <div style={{ marginTop: 32, padding: '14px', borderRadius: 10, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}>
            <p style={{ fontSize: 11, color: '#4ade80', fontWeight: 600, marginBottom: 4 }}>Zero-Knowledge</p>
            <p style={{ fontSize: 11, color: '#2d5a3d', lineHeight: 1.5 }}>We physically cannot read your files.</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="content-area" style={{ flex: 1, paddingTop: 40, paddingBottom: 120 }}>
          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#818cf8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Legal Document
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 800, color: '#eef0fc', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
              Privacy<br /><span style={{ fontStyle: 'italic', color: '#6366f1' }}>Policy</span>
            </h1>
            <p style={{ fontSize: 15, color: '#4a4f6a', lineHeight: 1.7, maxWidth: 560 }}>
              Veilora is built so that privacy is the product, not an afterthought. This document tells you exactly what we collect and exactly what we cannot see.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#2e3250' }}>Last updated: <span style={{ color: '#4a4f6a' }}>January 2025</span></span>
              <span style={{ fontSize: 12, color: '#2e3250' }}>Effective: <span style={{ color: '#4a4f6a' }}>January 2025</span></span>
            </div>
          </div>

          {/* Sections */}
          {SECTIONS.map(s => (
            <div key={s.id} id={s.id} className="section-block">
              <h2 className="section-title">{s.title}</h2>

              {s.content && <p className="section-text">{s.content}</p>}

              {s.items && s.items.map(item => (
                <div key={item.label} className="item-card">
                  <div className="item-dot" />
                  <div>
                    <p className="item-label">{item.label}</p>
                    <p className="item-desc">{item.desc}</p>
                  </div>
                </div>
              ))}

              {s.never && (
                <div style={{ background: 'rgba(34,197,94,0.03)', border: '1px solid rgba(34,197,94,0.08)', borderRadius: 14, padding: '4px 20px' }}>
                  {s.never.map(text => (
                    <div key={text} className="never-item">
                      <div className="never-check">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      {text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}