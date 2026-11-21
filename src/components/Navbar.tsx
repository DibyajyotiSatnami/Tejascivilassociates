import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MapPin, Clock, ArrowUpRight } from 'lucide-react'
import { nav, site } from '../config/site'
import { lockScroll, scrollToHash } from '../lib/scroll'
import { Logo } from './Logo'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // active section highlight
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1))
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    lockScroll(open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // wait for menu close before scrolling on mobile
    setTimeout(() => scrollToHash(href), open ? 450 : 0)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-premium ${
          scrolled && !open ? 'bg-ink/85 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl' : 'bg-transparent py-5 lg:py-7'
        }`}
      >
        <div className="container-site flex items-center justify-between">
          <a href="#home" onClick={go('#home')} className="relative z-10" aria-label={`${site.name} — home`}>
            <Logo tone="light" />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={go(n.href)}
                    className={`group relative py-2 text-[12px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 ${
                      active === n.href ? 'text-gold' : 'text-white/80 hover:text-white'
                    }`}
                    aria-current={active === n.href ? 'true' : undefined}
                  >
                    {n.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-500 ease-premium ${active === n.href ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <a href="#contact" onClick={go('#contact')} className="btn-gold hidden !px-6 !py-3 sm:inline-flex">
              <span className="relative z-10">Get a Quote</span>
            </a>
            <button
              type="button"
              className="relative z-10 grid h-11 w-11 place-items-center lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span className="relative block h-3 w-7">
                <span className={`absolute left-0 top-0 h-px w-7 bg-white transition-all duration-500 ease-premium ${open ? 'top-1.5 rotate-45' : ''}`} />
                <span className={`absolute bottom-0 right-0 h-px bg-white transition-all duration-500 ease-premium ${open ? 'bottom-1.5 w-7 -rotate-45' : 'w-5'}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink text-white lg:hidden"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 44px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="blueprint-grid absolute inset-0 opacity-30" aria-hidden />
            <nav className="container-site relative flex flex-1 flex-col justify-center" aria-label="Mobile">
              <ul className="space-y-2">
                {nav.map((n, i) => (
                  <li key={n.href} className="overflow-hidden">
                    <motion.a
                      href={n.href}
                      onClick={go(n.href)}
                      className="flex items-baseline gap-4 py-2 font-serif text-[2.6rem] leading-tight sm:text-6xl"
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="font-sans text-xs text-gold">0{i + 1}</span>
                      <span className={active === n.href ? 'text-gold' : ''}>{n.label}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
              <motion.a
                href="#contact"
                onClick={go('#contact')}
                className="btn-gold mt-10 self-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="relative z-10">Get a Quote</span>
                <ArrowUpRight className="relative z-10 h-4 w-4" />
              </motion.a>
            </nav>
            <motion.div className="container-site relative space-y-2 pb-10 text-sm text-white/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> {site.address.city}, {site.address.state}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold" /> {site.hours.label}, {site.hours.time}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
