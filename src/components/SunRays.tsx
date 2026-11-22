import { motion, useReducedMotion } from 'framer-motion'

/** Rising-sun rays — a brand motif taken from the logo. Purely decorative. */
export function SunRays({ className = '', rays = 9, opacity = 0.18 }: { className?: string; rays?: number; opacity?: number }) {
  const reduce = useReducedMotion()
  const spread = 150 // degrees
  return (
    <svg viewBox="-200 -200 400 200" className={`pointer-events-none text-gold ${className}`} aria-hidden style={{ opacity }}>
      <defs>
        <radialGradient id="sunglow" cx="0" cy="0" r="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="0" cy="0" r="200" fill="url(#sunglow)" />
      {Array.from({ length: rays }).map((_, i) => {
        const a = -90 - spread / 2 + (i * spread) / (rays - 1)
        return (
          <motion.polygon
            key={i}
            points="-7,-70 7,-70 0,-190"
            fill="currentColor"
            transform={`rotate(${a + 90})`}
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1 + Math.abs(i - (rays - 1) / 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: '0px 0px' }}
          />
        )
      })}
      <motion.circle cx="0" cy="0" r="56" fill="currentColor" initial={reduce ? false : { scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
    </svg>
  )
}
