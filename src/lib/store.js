const K = {
  BOOKINGS:       'topbarber_bookings',
  BLOCKED_SLOTS:  'topbarber_blocked_slots',
  BLOCKED_DATES:  'topbarber_blocked_dates',
  BLOCKED_DAYS:   'topbarber_blocked_days',
  DEFAULT_TIMES:  'topbarber_default_times',
  REVIEWS:        'topbarber_reviews',
  OWNER_PIN:      'topbarber_owner_pin',
  HOURS:          'topbarber_business_hours',
  DAY_SCHEDULES:  'topbarber_day_schedules',
}

function buildTimeGrid(intervalMins) {
  const out = []
  for (let total = 7 * 60; total <= 20 * 60; total += intervalMins) {
    const h24 = Math.floor(total / 60), m = total % 60
    const period = h24 < 12 ? 'AM' : 'PM'
    const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24
    out.push(`${h12}:${String(m).padStart(2,'0')} ${period}`)
  }
  return out
}

const INITIAL_TIMES = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']
export const ALL_POSSIBLE_TIMES = buildTimeGrid(30)   // 30-min grid for global defaults
export const ALL_FINE_TIMES     = buildTimeGrid(15)   // 15-min grid for per-day overrides
export const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
export const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export const HOURS_OPTIONS = (() => {
  const out = []
  for (let total = 6 * 60; total <= 21 * 60; total += 30) {
    const h24 = Math.floor(total / 60), m = total % 60
    const period = h24 < 12 ? 'AM' : 'PM'
    const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24
    out.push(`${h12}:${String(m).padStart(2,'0')} ${period}`)
  }
  return out
})()

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function write(key, val) { localStorage.setItem(key, JSON.stringify(val)) }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }

function parseTimeMins(t) {
  if (!t) return null
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return null
  let h = parseInt(m[1])
  const min = parseInt(m[2])
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0
  return h * 60 + min
}

export function dateKey(date) {
  const p = n => String(n).padStart(2, '0')
  return `${date.year}-${p(date.month + 1)}-${p(date.day)}`
}
function slotKey(date, time) { return `${dateKey(date)}|${time}` }

export function getBookings() { return read(K.BOOKINGS, []) }
export function addBooking(form) {
  const bookings = getBookings()
  const booking  = { ...form, id: uid(), createdAt: new Date().toISOString() }
  write(K.BOOKINGS, [...bookings, booking])
  const blocked = getBlockedSlots()
  blocked.add(slotKey(form.date, form.time))
  write(K.BLOCKED_SLOTS, [...blocked])
  return booking
}
export function cancelBooking(id) {
  const bookings = getBookings()
  const booking  = bookings.find(b => b.id === id)
  if (!booking) return
  const blocked = getBlockedSlots()
  blocked.delete(slotKey(booking.date, booking.time))
  write(K.BLOCKED_SLOTS, [...blocked])
  write(K.BOOKINGS, bookings.filter(b => b.id !== id))
}

export function getBlockedSlots()    { return new Set(read(K.BLOCKED_SLOTS, [])) }
export function getBlockedDates()    { return new Set(read(K.BLOCKED_DATES, [])) }
export function getBlockedWeekdays() { return new Set(read(K.BLOCKED_DAYS,  [])) }

export function blockDate(date)   { const s = getBlockedDates(); s.add(dateKey(date));    write(K.BLOCKED_DATES, [...s]) }
export function unblockDate(date) { const s = getBlockedDates(); s.delete(dateKey(date)); write(K.BLOCKED_DATES, [...s]) }
export function blockWeekday(n)   { const s = getBlockedWeekdays(); s.add(n);    write(K.BLOCKED_DAYS, [...s]) }
export function unblockWeekday(n) { const s = getBlockedWeekdays(); s.delete(n); write(K.BLOCKED_DAYS, [...s]) }

export function isDateUnavailable(date) {
  if (!date) return false
  const dow = new Date(date.year, date.month, date.day).getDay()
  return getBlockedWeekdays().has(dow) || getBlockedDates().has(dateKey(date))
}

export function getDefaultTimes()      { return read(K.DEFAULT_TIMES, INITIAL_TIMES) }
export function setDefaultTimes(times) { write(K.DEFAULT_TIMES, times) }

export function getBusinessHours()      { return read(K.HOURS, { open: null, close: null }) }
export function setBusinessHours(hours) { write(K.HOURS, hours) }

export function getDaySchedule(dk)        { return (read(K.DAY_SCHEDULES, {}))[dk] ?? null }
export function getAllDaySchedules()       { return read(K.DAY_SCHEDULES, {}) }
export function setDaySchedule(dk, times) {
  const all = read(K.DAY_SCHEDULES, {}); all[dk] = times; write(K.DAY_SCHEDULES, all)
}
export function clearDaySchedule(dk) {
  const all = read(K.DAY_SCHEDULES, {}); delete all[dk]; write(K.DAY_SCHEDULES, all)
}

export function getAvailableTimesForDate(date) {
  if (!date) return getDefaultTimes()
  if (isDateUnavailable(date)) return []
  const dk       = dateKey(date)
  const daySched = getDaySchedule(dk)
  const blocked  = getBlockedSlots()
  const { open, close } = getBusinessHours()
  const openMins  = parseTimeMins(open)
  const closeMins = parseTimeMins(close)
  const base = daySched !== null ? daySched : getDefaultTimes()
  return base.filter(t => {
    if (blocked.has(slotKey(date, t))) return false
    const tMins = parseTimeMins(t)
    if (openMins  !== null && tMins < openMins)  return false
    if (closeMins !== null && tMins > closeMins) return false
    return true
  })
}

export function getReviews() { return read(K.REVIEWS, []) }
export function addReview({ name, service, rating, ratingLabel, comment }) {
  const reviews = getReviews()
  reviews.unshift({ id: uid(), name, service, rating, ratingLabel, comment, date: new Date().toISOString() })
  write(K.REVIEWS, reviews)
}

export function getOwnerPin()    { return localStorage.getItem(K.OWNER_PIN) || '123456' }
export function setOwnerPin(pin) { localStorage.setItem(K.OWNER_PIN, pin) }
