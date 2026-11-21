import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { site } from '../config/site'
import { gsap } from '../lib/scroll'
import { Img } from './Img'
import { Reveal, SplitLines } from './Reveal'

/** Isometric blueprint line-drawing that draws itself as it enters view. */
function Blueprint({ className = '' }: { className?: string }) {
  const paths = [
    // ground grid
    'M20 210 L160 290 L300 210 L160 130 Z',
    'M55 230 L195 150 M90 250 L230 170 M125 270 L265 190',
    'M55 190 L195 270 M90 170 L230 250 M125 150 L265 230',
    // building volume
    'M80 200 L80 110 L160 64 L240 110 L240 200',
    'M80 110 L160 156 L240 110 M160 156 L160 246',
    'M80 200 L160 246 L240 200',
    // floors
    'M80 170 L160 216 L240 170 M80 140 L160 186 L240 140',
    // upper cantilever
    'M120 88 L120 50 L200 4 L270 44 L270 82',
    'M120 50 L190 90 L270 44 M190 90 L190 128',
  ]
  return (
    <svg viewBox="0 0 320 300" className={className} fill="none" stroke="currentColor" strokeWidth="0.8" aria-hidden>
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.8, delay: 0.2 + i * 0.12, ease: 'easeInOut' }}
          strokeDasharray={i < 3 ? '3 4' : undefined}
          strokeOpacity={i < 3 ? 0.5 : 1}
        />
      ))}
      <motion.circle cx="160" cy="156" r="3" fill="currentColor" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.8 }} />
    </svg>
  )
}

const principles = [
  { k: '01', t: 'Thoughtful Planning', d: 'Every project begins with understanding the site, the brief and the budget — before a single foundation is laid.' },
  { k: '02', t: 'Construction Quality', d: 'An approach centred on sound structure, honest materials and careful workmanship.' },
  { k: '03', t: 'Client Relationships', d: 'Clear communication and a collaborative process, from the first conversation to handover.' },
]

export function About() {
  const imgWrap = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || !imgWrap.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgWrap.current!.querySelector('img'),
        { yPercent: -8, scale: 1.15 },
        { yPercent: 8, scale: 1.15, ease: 'none', scrollTrigger: { trigger: imgWrap.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.fromTo(
        imgWrap.current,
        { clipPath: 'inset(12% 12% 12% 12%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: imgWrap.current, start: 'top 90%', end: 'top 30%', scrub: true } },
      )
    })
    return () => ctx.revert()
  }, [reduce])

  return (
    <section id="about" className="relative overflow-hidden bg-bone py-24 sm:py-32 lg:py-40" aria-labelledby="about-title">
      <div className="container-site grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
        {/* visual */}
        <div className="relative lg:col-span-6">
          <div ref={imgWrap} className="relative aspect-[4/5] overflow-hidden bg-ink-2">
            <Img
              base="/images/about"
              width={1200}
              height={1500}
              sizes="(min-width: 1024px) 45vw, 100vw"
              alt="Computer-generated visual: façade detail of a contemporary building with timber screen and glazing"
              className="h-full w-full object-cover"
            />
            <span className="sample-tag absolute left-4 top-4">Illustrative visual</span>
          </div>
          {/* blueprint card */}
          <Reveal delay={0.2} className="absolute -bottom-10 -right-2 w-[58%] max-w-[300px] bg-ink p-5 text-gold shadow-2xl sm:-right-8 lg:-right-14">
            <div className="blueprint-grid absolute inset-0 opacity-60" aria-hidden />
            <Blueprint className="relative w-full" />
            <p className="relative mt-3 text-[10px] uppercase tracking-[0.25em] text-white/50">From concept to structure</p>
          </Reveal>
        </div>

        {/* copy */}
        <div className="lg:col-span-6 lg:pl-6">
          <Reveal>
            <p className="eyebrow text-gold-dark">About Us</p>
          </Reveal>
          <SplitLines
            lines={['Building with purpose.', <em key="e" className="italic text-gold-dark">Creating with vision.</em>]}
            className="heading-lg mt-6 text-ink"
            id="about-title"
          />
          <Reveal delay={0.1}>
            <p className="mt-8 text-lg leading-relaxed text-text/80">
              {site.name} is a real estate builders and construction company based in {site.address.city}, {site.address.state}. We believe a good building
              starts long before construction — with careful listening, considered planning and a clear understanding of what our clients want to achieve.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 leading-relaxed text-text/70">
              Our focus is simple: to build spaces that are well-planned, soundly constructed and made to last, while keeping the process transparent and
              collaborative for the people we build for.
            </p>
          </Reveal>

          <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.k} delay={0.1 + i * 0.08} className="group grid grid-cols-[auto_1fr] gap-6 py-6">
                <span className="font-serif text-sm text-gold-dark">{p.k}</span>
                <div>
                  <h3 className="font-serif text-xl text-ink transition-colors duration-500 group-hover:text-gold-dark">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text/65">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
