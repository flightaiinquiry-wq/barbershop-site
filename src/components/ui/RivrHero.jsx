import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function TopLogo({ size = 34 }) {
  const g = '#CA8A04'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="47" stroke={g} strokeWidth="2"/>
      <circle cx="50" cy="50" r="40" stroke={g} strokeWidth="0.8" strokeOpacity="0.45"/>
      <g transform="translate(50,50)">
        <line x1="-2" y1="-18" x2="-14" y2="12" stroke={g} strokeWidth="3" strokeLinecap="round"/>
        <line x1="2" y1="-18" x2="14" y2="12" stroke={g} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="0" cy="-3" r="3.5" fill={g}/>
        <circle cx="-16" cy="15" r="6" stroke={g} strokeWidth="2" fill="none"/>
        <circle cx="16" cy="15" r="6" stroke={g} strokeWidth="2" fill="none"/>
      </g>
      <text x="50" y="78" textAnchor="middle" fill={g} fontSize="8" fontWeight="700"
        letterSpacing="3" fontFamily="Jost,sans-serif">TOP</text>
    </svg>
  )
}

export default function RivrHero() {
  const navigate = useNavigate()

  useEffect(() => {
    const els = {
      title:   document.getElementById('tb-title'),
      desc:    document.getElementById('tb-desc'),
      actions: document.getElementById('tb-actions'),
      card:    document.getElementById('tb-card'),
      corner:  document.getElementById('tb-corner'),
    }
    if (!els.title) return
    setTimeout(() => { els.title.style.transition='all 1s cubic-bezier(0.16,1,0.3,1)'; els.title.style.opacity='1'; els.title.style.transform='translateY(0) scale(1)' }, 300)
    setTimeout(() => { els.desc.style.transition='all 0.8s ease-out'; els.desc.style.opacity='1'; els.desc.style.transform='translateY(0)' }, 600)
    setTimeout(() => { els.actions.style.transition='all 0.8s ease-out'; els.actions.style.opacity='1'; els.actions.style.transform='translateY(0)' }, 900)
    setTimeout(() => { els.card.style.transition='all 0.8s cubic-bezier(0.34,1.56,0.64,1)'; els.card.style.opacity='1'; els.card.style.transform='translateX(0)' }, 1200)
    setTimeout(() => { els.corner.style.transition='all 0.8s ease-out'; els.corner.style.opacity='1' }, 1500)
  }, [])

  useEffect(() => {
    const fn = (e) => {
      const b = document.getElementById('tb-badge')
      if (!b || window.innerWidth < 768) return
      b.style.transform = `translate(${(e.clientX/window.innerWidth-.5)*20}px,${(e.clientY/window.innerHeight-.5)*20}px)`
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return (
    <>
      <style>{`
        .tb-section {
          height: calc(100vh - 32px);
          margin: 16px;
          border-radius: 3rem;
          overflow: hidden;
          position: relative;
          box-shadow: 0 25px 80px rgba(0,0,0,0.25);
        }
        @media (max-width: 640px) {
          .tb-section { margin: 8px; border-radius: 1.5rem; height: calc(100vh - 16px); }
        }

        /* Header */
        .tb-header {
          position: absolute; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 28px;
        }
        .tb-logo-wrap { display: flex; align-items: center; gap: 8px; }
        .tb-logo-text {
          color: #fff; font-family: 'Jost',sans-serif; font-weight: 800;
          font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase;
          text-shadow: 0 1px 6px rgba(0,0,0,0.5);
        }
        .tb-nav { display: flex; gap: 28px; }
        .tb-nav a {
          color: rgba(255,255,255,0.9); font-family: 'Jost',sans-serif;
          font-weight: 500; font-size: 14px; text-decoration: none;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .tb-book-btn {
          background: #fff; color: #0D0C08; border: none; border-radius: 999px;
          padding: 9px 20px; font-family: 'Jost',sans-serif; font-weight: 700;
          font-size: 13px; letter-spacing: 0.05em; cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.2); white-space: nowrap;
        }
        @media (max-width: 640px) {
          .tb-header { padding: 16px 16px; }
          .tb-logo-text { display: none; }
          .tb-nav { display: none; }
          .tb-book-btn { padding: 8px 14px; font-size: 12px; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .tb-nav { display: none; }
          .tb-header { padding: 18px 24px; }
        }

        /* Center content */
        .tb-center {
          position: relative; z-index: 20; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 80px 20px 100px; text-align: center;
        }
        @media (max-width: 640px) {
          .tb-center { padding: 70px 16px 110px; }
        }

        /* Badge */
        .tb-badge {
          background: rgba(255,255,255,0.4); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2); border-radius: 999px;
          padding: 6px 14px; margin-bottom: 20px;
          display: inline-flex; align-items: center; gap: 7px;
          animation: tb-float 6s ease-in-out infinite;
          transition: transform 0.1s ease-out;
        }
        .tb-badge span {
          color: #6B4A00; font-weight: 700; font-size: 11px;
          letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Jost',sans-serif;
        }
        @media (max-width: 640px) { .tb-badge span { font-size: 10px; } }

        /* H1 */
        .tb-h1 {
          font-family: 'Bodoni Moda',serif; font-weight: 900; line-height: 0.92;
          letter-spacing: -0.02em; color: #5E6470; margin-bottom: 16px;
          max-width: 900px; font-size: clamp(42px, 8.5vw, 110px);
          opacity: 0; transform: translateY(40px) scale(0.98);
        }

        /* Desc */
        .tb-desc {
          color: #fff; font-size: clamp(14px, 1.8vw, 18px);
          max-width: 420px; line-height: 1.6; font-weight: 500;
          margin-bottom: 28px; opacity: 0; transform: translateY(20px);
          font-family: 'Jost',sans-serif;
        }

        /* Action buttons */
        .tb-actions {
          display: flex; gap: 12px; flex-wrap: wrap;
          justify-content: center; opacity: 0; transform: translateY(20px);
        }
        .tb-btn-primary {
          background: #0D0C08; color: #fff; border: none;
          border-radius: 14px; padding: 13px 24px;
          font-family: 'Jost',sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; display: flex; align-items: center; gap: 8px;
          white-space: nowrap;
        }
        .tb-btn-glass {
          background: rgba(255,255,255,0.2); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff; border-radius: 14px; padding: 13px 24px;
          font-family: 'Jost',sans-serif; font-weight: 700; font-size: 15px;
          cursor: pointer; display: flex; align-items: center; gap: 8px;
          white-space: nowrap;
        }
        @media (max-width: 480px) {
          .tb-btn-primary, .tb-btn-glass { padding: 12px 18px; font-size: 14px; }
          .tb-actions { gap: 10px; }
        }

        /* Phone badge */
        .tb-phone {
          position: absolute; bottom: 20px; left: 20px; z-index: 30;
          opacity: 0; transform: translateX(-40px);
        }
        .tb-phone a {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.35); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.3); border-radius: 999px;
          padding: 8px 14px; text-decoration: none; cursor: pointer;
        }
        .tb-phone-icon {
          background: rgba(30,50,90,0.85); border-radius: 50%;
          width: 26px; height: 26px; display: flex;
          align-items: center; justify-content: center; flex-shrink: 0;
        }
        .tb-phone-label { color: #CA8A04; font-weight: 700; font-size: 10px; letter-spacing: 0.07em; font-family: 'Jost',sans-serif; }
        .tb-phone-num { color: #1A1408; font-weight: 600; font-size: 12px; font-family: 'Jost',sans-serif; }
        @media (max-width: 640px) {
          .tb-phone { bottom: 16px; left: 16px; }
          .tb-phone a { padding: 7px 12px; gap: 7px; }
          .tb-phone-icon { width: 22px; height: 22px; }
          .tb-phone-num { font-size: 11px; }
        }

        /* Bottom-right corner */
        .tb-corner {
          position: absolute; bottom: 0; right: 0; z-index: 40;
          width: 220px; height: 120px; opacity: 0;
        }
        .tb-corner svg { position: absolute; bottom: 0; right: 0; }
        .tb-corner-text { position: absolute; bottom: 16px; right: 28px; text-align: right; }
        .tb-corner-title { color: #041c44; font-weight: 700; font-size: 15px; margin-bottom: 2px; font-family: 'Bodoni Moda',serif; }
        .tb-corner-link { display: flex; align-items: center; justify-content: flex-end; gap: 3px; color: #5E6470; font-weight: 500; font-size: 12px; text-decoration: none; font-family: 'Jost',sans-serif; }
        @media (max-width: 640px) {
          .tb-corner { width: 160px; height: 90px; }
          .tb-corner-text { bottom: 12px; right: 20px; }
          .tb-corner-title { font-size: 13px; }
          .tb-corner-link { font-size: 11px; }
        }

        /* Trust bar */
        .tb-trust {
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1280px; margin: 0 auto; padding: 36px 32px;
          opacity: 0.45; filter: grayscale(1); transition: all 0.7s; flex-wrap: wrap; gap: 16px;
        }
        .tb-trust:hover { opacity: 1; filter: grayscale(0); }
        .tb-trust-item { font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 7px; font-family: 'Jost',sans-serif; color: #1A1408; }
        @media (max-width: 640px) {
          .tb-trust { padding: 24px 20px; justify-content: center; gap: 16px 24px; }
          .tb-trust-item { font-size: 13px; }
        }

        @keyframes tb-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <section className="tb-section">
        {/* Header */}
        <header className="tb-header">
          <div className="tb-logo-wrap">
            <TopLogo size={32} />
            <span className="tb-logo-text">Top Barbershop</span>
          </div>
          <nav className="tb-nav">
            {['Services','Reviews','Location'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
            ))}
          </nav>
          <button className="tb-book-btn" onClick={() => navigate('/book')}>
            Book Now
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>

        {/* Video */}
        <video autoPlay muted loop playsInline
          style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',zIndex:0 }}
          src="/22225.mp4"
        />
        <div style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0.15)',zIndex:1 }}/>

        {/* Center content */}
        <div className="tb-center">
          <div id="tb-badge" className="tb-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#CA8A04"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
            <span>5.0 Google Rating · Est. 2020</span>
          </div>

          <h1 id="tb-title" className="tb-h1">
            The Art of<br /><em style={{ color:'#1A1408',fontStyle:'italic' }}>the Perfect Cut.</em>
          </h1>

          <p id="tb-desc" className="tb-desc">
            Walk in. Transform. Walk out legendary.<br />
            6722 San Pedro Ave · San Antonio, TX
          </p>

          <div id="tb-actions" className="tb-actions">
            <button className="tb-btn-primary" onClick={() => navigate('/book')}>
              Book Appointment
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="tb-btn-glass" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior:'smooth' })}>
              View Services
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Phone badge — bottom left, compact */}
        <div id="tb-card" className="tb-phone">
          <a href="tel:+12105486613">
            <div className="tb-phone-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.72h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="tb-phone-label">5.0 ★ GOOGLE</div>
              <div className="tb-phone-num">(210) 548-6613</div>
            </div>
          </a>
        </div>

        {/* Bottom-right corner cutout */}
        <div id="tb-corner" className="tb-corner">
          <svg viewBox="0 0 220 120" width="220" height="120" fill="none">
            <path d="M0 120H220V0C220 24.3 200.7 44 176 44H44C19.7 44 0 63.7 0 88V120Z" fill="#f8f6f0"/>
          </svg>
          <div className="tb-corner-text">
            <div className="tb-corner-title">Our Services</div>
            <a href="#services" className="tb-corner-link">
              View menu
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div style={{ overflow:'hidden' }}>
        <div className="tb-trust">
          {[['★','5.0 Google Rating'],['✂','Est. 2020'],['📍','San Antonio, TX'],['🕐','Open Today']].map(([icon,text])=>(
            <div key={text} className="tb-trust-item">{icon} {text}</div>
          ))}
        </div>
      </div>
    </>
  )
}
