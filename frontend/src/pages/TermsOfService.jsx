import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const TERMS = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: `By creating an account or using Veilora in any way, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.

These terms apply to all users of Veilora, including visitors, registered users, and anyone who accesses files via a share link.`
  },
  {
    id: 'description',
    title: 'Description of Service',
    content: `Veilora provides an encrypted file storage and sharing platform. Files are encrypted client-side in your browser using AES-256-GCM before being uploaded to our servers. We do not have the ability to decrypt or access the contents of your files.

The service is provided as-is. We offer a free tier with 40 MB of encrypted storage per account. We reserve the right to modify storage limits, features, and pricing at any time with reasonable notice.`
  },
  {
    id: 'accounts',
    title: 'Your Account',
    items: [
      { label: 'Eligibility', desc: 'You must be at least 13 years of age to use Veilora. By registering, you confirm that you meet this requirement.' },
      { label: 'Accurate information', desc: 'You agree to provide a real, valid email address. Accounts created with disposable or temporary email addresses are prohibited and may be terminated without notice. We check email domains against a blocklist at registration time.' },
      { label: 'Account security', desc: 'You are responsible for maintaining the confidentiality of your account login credentials and for all activity that occurs under your account.' },
      { label: 'One account per person', desc: 'Creating multiple accounts to circumvent storage limits or other restrictions is not permitted.' },
      { label: 'Account termination', desc: 'We reserve the right to suspend or terminate accounts that violate these terms. In cases of serious violations, we may act without prior notice.' },
    ]
  },
  {
    id: 'encryption-responsibility',
    title: 'Your Encryption Password',
    content: `You are solely responsible for your encryption password. Veilora has no ability to recover lost passwords, decrypt your files, or restore access to encrypted content — this is by design.

If you lose your encryption password, your files are permanently inaccessible. We strongly recommend storing your password in a reputable password manager.

When sharing files, you must share your encryption password separately from the share link. Sending both together in the same message (e.g. a single email) reduces the security of the transfer to the security of that single channel.`
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    content: `You agree not to use Veilora to store, transmit, or share:`,
    prohibited: [
      'Child sexual abuse material (CSAM) or any content that sexually exploits minors.',
      'Malware, ransomware, spyware, or any software designed to cause harm to systems or individuals.',
      'Content that infringes the intellectual property rights of any third party.',
      'Personal data of third parties collected or processed in violation of applicable privacy laws.',
      'Content used to harass, threaten, stalk, or harm any individual.',
      'Any content that is illegal under applicable local, national, or international law.',
    ]
  },
  {
    id: 'enforcement',
    title: 'Enforcement & Zero-Knowledge Limitations',
    content: `Because Veilora uses zero-knowledge encryption, we cannot inspect the contents of your files. We are technically unable to confirm or deny what any encrypted file contains.

We reserve the right to remove files, revoke share links, and terminate accounts upon receipt of a valid legal order from a competent authority. We will comply with lawful requests and will follow applicable law regarding user notification.

We will not voluntarily disclose user data to any party without a valid legal basis.`
  },
  {
    id: 'storage-quota',
    title: 'Storage Quota & Limits',
    items: [
      { label: 'Free tier', desc: 'Each account receives 40 MB of encrypted storage at no cost. This limit applies to the total size of encrypted blobs, not the original file sizes.' },
      { label: 'Quota enforcement', desc: 'Uploads that would exceed your quota are rejected server-side before any storage is consumed. The dashboard displays your current usage.' },
      { label: 'File size', desc: 'There is no individual file size limit beyond your total quota.' },
      { label: 'Quota changes', desc: 'We reserve the right to change storage quotas with reasonable notice to registered users.' },
    ]
  },
  {
    id: 'share-links',
    title: 'Share Links',
    content: `Share links grant any holder the ability to download the encrypted ciphertext of the associated file. Decryption requires your encryption password, which must be shared separately.

You may revoke any share link at any time from your dashboard. Revocation takes effect immediately on our server. Expiry times are enforced server-side.

We are not responsible for files after a recipient has decrypted and downloaded them, or for the further distribution of share links you have created.`
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting',
    content: `Our API enforces a rate limit of 100 requests per 15-minute window per IP address. Attempts to circumvent this limit are a violation of these terms. Repeated violations may result in account suspension.`
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer of Warranties',
    content: `Veilora is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the service will be uninterrupted, error-free, or free from security vulnerabilities.

The cryptographic implementation uses industry-standard algorithms (AES-256-GCM, PBKDF2 with 310,000 iterations, Web Crypto API). However, no system can guarantee absolute security against all possible future threats. You use Veilora at your own risk.`
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, Veilora and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:

— Loss of or inability to access encrypted files due to a lost password
— Data loss caused by infrastructure failures
— Unauthorised access to your account due to compromised credentials
— Any damages arising from your use of or inability to use the service

Our total liability for any claims arising from use of the service shall not exceed the amount you paid us in the twelve months preceding the claim. For free-tier users, this amount is zero.`
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    content: `You agree to defend, indemnify, and hold harmless Veilora and its operators from any claims, damages, costs, and expenses (including reasonable legal fees) arising from your use of the service, your violation of these terms, or your violation of any third-party rights.`
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    content: `We may update these Terms of Service at any time. For material changes, we will notify you by email at least 14 days before the new terms take effect. Continued use of the service after that date constitutes acceptance of the revised terms.

Non-material changes (such as clarifications or corrections) may be made without advance notice. The date at the top of this document will always reflect the current version.`
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    content: `These terms are governed by applicable law. Any disputes arising under these terms shall be resolved in the jurisdiction where the service is operated. Nothing in these terms limits your rights as a consumer under applicable mandatory local laws.`
  },
  {
    id: 'contact',
    title: 'Contact',
    content: `For questions about these terms:\n\nlegal@veilora.app\n\nFor privacy-related matters, see our Privacy Policy or contact:\n\nprivacy@veilora.app`
  },
]

export default function TermsOfService() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('acceptance')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      for (const s of TERMS) {
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
        ::selection { background: rgba(245,158,11,0.3); color: #fff; }
        .nav-pill {
          display: block; width: 100%; text-align: left;
          padding: 9px 14px; border-radius: 8px; border: none;
          background: transparent; cursor: pointer;
          font-family: 'Sora', sans-serif; font-size: 12.5px; font-weight: 500;
          color: #4a4f6a; transition: all 0.2s ease; border-left: 2px solid transparent;
        }
        .nav-pill:hover { color: #b8a87c; background: rgba(255,255,255,0.03); }
        .nav-pill.active { color: #fbbf24; background: rgba(245,158,11,0.07); border-left-color: #f59e0b; }
        .section-block { margin-bottom: 64px; scroll-margin-top: 100px; }
        .section-title {
          font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700;
          color: #eef0fc; margin-bottom: 20px; letter-spacing: -0.3px;
          padding-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .section-text { font-size: 15px; line-height: 1.85; color: #8a90b8; white-space: pre-wrap; }
        .item-card {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 18px 20px; margin-bottom: 10px;
          display: flex; gap: 16px; align-items: flex-start; transition: background 0.2s;
        }
        .item-card:hover { background: rgba(245,158,11,0.04); }
        .item-dot { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; flex-shrink: 0; margin-top: 6px; }
        .item-label { font-size: 13.5px; font-weight: 600; color: #c5cbec; margin-bottom: 4px; }
        .item-desc { font-size: 13.5px; color: #6b7299; line-height: 1.7; }
        .prohibited-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 14px; color: #8a90b8; line-height: 1.6;
        }
        .prohibited-item:last-child { border-bottom: none; }
        .prohibited-x {
          width: 18px; height: 18px; border-radius: 50%;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
        }
        .badge {
          display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px;
          background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);
          font-size: 11px; font-weight: 600; color: #fbbf24; letter-spacing: 0.04em; text-transform: uppercase;
        }
        .back-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 10px 16px; cursor: pointer;
          color: #6b7299; font-size: 13px; font-family: 'Sora', sans-serif;
          font-weight: 500; transition: all 0.2s ease;
        }
        .back-btn:hover { background: rgba(255,255,255,0.07); color: #c9cfe8; transform: translateX(-2px); }
        .top-bar { position: fixed; top: 0; width: 100%; z-index: 50; transition: all 0.3s ease; }
        .top-bar.scrolled { background: rgba(8,9,15,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
        @media (max-width: 900px) { .sidebar { display: none !important; } .content-area { padding: 0 20px !important; } }
        .glow-amber {
          position: fixed; pointer-events: none; z-index: 0; width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%); top: -80px; left: -150px;
        }
      `}</style>

      <div className="glow-amber" />

      <div className={`top-bar ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button className="back-btn" onClick={() => navigate('/')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => navigate('/privacy')}
            style={{ background: 'none', border: 'none', color: '#4a4f6a', fontSize: 13, cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#fbbf24'} onMouseLeave={e => e.target.style.color = '#4a4f6a'}>
            Privacy Policy
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 64, paddingTop: 100 }}>
        <aside className="sidebar" style={{ width: 220, flexShrink: 0, position: 'sticky', top: 100, height: 'fit-content', paddingTop: 40 }}>
          <p style={{ fontSize: 10.5, fontWeight: 700, color: '#2e3250', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Contents</p>
          {TERMS.map(s => (
            <button key={s.id} className={`nav-pill ${activeSection === s.id ? 'active' : ''}`} onClick={() => scrollTo(s.id)}>
              {s.title}
            </button>
          ))}
          <div style={{ marginTop: 32, padding: '14px', borderRadius: 10, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)' }}>
            <p style={{ fontSize: 11, color: '#fbbf24', fontWeight: 600, marginBottom: 4 }}>Plain language</p>
            <p style={{ fontSize: 11, color: '#5a4a2a', lineHeight: 1.5 }}>We try to write terms you can actually read.</p>
          </div>
        </aside>

        <main className="content-area" style={{ flex: 1, paddingTop: 40, paddingBottom: 120 }}>
          <div style={{ marginBottom: 56 }}>
            <div className="badge" style={{ marginBottom: 20 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Legal Document
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 800, color: '#eef0fc', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
              Terms of<br /><span style={{ fontStyle: 'italic', color: '#f59e0b' }}>Service</span>
            </h1>
            <p style={{ fontSize: 15, color: '#4a4f6a', lineHeight: 1.7, maxWidth: 560 }}>
              These terms govern your use of Veilora. We have tried to write them clearly. If something is unclear, email us and we will explain it in plain language.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 20, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#2e3250' }}>Last updated: <span style={{ color: '#4a4f6a' }}>April 2025</span></span>
              <span style={{ fontSize: 12, color: '#2e3250' }}>Effective: <span style={{ color: '#4a4f6a' }}>April 2025</span></span>
            </div>
          </div>

          {TERMS.map(s => (
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
              {s.prohibited && (
                <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.08)', borderRadius: 14, padding: '4px 20px', marginTop: 16 }}>
                  {s.prohibited.map(text => (
                    <div key={text} className="prohibited-item">
                      <div className="prohibited-x">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
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