import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { addBooking, getAvailableTimesForDate, getDefaultTimes, isDateUnavailable, getBlockedWeekdays, addReview } from '../lib/store'
import { EmojiRating } from '../components/ui/EmojiRating'
import { Balloons } from '../components/ui/Balloons'
import './Booking.css'

const SERVICES = [
  { id: 'haircut_facial', label: 'Haircut + Facial Hair', price: '$40', desc: 'Full cut with facial hair grooming', popular: true },
  { id: 'adult_cut',      label: 'Adult Haircut',          price: '$25', desc: 'Clean, precise haircut' },
  { id: 'kids_cut',       label: 'Kids Haircut',           price: '$25', desc: 'For the young ones' },
  { id: 'lining_facial',  label: 'Lining & Facial Hair',   price: '$15', desc: 'Sharp lines + facial hair' },
  { id: 'facial_trim',    label: 'Facial Hair Lining/Trim',price: '$15', desc: 'Beard and mustache shaping' },
  { id: 'lineup',         label: 'Line Up',                price: '$15', desc: 'Clean edges only' },
  { id: 'hair_dye',       label: 'Hair Dye',               price: '$15', desc: 'Color touch-up service' },
]

const SERVICE_DURATION = { classic: 45, fade: 60, beard: 30, shave: 45, combo: 75, kids: 35 }

function CalendarPicker({ value, onChange }) {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear]   = useState(today.getFullYear())

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  const firstDay     = new Date(year, month, 1).getDay()
  const daysInMonth  = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const isToday    = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  const isPast     = (d) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const isDayOff   = (d) => getBlockedWeekdays().has(new Date(year, month, d).getDay())
  const isBlocked  = (d) => isDateUnavailable({ day: d, month, year })
  const isDisabled = (d) => isPast(d) || isBlocked(d)
  const isSelected = (d) => value && value.day === d && value.month === month && value.year === year

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="calendar">
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="cal-month">{MONTHS[month]} {year}</span>
        <button className="cal-nav" onClick={nextMonth}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="cal-days-header">{DAYS.map(d => <span key={d}>{d}</span>)}</div>
      <div className="cal-grid">
        {cells.map((day, i) =>
          day === null ? <span key={`e-${i}`} /> : (
            <button key={day}
              className={`cal-day ${isToday(day)?'today':''} ${isSelected(day)?'selected':''} ${isDisabled(day)?'past':''} ${isDayOff(day)&&!isPast(day)?'day-off':''}`}
              onClick={() => !isDisabled(day) && onChange({ day, month, year })}
              disabled={isDisabled(day)}
            >
              {day}
            </button>
          )
        )}
      </div>
    </div>
  )
}

export default function Booking() {
  const navigate = useNavigate()
  const [step, setStep]   = useState(1)
  const [form, setForm]   = useState({ name: '', phone: '', service: '', date: null, time: '' })
  const [submitted, setSubmitted]   = useState(false)
  const [errors, setErrors]         = useState({})
  const [availableTimes, setAvailableTimes] = useState(getDefaultTimes)
  const [visitType, setVisitType]   = useState(null)   // null | 'first' | 'returning'
  const [reviewRating, setReviewRating]   = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewDone, setReviewDone] = useState(false)
  const balloonsRef = useRef(null)

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

  useEffect(() => {
    setAvailableTimes(getAvailableTimesForDate(form.date))
    setForm(f => ({ ...f, time: '' }))
  }, [form.date])

  const validate = () => {
    const e = {}
    if (step === 1 && !form.name.trim())  e.name  = 'Please enter your name'
    if (step === 1 && !form.phone.trim()) e.phone = 'Please enter your phone number'
    if (step === 2 && !form.service)      e.service = 'Please choose a service'
    if (step === 3 && !form.date)         e.date  = 'Please pick a date'
    if (step === 3 && !form.time)         e.time  = 'Please pick a time'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next   = () => { if (validate()) setStep(s => s + 1) }
  const submit = () => { if (validate()) { addBooking(form); setSubmitted(true) } }

  const submitReview = () => {
    if (reviewRating === 0) return
    const labels = ['Terrible', 'Poor', 'Okay', 'Good', 'Amazing']
    addReview({
      name: form.name,
      service: SERVICES.find(s => s.id === form.service)?.label ?? form.service,
      rating: reviewRating,
      ratingLabel: labels[reviewRating - 1],
      comment: reviewComment,
    })
    setReviewDone(true)
  }

  if (submitted) {
    const showActions = visitType === 'first' || reviewDone

    return (
      <div className="booking-page">
        <motion.div className="success-box"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="success-orb">
            <svg viewBox="0 0 160 160" fill="none" width="140">
              <defs>
                <radialGradient id="sg" cx="45%" cy="38%" r="60%">
                  <stop offset="0%" stopColor="#F5C842" />
                  <stop offset="60%" stopColor="#CA8A04" />
                  <stop offset="100%" stopColor="#1C1000" />
                </radialGradient>
              </defs>
              <motion.circle cx="80" cy="80" r="60" fill="url(#sg)"
                animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 3, repeat: Infinity }}
                style={{ transformOrigin: '80px 80px' }}
              />
              <circle cx="80" cy="80" r="22" fill="#080806" />
              <circle cx="88" cy="72" r="8" fill="white" opacity="0.75" />
              {[0,90,180,270].map((a, i) => {
                const r = a * Math.PI / 180
                return <line key={i} x1={80+Math.cos(r)*24} y1={80+Math.sin(r)*24} x2={80+Math.cos(r)*56} y2={80+Math.sin(r)*56} stroke="#CA8A04" strokeWidth="1.2" strokeOpacity="0.6" strokeLinecap="round" />
              })}
            </svg>
          </div>

          {reviewDone
            ? <h2>Thanks,<br />{form.name.split(' ')[0]}. 🙌</h2>
            : <h2>You're Booked,<br />{form.name.split(' ')[0]}.</h2>
          }

          <div className="success-details">
            {[
              { icon: '✦', text: SERVICES.find(s => s.id === form.service)?.label },
              { icon: '◈', text: `${form.date ? `${MONTHS[form.date.month]} ${form.date.day}, ${form.date.year}` : ''} at ${form.time}` },
              { icon: '◷', text: `~${SERVICE_DURATION[form.service]} min` },
            ].map((row, i) => (
              <div key={i} className="success-row">
                <span className="success-icon">{row.icon}</span>
                <span>{row.text}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Ask first visit */}
            {visitType === null && (
              <motion.div key="ask" className="first-visit-section"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <p className="first-visit-q">First time at Obsidian?</p>
                <div className="first-visit-btns">
                  <button className="btn-first" onClick={() => {
                    balloonsRef.current?.launchAnimation()
                    setVisitType('first')
                  }}>
                    Yes, first visit!
                  </button>
                  <button className="btn-returning" onClick={() => setVisitType('returning')}>
                    No, I'm back
                  </button>
                </div>
              </motion.div>
            )}

            {/* Review form */}
            {visitType === 'returning' && !reviewDone && (
              <motion.div key="review" className="review-section"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <p className="review-heading">How was your last cut?</p>
                <EmojiRating onChange={setReviewRating} />
                <textarea className="review-textarea" rows={3}
                  placeholder="Tell us more (optional)…"
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                />
                <button className="btn-book" onClick={submitReview}
                  disabled={reviewRating === 0}
                  style={{ opacity: reviewRating === 0 ? 0.45 : 1 }}
                >
                  Submit Review
                </button>
              </motion.div>
            )}

            {/* Final actions */}
            {showActions && (
              <motion.div key="done"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}
              >
                {reviewDone && <p className="review-thanks">See you in the chair, legend.</p>}
                {!reviewDone && <p className="success-sub">We'll see you in the chair. Come sharp.</p>}
                <button className="btn-book btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
              </motion.div>
            )}
          </AnimatePresence>

          <Balloons ref={balloonsRef} />
        </motion.div>
      </div>
    )
  }

  const stepTitles = ['Your Details', 'Choose Service', 'Date & Time']
  const progress   = ((step - 1) / 3) * 100

  return (
    <div className="booking-page">
      <button className="back-btn" onClick={() => step === 1 ? navigate('/') : setStep(s => s - 1)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {step === 1 ? 'Back to home' : 'Back'}
      </button>

      <div className="booking-wrapper">
        <div className="booking-left">
          <div className="booking-brand">✦ OBSIDIAN</div>
          <h1>Reserve <em>Your Chair</em></h1>
          <p>The best cuts in the city. Book your spot before it's gone.</p>

          <div className="booking-orb-deco">
            <svg viewBox="0 0 260 260" fill="none" width="100%" style={{ maxWidth: 240 }}>
              <defs>
                <radialGradient id="bkOrb" cx="45%" cy="38%" r="60%">
                  <stop offset="0%" stopColor="#F5C842" />
                  <stop offset="50%" stopColor="#CA8A04" />
                  <stop offset="100%" stopColor="#1C1000" />
                </radialGradient>
              </defs>
              <circle cx="130" cy="130" r="90" fill="url(#bkOrb)" opacity="0.9" />
              <circle cx="130" cy="130" r="32" fill="#080806" />
              <circle cx="142" cy="118" r="12" fill="white" opacity="0.7" />
              {[...Array(20)].map((_, i) => {
                const a = (i/20)*Math.PI*2
                return <line key={i} x1={130+Math.cos(a)*92} y1={130+Math.sin(a)*92} x2={130+Math.cos(a)*80} y2={130+Math.sin(a)*80} stroke="#CA8A04" strokeWidth="1" strokeOpacity="0.5" />
              })}
            </svg>
          </div>

          <div className="booking-info-list">
            {['Walk-ins welcome, bookings preferred','Arrive 5 min early — respect the craft','Cancel up to 24hrs before your appointment'].map((t, i) => (
              <div key={i} className="booking-info-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CA8A04" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="booking-right">
          <div className="progress-bar-track">
            <motion.div className="progress-bar-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
          <div className="steps-indicator">
            {stepTitles.map((t, i) => (
              <div key={i} className={`step-dot ${i+1===step?'active':''} ${i+1<step?'done':''}`}>
                <div className="dot-circle">{i+1<step?'✓':i+1}</div>
                <span>{t}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" className="form-step"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Who are we cutting today?</h2>
                <p className="step-sub">Let's get your details down.</p>
                <div className={`input-group ${errors.name ? 'error' : ''}`}>
                  <label htmlFor="name">Full Name</label>
                  <input id="name" type="text" placeholder="e.g. Marcus Johnson"
                    value={form.name} autoFocus
                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors({}) }}
                    onKeyDown={e => e.key === 'Enter' && next()}
                  />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>
                <div className={`input-group ${errors.phone ? 'error' : ''}`}>
                  <label htmlFor="phone">Phone Number</label>
                  <input id="phone" type="tel" placeholder="e.g. (555) 123-4567"
                    value={form.phone}
                    onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors({}) }}
                    onKeyDown={e => e.key === 'Enter' && next()}
                  />
                  {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>
                <button className="btn-book" onClick={next}>Continue</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" className="form-step"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Choose your cut, {form.name.split(' ')[0]}.</h2>
                <p className="step-sub">Every service, executed with precision.</p>
                {errors.service && <span className="error-msg">{errors.service}</span>}
                <div className="service-picker">
                  {SERVICES.map(s => (
                    <button key={s.id}
                      className={`service-option ${form.service === s.id ? 'selected' : ''}`}
                      onClick={() => { setForm(f => ({ ...f, service: s.id })); setErrors({}) }}
                    >
                      {s.popular && <span className="tag-popular">Popular</span>}
                      <span className="s-name">{s.label}</span>
                      <span className="s-desc">{s.desc}</span>
                      <span className="s-price">{s.price}</span>
                    </button>
                  ))}
                </div>
                <button className="btn-book" onClick={next}>Continue</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" className="form-step"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Pick your date & time.</h2>
                <p className="step-sub">Secure your chair before it fills up.</p>
                <CalendarPicker value={form.date} onChange={d => { setForm(f => ({ ...f, date: d })); setErrors(e => ({ ...e, date: '' })) }} />
                {errors.date && <span className="error-msg">{errors.date}</span>}
                <div className="time-label">Select a time</div>
                {availableTimes.length === 0 && <p className="no-times-msg">No slots on this date. Please choose another day.</p>}
                <div className="time-grid">
                  {availableTimes.map(t => (
                    <button key={t} className={`time-btn ${form.time === t ? 'selected' : ''}`}
                      onClick={() => { setForm(f => ({ ...f, time: t })); setErrors(e => ({ ...e, time: '' })) }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.time && <span className="error-msg">{errors.time}</span>}
                <button className="btn-book" onClick={submit}>
                  Confirm Booking
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
