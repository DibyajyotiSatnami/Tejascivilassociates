import { motion } from 'framer-motion'
import { ArrowUp, ExternalLink } from 'lucide-react'
import type { SVGProps } from 'react'

// Minimal brand glyphs (lucide no longer ships brand icons)
const svg = (d: string) => (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d={d} />
  </svg>
)
const Facebook = svg('M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z')
const Instagram = svg('M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 3.8c2.7 0 3 0 4 .1 2.7.1 4 1.4 4.1 4.1.1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.7-1.4 4-4.1 4.1-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.7-.1-4-1.4-4.1-4.1-.1-1-.1-1.3-.1-4s0-3 .1-4C4 5.3 5.3 4 8 3.9c1-.1 1.3-.1 4-.1z')
const Linkedin = svg('M6.9 8.9H3.6V20h3.3V8.9zM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 13.6c0-3-.6-5-4.1-5-1.7 0-2.8.9-3.2 1.8V8.9H9.9V20h3.3v-5.5c0-1.4.3-2.8 2-2.8s1.7 1.6 1.7 2.9V20h3.4v-6.4z')
const Youtube = svg('M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z')
import { nav, services, site } from '../config/site'
import { startEnquiry } from '../lib/enquiry'
import { scrollToHash } from '../lib/scroll'
import { Logo } from './Logo'

const socials = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { key: 'youtube', label: 'YouTube', Icon: Youtube },
] as const

export function Footer() {
  const go = (h: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToHash(h)
  }
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-[#051530] pt-20 text-white/70 sm:pt-28">
      {/* animated gold line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-gold to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden />

      <div className="container-site relative">
        <div className="grid gap-14 pb-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-7 max-w-sm text-sm leading-relaxed text-white/55">
              {site.name} — {site.category.toLowerCase()} based in {site.address.city}, {site.address.state}. Thoughtful construction, modern architecture and
              a foundation built on trust.
            </p>
            <div className="mt-8 flex gap-3">
              {socials.map(({ key, label, Icon }) => {
                const href = site.social[key]
                return href ? (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:text-gold">
                    <Icon className="h-4 w-4" />
                  </a>
                ) : (
                  <span key={key} title={`${label} link to be added`} aria-label={`${label} (link to be added)`} className="grid h-10 w-10 cursor-default place-items-center rounded-full border border-dashed border-white/10 text-white/25">
                    <Icon className="h-4 w-4" />
                  </span>
                )
              })}
            </div>
          </div>

          <nav className="lg:col-span-2" aria-label="Footer">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Explore</p>
            <ul className="mt-6 space-y-3 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} onClick={go(n.href)} className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                    <span className="h-px w-0 bg-gold transition-all duration-500 group-hover:w-4" />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Services</p>
            <ul className="mt-6 space-y-3 text-sm">
              {services
                .filter((s) => s.enabled)
                .map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => startEnquiry(s.title)} className="group inline-flex items-center gap-2 text-left transition-colors hover:text-white">
                      <span className="h-px w-0 bg-gold transition-all duration-500 group-hover:w-4" />
                      {s.title}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">Visit</p>
            <address className="mt-6 text-sm not-italic leading-relaxed">
              {site.address.line1}, {site.address.line2}
              <br />
              {site.address.city}, {site.address.state} – {site.address.postcode}
              <br />
              {site.address.country}
            </address>
            <p className="mt-4 text-sm">
              {site.hours.label}
              <br />
              {site.hours.time}
            </p>
            <p className="mt-4 text-sm">{site.phone ?? <span className="text-white/35">Phone: to be added</span>}</p>
            <p className="text-sm">{site.email ?? <span className="text-white/35">Email: to be added</span>}</p>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-gold hover:underline">
              View on Google Maps <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* oversized wordmark */}
        <p aria-hidden className="select-none whitespace-nowrap text-center font-serif text-[13vw] leading-[0.8] tracking-[0.02em] text-white/[0.04]">
          TEJAS CIVIL
        </p>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-white/40 sm:flex-row">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="text-center">Visuals shown are illustrative (AI-generated or computer-rendered).</p>
          <a href="#home" onClick={go('#home')} className="group inline-flex items-center gap-2 uppercase tracking-[0.2em] transition-colors hover:text-gold">
            Back to top
            <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-gold">
              <ArrowUp className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}
