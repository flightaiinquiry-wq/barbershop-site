import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getBookings, cancelBooking,
  getDefaultTimes, setDefaultTimes, ALL_POSSIBLE_TIMES, ALL_FINE_TIMES,
  getBlockedDates, blockDate, unblockDate,
  getBlockedWeekdays, blockWeekday, unblockWeekday,
  DAY_NAMES, DAY_SHORT,
  getOwnerPin, setOwnerPin,
  getReviews,
  getBusinessHours, setBusinessHours, HOURS_OPTIONS,
  getDaySchedule, setDaySchedule, clearDaySchedule, getAllDaySchedules,
  dateKey,
} from '../lib/store'
import './Admin.css'

const SERVICES = {
  haircut_facial: 'Haircut + Facial Hair',
  adult_cut:      'Adult Haircut',
  kids_cut:       'Kids Haircut',
  lining_facial:  'Lining & Facial Hair',
  facial_trim:    'Facial Hair Lining/Trim',
  lineup:         'Line Up',
  hair_dye:       'Hair Dye',
}
const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December']
const RATING_EMOJIS = ['😔','😕','😐','🙂','😍']

// ── PIN Screen ──────────────────────────────────────────────────────────────
function PinScreen({ onSuccess }) {
  const [input, setInput] = useState('')
  const [shake, setShake] = useState(false)
  const [error, setError] = useState(false)

  const enter = d => setInput(p => p.length < 4 ? p + d : p)
  const del   = () => setInput(p => p.slice(0, -1))

  useEffect(() => {
    if (input.length < 4) return
    if (input === getOwnerPin()) { onSuccess(); return }
    setShake(true); setError(true)
    setTimeout(() => { setShake(false); setError(false); setInput('') }, 700)
  }, [input, onSuccess])

  return (
    <div className="pin-screen">
      <div className="pin-brand">✦ BARBERZ BLVD</div>
      <h2>Owner Access</h2>
      <p>Enter your 4-digit code</p>
      <motion.div className={`pin-dots ${error ? 'pin-error' : ''}`}
        animate={shake ? { x: [0,-10,10,-8,8,0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {[0,1,2,3].map(i => <div key={i} className={`pin-dot ${input.length > i ? 'filled' : ''}`} />)}
      </motion.div>
      {error && <p className="pin-error-msg">Wrong code — try again</p>}
      <div className="pin-pad">
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k,i) => (
          <button key={i} className={`pin-key ${k===''?'pin-key-empty':''}`}
            onClick={() => k==='⌫' ? del() : k!=='' ? enter(k) : null}
            disabled={k===''}>
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Bookings Tab ─────────────────────────────────────────────────────────────
function BookingsTab() {
  const [bookings, setBookings] = useState([])
  const [filter,   setFilter]   = useState('upcoming')

  const reload = useCallback(() => {
    setBookings([...getBookings()].sort((a,b) => {
      const da = new Date(a.date.year, a.date.month, a.date.day)
      const db = new Date(b.date.year, b.date.month, b.date.day)
      return da - db
    }))
  }, [])

  useEffect(() => { reload() }, [reload])

  const handleCancel = id => {
    if (!window.confirm('Cancel this booking?')) return
    cancelBooking(id); reload()
  }

  const now = new Date(); now.setHours(0,0,0,0)
  const today    = bookings.filter(b => new Date(b.date.year,b.date.month,b.date.day).getTime()===now.getTime())
  const upcoming = bookings.filter(b => new Date(b.date.year,b.date.month,b.date.day) >= now)
  const past     = bookings.filter(b => new Date(b.date.year,b.date.month,b.date.day) <  now)
  const shown    = filter==='today' ? today : filter==='upcoming' ? upcoming : past

  return (
    <div className="tab-content">
      <div className="stats-row">
        {[['Today',today.length],['Upcoming',upcoming.length],['Total',bookings.length]].map(([l,n]) => (
          <div key={l} className="stat-card">
            <span className="stat-num">{n}</span>
            <span className="stat-label">{l}</span>
          </div>
        ))}
      </div>
      <div className="filter-tabs">
        {['today','upcoming','past'].map(f => (
          <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>
      {shown.length===0 ? (
        <div className="empty-state">No {filter} bookings.</div>
      ) : (
        <div className="booking-list">
          {shown.map(b => (
            <div key={b.id} className="booking-row">
              <div className="booking-row-left">
                <div className="booking-avatar">{b.name[0].toUpperCase()}</div>
                <div>
                  <div className="booking-name">{b.name}</div>
                  <div className="booking-meta">{SERVICES[b.service]} · {b.time}{b.phone ? ` · ${b.phone}` : ''}</div>
                </div>
              </div>
              <div className="booking-row-right">
                <div className="booking-date">{MONTHS[b.date.month]} {b.date.day}</div>
                <button className="btn-cancel" onClick={()=>handleCancel(b.id)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Reviews Tab ──────────────────────────────────────────────────────────────
function ReviewsTab() {
  const reviews = getReviews()
  const avg = reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1) : '—'
  return (
    <div className="tab-content">
      <div className="stats-row">
        <div className="stat-card"><span className="stat-num">{reviews.length}</span><span className="stat-label">Reviews</span></div>
        <div className="stat-card"><span className="stat-num">{avg}</span><span className="stat-label">Avg Rating</span></div>
        <div className="stat-card"><span className="stat-num">{reviews.filter(r=>r.rating>=4).length}</span><span className="stat-label">Happy Clients</span></div>
      </div>
      {reviews.length===0 ? (
        <div className="empty-state">No reviews yet. Returning clients will be asked to rate their last visit after booking.</div>
      ) : (
        <div className="booking-list">
          {reviews.map(r => (
            <div key={r.id} className="booking-row review-row-admin">
              <div className="booking-row-left" style={{flex:1,flexDirection:'column',alignItems:'flex-start',gap:6}}>
                <div style={{display:'flex',alignItems:'center',gap:10,width:'100%'}}>
                  <div className="booking-avatar">{r.name[0].toUpperCase()}</div>
                  <div style={{flex:1}}>
                    <div className="booking-name">{r.name}</div>
                    <div className="booking-meta">{r.service} · {new Date(r.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
                  </div>
                  <div className="review-score">
                    <span className="review-emoji-big">{RATING_EMOJIS[r.rating-1]}</span>
                    <span className="review-label-tag">{r.ratingLabel}</span>
                  </div>
                </div>
                {r.comment && <p className="review-comment-admin">"{r.comment}"</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Schedule Tab ──────────────────────────────────────────────────────────────
function ScheduleTab() {
  const [times,   setTimes]   = useState(getDefaultTimes())
  const [blocked, setBlocked] = useState(() => [...getBlockedDates()])
  const [offDays, setOffDays] = useState(() => [...getBlockedWeekdays()])
  const [pickDate,setPickDate]= useState({ year:new Date().getFullYear(), month:new Date().getMonth(), day:'' })
  const [saved,   setSaved]   = useState(false)

  const initHours = getBusinessHours()
  const [openTime,  setOpenTime]  = useState(initHours.open  || '')
  const [closeTime, setCloseTime] = useState(initHours.close || '')
  const [hoursSaved, setHoursSaved] = useState(false)

  const toggleWeekday = d => {
    if (offDays.includes(d)) { unblockWeekday(d); setOffDays(p=>p.filter(x=>x!==d)) }
    else                     { blockWeekday(d);   setOffDays(p=>[...p,d]) }
  }
  const toggleTime = t => {
    setTimes(p => p.includes(t) ? p.filter(x=>x!==t) : [...p,t].sort((a,b)=>ALL_POSSIBLE_TIMES.indexOf(a)-ALL_POSSIBLE_TIMES.indexOf(b)))
  }
  const saveSchedule = () => { setDefaultTimes(times); setSaved(true); setTimeout(()=>setSaved(false),2000) }
  const saveHours    = () => {
    setBusinessHours({ open: openTime||null, close: closeTime||null })
    setHoursSaved(true); setTimeout(()=>setHoursSaved(false),2000)
  }
  const blockFullDay = () => {
    if (!pickDate.day) return
    blockDate(pickDate); setBlocked([...getBlockedDates()]); setPickDate(p=>({...p,day:''}))
  }
  const removeBlock = dk => {
    const [year,mon,day] = dk.split('-').map(Number)
    unblockDate({ year, month:mon-1, day }); setBlocked([...getBlockedDates()])
  }

  // ── Per-day schedule ──
  const [dayPick,      setDayPick]     = useState({ year: new Date().getFullYear(), month: new Date().getMonth(), day: '' })
  const [loadedDK,     setLoadedDK]    = useState(null)
  const [dayTimes,     setDayTimes]    = useState([])
  const [daySaved,     setDaySaved]    = useState(false)
  const [daySchedules, setDaySchedules]= useState(() => getAllDaySchedules())

  const loadDay = () => {
    if (!dayPick.day) return
    const dk = dateKey(dayPick)
    setLoadedDK(dk)
    setDayTimes(getDaySchedule(dk) ?? getDefaultTimes())
  }
  const toggleDayTime = t =>
    setDayTimes(p => p.includes(t)
      ? p.filter(x => x !== t)
      : [...p, t].sort((a,b) => ALL_FINE_TIMES.indexOf(a) - ALL_FINE_TIMES.indexOf(b)))
  const saveDaySchedule = () => {
    if (!loadedDK) return
    setDaySchedule(loadedDK, dayTimes)
    setDaySchedules(getAllDaySchedules())
    setDaySaved(true); setTimeout(() => setDaySaved(false), 2000)
  }
  const resetDaySchedule = () => {
    if (!loadedDK) return
    clearDaySchedule(loadedDK)
    setDaySchedules(getAllDaySchedules())
    setLoadedDK(null); setDayTimes([])
  }
  const removeDaySchedule = dk => {
    clearDaySchedule(dk); setDaySchedules(getAllDaySchedules())
    if (loadedDK === dk) { setLoadedDK(null); setDayTimes([]) }
  }

  return (
    <div className="tab-content">
      {/* Business Hours */}
      <section className="schedule-section">
        <h3>Business Hours</h3>
        <p className="section-hint">Set your daily availability window. Only slots within this range will appear for booking.</p>
        <div className="hours-row">
          <div className="field-group-inline">
            <label>Open from</label>
            <select className="admin-select" value={openTime} onChange={e=>setOpenTime(e.target.value)}>
              <option value="">— No limit —</option>
              {HOURS_OPTIONS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <span className="hours-sep">→</span>
          <div className="field-group-inline">
            <label>Close at</label>
            <select className="admin-select" value={closeTime} onChange={e=>setCloseTime(e.target.value)}>
              <option value="">— No limit —</option>
              {HOURS_OPTIONS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button className={`btn-save ${hoursSaved?'saved':''}`} onClick={saveHours}>
            {hoursSaved ? '✓ Saved!' : 'Save Hours'}
          </button>
        </div>
        {(openTime||closeTime) && (
          <p className="hours-summary">
            Clients can book between <strong>{openTime||'any time'}</strong> and <strong>{closeTime||'any time'}</strong>
          </p>
        )}
      </section>

      {/* Time Slots */}
      <section className="schedule-section">
        <h3>Available Time Slots</h3>
        <p className="section-hint">Toggle which times clients can book.</p>
        <div className="time-toggles">
          {ALL_POSSIBLE_TIMES.map(t => (
            <button key={t} className={`time-toggle ${times.includes(t)?'on':'off'}`} onClick={()=>toggleTime(t)}>
              {t}
              <span className="toggle-badge">{times.includes(t)?'Open':'Closed'}</span>
            </button>
          ))}
        </div>
        <button className={`btn-save ${saved?'saved':''}`} onClick={saveSchedule}>
          {saved?'✓ Saved!':'Save Schedule'}
        </button>
      </section>

      {/* Weekly Days Off */}
      <section className="schedule-section">
        <h3>Weekly Days Off</h3>
        <p className="section-hint">Select the days you <strong>never</strong> work.</p>
        <div className="weekday-grid">
          {DAY_SHORT.map((name,i) => (
            <button key={i} className={`weekday-btn ${offDays.includes(i)?'off':'on'}`} onClick={()=>toggleWeekday(i)}>
              <span className="weekday-name">{name}</span>
              <span className="weekday-status">{offDays.includes(i)?'Day Off':'Working'}</span>
            </button>
          ))}
        </div>
        {offDays.length>0 && (
          <p className="days-off-summary">You don't work on: <strong>{offDays.sort().map(d=>DAY_NAMES[d]).join(', ')}</strong></p>
        )}
      </section>

      {/* Block Specific Date */}
      <section className="schedule-section">
        <h3>Block a Specific Date</h3>
        <p className="section-hint">Block an individual date — vacation, personal, etc.</p>
        <div className="block-day-row">
          <select className="admin-select" value={pickDate.month} onChange={e=>setPickDate(p=>({...p,month:parseInt(e.target.value)}))}>
            {MONTHS_FULL.map((m,i)=><option key={i} value={i}>{m}</option>)}
          </select>
          <input type="number" min="1" max="31" placeholder="Day" className="admin-input-sm"
            value={pickDate.day} onChange={e=>setPickDate(p=>({...p,day:parseInt(e.target.value)||''}))} />
          <input type="number" min="2026" max="2030" className="admin-input-sm"
            value={pickDate.year} onChange={e=>setPickDate(p=>({...p,year:parseInt(e.target.value)||p.year}))} />
          <button className="btn-block" onClick={blockFullDay}>Block Day</button>
        </div>
        {blocked.length>0 && (
          <div className="blocked-list">
            {blocked.sort().map(dk => (
              <div key={dk} className="blocked-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>
                {dk}
                <button onClick={()=>removeBlock(dk)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Per-Day Custom Schedule ── */}
      <section className="schedule-section">
        <h3>Custom Day Schedule</h3>
        <p className="section-hint">Override available times for one specific date — 15-min precision lets you set 30-min, 45-min, or any custom gap between slots.</p>
        <div className="block-day-row">
          <select className="admin-select" value={dayPick.month} onChange={e=>setDayPick(p=>({...p,month:parseInt(e.target.value)}))}>
            {MONTHS_FULL.map((m,i)=><option key={i} value={i}>{m}</option>)}
          </select>
          <input type="number" min="1" max="31" placeholder="Day" className="admin-input-sm"
            value={dayPick.day} onChange={e=>setDayPick(p=>({...p,day:parseInt(e.target.value)||''}))} />
          <input type="number" min="2026" max="2030" className="admin-input-sm"
            value={dayPick.year} onChange={e=>setDayPick(p=>({...p,year:parseInt(e.target.value)||p.year}))} />
          <button className="btn-block" onClick={loadDay}>Load Day</button>
        </div>

        {loadedDK && (
          <>
            <p className="day-loaded-label">
              Editing <strong>{loadedDK}</strong>
              {getDaySchedule(loadedDK) ? ' — custom override active' : ' — using default (no override yet)'}
            </p>
            <div className="fine-time-grid">
              {ALL_FINE_TIMES.map(t => (
                <button key={t} className={`fine-slot ${dayTimes.includes(t)?'on':'off'}`} onClick={()=>toggleDayTime(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="day-sched-actions">
              <button className={`btn-save ${daySaved?'saved':''}`} onClick={saveDaySchedule}>
                {daySaved ? '✓ Saved!' : 'Save This Day'}
              </button>
              <button className="btn-ghost-danger" onClick={resetDaySchedule}>Reset to Default</button>
            </div>
          </>
        )}

        {Object.keys(daySchedules).length > 0 && (
          <div className="day-overrides-list">
            <p className="section-hint" style={{marginBottom:8}}>Active day overrides:</p>
            {Object.entries(daySchedules).sort().map(([dk, times]) => (
              <div key={dk} className="day-override-row">
                <span className="override-date">{dk}</span>
                <span className="override-slots">{times.length} slot{times.length!==1?'s':''}</span>
                <button className="override-edit" onClick={() => {
                  const [y,mo,d] = dk.split('-').map(Number)
                  setDayPick({ year:y, month:mo-1, day:d })
                  setLoadedDK(dk)
                  setDayTimes(getDaySchedule(dk) ?? getDefaultTimes())
                }}>Edit</button>
                <button className="override-remove" onClick={()=>removeDaySchedule(dk)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab() {
  const [pin, setPin]           = useState('')
  const [pinConfirm, setPC]     = useState('')
  const [pinMsg, setPinMsg]     = useState('')

  const savePin = () => {
    if (pin.length!==4 || !/^\d{4}$/.test(pin)) { setPinMsg('PIN must be 4 digits'); return }
    if (pin!==pinConfirm) { setPinMsg('PINs do not match'); return }
    setOwnerPin(pin); setPin(''); setPC('')
    setPinMsg('✓ PIN updated!'); setTimeout(()=>setPinMsg(''),2500)
  }

  return (
    <div className="tab-content">
      <section className="settings-section">
        <h3>Change Access PIN</h3>
        <div className="settings-fields">
          <div className="field-group">
            <label>New PIN (4 digits)</label>
            <input type="password" maxLength={4} placeholder="••••" className="admin-input"
              value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,''))} />
          </div>
          <div className="field-group">
            <label>Confirm PIN</label>
            <input type="password" maxLength={4} placeholder="••••" className="admin-input"
              value={pinConfirm} onChange={e=>setPC(e.target.value.replace(/\D/g,''))} />
          </div>
        </div>
        <button className="btn-save" onClick={savePin}>Update PIN</button>
        {pinMsg && <p className={`settings-msg ${pinMsg.startsWith('✓')?'success':'error'}`}>{pinMsg}</p>}
      </section>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [tab,    setTab]    = useState('bookings')

  const tabs = [
    { id:'bookings', label:'Bookings',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { id:'reviews', label:'Reviews',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round"/></svg> },
    { id:'schedule', label:'Schedule',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { id:'settings', label:'Settings',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
  ]

  if (!authed) return <PinScreen onSuccess={() => setAuthed(true)} />

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-logo">✦ BARBERZ BLVD <span>Owner Dashboard</span></div>
        <button className="btn-logout" onClick={() => setAuthed(false)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Lock
        </button>
      </header>
      <nav className="admin-nav">
        {tabs.map(t => (
          <button key={t.id} className={`admin-tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>
            {t.icon}{t.label}
          </button>
        ))}
      </nav>
      <main className="admin-main">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.22}}>
            {tab==='bookings' && <BookingsTab />}
            {tab==='reviews'  && <ReviewsTab />}
            {tab==='schedule' && <ScheduleTab />}
            {tab==='settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
