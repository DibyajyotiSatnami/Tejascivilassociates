import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowRight, Star } from 'lucide-react'
import { site } from '../config/site'
import { gsap, scrollToHash } from '../lib/scroll'
import { Img } from './Img'
import { SplitLines } from './Reveal'

const ease = [0.22, 1, 0.36, 1] as const

/** Floating isometric wireframe — an architectural accent drawn in SVG. */
function IsoFrame({ className = '', delay = 0, size = 120 }: { className?: string; delay?: number; size?: number }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`pointer-events-none absolute text-gold ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.7, 0.7], y: [0, -14, 0] }}
      transition={{ opacity: { duration: 2, delay }, y: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay } }}
      aria-hidden
    >
      <path d="M50 8 L90 30 L90 72 L50 94 L10 72 L10 30 Z" />
      <path d="M50 8 L50 50 M10 30 L50 50 L90 30 M50 50 L50 94" strokeDasharray="2 3" />
      <path d="M30 41 L30 83 M70 41 L70 83" strokeOpacity="0.5" />
    </motion.svg>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const section = useRef<HTMLElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // subtle "camera" drift following the pointer (desktop)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 20 })
  const sy = useSpring(my, { stiffness: 40, damping: 20 })
  const imgX = useTransform(sx, [-1, 1], [18, -18])
  const imgY = useTransform(sy, [-1, 1], [12, -12])
  const rotY = useTransform(sx, [-1, 1], [-1.2, 1.2])
  const rotX = useTransform(sy, [-1, 1], [0.8, -0.8])
  const fgX = useTransform(sx, [-1, 1], [-30, 30])
  const fgY = useTransform(sy, [-1, 1], [-20, 20])

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1)
      my.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my, reduce])

  // scroll parallax
  useEffect(() => {
    if (reduce || !section.current) return
    const ctx = gsap.context(() => {
      gsap.to(media.current, {
        yPercent: 18,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(content.current, {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: '80% top', scrub: true },
      })
    }, section)
    return () => ctx.revert()
  }, [reduce])

  const go = (h: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToHash(h)
  }

  return (
    <section ref={section} id="home" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink text-white" aria-label="Introduction">
      {/* media layer */}
      <div ref={media} className="absolute inset-0 will-change-transform">
        <motion.div
          className="absolute -inset-[4%]"
          style={{ x: imgX, y: imgY, rotateY: rotY, rotateX: rotX, transformPerspective: 1200 }}
          initial={{ scale: 1.25, opacity: 0 }}
          animate={ready ? { scale: 1.04, opacity: 1 } : {}}
          transition={{ duration: 2.4, ease }}
        >
          <Img
            base="/images/hero"
            priority
            width={2400}
            height={1350}
            alt="Computer-generated visual of a contemporary residence with glass, stone and timber at dusk"
            className="h-full w-full object-cover object-[65%_center]"
          />
        </motion.div>
        {/* gradients for legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
        <div className="grain absolute inset-0" />
      </div>

      {/* floating architectural elements */}
      <motion.div className="pointer-events-none absolute inset-0 hidden md:block" style={{ x: fgX, y: fgY }} aria-hidden>
        <IsoFrame className="right-[8%] top-[18%]" size={140} delay={1.6} />
        <IsoFrame className="right-[34%] bottom-[16%]" size={70} delay={2.1} />
        <motion.div
          className="absolute right-[6%] top-[46%] h-px w-40 origin-right bg-gradient-to-l from-gold to-transparent"
          initial={{ scaleX: 0 }}
          animate={ready ? { scaleX: 1 } : {}}
          transition={{ duration: 1.6, delay: 1.8, ease }}
        />
        <motion.div
          className="absolute left-[46%] top-0 w-px origin-top bg-gradient-to-b from-transparent via-gold/40 to-transparent"
          style={{ height: '100%' }}
          initial={{ scaleY: 0 }}
          animate={ready ? { scaleY: 1 } : {}}
          transition={{ duration: 2.2, delay: 1.2, ease }}
        />
      </motion.div>

      {/* content */}
      <div ref={content} className="container-site relative z-10 flex h-full flex-col justify-center pb-16 pt-28">
        <motion.p className="eyebrow mb-7 text-gold" initial={{ opacity: 0, x: -20 }} animate={ready ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3, ease }}>
          {site.category} · {site.address.city}, {site.address.state}
        </motion.p>

        {ready && (
          <SplitLines
            as="h1"
            trigger="mount"
            delay={0.45}
            className="heading-xl max-w-5xl"
            lines={[
              'Building Visions.',
              <>
                Creating <em className="font-normal italic text-gold">Landmarks.</em>
              </>,
            ]}
          />
        )}
        {!ready && <h1 className="heading-xl invisible max-w-5xl">Building Visions. Creating Landmarks.</h1>}

        <motion.p
          className="mt-8 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 1.0, ease }}
        >
          Thoughtful construction. Modern architecture. A foundation built on trust.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, delay: 1.2, ease }}
        >
          <a href="#contact" onClick={go('#contact')} className="btn-gold group">
            <span className="relative z-10">Discuss Your Project</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </a>
          <a href="#projects" onClick={go('#projects')} className="btn-ghost">
            Explore Our Work
          </a>
        </motion.div>
      </div>

      {/* bottom bar */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <div className="container-site flex items-end justify-between gap-6 pb-7">
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-xs text-white/70 transition-colors hover:text-white"
          >
            <span className="flex gap-0.5 text-gold" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </span>
            <span>
              <strong className="font-semibold text-white">{site.rating.value.toFixed(1)}</strong> on {site.rating.source} ({site.rating.count}{' '}
              {site.rating.count === 1 ? 'review' : 'reviews'})
            </span>
          </a>

          <a href="#about" onClick={go('#about')} className="hidden flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/60 md:flex" aria-label="Scroll to About section">
            Scroll
            <span className="relative h-12 w-px overflow-hidden bg-white/20">
              <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-gold" animate={{ y: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
            </span>
          </a>

          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-white/45 sm:block">Illustrative CGI visual</span>
          <ArrowDown className="h-4 w-4 text-white/50 md:hidden" aria-hidden />
        </div>
      </motion.div>
    </section>
  )
}
