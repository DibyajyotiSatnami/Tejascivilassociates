import { motion } from 'framer-motion'
import { Clock, Gem, Ruler, ScanSearch, Users, type LucideIcon } from 'lucide-react'
import { strengths } from '../config/site'
import { Reveal, SplitLines } from './Reveal'

const icons: Record<string, LucideIcon> = { gem: Gem, ruler: Ruler, scan: ScanSearch, users: Users, clock: Clock }

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-bone-2 py-24 sm:py-32 lg:py-40" aria-labelledby="why-title">
      {/* large outlined word */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -right-10 top-10 select-none font-serif text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(17,19,21,0.06)]"
        initial={{ x: 120 }}
        whileInView={{ x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        Trust
      </motion.span>

      <div className="container-site relative grid gap-16 lg:grid-cols-12">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <Reveal>
            <p className="eyebrow text-gold-dark">Why Choose Us</p>
          </Reveal>
          <SplitLines id="why-title" className="heading-lg mt-6 text-ink" lines={['A foundation', <em key="e" className="italic text-gold-dark">built on trust.</em>]} />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md leading-relaxed text-text/70">
              The principles that guide how we approach every project, large or small.
            </p>
          </Reveal>
        </div>

        <ol className="lg:col-span-7">
          {strengths.map((s, i) => {
            const Icon = icons[s.icon] ?? Gem
            return (
              <Reveal as="li" key={s.title} delay={i * 0.05} className="group relative border-t border-ink/10 py-9 last:border-b sm:py-10">
                <span className="absolute left-0 top-0 h-px w-0 bg-gold transition-all duration-1000 ease-premium group-hover:w-full" aria-hidden />
                <div className="grid grid-cols-[auto_1fr] items-start gap-6 sm:grid-cols-[auto_auto_1fr] sm:gap-10">
                  <span className="hidden pt-2 font-serif text-sm text-ink/40 sm:block">0{i + 1}</span>
                  <motion.span
                    className="grid h-14 w-14 place-items-center rounded-full border border-ink/15 text-gold-dark transition-colors duration-500 group-hover:border-gold group-hover:bg-ink group-hover:text-gold"
                    initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
                    whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.15 + i * 0.05 }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.4} aria-hidden />
                  </motion.span>
                  <div>
                    <h3 className="font-serif text-2xl text-ink sm:text-[1.7rem]">{s.title}</h3>
                    <p className="mt-3 max-w-lg leading-relaxed text-text/65">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
