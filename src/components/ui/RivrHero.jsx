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

  // Staggered entrance animations — exact RIVR pattern
  useEffect(() => {
    const els = {
      title:   document.getElementById('tb-title'),
      desc:    document.getElementById('tb-desc'),
      actions: document.getElementById('tb-actions'),
      card:    document.getElementById('tb-card'),
      corner:  document.getElementById('tb-corner'),
    }
    if (!els.title) return
    setTimeout(() => { els.title.style.transition = 'all 1s cubic-bezier(0.16,1,0.3,1)'; els.title.style.opacity = '1'; els.title.style.transform = 'translateY(0) scale(1)' }, 300)
    setTimeout(() => { els.desc.style.transition = 'all 0.8s ease-out'; els.desc.style.opacity = '1'; els.desc.style.transform = 'translateY(0)' }, 600)
    setTimeout(() => { els.actions.style.transition = 'all 0.8s ease-out'; els.actions.style.opacity = '1'; els.actions.style.transform = 'translateY(0)' }, 900)
    setTimeout(() => { els.card.style.transition = 'all 0.8s cubic-bezier(0.34,1.56,0.64,1)'; els.card.style.opacity = '1'; els.card.style.transform = 'translateX(0)' }, 1200)
    setTimeout(() => { els.corner.style.transition = 'all 0.8s ease-out'; els.corner.style.opacity = '1' }, 1500)
  }, [])

  // Badge mouse parallax
  useEffect(() => {
    const fn = (e) => {
      const b = document.getElementById('tb-badge')
      if (!b) return
      b.style.transform = `translate(${(e.clientX/window.innerWidth-.5)*20}px,${(e.clientY/window.innerHeight-.5)*20}px)`
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return (
    <>
      {/* Hero floating card — header lives INSIDE so it stays within the rounded container */}
      <section style={{ height: 'calc(100vh - 32px)', margin: 16, borderRadius: '3rem', overflow: 'hidden', position: 'relative', boxShadow: '0 25px 80px rgba(0,0,0,0.25)' }}>

        {/* Header — absolute inside the hero, never overflows */}
        <header style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '24px 40px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TopLogo size={34} />
            <span style={{ color: '#fff', fontFamily: "'Jost',sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>Top Barbershop</span>
          </div>
          <nav style={{ display: 'flex', gap: 36 }}>
            {['Services', 'Reviews', 'Location'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                style={{ color: 'rgba(255,255,255,0.9)', fontFamily: "'Jost',sans-serif", fontWeight: 500, fontSize: 15, textDecoration: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                {l}
              </a>
            ))}
          </nav>
          <button onClick={() => navigate('/book')}
            style={{ background: '#fff', color: '#0D0C08', border: 'none', borderRadius: 999, padding: '10px 24px', fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '0.06em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
            Book Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </header>

        {/* Video */}
        <video autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.12)', zIndex: 1 }}/>

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 20, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>

          {/* Floating badge */}
          <div id="tb-badge" style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '7px 18px', marginBottom: 32, display: 'inline-flex', alignItems: 'center', gap: 8, animation: 'tb-float 6s ease-in-out infinite', transition: 'transform 0.1s ease-out' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#CA8A04"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
            <span style={{ color: '#6B4A00', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Jost',sans-serif" }}>5.0 Google Rating · Est. 2020</span>
          </div>

          {/* H1 */}
          <h1 id="tb-title" style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 'clamp(52px,8.5vw,110px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.02em', color: '#5E6470', marginBottom: 24, maxWidth: 900, opacity: 0, transform: 'translateY(40px) scale(0.98)' }}>
            The Art of<br /><em style={{ color: '#1A1408', fontStyle: 'italic' }}>the Perfect Cut.</em>
          </h1>

          {/* Desc */}
          <p id="tb-desc" style={{ color: '#fff', fontSize: 'clamp(16px,1.8vw,20px)', maxWidth: 480, lineHeight: 1.65, fontWeight: 500, marginBottom: 40, opacity: 0, transform: 'translateY(20px)', fontFamily: "'Jost',sans-serif" }}>
            Walk in. Transform. Walk out legendary.<br />6722 San Pedro Ave · San Antonio, TX
          </p>

          {/* Buttons */}
          <div id="tb-actions" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', opacity: 0, transform: 'translateY(20px)' }}>
            <button onClick={() => navigate('/book')}
              style={{ background: '#0D0C08', color: '#fff', border: 'none', borderRadius: 16, padding: '16px 32px', fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              Book Appointment
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 16, padding: '16px 32px', fontFamily: "'Jost',sans-serif", fontWeight: 700, fontSize: 17, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              View Services
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Bottom-left compact badge — small, bottom corner, won't block content */}
        <div id="tb-card" style={{ position: 'absolute', bottom: 24, left: 24, zIndex: 30, opacity: 0, transform: 'translateX(-40px)' }}>
          <a href="tel:+12105486613" style={{ display:'flex',alignItems:'center',gap:10,background:'rgba(255,255,255,0.35)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.3)',borderRadius:999,padding:'10px 16px',textDecoration:'none',cursor:'pointer' }}>
            <div style={{ background:'rgba(30,50,90,0.85)',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.72h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div style={{ color:'#CA8A04',fontWeight:700,fontSize:11,letterSpacing:'0.08em',fontFamily:"'Jost',sans-serif" }}>5.0 ★ GOOGLE</div>
              <div style={{ color:'#1A1408',fontWeight:600,fontSize:13,fontFamily:"'Jost',sans-serif" }}>(210) 548-6613</div>
            </div>
          </a>
        </div>

        {/* Bottom-right SVG cutout — exact RIVR shape */}
        <div id="tb-corner" style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 40, width: 300, height: 160, opacity: 0 }}>
          <svg style={{ position:'absolute',bottom:0,right:0 }} width="300" height="160" viewBox="0 0 300 160" fill="none">
            <path d="M0 160H300V0C300 33.1371 273.137 60 240 60H60C26.8629 60 0 86.8629 0 120V160Z" fill="#f8f6f0" />
          </svg>
          <div style={{ position:'absolute',bottom:24,right:40,textAlign:'right' }}>
            <div style={{ color:'#041c44',fontWeight:700,fontSize:18,marginBottom:4,fontFamily:"'Bodoni Moda',serif" }}>Our Services</div>
            <a href="#services" style={{ display:'flex',alignItems:'center',justifyContent:'flex-end',gap:4,color:'#5E6470',fontWeight:500,fontSize:14,textDecoration:'none',fontFamily:"'Jost',sans-serif" }}>
              View menu
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ padding: '48px', overflow: 'hidden' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',maxWidth:1280,margin:'0 auto',opacity:0.45,filter:'grayscale(1)',transition:'all 0.7s' }}
          onMouseEnter={e=>{e.currentTarget.style.opacity='1';e.currentTarget.style.filter='grayscale(0)'}}
          onMouseLeave={e=>{e.currentTarget.style.opacity='0.45';e.currentTarget.style.filter='grayscale(1)'}}>
          {[['★','5.0 GOOGLE RATING'],['✂','EST. 2020'],['📍','SAN ANTONIO, TX'],['🕐','OPEN TODAY']].map(([icon,text])=>(
            <div key={text} style={{ fontSize:18,fontWeight:700,display:'flex',alignItems:'center',gap:8,fontFamily:"'Jost',sans-serif",color:'#1A1408' }}>{icon} {text}</div>
          ))}
        </div>
      </section>

      <style>{`@keyframes tb-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </>
  )
}
