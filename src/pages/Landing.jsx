import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BarberIntro from '../components/ui/hero-barber'
import './Landing.css'

/* ── Straight razor + geometric rings hero deco ── */
function RazorDeco({ animate }) {
  return (
    <motion.div
      className="razor-deco"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: animate ? 1 : 0, scale: animate ? 1 : 0.85 }}
      transition={{ duration: 1.1, delay: 0.5 }}
    >
      <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rzGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#CA8A04" />
            <stop offset="55%"  stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F5C842" />
          </linearGradient>
          <filter id="rzBlur"><feGaussianBlur stdDeviation="12" /></filter>
        </defs>

        {/* Background glow */}
        <ellipse cx="160" cy="160" rx="140" ry="140" fill="url(#rzGlow)" filter="url(#rzBlur)" />

        {/* Outer rotating diamond rings */}
        <motion.path d="M160,28 L292,160 L160,292 L28,160 Z"
          stroke="#CA8A04" strokeWidth="0.9" fill="none" strokeOpacity="0.35"
          animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '160px 160px' }}
        />
        <motion.path d="M160,56 L264,160 L160,264 L56,160 Z"
          stroke="#D4AF37" strokeWidth="0.5" fill="none" strokeOpacity="0.2"
          animate={{ rotate: -360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '160px 160px' }}
        />

        {/* ── STRAIGHT RAZOR (tilted 38°, centered at 160,160) ── */}
        <g transform="rotate(38, 160, 160)">
          {/* Handle — dark pill with gold border */}
          <rect x="58" y="150" width="108" height="26" rx="13"
            fill="#0D0C08" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Handle rivets */}
          <circle cx="80"  cy="163" r="5.5" fill="#CA8A04" />
          <circle cx="103" cy="163" r="5.5" fill="#CA8A04" />
          <circle cx="126" cy="163" r="5.5" fill="#CA8A04" />
          {/* End cap */}
          <circle cx="64"  cy="163" r="9"   fill="#CA8A04" fillOpacity="0.35" />
          {/* Pivot pin */}
          <circle cx="166" cy="163" r="10"  fill="#D4AF37" />
          <circle cx="166" cy="163" r="5"   fill="#6A4800" />

          {/* Blade body */}
          <path d="M166,151 L258,155 L263,163 L258,171 L166,175 Z" fill="url(#bladeGrad)" />
          {/* Blade spine */}
          <line x1="166" y1="151" x2="258" y2="155" stroke="#8B6000" strokeWidth="1.2" />
          {/* Cutting edge — bright highlight */}
          <line x1="166" y1="175" x2="263" y2="163" stroke="#F5C842" strokeWidth="2.5" />
          <line x1="166" y1="175" x2="263" y2="163" stroke="#FFE580" strokeWidth="1"
            strokeOpacity="0.6" />
        </g>

        {/* Tick marks */}
        {[...Array(16)].map((_, i) => {
          const a = (i / 16) * Math.PI * 2
          const r1 = 138, r2 = i % 4 === 0 ? 116 : 128
          return (
            <line key={i}
              x1={160 + Math.cos(a) * r1} y1={160 + Math.sin(a) * r1}
              x2={160 + Math.cos(a) * r2} y2={160 + Math.sin(a) * r2}
              stroke="#CA8A04" strokeWidth={i % 4 === 0 ? 1.6 : 0.8} strokeOpacity="0.5"
            />
          )
        })}

        {/* Corner sparkles */}
        {[45, 135, 225, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <motion.circle key={i}
              cx={160 + Math.cos(rad) * 102}
              cy={160 + Math.sin(rad) * 102}
              r="3" fill="#D4AF37"
              animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.7, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
              style={{ transformOrigin: `${160 + Math.cos(rad) * 102}px ${160 + Math.sin(rad) * 102}px` }}
            />
          )
        })}
      </svg>
    </motion.div>
  )
}

/* ── Service card ── */
function ServiceCard({ title, desc, price, tag, delay, icon }) {
  return (
    <motion.div
      className="service-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(202,138,4,0.18)' }}
    >
      {tag && <span className="service-tag">{tag}</span>}
      <div className="service-icon-wrap">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="service-price">{price}</div>
    </motion.div>
  )
}

/* ── BSB circular badge logo ── */
function BsbLogo({ size = 44 }) {
  const c = '#CA8A04'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="47" stroke={c} strokeWidth="2.5"/>
      <circle cx="50" cy="50" r="38" stroke={c} strokeWidth="1" strokeOpacity="0.45"/>
      <defs>
        <path id="bsb-arc" d="M 14,50 A 36,36 0 1,1 86,50"/>
      </defs>
      <text fill={c} fontSize="7.2" fontWeight="700" letterSpacing="1.8" fontFamily="Jost,sans-serif">
        <textPath href="#bsb-arc" startOffset="4%">BARBERZ BOULEVARD BARBERSHOP</textPath>
      </text>
      <text x="50" y="56" textAnchor="middle" fill={c} fontSize="21" fontWeight="800"
        fontFamily="'Bodoni Moda',serif" letterSpacing="1">BSB</text>
      <text x="50" y="68" textAnchor="middle" fill={c} fontSize="6" fontWeight="600"
        letterSpacing="2.5" fontFamily="Jost,sans-serif">— EST. 2020 —</text>
    </svg>
  )
}

/* ── Barber card ── */
function BarberCard({ name, role, specialty, delay }) {
  return (
    <motion.div className="barber-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay }}
    >
      <div className="barber-avatar">
        <svg viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="#CA8A04" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="40" cy="30" r="14" fill="#1C1B14" stroke="#CA8A04" strokeWidth="0.8" strokeOpacity="0.6" />
          <path d="M12,70 Q40,48 68,70" fill="#1C1B14" stroke="#CA8A04" strokeWidth="0.8" strokeOpacity="0.6" />
        </svg>
      </div>
      <div className="barber-info">
        <h3>{name}</h3>
        <p className="barber-role">{role}</p>
        <p className="barber-specialty">Specialty: {specialty}</p>
      </div>
    </motion.div>
  )
}

/* ── Testimonial ── */
function Testimonial({ name, text, stars, delay }) {
  return (
    <motion.div className="testimonial-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay }}
    >
      <div className="stars">{'★'.repeat(stars)}</div>
      <p>"{text}"</p>
      <span>— {name}</span>
    </motion.div>
  )
}

/* ── Barber pole decoration ── */
function BarberPole() {
  return (
    <div className="barber-pole">
      <div className="pole-stripe" />
    </div>
  )
}

/* ── Main ── */
export default function Landing() {
  const [showIntro, setShowIntro] = useState(true)
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const heroParallax = useTransform(scrollY, [0, 500], [0, -60])

  const services = [
    // ── Hair Service ──
    {
      title: 'Haircut + Facial Hair', price: '$40', tag: 'Popular', delay: 0,
      desc: 'Full cut with facial hair grooming included. Our most complete hair service.',
      icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="7" stroke="#CA8A04" strokeWidth="1.2"/><path d="M10,30 Q14,22 20,22 Q26,22 30,30" stroke="#CA8A04" strokeWidth="1.2" fill="none" strokeLinecap="round"/><path d="M14,26 Q17,29 20,29 Q23,29 26,26" stroke="#CA8A04" strokeWidth="1" fill="none" strokeLinecap="round"/></svg>,
    },
    {
      title: 'Adult Haircut', price: '$25', tag: null, delay: 0.08,
      desc: 'Clean, precise cut tailored to your head shape and style.',
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M8,32 Q14,8 20,8 Q26,8 32,32" stroke="#CA8A04" strokeWidth="1.5" fill="none" strokeLinecap="round"/><line x1="8" y1="32" x2="32" y2="32" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    },
    {
      title: 'Kids Haircut', price: '$25', tag: null, delay: 0.16,
      desc: 'Patient and fun cuts for the little ones. Every kid leaves proud.',
      icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="16" r="9" stroke="#CA8A04" strokeWidth="1.2"/><path d="M12,32 Q16,26 20,26 Q24,26 28,32" stroke="#CA8A04" strokeWidth="1.2" fill="none" strokeLinecap="round"/><line x1="20" y1="7" x2="20" y2="5" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    },
    // ── Shave Service ──
    {
      title: 'Lining & Facial Hair', price: '$15', tag: null, delay: 0.24,
      desc: 'Sharp lines with complete facial hair cleanup. Crisp and defined.',
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M10,16 Q20,28 30,16" stroke="#CA8A04" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M10,16 L10,26 Q20,34 30,26 L30,16" stroke="#CA8A04" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>,
    },
    {
      title: 'Facial Hair Lining/Trim', price: '$15', tag: null, delay: 0.32,
      desc: 'Precision beard and mustache shaping to frame your face perfectly.',
      icon: <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="18" width="24" height="10" rx="2" stroke="#CA8A04" strokeWidth="1.2"/><line x1="8" y1="23" x2="32" y2="23" stroke="#CA8A04" strokeWidth="0.8" strokeOpacity="0.5"/><path d="M14,18 L14,14 Q14,10 20,10 Q26,10 26,14 L26,18" stroke="#CA8A04" strokeWidth="1.2" fill="none"/></svg>,
    },
    {
      title: 'Line Up', price: '$15', tag: null, delay: 0.40,
      desc: 'Clean edges and crisp hairline — no full cut, just sharp lines.',
      icon: <svg viewBox="0 0 40 40" fill="none"><line x1="8" y1="20" x2="32" y2="20" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="26" x2="32" y2="26" stroke="#CA8A04" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5"/><circle cx="8" cy="20" r="2.5" fill="#CA8A04"/><circle cx="32" cy="20" r="2.5" fill="#CA8A04"/></svg>,
    },
    // ── Hair Dye ──
    {
      title: 'Hair Dye', price: '$15', tag: null, delay: 0.48,
      desc: 'Color touch-up and full dyeing service. Ask about available shades.',
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M20,8 C14,14 10,20 10,26 a10,10 0 0,0 20,0 C30,20 26,14 20,8Z" stroke="#CA8A04" strokeWidth="1.2" fill="none"/><line x1="20" y1="30" x2="20" y2="34" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    },
  ]

  return (
    <div className="landing">
      <AnimatePresence>
        {showIntro && (
          <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <BarberIntro onComplete={() => setShowIntro(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <motion.nav className="nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? -20 : 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="nav-logo"><BsbLogo size={36} /><span>BARBERZ BLVD</span></div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#reviews">Reviews</a>
          <button className="nav-cta" onClick={() => navigate('/book')}>Book Now</button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="hero" ref={heroRef}>
        <motion.div className="hero-content" style={{ y: heroParallax }}>
          <motion.p className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            ✦ Est. 2020 — Full Service Luxury Barbershop ✦
          </motion.p>
          <motion.h1 className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 30 : 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            The Art of<br />
            <em>the Perfect Cut.</em>
          </motion.h1>
          <motion.p className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            Walk in. Transform. Walk out legendary.<br />
            Every cut is a statement. Every line, a signature.
          </motion.p>
          <motion.div className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
          >
            <button className="btn-primary" onClick={() => navigate('/book')}>
              Book Your Cut
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a href="#services" className="btn-ghost">View services</a>
          </motion.div>
          <motion.div className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: showIntro ? 0 : 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            {[['2,400+', 'Happy Clients'], ['Est.', '2020'], ['Luxury', 'Barbershop']].map(([num, label]) => (
              <div key={label} className="hero-stat">
                <span className="stat-num">{num}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <RazorDeco animate={!showIntro} />
      </section>

      {/* 3D Experience Card */}
      <motion.section className="experience-section"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="exp-card">
          <div className="exp-corner exp-tl" />
          <div className="exp-corner exp-br" />
          <div className="exp-inner">
            <div className="exp-copy">
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                Precision is<br /><em>Our Religion.</em>
              </motion.h2>
              <motion.p className="exp-body" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.35 }}>
                Every client gets a tailored consultation. We study your face shape, hair texture, and lifestyle before a single blade touches your hair. This is barbering as an art form.
              </motion.p>
              <motion.ul className="exp-features" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}>
                {['Face-shape analysis before every cut','Master barbers with 5+ years experience','Japanese steel tools, sterilized between clients','Complimentary hot towel finish on all cuts'].map((item, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {item}
                  </li>
                ))}
              </motion.ul>
              <motion.button className="exp-cta" onClick={() => navigate('/book')}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.62 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              >
                Reserve Your Chair
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </div>

            <div className="exp-visual">
              <div className="exp-glow" />
              {/* Animated scissors */}
              <div className="orb-wrap">
                <svg viewBox="0 0 300 300" fill="none" className="orb-svg">
                  <defs>
                    <radialGradient id="scGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#CA8A04" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#CA8A04" stopOpacity="0" />
                    </radialGradient>
                    <filter id="scBlur"><feGaussianBlur stdDeviation="16" /></filter>
                    <linearGradient id="scBlade" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F5C842" />
                      <stop offset="100%" stopColor="#CA8A04" />
                    </linearGradient>
                  </defs>

                  {/* Background glow */}
                  <ellipse cx="150" cy="150" rx="120" ry="120" fill="url(#scGlow)" filter="url(#scBlur)" />

                  {/* Outer rotating ring */}
                  <motion.circle cx="150" cy="150" r="118" fill="none"
                    stroke="#CA8A04" strokeWidth="0.7" strokeOpacity="0.25"
                    strokeDasharray="10 8"
                    animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '150px 150px' }}
                  />

                  {/* ── SCISSORS ── */}
                  {/* Top blade — opens upward */}
                  <motion.g
                    animate={{ rotate: [12, 28, 12] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: '150px 150px' }}
                  >
                    {/* Blade 1 */}
                    <path d="M150,150 L80,72" stroke="url(#scBlade)" strokeWidth="7" strokeLinecap="round" />
                    <path d="M150,150 L78,70" stroke="#FFE580" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
                    {/* Handle ring 1 */}
                    <circle cx="68" cy="62" r="22" fill="none" stroke="#CA8A04" strokeWidth="3" />
                    <circle cx="68" cy="62" r="13" fill="#0D0C08" stroke="#CA8A04" strokeWidth="1" />
                    <circle cx="68" cy="62" r="6"  fill="#CA8A04" fillOpacity="0.5" />
                  </motion.g>

                  {/* Bottom blade — opens downward */}
                  <motion.g
                    animate={{ rotate: [-12, -28, -12] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: '150px 150px' }}
                  >
                    {/* Blade 2 */}
                    <path d="M150,150 L220,72" stroke="url(#scBlade)" strokeWidth="7" strokeLinecap="round" />
                    <path d="M150,150 L222,70" stroke="#FFE580" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
                    {/* Handle ring 2 */}
                    <circle cx="232" cy="62" r="22" fill="none" stroke="#CA8A04" strokeWidth="3" />
                    <circle cx="232" cy="62" r="13" fill="#0D0C08" stroke="#CA8A04" strokeWidth="1" />
                    <circle cx="232" cy="62" r="6"  fill="#CA8A04" fillOpacity="0.5" />
                  </motion.g>

                  {/* Tail blades (lower half, mirror) */}
                  <motion.g
                    animate={{ rotate: [12, 28, 12] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: '150px 150px' }}
                  >
                    <path d="M150,150 L90,240" stroke="#CA8A04" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.6" />
                  </motion.g>
                  <motion.g
                    animate={{ rotate: [-12, -28, -12] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ transformOrigin: '150px 150px' }}
                  >
                    <path d="M150,150 L210,240" stroke="#CA8A04" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.6" />
                  </motion.g>

                  {/* Pivot screw */}
                  <circle cx="150" cy="150" r="11" fill="#D4AF37" />
                  <circle cx="150" cy="150" r="6"  fill="#8B6000" />
                  <circle cx="150" cy="150" r="2.5" fill="#F5C842" />

                  {/* Tick marks */}
                  {[...Array(20)].map((_, i) => {
                    const a = (i / 20) * Math.PI * 2
                    const r1 = 118, r2 = i % 5 === 0 ? 104 : 112
                    return <line key={i}
                      x1={150 + Math.cos(a)*r1} y1={150 + Math.sin(a)*r1}
                      x2={150 + Math.cos(a)*r2} y2={150 + Math.sin(a)*r2}
                      stroke="#CA8A04" strokeWidth={i%5===0?1.4:0.7} strokeOpacity="0.45"
                    />
                  })}
                </svg>
              </div>
              <div className="exp-bottom-fade" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services */}
      <section id="services" className="services-section">
        <motion.div className="section-header"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <p className="section-eyebrow">✦ The Menu ✦</p>
          <h2>Every Service is a <em>Craft</em></h2>
          <p className="section-sub">No cookie-cutter cuts. Every service is executed with purpose and precision.</p>
        </motion.div>
        <div className="services-grid">
          {services.map((s, i) => <ServiceCard key={s.title} {...s} />)}
        </div>
        <motion.div className="senior-note"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span><strong>Senior Citizen Discount</strong> — $5 off any service for clients 65 &amp; older.</span>
        </motion.div>
      </section>

      {/* Barber pole divider */}
      <div className="pole-divider">
        <BarberPole />
        <div className="divider-line" />
        <BarberPole />
      </div>

      {/* Process */}
      <section className="process-section">
        <motion.div className="section-header"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <p className="section-eyebrow">✦ The Experience ✦</p>
          <h2>Your <em>Chair-to-Street</em> Journey</h2>
        </motion.div>
        <div className="process-steps">
          {[
            { num: '01', title: 'Consultation', desc: 'We study your face shape, hair type, and lifestyle. No assumptions.' },
            { num: '02', title: 'Hot Towel Prep', desc: 'Warm towel opens the pores and softens every strand. The ritual begins.' },
            { num: '03', title: 'The Cut', desc: 'Precise clipper and scissor work. Every line with intention.' },
            { num: '04', title: 'The Finish', desc: 'Straight-razor edge, cool towel, and premium product. You\'re ready.' },
          ].map((step, i) => (
            <motion.div key={i} className="process-step"
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55, delay: i * 0.12 }}
            >
              <span className="step-num">{step.num}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="testimonials-section">
        <motion.div className="section-header"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <p className="section-eyebrow">✦ The Word ✦</p>
          <h2>Straight from the <em>Chair</em></h2>
        </motion.div>
        <div className="testimonials-grid">
          <Testimonial name="Aaron T." stars={5} text="Best cut I've ever had. He read my face perfectly — walked out looking like a new man. Won't go anywhere else." delay={0} />
          <Testimonial name="James R." stars={5} text="The line-up and beard trim is unreal. Crisp, clean, exactly what I asked for. Barberz Blvd is the real deal." delay={0.1} />
          <Testimonial name="Devon S." stars={5} text="My kid's haircut came out perfect and he actually sat still the whole time. Incredibly patient and talented." delay={0.2} />
        </div>
      </section>

      {/* CTA */}
      <motion.section className="cta-banner"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7 }}
      >
        <div className="cta-glow" />
        <p className="section-eyebrow" style={{ color: '#CA8A04' }}>✦ Reserve Your Seat ✦</p>
        <h2>Your Best Cut is <em>One Click Away</em></h2>
        <p>Appointments fill up fast. Secure your spot now.</p>
        <button className="btn-primary btn-large" onClick={() => navigate('/book')}>
          Book My Appointment
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo-wrap"><BsbLogo size={52} /><span className="footer-logo">BARBERZ BLVD</span></div>
        <p>Full service luxury barber shop.</p>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#reviews">Reviews</a>
        </div>
        <p className="footer-copy">© 2025 Barberz Blvd — All Rights Reserved.</p>
      </footer>
    </div>
  )
}
