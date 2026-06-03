import { useState } from 'react'

const RATINGS = [
  { emoji: '😔', label: 'Terrible' },
  { emoji: '😕', label: 'Poor' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😍', label: 'Amazing' },
]

export function EmojiRating({ onChange }) {
  const [rating,  setRating]  = useState(0)
  const [hovered, setHovered] = useState(0)

  const active = hovered || rating

  const pick = (v) => { setRating(v); onChange?.(v) }

  return (
    <div className="emoji-rating">
      <div className="emoji-row">
        {RATINGS.map((item, i) => {
          const v  = i + 1
          const on = v <= active
          return (
            <button key={v} type="button"
              className={`emoji-btn ${on ? 'emoji-on' : 'emoji-off'}`}
              onClick={() => pick(v)}
              onMouseEnter={() => setHovered(v)}
              onMouseLeave={() => setHovered(0)}
              aria-label={`${v} — ${item.label}`}
            >
              {item.emoji}
            </button>
          )
        })}
      </div>
      <div className="emoji-label">
        {active ? RATINGS[active - 1].label : 'Rate your experience'}
      </div>
    </div>
  )
}
