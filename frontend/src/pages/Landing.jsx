import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('hero')
  const [scrolled, setScrolled] = useState(false)

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = ['hero', 'howitworks', 'features', 'security', 'cta']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom > 100) { setActiveSection(id); break }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'How It Works', id: 'howitworks' },
    { label: 'Features', id: 'features' },
    { label: 'Security', id: 'security' },
    { label: 'Get Started', id: 'cta' },
  ]

  const isActive = (id) => {
    if (id === 'hero') return activeSection === 'hero'
    if (id === 'cta') return activeSection === 'cta'
    return activeSection === id
  }

  return (
    <div style={{fontFamily:'Inter,sans-serif', background:'#0a0d1a', color:'#dee1f7', minHeight:'100vh'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-family:'Material Symbols Outlined'; font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .btn-primary { background: linear-gradient(135deg, #7c83ff 0%, #4f46e5 100%); color: #fff; border: none; cursor: pointer; font-weight: 700; transition: all 0.3s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(79,70,229,0.4); }
        .btn-secondary { background: rgba(255,255,255,0.06); color: #dee1f7; border: 1px solid rgba(255,255,255,0.12); cursor: pointer; font-weight: 700; transition: all 0.3s ease; }
        .btn-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
        .feature-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); transition: all 0.35s ease; }
        .feature-card:hover { background: rgba(124,131,255,0.08); border-color: rgba(124,131,255,0.3); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(79,70,229,0.15); }
        .nav-link { position: relative; cursor: pointer; transition: color 0.2s; padding-bottom: 4px; background: none; border: none; font-size: 14px; font-weight: 500; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, #7c83ff, #4f46e5); border-radius: 2px; transition: width 0.3s ease; }
        .nav-link.active { color: #a5b4fc; }
        .nav-link.active::after { width: 100%; }
        .nav-link:hover { color: #c7d2fe; }
        .nav-link:hover::after { width: 100%; }
        .fade-up { opacity: 0; transform: translateY(24px); animation: fadeUp 0.7s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        .progress-bar { animation: progressFill 2.5s ease-out 0.8s both; }
        @keyframes progressFill { from{width:0} to{width:67%} }
        .float { animation: float 4s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .glow-orb { animation: glowPulse 4s ease-in-out infinite; }
        @keyframes glowPulse { 0%,100%{opacity:0.15} 50%{opacity:0.3} }
        .step-card { background: #fff; transition: all 0.3s ease; }
        .step-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(79,70,229,0.15); }
        .trust-item { transition: all 0.3s ease; }
        .trust-item:hover { transform: translateY(-2px); opacity: 1 !important; }
        .testimonial-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); transition: all 0.3s ease; }
        .testimonial-card:hover { background: rgba(124,131,255,0.06); border-color: rgba(124,131,255,0.2); transform: translateY(-4px); }
        .logo-img { filter: brightness(0) invert(1); transition: all 0.3s ease; }
        .logo-img:hover { filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(165,180,252,0.8)); }
        @media (max-width: 768px) {
          nav { padding: 12px 20px !important; }
          nav > div:nth-child(2) { display: none !important; }
          #hero > div > div { grid-template-columns: 1fr !important; padding: 0 20px !important; gap: 32px !important; }
          #hero > div > div > div:nth-child(2) { display: none !important; }
          h1 { font-size: 44px !important; }
          #howitworks > div, #features > div, #security > div, #cta > div { padding: 0 20px !important; }
          #howitworks > div > div:last-child { grid-template-columns: 1fr !important; }
          #features > div > div:first-child { grid-template-columns: 1fr !important; }
          #features > div > div:last-child { grid-template-columns: 1fr 1fr !important; }
          #security > div { grid-template-columns: 1fr !important; gap: 40px !important; }
          footer > div > div:first-child > div { flex-direction: column !important; gap: 24px !important; }
          footer > div > div:first-child > div > div:last-child { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
        }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `}</style>

      {/* Navbar */}
      <header style={{
        position:'fixed', top:0, width:'100%', zIndex:50,
        background: scrolled ? 'rgba(10,13,26,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.4s ease'
      }}>
        <nav style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 48px', maxWidth:1280, margin:'0 auto'}}>
          <div style={{display:'flex', alignItems:'center', gap:10, cursor:'pointer'}}
            onClick={() => { scrollTo('hero'); setActiveSection('hero') }}>
            <img src="/logo.png" alt="Veilora" className="logo-img" style={{height:60, width:'auto'}} />
          </div>

          <div style={{display:'flex', alignItems:'center', gap:32}}>
            {navLinks.map(({ label, id }) => (
              <button key={id}
                className={`nav-link ${isActive(id) ? 'active' : ''}`}
                style={{color: isActive(id) ? '#a5b4fc' : '#94a3b8', fontFamily:'Inter,sans-serif'}}
                onClick={() => { scrollTo(id); setActiveSection(id) }}>
                {label}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={() => navigate('/login')}
            style={{padding:'10px 24px', borderRadius:999, fontSize:14, fontFamily:'Inter,sans-serif'}}>
            Start Now
          </button>
        </nav>
      </header>

      <main>
        {/* Hero — uses veilorabg as background */}
        <section id="hero" style={{
          position:'relative', minHeight:'100vh',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          paddingTop:120, paddingBottom:80, overflow:'hidden',
          backgroundImage:'url(/veilorabg.jpeg)',
          backgroundSize:'cover', backgroundPosition:'center',
          backgroundRepeat:'no-repeat',
        }}>
          {/* Dark overlay — replaces the low-opacity child div that caused blur */}
          <div style={{position:'absolute', inset:0, zIndex:0, background:'rgba(10,13,26,0.80)'}}/>
          <div className="glow-orb" style={{position:'absolute', top:'20%', left:'10%', width:400, height:400, borderRadius:'50%', background:'rgba(79,70,229,0.08)', filter:'blur(80px)', zIndex:1}}/>
          <div className="glow-orb" style={{position:'absolute', bottom:'20%', right:'10%', width:300, height:300, borderRadius:'50%', background:'rgba(124,131,255,0.06)', filter:'blur(60px)', zIndex:1, animationDelay:'2s'}}/>

          <div style={{position:'relative', zIndex:2, maxWidth:1280, margin:'0 auto', padding:'0 48px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center', width:'100%'}}>
            <div>
              <div className="fade-up delay-1" style={{display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:999, background:'rgba(124,131,255,0.1)', border:'1px solid rgba(124,131,255,0.2)', marginBottom:28}}>
                <span className="pulse-dot" style={{width:7, height:7, borderRadius:'50%', background:'#818cf8', display:'inline-block'}}/>
                <span style={{fontSize:13, color:'#a5b4fc', fontWeight:500}}>New: Quantum-Resistant Encryption</span>
              </div>
              <h1 className="fade-up delay-2" style={{fontSize:72, fontWeight:900, lineHeight:1.05, letterSpacing:'-2px', color:'#fff', marginBottom:24}}>
                Share Files With <br/><span style={{color:'#818cf8'}}>Zero Compromise</span>
              </h1>
              <p className="fade-up delay-3" style={{fontSize:18, color:'#94a3b8', lineHeight:1.7, maxWidth:480, marginBottom:36}}>
                Veilora encrypts your files in your browser before upload. We never see your data. Ever. Your files. Your keys. Zero knowledge.
              </p>
              <div className="fade-up delay-4" style={{display:'flex', gap:16, flexWrap:'wrap'}}>
                <button className="btn-primary" onClick={() => navigate('/login')}
                  style={{padding:'14px 32px', borderRadius:999, fontSize:16, fontFamily:'Inter,sans-serif'}}>
                  Start for Free
                </button>
                <button className="btn-secondary" onClick={() => scrollTo('howitworks')}
                  style={{padding:'14px 32px', borderRadius:999, fontSize:16, fontFamily:'Inter,sans-serif'}}>
                  See How It Works
                </button>
              </div>
            </div>

            {/* Mockup */}
            <div className="float fade-up delay-5">
              <div className="glass" style={{borderRadius:16, padding:28, boxShadow:'0 24px 80px rgba(0,0,0,0.4)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
                  <div style={{display:'flex', gap:6}}>
                    <div style={{width:11, height:11, borderRadius:'50%', background:'rgba(255,95,86,0.7)'}}/>
                    <div style={{width:11, height:11, borderRadius:'50%', background:'rgba(255,189,46,0.7)'}}/>
                    <div style={{width:11, height:11, borderRadius:'50%', background:'rgba(39,201,63,0.7)'}}/>
                  </div>
                  <span style={{fontSize:11, color:'#475569', fontFamily:'monospace'}}>secure-session</span>
                </div>
                <div style={{border:'2px dashed rgba(124,131,255,0.25)', borderRadius:12, padding:'48px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:16, background:'rgba(0,0,0,0.3)'}}>
                  <div style={{width:60, height:60, borderRadius:'50%', background:'rgba(79,70,229,0.25)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <span className="material-symbols-outlined" style={{fontSize:32, color:'#818cf8', fontVariationSettings:"'FILL' 1"}}>lock</span>
                  </div>
                  <div style={{textAlign:'center'}}>
                    <p style={{fontWeight:700, color:'#fff', marginBottom:4}}>Drop files to encrypt</p>
                    <p style={{fontSize:13, color:'#64748b'}}>Browser-side AES-256-GCM protection</p>
                  </div>
                </div>
                <div style={{marginTop:20}}>
                  <div style={{height:6, background:'rgba(255,255,255,0.06)', borderRadius:999, overflow:'hidden', marginBottom:8}}>
                    <div className="progress-bar" style={{height:'100%', background:'linear-gradient(90deg,#818cf8,#4f46e5)', borderRadius:999, width:0}}/>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:11, color:'#475569', fontFamily:'monospace'}}>
                    <span>ENCRYPTING_CHUNKS...</span><span>67%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section style={{padding:'28px 0', background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{maxWidth:1280, margin:'0 auto', padding:'0 48px', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:24}}>
            {[
              { icon:'shield', label:'AES-256-GCM Encryption' },
              { icon:'visibility_off', label:'Zero Knowledge Architecture' },
              { icon:'code', label:'Open Source' },
              { icon:'verified_user', label:'GDPR Ready' },
            ].map(({ icon, label }) => (
              <div key={label} className="trust-item" style={{display:'flex', alignItems:'center', gap:8, opacity:0.5}}>
                <span className="material-symbols-outlined" style={{color:'#818cf8', fontSize:20}}>{icon}</span>
                <span style={{fontSize:13, fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color:'#94a3b8'}}>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="howitworks" style={{padding:'112px 0', background:'#f8fafc', color:'#0f172a'}}>
          <div style={{maxWidth:1280, margin:'0 auto', padding:'0 48px'}}>
            <div style={{textAlign:'center', marginBottom:72}}>
              <h2 style={{fontSize:48, fontWeight:800, letterSpacing:'-1.5px', marginBottom:16}}>Privacy by design, not by policy</h2>
              <div style={{height:4, width:80, background:'linear-gradient(90deg,#818cf8,#4f46e5)', borderRadius:999, margin:'0 auto'}}/>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:32, position:'relative'}}>
              <div style={{position:'absolute', top:'50%', left:0, width:'100%', height:1, background:'#e2e8f0', zIndex:0}}/>
              {[
                { icon:'upload', step:'1. Upload', desc:'Your browser encrypts the file with AES-256-GCM before it ever leaves your machine.' },
                { icon:'share', step:'2. Share', desc:'Generate a secure link with optional expiry. Share the password separately for full zero-knowledge.' },
                { icon:'key', step:'3. Decrypt', desc:"The recipient enters the password and their browser decrypts the file locally. Server sees nothing." },
              ].map(({ icon, step, desc }) => (
                <div key={step} className="step-card" style={{borderRadius:16, padding:40, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:20, position:'relative', zIndex:1, boxShadow:'0 4px 24px rgba(0,0,0,0.06)'}}>
                  <div style={{width:72, height:72, borderRadius:'50%', background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <span className="material-symbols-outlined" style={{fontSize:36, color:'#4f46e5'}}>{icon}</span>
                  </div>
                  <h3 style={{fontSize:18, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.05em'}}>{step}</h3>
                  <p style={{color:'#64748b', lineHeight:1.7, fontWeight:500}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" style={{padding:'112px 0', background:'#0a0d1a'}}>
          <div style={{maxWidth:1280, margin:'0 auto', padding:'0 48px'}}>
            <div style={{textAlign:'center', marginBottom:56}}>
              <h2 style={{fontSize:44, fontWeight:800, color:'#fff', letterSpacing:'-1px', marginBottom:16}}>Everything you need for secure sharing</h2>
              <div style={{height:4, width:80, background:'linear-gradient(90deg,#818cf8,#4f46e5)', borderRadius:999, margin:'0 auto'}}/>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, marginBottom:20}}>
              {/* Main big card */}
              <div className="feature-card" style={{borderRadius:16, padding:40, position:'relative', overflow:'hidden'}}>
                <div style={{position:'absolute', top:0, right:0, padding:24, opacity:0.06, fontSize:160, lineHeight:1}}>
                  <span className="material-symbols-outlined" style={{fontSize:160}}>security</span>
                </div>
                <div style={{width:44, height:44, borderRadius:10, background:'rgba(124,131,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20}}>
                  <span className="material-symbols-outlined" style={{color:'#818cf8'}}>vpn_lock</span>
                </div>
                <h3 style={{fontSize:28, fontWeight:800, color:'#fff', marginBottom:12}}>End-to-End Encryption</h3>
                <p style={{color:'#64748b', fontSize:16, lineHeight:1.7, maxWidth:380}}>Every single bit is scrambled using AES-256-GCM before it ever hits the wire. Only the intended recipient with the correct password can unscramble it.</p>
                <div style={{marginTop:28, height:160, borderRadius:12, background:'linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b)', border:'1px solid rgba(255,255,255,0.06)', opacity:0.7}}/>
              </div>
              <div className="feature-card" style={{borderRadius:16, padding:32}}>
                <span className="material-symbols-outlined" style={{color:'#818cf8', fontSize:24, marginBottom:14, display:'block'}}>dns</span>
                <h4 style={{fontSize:18, fontWeight:700, color:'#fff', marginBottom:8}}>Zero Knowledge Server</h4>
                <p style={{color:'#64748b', fontSize:14, lineHeight:1.7}}>We store only encrypted blobs. No keys, no passwords, no way to read your data. Ever.</p>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:20}}>
              {[
                { icon:'link', title:'Secure Share Links', desc:'Set expiry times and revoke access anytime. Links are worthless without the password.' },
                { icon:'toggle_on', title:'Privacy First Toggle', desc:'Zero telemetry, no cookies, no analytics. Every privacy setting is on by default.' },
                { icon:'fact_check', title:'File Integrity', desc:'AES-GCM authentication detects any tampering before decryption completes.' },
                { icon:'fingerprint', title:'Your Keys Only', desc:'PBKDF2 key derivation runs in your browser. Your password never leaves your device.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="feature-card" style={{borderRadius:16, padding:28}}>
                  <span className="material-symbols-outlined" style={{color:'#818cf8', fontSize:22, marginBottom:12, display:'block'}}>{icon}</span>
                  <h4 style={{fontSize:16, fontWeight:700, color:'#fff', marginBottom:6}}>{title}</h4>
                  <p style={{color:'#64748b', fontSize:13, lineHeight:1.7}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" style={{padding:'112px 0', background:'#060810', position:'relative', overflow:'hidden'}}>
          <div className="glow-orb" style={{position:'absolute', top:'30%', right:'5%', width:350, height:350, borderRadius:'50%', background:'rgba(79,70,229,0.06)', filter:'blur(80px)'}}/>
          <div style={{maxWidth:1280, margin:'0 auto', padding:'0 48px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center', position:'relative', zIndex:1}}>
            <div>
              <h2 style={{fontSize:48, fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:36}}>
                Your password never <br/>leaves your device
              </h2>
              <ul style={{listStyle:'none', display:'flex', flexDirection:'column', gap:20}}>
                {[
                  'PBKDF2 key derivation with 310,000 iterations happens entirely in your browser.',
                  'Keys are never sent to our servers in any form — encrypted or otherwise.',
                  'Uses the browser-native Web Crypto API for hardware-accelerated AES-256-GCM.',
                  'Each file gets a unique random salt and IV — identical files produce different ciphertext.',
                ].map((text) => (
                  <li key={text} style={{display:'flex', gap:14, alignItems:'flex-start'}}>
                    <div style={{marginTop:3, width:22, height:22, borderRadius:'50%', background:'rgba(124,131,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                      <span className="material-symbols-outlined" style={{fontSize:14, color:'#818cf8'}}>check</span>
                    </div>
                    <p style={{color:'#94a3b8', lineHeight:1.7, fontWeight:500}}>{text}</p>
                  </li>
                ))}
              </ul>
            </div>
            {/* Code block */}
            <div style={{borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)', boxShadow:'0 24px 80px rgba(0,0,0,0.5)'}}>
              <div style={{background:'#1e2133', padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                <div style={{display:'flex', gap:6}}>
                  <div style={{width:11, height:11, borderRadius:'50%', background:'#ff5f56'}}/>
                  <div style={{width:11, height:11, borderRadius:'50%', background:'#ffbd2e'}}/>
                  <div style={{width:11, height:11, borderRadius:'50%', background:'#27c93f'}}/>
                </div>
                <span style={{fontSize:10, fontFamily:'monospace', color:'#475569', textTransform:'uppercase', letterSpacing:'0.1em'}}>crypto_engine.js</span>
              </div>
              <div style={{padding:28, fontFamily:'monospace', fontSize:13, lineHeight:1.8, background:'#0d1117', overflowX:'auto'}}>
                <p style={{color:'#7c83ff'}}>async <span style={{color:'#fff'}}>function</span> <span style={{color:'#a5b4fc'}}>encryptFile</span>(fileData, masterKey) {'{'}</p>
                <p style={{color:'#475569', paddingLeft:16}}>// Derive 256-bit AES key locally</p>
                <p style={{color:'#7c83ff', paddingLeft:16}}><span style={{color:'#fff'}}>const</span> key = <span style={{color:'#fff'}}>await</span> window.crypto.subtle.deriveKey(</p>
                <p style={{color:'#7c83ff', paddingLeft:32}}>{'{ name: '}<span style={{color:'#34d399'}}>"PBKDF2"</span>{', salt, iterations: '}<span style={{color:'#fb923c'}}>310000</span>{' },'}</p>
                <p style={{color:'#7c83ff', paddingLeft:32}}>{'masterKey, { name: '}<span style={{color:'#34d399'}}>"AES-GCM"</span>{', length: '}<span style={{color:'#fb923c'}}>256</span>{' },'}</p>
                <p style={{color:'#7c83ff', paddingLeft:32}}><span style={{color:'#fff'}}>false</span>{', ['}<span style={{color:'#34d399'}}>"encrypt"</span>{']'}</p>
                <p style={{color:'#7c83ff', paddingLeft:16}}>);</p>
                <p style={{color:'#475569', paddingLeft:16}}>// Encryption never touches our servers</p>
                <p style={{color:'#7c83ff', paddingLeft:16}}><span style={{color:'#fff'}}>return await</span> crypto.subtle.encrypt({'{ name: '}<span style={{color:'#34d399'}}>"AES-GCM"</span>{', iv },'} key, fileData);</p>
                <p style={{color:'#7c83ff'}}>{'}'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section style={{padding:'112px 0', background:'#0a0d1a'}}>
          <div style={{maxWidth:1280, margin:'0 auto', padding:'0 48px'}}>
            <div style={{textAlign:'center', marginBottom:56}}>
              <h2 style={{fontSize:44, fontWeight:800, color:'#fff', letterSpacing:'-1px', marginBottom:16}}>Trusted by security professionals</h2>
              <div style={{height:4, width:80, background:'linear-gradient(90deg,#818cf8,#4f46e5)', borderRadius:999, margin:'0 auto'}}/>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24}}>
              {[
                { quote:"Finally a file sharing tool that actually practices what it preaches. The zero-knowledge model is real — I verified it myself.", name:"Alex R.", role:"Penetration Tester" },
                { quote:"We switched our entire team to Veilora for client documents. Encryption before upload — that's the only way I trust cloud storage.", name:"Priya M.", role:"CISO, FinTech Startup" },
                { quote:"Simple enough for non-technical users, strong enough for security engineers. That balance is incredibly hard to achieve.", name:"Jordan K.", role:"Security Engineer" },
              ].map(({ quote, name, role }) => (
                <div key={name} className="testimonial-card" style={{borderRadius:16, padding:32, display:'flex', flexDirection:'column', gap:20}}>
                  <div style={{display:'flex', gap:4}}>
                    {[...Array(5)].map((_,i) => <span key={i} style={{color:'#818cf8', fontSize:16}}>★</span>)}
                  </div>
                  <p style={{color:'#94a3b8', lineHeight:1.7, flex:1}}>"{quote}"</p>
                  <div>
                    <p style={{color:'#fff', fontWeight:700}}>{name}</p>
                    <p style={{color:'#475569', fontSize:13}}>{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" style={{padding:'120px 0', background:'#060810', position:'relative', overflow:'hidden'}}>
          <div className="glow-orb" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:700, height:400, borderRadius:'50%', background:'rgba(79,70,229,0.12)', filter:'blur(100px)'}}/>
          <div style={{maxWidth:640, margin:'0 auto', padding:'0 48px', textAlign:'center', position:'relative', zIndex:1}}>
            <h2 style={{fontSize:56, fontWeight:900, color:'#fff', letterSpacing:'-2px', lineHeight:1.1, marginBottom:20}}>Ready to share files the private way?</h2>
            <p style={{fontSize:18, color:'#64748b', marginBottom:44, lineHeight:1.7}}>Join security-conscious professionals who trust Veilora for their sensitive data.</p>
            <div style={{display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap', marginBottom:24}}>
              <button className="btn-primary" onClick={() => navigate('/login')}
                style={{padding:'16px 40px', borderRadius:999, fontSize:17, fontFamily:'Inter,sans-serif'}}>
                Create Free Account
              </button>
              <a href="https://github.com/AronJoseph96/Veilora" target="_blank" rel="noopener noreferrer"
                className="btn-secondary"
                style={{padding:'16px 40px', borderRadius:999, fontSize:17, fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', gap:10, textDecoration:'none'}}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
            <p style={{fontSize:13, color:'#334155'}}>No credit card. No tracking. No compromise.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{background:'#04060f', borderTop:'1px solid rgba(255,255,255,0.04)', padding:'56px 48px 32px'}}>
        <div style={{maxWidth:1280, margin:'0 auto'}}>
          <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:48, marginBottom:48}}>
            <div style={{maxWidth:280}}>
              <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:16}}>
                <img src="/logo.png" alt="Veilora" className="logo-img" style={{height:48, width:'auto'}}/>
              </div>
              <p style={{color:'#334155', fontSize:14, lineHeight:1.7}}>The sovereign vault for your digital assets. Privacy by default, security by mathematics.</p>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:48}}>
              {[
                { title:'Platform', links:[
                  { label:'How It Works', action:() => scrollTo('howitworks') },
                  { label:'Features', action:() => scrollTo('features') },
                  { label:'Security', action:() => scrollTo('security') },
                ]},
                { title:'Resources', links:[
                  { label:'GitHub', href:'https://github.com/AronJoseph96/Veilora' },
                  { label:'Get Started', action:() => navigate('/login') },
                ]},
                { title:'Legal', links:[
                  { label:'Privacy Policy', href:'#' },
                  { label:'Terms of Service', href:'#' },
                ]},
              ].map(({ title, links }) => (
                <div key={title}>
                  <h5 style={{color:'#fff', fontWeight:700, fontSize:12, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:16}}>{title}</h5>
                  <ul style={{listStyle:'none', display:'flex', flexDirection:'column', gap:10}}>
                    {links.map(({ label, href, action }) => (
                      <li key={label}>
                        {action
                          ? <button onClick={action} style={{background:'none', border:'none', color:'#475569', fontSize:14, cursor:'pointer', fontFamily:'Inter,sans-serif', transition:'color 0.2s'}}
                              onMouseEnter={e => e.target.style.color='#818cf8'} onMouseLeave={e => e.target.style.color='#475569'}>{label}</button>
                          : <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                              style={{color:'#475569', fontSize:14, textDecoration:'none', transition:'color 0.2s'}}
                              onMouseEnter={e => e.target.style.color='#818cf8'} onMouseLeave={e => e.target.style.color='#475569'}>{label}</a>
                        }
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.04)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16}}>
            <p style={{color:'#1e293b', fontSize:13}}>© 2025 Veilora. All rights reserved.</p>
            <a href="https://github.com/AronJoseph96/Veilora" target="_blank" rel="noopener noreferrer"
              style={{color:'#334155', transition:'color 0.2s'}}
              onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='#334155'}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}