import { useCallback, useEffect, useState } from 'react'
import { About } from './components/About'
import { Architecture } from './components/Architecture'
import { Contact } from './components/Contact'
import { CTA } from './components/CTA'
import { Cursor } from './components/Cursor'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Loader } from './components/Loader'
import { Navbar } from './components/Navbar'
import { Projects } from './components/Projects'
import { Services } from './components/Services'
import { WhyUs } from './components/WhyUs'
import { initSmoothScroll, lockScroll, ScrollTrigger, scrollToHash } from './lib/scroll'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    lockScroll(true)
    initSmoothScroll()
    lockScroll(true)
  }, [])

  const onLoaded = useCallback(() => {
    setReady(true)
    lockScroll(false)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (location.hash && location.hash !== '#home') setTimeout(() => scrollToHash(location.hash), 300)
    })
  }, [])

  // refresh scroll measurements once images/fonts settle
  useEffect(() => {
    const r = () => ScrollTrigger.refresh()
    window.addEventListener('load', r)
    document.fonts?.ready.then(r)
    return () => window.removeEventListener('load', r)
  }, [])

  return (
    <>
      <a href="#main" className="sr-only z-[200] bg-gold px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Loader onDone={onLoaded} />
      <Cursor />
      <Navbar />
      <main id="main">
        <Hero ready={ready} />
        <About />
        <Services />
        <Projects />
        <WhyUs />
        <Architecture />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
