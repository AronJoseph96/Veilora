import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'


// ── Disposable/temp mail domains blocklist ────────────────────────────────────
const TEMP_MAIL_DOMAINS = new Set([
  'mailinator.com','guerrillamail.com','guerrillamail.net','guerrillamail.org',
  'guerrillamail.biz','guerrillamail.de','guerrillamail.info','guerrillamailblock.com',
  'sharklasers.com','grr.la','guerrillamailblock.com','spam4.me','yopmail.com',
  'yopmail.fr','cool.fr.nf','jetable.fr.nf','nospam.ze.tc','nomail.xl.cx',
  'mega.zik.dj','speed.1s.fr','courriel.fr.nf','moncourrier.fr.nf','monemail.fr.nf',
  'monmail.fr.nf','10minutemail.com','10minutemail.net','10minutemail.org',
  '10minutemail.de','10minutemail.co.uk','10minutemail.info','10minutemail.biz',
  '10minutemail.us','trashmail.com','trashmail.me','trashmail.net','trashmail.at',
  'trashmail.io','trashmail.xyz','tempmail.com','tempmail.net','tempmail.org',
  'temp-mail.org','temp-mail.io','tempinbox.com','throwam.com','throwam.net',
  'throwam.org','maildrop.cc','dispostable.com','dispostable.net','dispostable.org',
  'fakeinbox.com','fakeinbox.net','mailnull.com','mailnull.net','mailnull.org',
  'spamgourmet.com','spamgourmet.net','spamgourmet.org','nwldx.com','cuvox.de',
  'dayrep.com','fleckens.hu','gustr.com','jourrapide.com','rhyta.com','superrito.com',
  'teleworm.us','armyspy.com','cuvox.de','einrot.com','fleckens.hu','getairmail.com',
  'girlsundertheinfluence.com','hmamail.com','inoutmail.de','inoutmail.eu',
  'inoutmail.info','inoutmail.net','jetable.com','jetable.fr','mailexpire.com',
  'mailexpire.net','mailnew.com','mailnew.net','mailnew.org','mailnull.com',
  'mailnull.net','mailnull.org','mailscrap.com','mailscrap.net','mailscrap.org',
  'mailslite.com','mailslite.net','mailslite.org','mt2009.com','mt2014.com',
  'mt2015.com','mt2016.com','mt2017.com','nomail.com','nomail.net','nomail.org',
  'nowmymail.com','nowmymail.net','nowmymail.org','put2.net','safetymail.info',
  'safetymail.net','safetymail.org','sharedmailbox.org','sharedmailbox.net',
  'sharedmailbox.com','sneakemail.com','sneakemail.net','sneakemail.org',
  'sofimail.com','sofimail.net','sofimail.org','spamfree24.org','spamfree24.de',
  'spamfree24.eu','spamfree24.info','spamfree24.net','spamgourmet.com',
  'spamgourmet.net','spamgourmet.org','suremail.info','suremail.net','suremail.org',
  'tafmail.com','tafmail.net','tafmail.org','taintedmail.com','taintedmail.net',
  'taintedmail.org','tempinbox.com','tempinbox.net','tempinbox.org','tempr.email',
  'throwam.com','throwam.net','throwam.org','trashdevil.com','trashdevil.net',
  'trashdevil.org','uggsrock.com','uggsrock.net','uggsrock.org','wetrainbayarea.com',
  'wetrainbayarea.net','wetrainbayarea.org','yep.it','zehnminutenmail.de',
  'binkmail.com','bobmail.info','chammy.info','devnullmail.com','discard.email',
  'discardmail.com','discardmail.de','eintagsmail.de','email60.com','emailias.com',
  'emailigo.com','emailinfive.com','emailmiser.com','emailsensei.com','emailtemporanea.com',
  'emailtemporaria.com.br','emailwarden.com','emailx.at.hm','emailxfer.com',
  'emz.net','es.riffs.us','evopo.com','explodemail.com','express.net.ua',
  'extremail.ru','fakenews.com','fakeinformation.com','fakemail.fr','fakemail.net',
  'filzmail.com','flurmy.com','frapmail.com','garliclife.com','get1mail.com',
  'getonemail.com','gishpuppy.com','gowikibooks.com','gowikicampus.com',
  'gowikicars.com','gowikifilms.com','gowikigames.com','gowikimusic.com',
  'gowikinet.com','gowikitravel.com','grandmamail.com','great-host.in',
  'greensloth.com','gsrv.co.uk','guerrillamail.biz','ieatspam.eu','ieatspam.info',
  'ieh-mail.de','inbax.tk','inbox.si','inboxclean.com','inboxclean.org',
  'inboxstore.me','incognitomail.com','incognitomail.net','incognitomail.org',
  'inoutmail.de','iroid.com','jetable.net','jetable.org','joseimixx.com',
  'josse.ltd','kasmail.com','keepmymail.com','kurzepost.de','letthemeatspam.com',
  'lol.ovpn.to','lroid.com','m4ilweb.info','mail-easy.fr','mail.mezimages.net',
  'mail114.net','mail1a.de','mail21.cc','mail2rss.org','mail333.com','mail4trash.com',
  'mailbidon.com','mailbiz.biz','mailblocks.com','mailcatch.com','mailchop.com',
  'mailden.net','maildx.com','mailed.ro','mailexpire.com','mailfa.tk','mailforspam.com',
  'mailfreeonline.com','mailfs.com','mailguard.me','mailin8r.com','mailinater.com',
  'mailinator.net','mailinator2.com','mailincubator.com','mailismagic.com',
  'mailjunk.com','mailme.ir','mailme.lv','mailme24.com','mailmetrash.com',
  'mailmoat.com','mailms.com','mailnew.com','mailnobody.com','mailnull.com',
  'mailpick.biz','mailproxsy.com','mailquack.com','mailrock.biz','mailsac.com',
  'mailscrap.com','mailshell.com','mailsiphon.com','mailslite.com','mailsreal.com',
  'mailsucker.net','mailtemp.info','mailtome.de','mailtothis.com','mailtrash.net',
  'mailtv.net','mailtv.tv','mailzilla.com','mailzilla.org','mbx.cc','mega.zik.dj',
  'meltmail.com','messagebeamer.de','mezimages.net','mfsa.ru','mobi.web.id',
  'moburl.com','mockumail.com','mohmal.com','moncourrier.fr.nf','monemail.fr.nf',
  'monmail.fr.nf','msa.minsmail.com','msb.minsmail.com','mt2009.com','mxp.dns.ms',
  'mycleaninbox.net','mymailoasis.com','mypartyclip.de','myphantomemail.com',
  'myspaceinc.com','myspaceinc.net','myspaceinc.org','myspacepimpedup.com',
  'myspamless.com','mytempemail.com','mytrashmail.com','nabuma.com','netzidiot.de',
  'neverbox.com','nice-4u.com','nincsmail.com','nmail.cf','no-spam.ws','noblepioneer.com',
  'nobulk.com','noclickemail.com','nogmailspam.info','nomail.pw','nomail.xl.cx',
  'nomail2me.com','nomorespamemails.com','nonspam.eu','nonspammer.de','noref.in',
  'nospam.ze.tc','nospam4.us','nospamfor.us','nospamthanks.info','notmailinator.com',
  'nowhere.org','nowmymail.com','nwldx.com','objectmail.com','obobbo.com',
  'odaymail.com','oerpub.org','oneoffemail.com','onewaymail.com','online.ms',
  'onlineidea.info','oopi.org','ordinaryamerican.net','otherinbox.comuv.com',
  'owlpic.com','pancakemail.com','pimpedupmyspace.com','plexolan.de','poofy.org',
  'pookmail.com','privacy.net','privatdemail.net','proxymail.eu','prtnx.com',
  'prtz.eu','putthisinyourspamdatabase.com','qq.com','quickinbox.com','rcpt.at',
  'reallymymail.com','recode.me','recursor.net','recyclemail.dk','regbypass.comuv.com',
  'rklips.com','rmqkr.net','rppkn.com','rtrtr.com','s0ny.net','safe-mail.net',
  'safersignup.de','safetymail.info','safetypost.de','sandelf.de','schafmail.de',
  'schrott-email.de','secretemail.de','secure-mail.biz','selfdestructingmail.com',
  'sendspamhere.com','sharklasers.com','shieldedmail.com','shiftmail.com',
  'shitmail.me','shitmail.org','shortmail.net','showslow.de','signaturit.com',
  'skeefmail.com','slapsfromlindas.com','slaskpost.se','slave-auctions.net',
  'slopsbox.com','slowslow.de','slushmail.com','smapfree24.com','smapfree24.de',
  'smapfree24.eu','smapfree24.info','smapfree24.org','smellfear.com','snakemail.com',
  'sneakemail.com','sogetthis.com','soioa.com','soodonims.com','spam.la',
  'spam.org.tr','spam.su','spam4.me','spamavert.com','spambob.com','spambob.net',
  'spambob.org','spambog.com','spambog.de','spambog.ru','spambox.info','spambox.irishspringrealty.com',
  'spambox.us','spamcannon.com','spamcannon.net','spamcannon.org','spamcon.org',
  'spamcorpse.com','spamdag.com','spamex.com','spamfree.eu','spamfree24.de',
  'spamfree24.eu','spamfree24.info','spamfree24.net','spamfree24.org','spamgoes.in',
  'spamgourmet.com','spamherelots.com','spamhereplease.com','spamhole.com',
  'spamify.com','spaminator.de','spamkill.info','spaml.com','spaml.de',
  'spammotel.com','spammy.host','spamnot.com','spamoff.de','spamslicer.com',
  'spamspot.com','spamstack.net','spamthis.co.uk','spamthisplease.com',
  'spamtroll.net','spamwc.cf','spamwc.de','spamwc.ga','spamwc.gq','spamwc.ml',
  'speed.1s.fr','spoofmail.de','squizzy.de','squizzy.eu','squizzy.net',
  'startkeys.com','stinkefinger.net','stuffmail.de','super-auswahl.de','supergreatmail.com',
  'supermailer.jp','superrito.com','superstachel.de','suremail.info','sweetxxx.de',
  'tafmail.com','tagyourself.com','talkinator.com','tapchicuoihoi.com','teewars.org',
  'teleworm.com','teleworm.us','tempalias.com','tempe-mail.com','tempemail.biz',
  'tempemail.com','tempemail.net','tempemail.org','tempinbox.co.uk','tempinbox.com',
  'tempmail.de','tempmail.eu','tempmail.it','tempmail2.com','tempomail.fr',
  'temporaryemail.net','temporaryemail.us','temporaryforwarding.com','temporaryinbox.com',
  'temporarymailaddress.com','tempsky.com','tempthe.net','tempymail.com',
  'thankyou2010.com','thisisnotmyrealemail.com','throwam.com','throwam.net',
  'throwam.org','throwaway.email','tilien.com','tmail.com','tmail.io','tmail.ws',
  'tmailinator.com','tokem.co','toomail.biz','tradermail.info','trash-amil.com',
  'trash-mail.at','trash-mail.cf','trash-mail.ga','trash-mail.gq','trash-mail.io',
  'trash-mail.ml','trash-mail.tk','trash2009.com','trash2010.com','trash2011.com',
  'trashmail.at','trashmail.com','trashmail.io','trashmail.me','trashmail.net',
  'trashmail.org','trashmail.xyz','trashmailer.com','trashme.com','trashrbin.com',
  'trillianpro.com','trmailbox.com','turual.com','twinmail.de','tyldd.com',
  'uggsrock.com','uo8.de','uroid.com','ux.dob.jp','v-mail.org','veryrealemail.com',
  'vidchart.com','viditag.com','viewcastmedia.com','viewcastmedia.net',
  'viewcastmedia.org','vkcode.ru','vomoto.com','vpn.st','vubby.com','w3internet.co.uk',
  'walala.org','walkmail.net','webemail.me','webm4il.info','webmail.kolmpuu.net',
  'wetrainbayarea.com','wetrainbayarea.org','whyspam.me','willhackforfood.biz',
  'willselfdestruct.com','wilemail.com','winmail.com.au','wmail.org','wolfmission.com',
  'wolfsmail.tk','wtmlife.com','wuzupmail.net','xagloo.com','xemaps.com',
  'xents.com','xmail.de','xmaily.com','xn--9kq967o.com','xoxy.net','xyzfree.net',
  'yapped.net','yeah.net','yep.it','yogamaven.com','yopmail.com','yopmail.fr',
  'yourdomain.com','yuurok.com','z1p.biz','za.com','zehnminuten.de',
  'zehnminutenmail.de','zippymail.info','zoemail.net','zoemail.org',
  'zomg.info','zxcv.com','zxcvbnm.com','zzz.com',
])

function isTempMail(email) {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? TEMP_MAIL_DOMAINS.has(domain) : false
}

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

  const [verificationSent, setVerificationSent] = useState(false)

  async function checkDisposable(email) {
    // Static list fast-check first
    if (isTempMail(email)) return true
    // Then hit disify.com free API for real-time domain check
    try {
      const domain = email.split('@')[1]
      const res = await fetch(`https://www.disify.com/api/email/${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        // disposable:true or format:false means block it
        if (data.disposable === true || data.format === false || data.dns === false) return true
      }
    } catch {
      // If API fails, fall back to static list only (don't block legit users)
    }
    return false
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isSignup) {
      // Check disposable/temp mail via static list + live API
      const isDisposable = await checkDisposable(email)
      if (isDisposable) {
        setError('Disposable or temporary email addresses are not allowed. Please use a real email.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin }
      })
      if (error) {
        setError(error.message)
      } else if (data?.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          setError('An account with this email already exists. Try signing in instead.')
        } else {
          // Always show verification screen — works once Supabase "Confirm email" is ON
          setVerificationSent(true)
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }
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

        {/* Email verification sent screen */}
        {verificationSent ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: dark ? 'rgba(34,197,94,0.12)' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: textPrimary, marginBottom: 10, fontFamily: "'DM Serif Display', serif" }}>Check your email</h2>
            <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.6, marginBottom: 20 }}>
              We sent a verification link to <strong style={{ color: textPrimary }}>{email}</strong>.<br/>
              Click the link to activate your account.
            </p>
            <p style={{ fontSize: 12, color: dark ? '#38384a' : '#c0bbb4' }}>
              Didn't receive it? Check your spam folder.
            </p>
            <button onClick={() => { setVerificationSent(false); setIsSignup(false) }}
              style={{ marginTop: 20, background: 'none', border: 'none', color: dark ? '#6c63f5' : '#1a1714', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline' }}>
              Back to sign in
            </button>
          </div>
        ) : (

        <>{/* Fields */}
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
        </>
        )}
      </div>
    </div>
  )
}