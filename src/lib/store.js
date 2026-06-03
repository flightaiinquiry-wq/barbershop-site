const K = {
  BOOKINGS:      'obsidian_bookings',
  BLOCKED_SLOTS: 'obsidian_blocked_slots',
  BLOCKED_DATES: 'obsidian_blocked_dates',
  BLOCKED_DAYS:  'obsidian_blocked_days',
  DEFAULT_TIMES: 'obsidian_default_times',
}

const INITIAL_TIMES = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']
export const ALL_POSSIBLE_TIMES = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM']

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function write(key, val) { localStorage.setItem(key, JSON.stringify(val)) }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }

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

export function getBlockedSlots() { return new Set(read(K.BLOCKED_SLOTS, [])) }
export function getBlockedDates()  { return new Set(read(K.BLOCKED_DATES, [])) }
export function getBlockedWeekdays() { return new Set(read(K.BLOCKED_DAYS, [])) }

export function isDateUnavailable(date) {
  if (!date) return false
  const dow = new Date(date.year, date.month, date.day).getDay()
  return getBlockedWeekdays().has(dow) || getBlockedDates().has(dateKey(date))
}

export function getDefaultTimes() { return read(K.DEFAULT_TIMES, INITIAL_TIMES) }

export function getAvailableTimesForDate(date) {
  if (!date) return getDefaultTimes()
  if (isDateUnavailable(date)) return []
  const blocked = getBlockedSlots()
  return getDefaultTimes().filter(t => !blocked.has(slotKey(date, t)))
}
