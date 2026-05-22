'use client'

import { motion } from 'framer-motion'

// Stable positions — no Math.random() to avoid hydration mismatch
const STAR_POSITIONS = [
  { left: '12%', top: '15%', delay: 0.0, dur: 2.2 },
  { left: '28%', top: '8%',  delay: 0.4, dur: 2.8 },
  { left: '45%', top: '22%', delay: 0.2, dur: 2.0 },
  { left: '62%', top: '10%', delay: 0.7, dur: 3.1 },
  { left: '78%', top: '18%', delay: 0.1, dur: 2.5 },
  { left: '91%', top: '32%', delay: 0.5, dur: 2.3 },
  { left: '7%',  top: '55%', delay: 0.3, dur: 2.7 },
  { left: '20%', top: '70%', delay: 0.6, dur: 2.1 },
  { left: '35%', top: '80%', delay: 0.8, dur: 3.0 },
  { left: '55%', top: '65%', delay: 0.2, dur: 2.6 },
  { left: '70%', top: '75%', delay: 0.9, dur: 2.4 },
  { left: '85%', top: '60%', delay: 0.4, dur: 2.9 },
  { left: '15%', top: '40%', delay: 0.7, dur: 2.2 },
  { left: '40%', top: '45%', delay: 0.1, dur: 2.7 },
  { left: '60%', top: '48%', delay: 0.5, dur: 3.2 },
  { left: '75%', top: '42%', delay: 0.3, dur: 2.0 },
]

const SPEED_LINES = [
  { width: 180, left: '10%', top: '22%', delay: 0.0, dur: 1.1 },
  { width: 220, left: '25%', top: '35%', delay: 0.3, dur: 0.9 },
  { width: 140, left: '5%',  top: '50%', delay: 0.6, dur: 1.3 },
  { width: 200, left: '60%', top: '28%', delay: 0.2, dur: 1.0 },
  { width: 160, left: '45%', top: '60%', delay: 0.5, dur: 1.2 },
  { width: 250, left: '70%', top: '45%', delay: 0.1, dur: 0.8 },
  { width: 190, left: '80%', top: '65%', delay: 0.4, dur: 1.1 },
  { width: 120, left: '15%', top: '75%', delay: 0.7, dur: 1.4 },
]

export function RocketLoader({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] via-transparent to-rose-500/[0.06]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

      {/* Stars */}
      <div className="absolute inset-0">
        {STAR_POSITIONS.map((s, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{ left: s.left, top: s.top }}
            animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.4, 0.8] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
          />
        ))}
      </div>

      {/* Speed lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {SPEED_LINES.map((l, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
            style={{ width: `${l.width}px`, left: l.left, top: l.top }}
            animate={{ x: [0, -600], opacity: [0, 0.6, 0] }}
            transition={{ duration: l.dur, repeat: Infinity, delay: l.delay, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Rocket */}
      <motion.div
        className="relative z-10"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative"
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="72" height="108" viewBox="0 0 80 120" fill="none" className="drop-shadow-2xl">
            {/* Body */}
            <path d="M40 0C40 0 20 30 20 60C20 80 28 100 40 100C52 100 60 80 60 60C60 30 40 0 40 0Z"
              fill="url(#rGrad)" />
            {/* Window outer */}
            <circle cx="40" cy="44" r="11" fill="#0d0d1a" stroke="url(#wGrad)" strokeWidth="2" />
            {/* Window inner */}
            <circle cx="40" cy="44" r="6.5" fill="url(#wInner)" />
            {/* Shine */}
            <ellipse cx="37" cy="41" rx="3" ry="2.5" fill="white" opacity="0.25" />
            {/* Left fin */}
            <path d="M20 68L4 96L20 84Z" fill="#7c3aed" />
            {/* Right fin */}
            <path d="M60 68L76 96L60 84Z" fill="#7c3aed" />
            {/* Nozzle */}
            <ellipse cx="40" cy="96" rx="13" ry="5.5" fill="#4f46e5" />

            <defs>
              <linearGradient id="rGrad" x1="40" y1="0" x2="40" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f8fafc" />
                <stop offset="1" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="wGrad" x1="29" y1="33" x2="51" y2="55" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a78bfa" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="wInner" x1="33.5" y1="37.5" x2="46.5" y2="50.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6d28d9" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>

          {/* Flame */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 -bottom-3"
            animate={{ scaleY: [1, 1.35, 1], scaleX: [1, 0.88, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 0.28, repeat: Infinity }}
          >
            <svg width="36" height="54" viewBox="0 0 40 60" fill="none">
              <path d="M20 0C20 0 5 22 5 36C5 51 14 60 20 60C26 60 35 51 35 36C35 22 20 0 20 0Z"
                fill="url(#fGrad)" />
              <defs>
                <linearGradient id="fGrad" x1="20" y1="0" x2="20" y2="60" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#fbbf24" />
                  <stop offset="0.45" stopColor="#f97316" />
                  <stop offset="1" stopColor="#dc2626" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Message */}
      <motion.div
        className="mt-14 text-center relative z-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.p
          className="text-xl font-semibold text-white/90 mb-2"
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
        <p className="text-sm text-white/35">Preparing your personalised dashboard…</p>
      </motion.div>
    </div>
  )
}
