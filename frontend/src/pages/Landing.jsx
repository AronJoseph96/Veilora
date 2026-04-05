import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="dark bg-[#0e1322] text-[#dee1f7] font-[Inter] min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-panel { background: rgba(47,52,69,0.4); backdrop-filter: blur(20px); border: 1px solid rgba(145,143,161,0.2); }
        .hero-glow { background: radial-gradient(circle at center, rgba(65,78,220,0.15) 0%, rgba(14,19,34,0) 70%); }
        .button-gradient { background: linear-gradient(135deg, #bec2ff 0%, #414edc 100%); }
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
      `}</style>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/10 shadow-2xl" style={{background:'rgba(2,6,23,0.4)'}}>
        <nav className="flex justify-between items-center px-8 py-3 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="Veilora" className="h-9 w-auto rounded-lg" />
            <span className="text-2xl font-black tracking-tighter text-white">Veilora</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home', id: null },
              { label: 'How It Works', id: 'howitworks' },
              { label: 'Features', id: 'features' },
              { label: 'Security', id: 'security' },
              { label: 'Get Started', id: 'cta' },
            ].map(({ label, id }) => (
              <a key={label}
                className="font-medium hover:text-white transition-colors cursor-pointer text-slate-400 hover:text-[#bec2ff] text-sm"
                onClick={() => id ? scrollTo(id) : window.scrollTo({ top: 0, behavior: 'smooth' })}>
                {label}
              </a>
            ))}
          </div>

          <button onClick={() => navigate('/login')}
            className="button-gradient text-[#000da4] px-6 py-2 rounded-full font-bold shadow-lg hover:opacity-90 transition-opacity text-sm">
            Start Now
          </button>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 hero-glow -z-10"></div>
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border" style={{background:'#25293a', borderColor:'rgba(70,69,85,0.3)'}}>
                <span className="w-2 h-2 rounded-full bg-[#bec2ff] animate-pulse"></span>
                <span className="text-sm text-[#bec2ff] font-medium">New: Quantum-Resistant Encryption</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none text-white">
                Share Files With <br/><span className="text-[#bec2ff]">Zero Compromise</span>
              </h1>
              <p className="text-xl text-[#c7c4d8] font-medium leading-relaxed max-w-xl">
                Veilora encrypts your files in your browser before upload. We never see your data. Ever. Your files. Your keys. Zero knowledge.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => navigate('/login')}
                  className="button-gradient text-[#000da4] px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:opacity-90 active:scale-95 transition-all">
                  Start for Free
                </button>
                <button onClick={() => scrollTo('howitworks')}
                  className="px-8 py-4 rounded-full font-bold text-lg hover:bg-white/5 transition-colors active:scale-95 text-[#dee1f7]"
                  style={{background:'#2f3445'}}>
                  See How It Works
                </button>
              </div>
            </div>

            {/* Mockup card */}
            <div className="relative group">
              <div className="glass-panel rounded-xl p-8 relative z-10 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">secure-session</span>
                </div>
                <div className="border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-4"
                  style={{borderColor:'rgba(70,69,85,0.5)', background:'rgba(9,14,28,0.5)'}}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{background:'rgba(65,78,220,0.2)'}}>
                    <span className="material-symbols-outlined text-4xl text-[#bec2ff]" style={{fontVariationSettings:"'FILL' 1"}}>lock</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Drop files to encrypt</h3>
                    <p className="text-sm text-[#c7c4d8]">Browser-side AES-256-GCM protection</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-2 w-full rounded-full overflow-hidden" style={{background:'#2f3445'}}>
                    <div className="h-full rounded-full bg-[#bec2ff]" style={{width:'67%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>ENCRYPTING_CHUNKS...</span>
                    <span>67%</span>
                  </div>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl" style={{background:'rgba(99,102,241,0.1)'}}></div>
              <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full blur-3xl" style={{background:'rgba(190,194,255,0.1)'}}></div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-12 border-y border-white/5" style={{background:'#161b2b'}}>
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-wrap justify-between items-center gap-8 opacity-60 hover:opacity-100 transition-all duration-500">
              {[
                { icon: 'shield', label: 'AES-256-GCM Encryption' },
                { icon: 'visibility_off', label: 'Zero Knowledge Architecture' },
                { icon: 'code', label: 'Open Source' },
                { icon: 'verified_user', label: 'GDPR Ready' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#bec2ff]">{icon}</span>
                  <span className="font-bold tracking-wider text-sm uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="howitworks" className="py-32 bg-slate-50 text-slate-900">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Privacy by design, not by policy</h2>
              <div className="h-1.5 w-24 mx-auto rounded-full bg-[#414edc]"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
              {[
                { icon: 'upload', step: '1. Upload', desc: 'Your browser encrypts the file with AES-256-GCM before it ever leaves your machine.' },
                { icon: 'share', step: '2. Share', desc: 'Generate a secure link with optional expiry. Share the password separately for full zero-knowledge.' },
                { icon: 'key', step: '3. Decrypt', desc: "The recipient enters the password and their browser decrypts the file locally. Server sees nothing." },
              ].map(({ icon, step, desc }) => (
                <div key={step} className="flex flex-col items-center text-center space-y-6 bg-white p-10 rounded-xl shadow-xl shadow-slate-200/50">
                  <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-4xl text-[#414edc]">{icon}</span>
                  </div>
                  <h3 className="text-xl font-extrabold uppercase tracking-tight">{step}</h3>
                  <p className="text-slate-600 font-medium">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Bento */}
        <section id="features" className="py-32" style={{background:'#0e1322'}}>
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-white mb-4">Everything you need for secure sharing</h2>
              <div className="h-1.5 w-24 mx-auto rounded-full bg-[#414edc]"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 glass-panel p-10 rounded-xl flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 group-hover:scale-[1.7] transition-transform">
                  <span className="material-symbols-outlined text-[160px]">security</span>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{background:'rgba(190,194,255,0.2)'}}>
                    <span className="material-symbols-outlined text-[#bec2ff]">vpn_lock</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-white mb-4">End-to-End Encryption</h3>
                  <p className="text-[#c7c4d8] text-lg leading-relaxed max-w-md">Every single bit is scrambled using AES-256-GCM before it ever hits the wire. Only the intended recipient with the correct password can unscramble it.</p>
                </div>
                <div className="w-full h-48 rounded-lg mt-8 border border-white/10 opacity-60 group-hover:opacity-100 transition-all duration-700"
                  style={{background:'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)'}}></div>
              </div>

              {[
                { icon: 'dns', title: 'Zero Knowledge Server', desc: 'We store only encrypted blobs. No keys, no passwords, no way to read your data. Ever.' },
                { icon: 'link', title: 'Secure Share Links', desc: 'Set expiration times and revoke access anytime. Links are worthless without the password.' },
                { icon: 'fact_check', title: 'File Integrity', desc: 'AES-GCM built-in authentication detects any tampering before decryption completes.' },
                { icon: 'fingerprint', title: 'Your Keys Only', desc: 'PBKDF2 key derivation runs in your browser. Your password is never transmitted anywhere.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="p-8 rounded-xl border border-white/10 hover:border-[#bec2ff]/50 transition-colors"
                  style={{background:'#1a1f2f'}}>
                  <span className="material-symbols-outlined text-[#bec2ff] mb-4 block">{icon}</span>
                  <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
                  <p className="text-[#c7c4d8] text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Deep Dive */}
        <section id="security" className="py-32 relative overflow-hidden" style={{background:'#090e1c'}}>
          <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                Your password never <br/>leaves your device
              </h2>
              <ul className="space-y-6">
                {[
                  'PBKDF2 key derivation with 310,000 iterations happens entirely in your browser.',
                  'Keys are never sent to our servers in any form — encrypted or otherwise.',
                  'Uses the browser-native Web Crypto API for hardware-accelerated AES-256-GCM.',
                  'Each file gets a unique random salt and IV — identical files produce different ciphertext.',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{background:'rgba(190,194,255,0.2)'}}>
                      <span className="material-symbols-outlined text-sm text-[#bec2ff]">check</span>
                    </div>
                    <p className="text-[#dee1f7] font-medium">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-white/5 shadow-2xl">
              <div className="px-6 py-3 flex items-center justify-between border-b border-white/5" style={{background:'#2f3445'}}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">crypto_engine.js</span>
              </div>
              <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto">
                <p className="text-indigo-400">async <span className="text-white">function</span> <span className="text-indigo-300">encryptFile</span>(fileData, masterKey) {'{'}</p>
                <p className="pl-4 text-slate-500">// Derive 256-bit AES key locally</p>
                <p className="pl-4 text-indigo-400"><span className="text-white">const</span> key = <span className="text-white">await</span> window.crypto.subtle.deriveKey(</p>
                <p className="pl-8 text-indigo-400">{'{ name: '}<span className="text-emerald-400">"PBKDF2"</span>{', salt, iterations: '}<span className="text-orange-400">310000</span>{' },'}</p>
                <p className="pl-8 text-indigo-400">{'masterKey, { name: '}<span className="text-emerald-400">"AES-GCM"</span>{', length: '}<span className="text-orange-400">256</span>{' },'}</p>
                <p className="pl-8 text-indigo-400"><span className="text-white">false</span>{', ['}<span className="text-emerald-400">"encrypt"</span>{']'}</p>
                <p className="pl-4 text-indigo-400">);</p>
                <p className="pl-4 text-slate-500">// Encryption never touches our servers</p>
                <p className="pl-4 text-indigo-400"><span className="text-white">return await</span> crypto.subtle.encrypt({'{ name: '}<span className="text-emerald-400">"AES-GCM"</span>{', iv },'} key, fileData);</p>
                <p className="text-indigo-400">{'}'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32" style={{background:'#0e1322'}}>
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-white mb-4">Trusted by security professionals</h2>
              <div className="h-1.5 w-24 mx-auto rounded-full bg-[#414edc]"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "Finally a file sharing tool that actually practices what it preaches. The zero-knowledge model is real — I verified it myself.", name: "Alex R.", role: "Penetration Tester" },
                { quote: "We switched our entire team to Veilora for sharing client documents. The encryption happens before upload — that's the only way I trust cloud storage.", name: "Priya M.", role: "CISO, FinTech Startup" },
                { quote: "Simple enough for non-technical users, strong enough for security engineers. That balance is incredibly hard to achieve.", name: "Jordan K.", role: "Security Engineer" },
              ].map(({ quote, name, role }) => (
                <div key={name} className="glass-panel p-8 rounded-xl flex flex-col gap-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-[#bec2ff] text-lg">★</span>)}
                  </div>
                  <p className="text-[#c7c4d8] leading-relaxed flex-1">"{quote}"</p>
                  <div>
                    <p className="text-white font-bold">{name}</p>
                    <p className="text-slate-500 text-sm">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-32 relative" style={{background:'#090e1c'}}>
          <div className="max-w-4xl mx-auto px-8 text-center space-y-10 relative z-10">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white">Ready to share files the private way?</h2>
            <p className="text-xl text-[#c7c4d8] font-medium">Join security-conscious professionals who trust Veilora for their sensitive data.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/login')}
                className="button-gradient text-[#000da4] px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-transform">
                Create Free Account
              </button>
              <a href="https://github.com/AronJoseph96/Veilora" target="_blank" rel="noopener noreferrer"
                className="border px-10 py-5 rounded-full font-bold text-xl hover:bg-white/5 transition-colors text-[#dee1f7] flex items-center gap-3"
                style={{borderColor:'rgba(70,69,85,0.3)'}}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
            <p className="text-sm text-slate-500">No credit card. No tracking. No compromise.</p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full -z-10 blur-[120px]"
            style={{background:'rgba(190,194,255,0.2)'}}></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-8" style={{background:'#090e1c'}}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 max-w-7xl mx-auto">
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Veilora" className="h-8 w-auto rounded-lg" />
              <span className="text-lg font-bold text-white">Veilora</span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              The sovereign vault for your digital assets. Privacy by default, security by mathematics.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            {[
              {
                title: 'Platform',
                links: [
                  { label: 'How It Works', action: () => scrollTo('howitworks') },
                  { label: 'Features', action: () => scrollTo('features') },
                  { label: 'Security', action: () => scrollTo('security') },
                ]
              },
              {
                title: 'Resources',
                links: [
                  { label: 'GitHub', href: 'https://github.com/AronJoseph96/Veilora' },
                  { label: 'Get Started', action: () => navigate('/login') },
                ]
              },
              {
                title: 'Legal',
                links: [
                  { label: 'Privacy Policy', href: '#' },
                  { label: 'Terms of Service', href: '#' },
                ]
              },
            ].map(({ title, links }) => (
              <div key={title} className="space-y-4">
                <h5 className="text-white font-bold text-sm uppercase tracking-widest">{title}</h5>
                <ul className="space-y-2">
                  {links.map(({ label, href, action }) => (
                    <li key={label}>
                      {action ? (
                        <button onClick={action} className="text-slate-500 font-medium text-sm hover:text-indigo-300 transition-colors text-left">
                          {label}
                        </button>
                      ) : (
                        <a href={href} target={href?.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="text-slate-500 font-medium text-sm hover:text-indigo-300 transition-colors">
                          {label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm font-medium">© 2025 Veilora. All rights reserved.</p>
          <a href="https://github.com/AronJoseph96/Veilora" target="_blank" rel="noopener noreferrer"
            className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}