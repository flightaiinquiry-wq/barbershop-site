import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import RivrHero from '../components/ui/RivrHero'
import LegalModal from '../components/ui/LegalModal'
import './Landing.css'

/* ── Service card ── */
function ServiceCard({ title, desc, tag, delay, icon }) {
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
    </motion.div>
  )
}

/* ── Top Barbershop minimal logo ── */
function BsbLogo({ size = 44 }) {
  const g = '#CA8A04'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Outer ring */}
      <circle cx="50" cy="50" r="47" stroke={g} strokeWidth="2"/>
      {/* Inner thin ring */}
      <circle cx="50" cy="50" r="40" stroke={g} strokeWidth="0.8" strokeOpacity="0.4"/>
      {/* Scissors icon — minimal */}
      <g transform="translate(50,50)">
        {/* Left blade */}
        <line x1="-2" y1="-18" x2="-14" y2="12" stroke={g} strokeWidth="3" strokeLinecap="round"/>
        {/* Right blade */}
        <line x1="2" y1="-18" x2="14" y2="12" stroke={g} strokeWidth="3" strokeLinecap="round"/>
        {/* Pivot */}
        <circle cx="0" cy="-3" r="3.5" fill={g}/>
        {/* Handle rings */}
        <circle cx="-16" cy="15" r="6" stroke={g} strokeWidth="2" fill="none"/>
        <circle cx="16" cy="15" r="6" stroke={g} strokeWidth="2" fill="none"/>
      </g>
      {/* "TB" monogram below scissors */}
      <text x="50" y="78" textAnchor="middle" fill={g} fontSize="8" fontWeight="700"
        letterSpacing="3" fontFamily="Jost,sans-serif">TOP</text>
    </svg>
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
  const navigate = useNavigate()
  const [legalDoc, setLegalDoc] = useState(null)

  const services = [
    {
      title: 'Haircut + Facial Hair', tag: 'Most Popular', delay: 0,
      desc: 'Full haircut combined with facial hair grooming. The complete package — walk in, walk out sharp.',
      icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="14" r="7" stroke="#CA8A04" strokeWidth="1.2"/><path d="M10,30 Q14,22 20,22 Q26,22 30,30" stroke="#CA8A04" strokeWidth="1.2" fill="none" strokeLinecap="round"/><path d="M14,26 Q17,29 20,29 Q23,29 26,26" stroke="#CA8A04" strokeWidth="1" fill="none" strokeLinecap="round"/></svg>,
    },
    {
      title: 'Adult Haircut', tag: null, delay: 0.08,
      desc: 'Clean, precise cut tailored to your head shape and personal style. Every time.',
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M8,32 Q14,8 20,8 Q26,8 32,32" stroke="#CA8A04" strokeWidth="1.5" fill="none" strokeLinecap="round"/><line x1="8" y1="32" x2="32" y2="32" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    },
    {
      title: 'Kids Haircut', tag: null, delay: 0.16,
      desc: 'Patient, fun cuts for kids of all ages. Every child leaves looking great and feeling confident.',
      icon: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="16" r="9" stroke="#CA8A04" strokeWidth="1.2"/><path d="M12,32 Q16,26 20,26 Q24,26 28,32" stroke="#CA8A04" strokeWidth="1.2" fill="none" strokeLinecap="round"/><line x1="20" y1="7" x2="20" y2="5" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    },
    {
      title: 'Lining & Facial Trim', tag: null, delay: 0.24,
      desc: 'Sharp hairline edges with full facial hair cleanup. Clean, crisp, and defined.',
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M10,16 Q20,28 30,16" stroke="#CA8A04" strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M10,16 L10,26 Q20,34 30,26 L30,16" stroke="#CA8A04" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>,
    },
    {
      title: 'Line Up', tag: null, delay: 0.32,
      desc: 'Razor-sharp edges and a crisp hairline. No full cut — just clean lines that frame your look.',
      icon: <svg viewBox="0 0 40 40" fill="none"><line x1="8" y1="20" x2="32" y2="20" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="26" x2="32" y2="26" stroke="#CA8A04" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5"/><circle cx="8" cy="20" r="2.5" fill="#CA8A04"/><circle cx="32" cy="20" r="2.5" fill="#CA8A04"/></svg>,
    },
    {
      title: 'Hair Dye', tag: null, delay: 0.40,
      desc: 'Color touch-up and full dyeing service. Ask Chino about available shades at your appointment.',
      icon: <svg viewBox="0 0 40 40" fill="none"><path d="M20,8 C14,14 10,20 10,26 a10,10 0 0,0 20,0 C30,20 26,14 20,8Z" stroke="#CA8A04" strokeWidth="1.2" fill="none"/><line x1="20" y1="30" x2="20" y2="34" stroke="#CA8A04" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    },
  ]

  return (
    <div className="landing">
      <RivrHero />

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
                Chino, the owner and barber, brings attention to detail that sets Top Barbershop apart. Known for recommending the best cut for your face and staying late to make sure you leave right.
              </motion.p>
              <motion.ul className="exp-features" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}>
                {['Personalized consultation on every visit','Attentive to detail — cuts tailored to your face shape','Knowledgeable, respectful, and professional','5.0 stars on Google — 5 reviews, zero complaints'].map((item, i) => (
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
          <Testimonial name="Juan C." stars={5} text="Very nice cut, attentive to detail and even recommended ways for the haircut to look better. Even stayed open after hours to make sure I was done right. 10/10 will be going back next time." delay={0} />
          <Testimonial name="Leo Contreras" stars={5} text="Gone here three times and have not been disappointed. The owner/barber is very knowledgeable. Looking forward to this clean, respectable barbershop in the neighborhood." delay={0.1} />
          <Testimonial name="Emma Segovia" stars={5} text="Excellent service! My husband got a haircut from Chino — he's quick and very attentive. Highly recommended." delay={0.2} />
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
        <p>Call or book online — <a href="tel:+12105486613" style={{ color: '#CA8A04' }}>+1 (210) 548-6613</a></p>
        <button className="btn-primary btn-large" onClick={() => navigate('/book')}>
          Book My Appointment
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo-wrap"><BsbLogo size={52} /><span className="footer-logo">TOP BARBERSHOP</span></div>
        <p>Full Service Luxury Barbershop — San Antonio, TX</p>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#reviews">Reviews</a>
          <a href="tel:+12105486613">+1 (210) 548-6613</a>
        </div>
        <p style={{ fontSize: '12px', color: '#9A8A62', marginTop: '4px' }}>6722 San Pedro Ave, San Antonio, TX 78216</p>
        {/* Legal links */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          {[['privacy','Privacy Policy'],['terms','Terms of Service'],['cancellation','Cancellation Policy']].map(([doc, label]) => (
            <button key={doc} onClick={() => setLegalDoc(doc)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'rgba(202,138,4,0.7)', fontFamily: "'Jost',sans-serif", letterSpacing: '0.05em', textDecoration: 'underline', textDecorationColor: 'rgba(202,138,4,0.3)', padding: 0 }}>
              {label}
            </button>
          ))}
        </div>

        <p className="footer-copy" style={{ marginTop: 12 }}>© 2020 Top Barbershop — All Rights Reserved.</p>
        <button className="owner-login-btn" onClick={() => navigate('/owner')}>Owner Login</button>
      </footer>

      {legalDoc && <LegalModal doc={legalDoc} onClose={() => setLegalDoc(null)} />}
    </div>
  )
}
