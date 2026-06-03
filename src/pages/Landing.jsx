import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BarberIntro from '../components/ui/hero-barber'
import './Landing.css'

/* ── Animated razor SVG deco ── */
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
          <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="goldIris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5C842" />
            <stop offset="50%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#4A3200" />
          </radialGradient>
          <filter id="goldBlur"><feGaussianBlur stdDeviation="10" /></filter>
          <clipPath id="bladeClip">
            <path d="M160,40 L280,160 L160,280 L40,160 Z" />
          </clipPath>
        </defs>

        {/* Outer glow */}
        <ellipse cx="160" cy="160" rx="140" ry="140" fill="url(#goldGlow)" filter="url(#goldBlur)" />

        {/* Diamond ring */}
        <motion.path
          d="M160,30 L290,160 L160,290 L30,160 Z"
          stroke="#CA8A04" strokeWidth="0.8" fill="none" strokeOpacity="0.4"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '160px 160px' }}
        />
        <motion.path
          d="M160,55 L265,160 L160,265 L55,160 Z"
          stroke="#D4AF37" strokeWidth="0.5" fill="none" strokeOpacity="0.25"
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '160px 160px' }}
        />

        {/* Central orb — eye of precision */}
        <circle cx="160" cy="160" r="55" fill="url(#goldIris)" />
        <motion.circle
          cx="160" cy="160"
          animate={{ r: [22, 26, 22] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          fill="#080806"
        />
        <circle cx="170" cy="150" r="8" fill="white" opacity="0.75" />
        <circle cx="152" cy="168" r="4" fill="white" opacity="0.35" />

        {/* Scissors arms */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          const x1 = 160 + Math.cos(rad) * 65
          const y1 = 160 + Math.sin(rad) * 65
          const x2 = 160 + Math.cos(rad) * 130
          const y2 = 160 + Math.sin(rad) * 130
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"
            />
          )
        })}

        {/* Tick marks around ring */}
        {[...Array(16)].map((_, i) => {
          const a = (i / 16) * Math.PI * 2
          const r1 = 138, r2 = i % 4 === 0 ? 118 : 128
          return (
            <line key={i}
              x1={160 + Math.cos(a) * r1} y1={160 + Math.sin(a) * r1}
              x2={160 + Math.cos(a) * r2} y2={160 + Math.sin(a) * r2}
              stroke="#CA8A04" strokeWidth={i % 4 === 0 ? 1.5 : 0.8} strokeOpacity="0.5"
            />
          )
        })}

        {/* Shimmer dots */}
        {[45, 135, 225, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180
          return (
            <motion.circle key={i}
              cx={160 + Math.cos(rad) * 100}
              cy={160 + Math.sin(rad) * 100}
              r="3" fill="#D4AF37"
              animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.6, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
              style={{ transformOrigin: `${160 + Math.cos(rad) * 100}px ${160 + Math.sin(rad) * 100}px` }}
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
    {
      title: 'Classic Cut', price: '$35', tag: null, delay: 0,
      desc: 'Timeless shape and finish. Scissor or clipper work tailored to your head shape.',
      icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="16" stroke="#CA8A04" strokeWidth="1.2" /><line x1="12" y1="12" x2="28" y2="28" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round" /><line x1="28" y1="12" x2="12" y2="28" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round" /><circle cx="20" cy="20" r="3" fill="#CA8A04" /></svg>,
    },
    {
      title: 'Fade', price: '$45', tag: 'Most Popular', delay: 0.1,
      desc: 'Low, mid, or high fade executed with precision. Clean edges every time.',
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M8,32 Q14,8 20,8 Q26,8 32,32" stroke="#CA8A04" strokeWidth="1.5" fill="none" strokeLinecap="round" /><line x1="8" y1="32" x2="32" y2="32" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round" /></svg>,
    },
    {
      title: 'Beard Sculpt', price: '$30', tag: null, delay: 0.2,
      desc: 'Define your jawline. Precision shaping and lining to frame your face.',
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M10,16 Q20,28 30,16" stroke="#CA8A04" strokeWidth="1.5" fill="none" strokeLinecap="round" /><path d="M10,16 L10,26 Q20,34 30,26 L30,16" stroke="#CA8A04" strokeWidth="1.2" fill="none" strokeLinecap="round" /></svg>,
    },
    {
      title: 'Hot Towel Shave', price: '$55', tag: 'Signature', delay: 0.3,
      desc: 'Traditional straight-razor shave with hot towel prep. The ultimate ritual.',
      icon: <svg viewBox="0 0 40 40" fill="none"><rect x="8" y="18" width="24" height="10" rx="2" stroke="#CA8A04" strokeWidth="1.2" /><line x1="8" y1="23" x2="32" y2="23" stroke="#CA8A04" strokeWidth="0.8" strokeOpacity="0.5" /><path d="M14,18 L14,14 Q14,10 20,10 Q26,10 26,14 L26,18" stroke="#CA8A04" strokeWidth="1.2" fill="none" /></svg>,
    },
    {
      title: 'Hair + Beard', price: '$70', tag: 'Best Value', delay: 0.4,
      desc: 'Full service combo. Cut, shape, and edge — walk out completely transformed.',
      icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="8" stroke="#CA8A04" strokeWidth="1.2" /><path d="M10,30 Q14,24 20,24 Q26,24 30,30" stroke="#CA8A04" strokeWidth="1.2" fill="none" strokeLinecap="round" /></svg>,
    },
    {
      title: "Kids Cut", price: '$25', tag: null, delay: 0.5,
      desc: 'Patient, fun, and precise. We make sure your little one sits still and leaves proud.',
      icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="16" r="9" stroke="#CA8A04" strokeWidth="1.2" /><path d="M12,32 Q16,26 20,26 Q24,26 28,32" stroke="#CA8A04" strokeWidth="1.2" fill="none" strokeLinecap="round" /><line x1="20" y1="7" x2="20" y2="5" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round" /></svg>,
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
        <div className="nav-logo">✦ OBSIDIAN</div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#team">Our Barbers</a>
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
            ✦ Est. 2018 — Premium Barbershop ✦
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
            {[['2,400+', 'Happy Clients'], ['8', 'Years Experience'], ['4', 'Master Barbers']].map(([num, label]) => (
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
              {/* Animated 3D-style rotating orb */}
              <div className="orb-wrap">
                <svg viewBox="0 0 300 300" fill="none" className="orb-svg">
                  <defs>
                    <radialGradient id="orbGrad" cx="45%" cy="38%" r="60%">
                      <stop offset="0%" stopColor="#F5C842" />
                      <stop offset="40%" stopColor="#CA8A04" />
                      <stop offset="100%" stopColor="#1C1000" />
                    </radialGradient>
                    <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#CA8A04" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#CA8A04" stopOpacity="0" />
                    </radialGradient>
                    <filter id="orbBlur"><feGaussianBlur stdDeviation="14" /></filter>
                  </defs>
                  <ellipse cx="150" cy="150" rx="130" ry="130" fill="url(#orbGlow)" filter="url(#orbBlur)" />
                  <circle cx="150" cy="150" r="90" fill="url(#orbGrad)" />
                  <motion.circle cx="150" cy="150" r="90" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.3"
                    strokeDasharray="12 6"
                    animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '150px 150px' }}
                  />
                  <motion.circle cx="150" cy="150" r="110" fill="none" stroke="#CA8A04" strokeWidth="0.6" strokeOpacity="0.2"
                    strokeDasharray="8 10"
                    animate={{ rotate: -360 }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '150px 150px' }}
                  />
                  <circle cx="150" cy="150" r="32" fill="#080806" />
                  <circle cx="162" cy="138" r="12" fill="white" opacity="0.7" />
                  <circle cx="142" cy="158" r="6" fill="white" opacity="0.3" />
                  {[...Array(24)].map((_, i) => {
                    const a = (i / 24) * Math.PI * 2
                    const r1 = 92, r2 = i % 6 === 0 ? 76 : 84
                    return <line key={i} x1={150 + Math.cos(a)*r1} y1={150 + Math.sin(a)*r1} x2={150 + Math.cos(a)*r2} y2={150 + Math.sin(a)*r2} stroke="#D4AF37" strokeWidth={i%6===0?1.5:0.7} strokeOpacity="0.5" />
                  })}
                  {[60,150,240,330].map((angle, i) => {
                    const rad = angle * Math.PI / 180
                    return (
                      <motion.circle key={i} cx={150 + Math.cos(rad)*118} cy={150 + Math.sin(rad)*118} r="4" fill="#D4AF37"
                        animate={{ opacity: [0.3,1,0.3], scale: [1,1.8,1] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: i*0.6 }}
                        style={{ transformOrigin: `${150+Math.cos(rad)*118}px ${150+Math.sin(rad)*118}px` }}
                      />
                    )
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
      </section>

      {/* Barber pole divider */}
      <div className="pole-divider">
        <BarberPole />
        <div className="divider-line" />
        <BarberPole />
      </div>

      {/* Team */}
      <section id="team" className="team-section">
        <motion.div className="section-header"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <p className="section-eyebrow">✦ The Artists ✦</p>
          <h2>Meet Your <em>Barbers</em></h2>
          <p className="section-sub">Masters of their craft. Each with a signature touch.</p>
        </motion.div>
        <div className="team-grid">
          <BarberCard name="Marcus Cole" role="Master Barber" specialty="Skin Fades & Razor Work" delay={0} />
          <BarberCard name="Jordan Webb" role="Senior Barber" specialty="Classic Cuts & Pompadours" delay={0.1} />
          <BarberCard name="Elijah Stone" role="Senior Barber" specialty="Beard Sculpting & Design" delay={0.2} />
          <BarberCard name="Darius King" role="Barber" specialty="Textured Hair & Braids" delay={0.3} />
        </div>
      </section>

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
          <Testimonial name="Aaron T." stars={5} text="Best fade I've ever had. Marcus read my face perfectly — I didn't even have to say anything. Just walked out looking like a new man." delay={0} />
          <Testimonial name="James R." stars={5} text="The hot towel shave alone is worth the trip. Feels like a ritual. Obsidian is the only place I'll ever go." delay={0.1} />
          <Testimonial name="Devon S." stars={5} text="My beard was a mess. Elijah shaped it in 20 minutes and I looked like I had a personal stylist. Ridiculous talent." delay={0.2} />
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
        <p>Limited chairs. Don't wait until it's too late.</p>
        <button className="btn-primary btn-large" onClick={() => navigate('/book')}>
          Book My Appointment
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">✦ OBSIDIAN BARBERSHOP</div>
        <p>Sharp. Precise. Legendary. — Since 2018.</p>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#team">Team</a>
          <a href="#reviews">Reviews</a>
        </div>
        <p className="footer-copy">© 2026 Obsidian Barbershop. All rights reserved.</p>
      </footer>
    </div>
  )
}
