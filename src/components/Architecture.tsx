import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ScrollTrigger } from '../lib/scroll'
import { Reveal } from './Reveal'

const Building3D = lazy(() => import('./Building3D'))

const stages = [
  { k: '01', t: 'Blueprint', d: 'Every structure begins as lines on a plan — precise, measured and considered.' },
  { k: '02', t: 'Structure', d: 'Foundations, columns and slabs rise to give the design its strength.' },
  { k: '03', t: 'Form', d: 'Materials, glazing and detail bring the building to life.' },
]

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

export function Architecture() {
  const section = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const [near, setNear] = useState(false)
  const [inView, setInView] = useState(false)
  const [stage, setStage] = useState(0)
  const [pct, setPct] = useState(0)
  const [gl] = useState(() => typeof window !== 'undefined' && webglAvailable())
  const reduce = useReducedMotion()

  // load the 3D bundle only when approaching the section
  useEffect(() => {
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '800px 0px' })
    const io2 = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '100px 0px' })
    io.observe(el)
    io2.observe(el)
    return () => {
      io.disconnect()
      io2.disconnect()
    }
  }, [])

  // pin + scrub
  useEffect(() => {
    const el = section.current
    if (!el) return
    if (reduce) {
      progress.current = 1
      setStage(2)
      setPct(100)
      return
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: () => (window.innerWidth < 768 ? '+=140%' : '+=220%'),
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress.current = self.progress
        setStage(self.progress < 0.36 ? 0 : self.progress < 0.78 ? 1 : 2)
        setPct(Math.round(self.progress * 100))
      },
    })
    return () => st.kill()
  }, [reduce])

  const onPointer = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 }
  }

  return (
    <section ref={section} className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink text-white" aria-labelledby="arch-title" onPointerMove={onPointer}>
      <div className="blueprint-grid absolute inset-0 opacity-50" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_55%,rgba(197,164,109,0.10),transparent_60%)]" aria-hidden />

      {/* 3D canvas */}
      <div className="absolute inset-x-0 top-[31%] h-[33%] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_85%,transparent)] md:inset-y-0 md:[mask-image:none] md:left-[30%] md:right-0 md:top-0 md:h-auto">
        {gl && near ? (
          <Suspense fallback={null}>
            <Building3D progress={progress} pointer={pointer} active={inView} />
          </Suspense>
        ) : (
          !gl && (
            <div className="grid h-full place-items-center text-sm text-white/40">Interactive 3D view requires WebGL.</div>
          )
        )}
      </div>

      {/* copy & stage indicator */}
      <div className="container-site pointer-events-none relative flex h-full flex-col justify-between pb-10 pt-24 md:justify-center md:py-0">
        <div className="max-w-md">
          <Reveal>
            <p className="eyebrow text-gold">Visual Architecture</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="arch-title" className="heading-lg mt-6">
              From blueprint <em className="italic text-gold">to building.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 hidden text-white/60 sm:block">Scroll to watch a concept take shape — line by line, floor by floor.</p>
          </Reveal>
        </div>

        <div className="md:mt-14 md:max-w-sm">
          <p className="mb-4 text-xs text-white/45 sm:hidden">{stages[stage].d}</p>
          <ol className="space-y-1">
            {stages.map((s, i) => (
              <li key={s.k} className={`border-l py-1.5 pl-5 sm:py-3 transition-all duration-700 ${stage === i ? 'border-gold' : 'border-white/10'}`}>
                <p className={`flex items-baseline gap-3 font-serif text-xl transition-colors duration-500 sm:text-2xl ${stage === i ? 'text-white' : 'text-white/30'}`}>
                  <span className="font-sans text-[11px] text-gold">{s.k}</span>
                  {s.t}
                </p>
                <motion.p
                  initial={false}
                  animate={{ height: stage === i ? 'auto' : 0, opacity: stage === i ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="hidden overflow-hidden text-sm leading-relaxed text-white/55 sm:block"
                >
                  <span className="block pt-2">{s.d}</span>
                </motion.p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] text-white/40">
            <span className="tabular-nums text-gold">{String(pct).padStart(3, '0')}%</span>
            <span className="relative h-px flex-1 bg-white/10">
              <span className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${pct}%` }} />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
