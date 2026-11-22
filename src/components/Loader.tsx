import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { asset } from '../lib/asset'

/** Elegant intro: counter + architectural line drawing, then curtain lift. */
export function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hero = new Image()
    hero.src = asset(window.innerWidth < 900 ? '/images/hero-sm.webp' : '/images/hero.webp')
    let loaded = false
    const markLoaded = () => (loaded = true)
    hero.onload = hero.onerror = markLoaded
    if (hero.complete) loaded = true

    const start = performance.now()
    const minTime = reduce ? 200 : 1500
    let raf = 0
    const tick = (t: number) => {
      const elapsed = t - start
      // ease toward 90% while loading, then complete
      const target = loaded && elapsed > minTime ? 100 : Math.min(90, (elapsed / minTime) * 90)
      setProgress((p) => {
        const next = p + (target - p) * 0.12
        return target === 100 && next > 99.5 ? 100 : next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const safety = setTimeout(() => (loaded = true), 4000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(safety)
    }
  }, [])

  useEffect(() => {
    if (progress >= 100 && visible) {
      const t = setTimeout(() => {
        setVisible(false)
        onDone()
      }, 250)
      return () => clearTimeout(t)
    }
  }, [progress, visible, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-white"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading website"
        >
          <div className="blueprint-grid absolute inset-0 opacity-40" aria-hidden />
          {/* sunrise: rays fan out behind the logo badge, echoing the logo's sun */}
          <div className="relative grid h-44 w-44 place-items-center">
            <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full text-gold" aria-hidden>
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.line
                  key={i}
                  x1="0"
                  y1="-62"
                  x2="0"
                  y2="-92"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  transform={`rotate(${i * 30})`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0.55] }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.06, ease: 'easeOut' }}
                />
              ))}
              <motion.circle r="58" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: 'easeInOut' }} />
            </svg>
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
              <Logo tone="light" size={104} wordmark={false} />
            </motion.div>
          </div>
          <p className="mt-8 font-serif text-xl font-bold tracking-[0.2em]">TEJAS</p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.35em] text-white/60">CIVIL ASSOCIATES</p>
          <div className="relative mt-10 h-px w-56 overflow-hidden bg-white/10">
            <div className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-100" style={{ width: `${progress}%` }} />
          </div>
          <span className="mt-4 font-serif text-sm tabular-nums text-white/60">{String(Math.round(progress)).padStart(3, '0')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
