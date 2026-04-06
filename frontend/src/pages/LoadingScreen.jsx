// src/pages/LoadingScreen.jsx
// Drop this in your frontend/src/pages/ folder

export default function LoadingScreen({ dark = false }) {
  const bg = dark
    ? 'linear-gradient(145deg, #0c0c12 0%, #111118 60%, #0c0c12 100%)'
    : 'linear-gradient(145deg, #f5f0eb 0%, #ede8e0 40%, #e8e2d8 100%)'

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: bg,
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      transition: 'opacity 0.5s ease',
      animation: 'lsFadeIn 0.35s ease both',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes lsFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes lsLogoIn {
          from { opacity: 0; transform: translateY(12px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }

        @keyframes lsPulse {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.92); }
        }

        @keyframes lsBarFill {
          0%   { width: 0%; opacity: 1; }
          80%  { width: 90%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }

        @keyframes lsDotBounce {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.4; }
          40%            { transform: translateY(-6px); opacity: 1; }
        }

        @keyframes lsGlowPulse {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50%       { opacity: 0.22; transform: scale(1.08); }
        }

        .ls-logo {
          animation: lsLogoIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }

        .ls-glow {
          animation: lsGlowPulse 3s ease-in-out infinite;
        }

        .ls-dot-1 { animation: lsDotBounce 1.2s ease-in-out 0s infinite; }
        .ls-dot-2 { animation: lsDotBounce 1.2s ease-in-out 0.15s infinite; }
        .ls-dot-3 { animation: lsDotBounce 1.2s ease-in-out 0.3s infinite; }

        .ls-bar-fill {
          animation: lsBarFill 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
        }

        .ls-tagline {
          animation: lsLogoIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
        }

        .ls-dots-wrap {
          animation: lsLogoIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.55s both;
        }
      `}</style>

      {/* Background ambient glow */}
      <div className="ls-glow" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 480,
        height: 320,
        borderRadius: '50%',
        background: dark
          ? 'radial-gradient(ellipse, rgba(108,99,245,0.18) 0%, transparent 70%)'
          : 'radial-gradient(ellipse, rgba(26,23,20,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div className="ls-logo" style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <img
          src="/logo.png"
          alt="Veilora"
          style={{
            height: 96,
            width: 'auto',
            display: 'block',
            filter: dark ? 'brightness(0) invert(1)' : 'none',
            dropShadow: dark ? '0 0 32px rgba(108,99,245,0.4)' : 'none',
          }}
        />
      </div>

      {/* Progress bar */}
      <div style={{
        width: 180,
        height: 3,
        borderRadius: 999,
        background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
        overflow: 'hidden',
        marginBottom: 28,
        position: 'relative',
        zIndex: 1,
      }}>
        <div className="ls-bar-fill" style={{
          height: '100%',
          borderRadius: 999,
          background: dark
            ? 'linear-gradient(90deg, #6c63f5, #a5a0ff)'
            : 'linear-gradient(90deg, #1a1714, #5a5550)',
          width: 0,
        }} />
      </div>

      {/* Tagline */}
      <p className="ls-tagline" style={{
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: dark ? 'rgba(255,255,255,0.25)' : 'rgba(26,23,20,0.35)',
        marginBottom: 20,
        position: 'relative',
        zIndex: 1,
      }}>
        Securing your vault
      </p>

      {/* Bouncing dots */}
      <div className="ls-dots-wrap" style={{
        display: 'flex',
        gap: 7,
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {['ls-dot-1', 'ls-dot-2', 'ls-dot-3'].map((cls) => (
          <div key={cls} className={cls} style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: dark ? 'rgba(165,160,255,0.7)' : 'rgba(26,23,20,0.4)',
          }} />
        ))}
      </div>
    </div>
  )
}