import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { services } from '../config/site'
import { startEnquiry } from '../lib/enquiry'
import { lockScroll } from '../lib/scroll'
import { Img } from './Img'
import { Reveal, SplitLines } from './Reveal'
import { TiltCard } from './TiltCard'

type Service = (typeof services)[number]

export function Services() {
  const list = services.filter((s) => s.enabled)
  const [open, setOpen] = useState<Service | null>(null)

  useEffect(() => {
    lockScroll(!!open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <section id="services" className="relative bg-ink py-24 text-white sm:py-32 lg:py-40" aria-labelledby="services-title">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.15]" aria-hidden />
      <div className="container-site relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-gold">Services</p>
            </Reveal>
            <SplitLines id="services-title" className="heading-lg mt-6" lines={['Expertise across', <em key="e" className="italic text-gold">every stage of building.</em>]} />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5">
            <p className="leading-relaxed text-white/65">
              From the first sketch to the final finish, explore the areas we can help with. Select a service to learn more or start an enquiry.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {list.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.1}>
              <TiltCard className="h-full">
                <button
                  type="button"
                  onClick={() => setOpen(s)}
                  className="relative flex h-full w-full flex-col overflow-hidden bg-ink-2 text-left ring-1 ring-white/5 transition-shadow duration-500 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] hover:ring-gold/30"
                  aria-haspopup="dialog"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Img
                      base={s.image}
                      width={1280}
                      height={960}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-[1.4s] ease-premium group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/10 to-transparent" />
                    <span className="absolute left-5 top-5 font-serif text-sm text-white/70">0{i + 1}</span>
                  </div>
                  <div className="relative flex flex-1 flex-col p-7" style={{ transform: 'translateZ(30px)' }}>
                    <h3 className="font-serif text-2xl leading-snug">{s.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{s.text}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                      Explore More
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-700 ease-premium group-hover:w-full" />
                </button>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-xs text-white/35">Service list is indicative and subject to confirmation. Images are illustrative AI-generated visuals.</p>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(null)} aria-label="Close" />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="service-dialog-title"
              className="relative grid max-h-[92svh] w-full max-w-4xl overflow-y-auto bg-ink-2 text-white md:grid-cols-2"
              initial={{ y: 60, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              data-lenis-prevent
            >
              <div className="relative aspect-[4/3] md:aspect-auto">
                <Img base={open.image} width={1280} height={960} sizes="(min-width: 768px) 450px, 100vw" alt="" className="h-full w-full object-cover" />
                <span className="sample-tag absolute bottom-4 left-4">Illustrative visual</span>
              </div>
              <div className="flex flex-col p-8 sm:p-10">
                <p className="eyebrow text-gold">Service</p>
                <h3 id="service-dialog-title" className="mt-5 font-serif text-3xl leading-tight sm:text-4xl">
                  {open.title}
                </h3>
                <p className="mt-5 leading-relaxed text-white/70">{open.text}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/50">
                  Tell us a little about your plans and we’ll get back to you to discuss scope, site and next steps.
                </p>
                <div className="mt-auto pt-10">
                  <button
                    type="button"
                    className="btn-gold w-full sm:w-auto"
                    onClick={() => {
                      const t = open.title
                      setOpen(null)
                      setTimeout(() => startEnquiry(t), 350)
                    }}
                  >
                    <span className="relative z-10">Enquire About This Service</span>
                    <ArrowUpRight className="relative z-10 h-4 w-4" />
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(null)} className="absolute right-3 top-3 grid h-11 w-11 place-items-center bg-ink/70 text-white transition-colors hover:text-gold" aria-label="Close dialog">
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
