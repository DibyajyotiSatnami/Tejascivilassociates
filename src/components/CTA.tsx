import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { whatsappLink } from '../config/site'
import { startEnquiry } from '../lib/enquiry'
import { gsap } from '../lib/scroll'
import { Img } from './Img'
import { Reveal, SplitLines } from './Reveal'
import { SunRays } from './SunRays'

export function CTA() {
  const wrap = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const wa = whatsappLink('Hello TEJAS CIVIL ASSOCIATES, I would like to discuss a project.')

  useEffect(() => {
    if (reduce || !wrap.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(wrap.current, { yPercent: -12 }, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: wrap.current!.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    return () => ctx.revert()
  }, [reduce])

  return (
    <section className="relative overflow-hidden bg-ink py-32 text-white sm:py-40 lg:py-52" aria-labelledby="cta-title">
      <div ref={wrap} className="absolute -inset-y-[15%] inset-x-0">
        <Img base="/images/cta" width={2400} height={1350} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-ink/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      <div className="grain absolute inset-0" />
      <SunRays className="absolute bottom-0 left-1/2 w-[1000px] max-w-none -translate-x-1/2" opacity={0.4} />

      <div className="container-site relative text-center">
        <Reveal>
          <p className="eyebrow justify-center text-gold">Start a Conversation</p>
        </Reveal>
        <SplitLines id="cta-title" className="heading-xl mx-auto mt-8 max-w-5xl" lines={["Let's build something", <em key="e" className="italic text-gold">exceptional.</em>]} />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/70">
            Have a project in mind? Let’s discuss your vision and explore how we can bring it to life.
          </p>
        </Reveal>
        <Reveal delay={0.25} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button type="button" onClick={() => startEnquiry()} className="btn-gold group">
            <span className="relative z-10">Start Your Project</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </button>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
          )}
        </Reveal>
      </div>
    </section>
  )
}
