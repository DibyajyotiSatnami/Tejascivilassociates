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
          <svg viewBox="0 0 200 120" className="relative mb-10 w-48 text-gold" fill="none" stroke="currentColor" strokeWidth="0.8" aria-hidden>
            {[
              'M10 110 H190',
              'M30 110 V50 H110 V110',
              'M110 110 V28 H170 V110',
              'M30 50 L70 30 L110 50',
              'M122 40 H158 M122 55 H158 M122 70 H158 M122 85 H158',
              'M45 70 H95 M45 88 H95',
            ].map((d, i) => (
              <motion.path key={i} d={d} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.4, delay: i * 0.12, ease: 'easeInOut' }} />
            ))}
          </svg>
          <Logo tone="light" />
          <div className="relative mt-10 h-px w-56 overflow-hidden bg-white/10">
            <div className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-100" style={{ width: `${progress}%` }} />
          </div>
          <span className="mt-4 font-serif text-sm tabular-nums text-white/60">{String(Math.round(progress)).padStart(3, '0')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
