import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

/* ── Typewriter hook ── */
function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) { clearInterval(interval); setDone(true) }
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(timeout)
  }, [text, speed, startDelay])

  return { displayed, done }
}

const SERVICE_OPTIONS = ['Haircut', 'Beard Trim', 'Line Up', 'Hair Dye', 'Kids Cut']

export default function ServicePicker() {
  const videoRef = useRef(null)
  const [selected, setSelected] = useState([])
  const { displayed, done } = useTypewriter("ready to look\nyour best?", 42, 400)

  /* ── Desktop scrub / Mobile autoplay ── */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (window.innerWidth < 1024) {
      video.muted = true
      video.autoplay = true
      video.play().catch(() => {})
      return
    }

    let prevX = null
    let targetTime = 0

    const onSeek = () => { video.currentTime = targetTime }
    video.addEventListener('seeked', onSeek)

    const onMouseMove = (e) => {
      if (window.innerWidth < 1024) return
      if (prevX !== null) {
        const delta = e.clientX - prevX
        targetTime = Math.min(
          Math.max(targetTime + (delta / window.innerWidth) * 0.8 * (video.duration || 10), 0),
          video.duration || 10
        )
        video.currentTime = targetTime
      }
      prevX = e.clientX
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      video.removeEventListener('seeked', onSeek)
    }
  }, [])

  const toggle = (s) =>
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <div className="relative bg-white text-neutral-900 font-sans antialiased overflow-x-hidden"
      style={{ fontFamily: "'Jost', 'Inter', sans-serif" }}>

      {/* Background video */}
      <div className="relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-right lg:object-right-bottom"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col w-full bg-white lg:bg-transparent pb-8 lg:pb-0">
        <main className="w-full max-w-2xl mx-auto px-6 py-10 flex-1 flex flex-col justify-center">

          {/* Headline with typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-black uppercase tracking-tight leading-none select-none whitespace-pre-wrap mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', color: '#0D0C08' }}
            >
              {displayed}
              {!done && (
                <span className="inline-block w-[3px] bg-[#CA8A04] align-middle ml-1 animate-blink"
                  style={{ height: '0.9em' }} />
              )}
            </h2>
          </motion.div>

          {/* Sub text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 leading-relaxed font-light"
            style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)', color: '#6B5040' }}
          >
            Tell us what you need and we'll have you looking sharp.
            <br />Book your seat at Barberz Blvd — San Antonio's finest.
          </motion.p>

          {/* Service pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="font-semibold uppercase tracking-widest text-xs mb-1" style={{ color: '#CA8A04' }}>
              What are you booking?
            </p>
            <p className="text-xs mb-5 opacity-60" style={{ color: '#0D0C08' }}>Select all that apply</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {SERVICE_OPTIONS.map(s => {
                const active = selected.includes(s)
                return (
                  <motion.button
                    key={s}
                    onClick={() => toggle(s)}
                    whileTap={{ scale: 0.94 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer"
                    style={{
                      background: active ? '#CA8A04' : 'transparent',
                      color: active ? '#0D0C08' : '#CA8A04',
                      border: `1.5px solid ${active ? '#CA8A04' : 'rgba(202,138,4,0.4)'}`,
                      boxShadow: active ? '0 4px 16px rgba(202,138,4,0.25)' : 'none',
                    }}
                  >
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Check size={13} strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {s}
                  </motion.button>
                )
              })}
            </div>

            {/* Status banner */}
            <AnimatePresence mode="wait">
              {selected.length === 0 ? (
                <motion.p key="empty"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }}
                  className="text-xs italic" style={{ color: '#0D0C08' }}>
                  Select a service above to get started.
                </motion.p>
              ) : (
                <motion.div key="active"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl px-4 py-3 flex items-center justify-between"
                  style={{ background: 'rgba(202,138,4,0.08)', border: '1px solid rgba(202,138,4,0.2)' }}>
                  <span className="text-xs" style={{ color: '#6B4A00' }}>
                    Booking: <strong>{selected.join(', ')}</strong>
                  </span>
                  <motion.button
                    whileHover={{ x: 3 }}
                    onClick={() => window.location.href = '/book'}
                    className="text-xs font-bold uppercase tracking-widest cursor-pointer ml-4 flex items-center gap-1"
                    style={{ color: '#CA8A04' }}>
                    Book Now →
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
