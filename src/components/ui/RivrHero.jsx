import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronRight, Scissors } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function BsbLogo({ size = 38 }) {
  const g = '#CA8A04'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="47" stroke={g} strokeWidth="2"/>
      <circle cx="50" cy="50" r="40" stroke={g} strokeWidth="0.8" strokeOpacity="0.4"/>
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

/* ── Navbar ── */
function HeroNav({ navigate }) {
  return (
    <nav className="flex items-center justify-between py-5 px-6 md:px-10 w-full relative z-10">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <BsbLogo size={38} />
        <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: '0.22em', color: '#CA8A04', textTransform: 'uppercase' }}>
          TOP BARBERSHOP
        </span>
      </div>

      {/* Center links — desktop */}
      <ul className="hidden md:flex items-center gap-8" style={{ color: 'rgba(30,20,5,0.75)', fontSize: 14, fontFamily: "'Jost', sans-serif", fontWeight: 500 }}>
        {['Services', 'Reviews', 'Location'].map(item => (
          <li key={item} className="cursor-pointer hover:opacity-60 transition-opacity">
            <a href={`#${item.toLowerCase()}`}>{item}</a>
          </li>
        ))}
      </ul>

      {/* Book Now CTA */}
      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/book')}
        className="flex items-center rounded-full gap-2 cursor-pointer transition-colors"
        style={{ background: 'rgba(12,10,2,0.85)', color: 'white', paddingLeft: 8, paddingRight: 20, paddingTop: 8, paddingBottom: 8, fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}
      >
        <div style={{ background: 'rgba(202,138,4,0.25)', borderRadius: '50%', padding: 6, display: 'flex' }}>
          <ArrowUpRight size={16} color="#CA8A04" />
        </div>
        Book Now
      </motion.button>
    </nav>
  )
}

/* ── Badge ── */
function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex items-center gap-2 px-4 py-2 rounded-full mx-auto mb-4 w-fit"
      style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(202,138,4,0.25)' }}
    >
      <Scissors size={14} color="#CA8A04" />
      <span style={{ fontSize: 13, fontFamily: "'Jost', sans-serif", fontWeight: 600, letterSpacing: '0.15em', color: '#6B4A00', textTransform: 'uppercase' }}>
        Luxury Barbershop · San Antonio, TX
      </span>
    </motion.div>
  )
}

/* ── Bottom-left stats card ── */
function StatsCard({ navigate }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute"
      style={{
        bottom: 24, left: 24,
        padding: '18px 20px', borderRadius: 28,
        background: 'rgba(255,255,255,0.35)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.5)',
        display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160
      }}
    >
      <div>
        <p style={{ fontSize: 30, fontWeight: 700, color: 'rgba(30,20,5,0.9)', lineHeight: 1.1, fontFamily: "'Bodoni Moda', serif" }}>5.0 ★</p>
        <p style={{ fontSize: 10, color: 'rgba(30,20,5,0.55)', textTransform: 'uppercase', letterSpacing: '0.14em', fontFamily: "'Jost', sans-serif", fontWeight: 600, marginTop: 2 }}>Google Rating</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/book')}
        className="flex items-center gap-2 rounded-full cursor-pointer transition-colors"
        style={{ background: 'white', paddingLeft: 8, paddingRight: 16, paddingTop: 7, paddingBottom: 7, alignSelf: 'flex-start', border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
      >
        <div style={{ background: 'rgba(202,138,4,0.12)', borderRadius: '50%', padding: 5, display: 'flex' }}>
          <ArrowUpRight size={13} color="#CA8A04" />
        </div>
        <span style={{ fontSize: 13, fontFamily: "'Jost', sans-serif", fontWeight: 600, color: 'rgba(30,20,5,0.85)', letterSpacing: '0.06em' }}>Book Appointment</span>
      </motion.button>
    </motion.div>
  )
}

/* ── Bottom-right cutout corner ── */
function BottomRightCorner() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute bottom-0 right-0"
      style={{
        padding: '22px 20px 20px 48px',
        background: '#f8f6f0',
        borderTopLeftRadius: 48,
        display: 'flex', alignItems: 'center', gap: 18
      }}
    >
      {/* Top mask */}
      <div style={{ position: 'absolute', top: -48, right: 0, width: 48, height: 48, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none">
          <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="#f8f6f0"/>
        </svg>
      </div>
      {/* Left mask */}
      <div style={{ position: 'absolute', bottom: 0, left: -48, width: 48, height: 48, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none">
          <path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="#f8f6f0"/>
        </svg>
      </div>

      <div style={{ background: 'rgba(202,138,4,0.08)', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(202,138,4,0.2)' }}>
        <Scissors size={20} color="#CA8A04" />
      </div>
      <div>
        <p style={{ fontSize: 17, fontFamily: "'Bodoni Moda', serif", fontWeight: 600, color: 'rgba(30,20,5,0.9)', marginBottom: 2 }}>Our Services</p>
        <div className="flex items-center gap-1" style={{ cursor: 'pointer' }}>
          <a href="#services" style={{ fontSize: 12, fontFamily: "'Jost', sans-serif", color: 'rgba(30,20,5,0.5)', letterSpacing: '0.1em', textDecoration: 'none' }}>View menu</a>
          <ChevronRight size={12} color="rgba(30,20,5,0.4)" />
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main hero ── */
export default function RivrHero() {
  const navigate = useNavigate()
  const videoRef = useRef(null)

  return (
    <div className="w-full h-screen flex items-center justify-center p-3 md:p-5"
      style={{ background: '#f8f6f0' }}>
      <section
        className="relative w-full h-full overflow-hidden flex flex-col items-center"
        style={{ borderRadius: 40, maxWidth: 1536, background: 'rgba(255,255,255,0.08)' }}
      >
        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0, objectPosition: '65% center' }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4"
        />

        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 z-0"
          style={{ background: 'linear-gradient(135deg, rgba(248,246,240,0.45) 0%, rgba(248,246,240,0.1) 60%, transparent 100%)' }} />

        {/* Content layer */}
        <div className="relative w-full h-full flex flex-col items-center" style={{ zIndex: 10 }}>
          <HeroNav navigate={navigate} />

          {/* Center text */}
          <div className="w-full flex flex-col items-center px-6 text-center" style={{ maxWidth: 760, paddingTop: 24 }}>
            <HeroBadge />
            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontSize: 'clamp(2.6rem, 7vw, 80px)',
                fontFamily: "'Bodoni Moda', serif",
                fontWeight: 500,
                color: '#1A1408',
                marginBottom: 14,
                lineHeight: 1.05,
                letterSpacing: '-0.01em'
              }}
            >
              The Art of<br /><em>the Perfect Cut.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                color: 'rgba(30,20,5,0.65)',
                lineHeight: 1.7,
                maxWidth: 480,
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300
              }}
            >
              Walk in. Transform. Walk out legendary.<br />
              6722 San Pedro Ave · San Antonio, TX · <a href="tel:+12105486613" style={{ color: '#CA8A04', textDecoration: 'none' }}>+1 (210) 548-6613</a>
            </motion.p>
          </div>

          {/* Bottom cards */}
          <StatsCard navigate={navigate} />
          <BottomRightCorner />
        </div>
      </section>
    </div>
  )
}
