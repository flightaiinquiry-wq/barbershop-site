const K = {
  BOOKINGS:      'obsidian_bookings',
  BLOCKED_SLOTS: 'obsidian_blocked_slots',
  BLOCKED_DATES: 'obsidian_blocked_dates',
  BLOCKED_DAYS:  'obsidian_blocked_days',
  DEFAULT_TIMES: 'obsidian_default_times',
  REVIEWS:       'obsidian_reviews',
  OWNER_PIN:     'obsidian_owner_pin',
  HOURS:         'obsidian_business_hours',
}

const INITIAL_TIMES = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']
export const ALL_POSSIBLE_TIMES = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM']
export const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
export const DAY_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export const HOURS_OPTIONS = [
  '6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM',
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM',
  '6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM',
]

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

export function getDefaultTimes()        { return read(K.DEFAULT_TIMES, INITIAL_TIMES) }
export function setDefaultTimes(times)   { write(K.DEFAULT_TIMES, times) }

export function getBusinessHours()       { return read(K.HOURS, { open: null, close: null }) }
export function setBusinessHours(hours)  { write(K.HOURS, hours) }

export function getAvailableTimesForDate(date) {
  if (!date) return getDefaultTimes()
  if (isDateUnavailable(date)) return []
  const blocked = getBlockedSlots()
  const { open, close } = getBusinessHours()
  const openMins  = parseTimeMins(open)
  const closeMins = parseTimeMins(close)
  return getDefaultTimes().filter(t => {
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

export function getOwnerPin()    { return localStorage.getItem(K.OWNER_PIN) || '1234' }
export function setOwnerPin(pin) { localStorage.setItem(K.OWNER_PIN, pin) }
