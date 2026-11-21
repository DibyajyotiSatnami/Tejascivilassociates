import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import { ArrowUpRight, MapPin, Info } from 'lucide-react'
import { gallery, projectCategories, projects, type ProjectCategory } from '../config/site'
import { Img } from './Img'
import { Lightbox, type LightboxItem } from './Lightbox'
import { Reveal, SplitLines } from './Reveal'

const ease = [0.22, 1, 0.36, 1] as const

export function Projects() {
  const [filter, setFilter] = useState<'All' | ProjectCategory>('All')
  const [lbItems, setLbItems] = useState<LightboxItem[]>([])
  const [lbIndex, setLbIndex] = useState<number | null>(null)
  const strip = useRef<HTMLDivElement>(null)

  const shown = useMemo(() => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)), [filter])
  const anySample = projects.some((p) => p.sample)

  const projectItems: LightboxItem[] = shown.map((p) => ({
    src: p.image,
    alt: p.description,
    title: p.title,
    meta: `${p.category} · ${p.location}`,
    note: p.sample ? `${p.description} (Sample visual — not a completed project.)` : p.description,
  }))
  const galleryItems: LightboxItem[] = gallery.map((g) => ({ src: g.src, alt: g.alt, note: `${g.alt}.` }))

  const openProject = (i: number) => {
    setLbItems(projectItems)
    setLbIndex(i)
  }
  const openGallery = (i: number) => {
    setLbItems(galleryItems)
    setLbIndex(i)
  }

  const scrollStrip = (dir: number) => strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.7, behavior: 'smooth' })

  return (
    <section id="projects" className="relative bg-bone py-24 sm:py-32 lg:py-40" aria-labelledby="projects-title">
      <div className="container-site">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow text-gold-dark">Featured Projects</p>
            </Reveal>
            <SplitLines id="projects-title" className="heading-lg mt-6 text-ink" lines={['Spaces shaped', <em key="e" className="italic text-gold-dark">with intent.</em>]} />
          </div>
          <Reveal delay={0.1}>
            <div role="tablist" aria-label="Filter projects by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
              {(['All', ...projectCategories] as const).map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={filter === c}
                  onClick={() => setFilter(c)}
                  className={`relative shrink-0 whitespace-nowrap border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                    filter === c ? 'border-ink bg-ink text-white' : 'border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {anySample && (
          <Reveal delay={0.1}>
            <p className="mt-8 flex items-start gap-3 border-l-2 border-gold bg-white/60 px-5 py-4 text-sm text-text/75">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
              <span>
                <strong className="font-semibold text-ink">Sample visuals.</strong> The images below are computer-generated demonstrations, not completed projects
                of the company. Actual project photographs and details will be added soon.
              </span>
            </p>
          </Reveal>
        )}

        <motion.div layout className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.8, ease, delay: i * 0.06 }}
                className={`group relative overflow-hidden bg-ink ${shown.length > 2 && i % 3 === 0 ? 'md:col-span-2' : ''}`}
              >
                <button type="button" onClick={() => openProject(i)} className="block w-full text-left" aria-label={`View project: ${p.title}, ${p.category}`}>
                  <div className={`relative overflow-hidden ${shown.length > 2 && i % 3 === 0 ? 'aspect-[4/3] md:aspect-[21/9]' : 'aspect-[4/3]'}`}>
                    <Img
                      base={p.image}
                      width={1800}
                      height={1200}
                      sizes={shown.length > 2 && i % 3 === 0 ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                      alt={p.description}
                      className="h-full w-full object-cover transition-transform duration-[1.6s] ease-premium group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
                    {p.sample && <span className="sample-tag absolute left-5 top-5">Sample visual</span>}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-white sm:p-8">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{p.category}</p>
                      <h3 className="mt-2 font-serif text-2xl sm:text-3xl">{p.title}</h3>
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-white/65">
                        <MapPin className="h-3.5 w-3.5" aria-hidden /> {p.location}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                      <span className="hidden translate-x-3 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:inline">View Project</span>
                      <span className="grid h-12 w-12 place-items-center rounded-full border border-white/30 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </span>
                  </div>
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* gallery strip */}
      <div className="mt-24 lg:mt-32">
        <div className="container-site flex items-end justify-between gap-6">
          <Reveal>
            <h3 className="font-serif text-3xl text-ink sm:text-4xl">Gallery</h3>
            <p className="mt-2 text-sm text-text/60">Illustrative visuals · drag or scroll to explore</p>
          </Reveal>
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => scrollStrip(-1)} className="grid h-12 w-12 place-items-center border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-white" aria-label="Scroll gallery left">
              ←
            </button>
            <button type="button" onClick={() => scrollStrip(1)} className="grid h-12 w-12 place-items-center border border-ink/20 transition-colors hover:border-ink hover:bg-ink hover:text-white" aria-label="Scroll gallery right">
              →
            </button>
          </div>
        </div>
        <div
          ref={strip}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:gap-6 sm:px-8 lg:px-14 [&::-webkit-scrollbar]:hidden"
          data-lenis-prevent-wheel
        >
          {gallery.map((g, i) => (
            <motion.button
              type="button"
              key={g.src}
              onClick={() => openGallery(i)}
              className="group relative aspect-[4/3] w-[78vw] shrink-0 snap-start overflow-hidden bg-ink sm:w-[46vw] lg:w-[34vw]"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease, delay: Math.min(i, 3) * 0.08 }}
              aria-label={`Open image: ${g.alt}`}
            >
              <Img base={g.src} width={1800} height={1200} sizes="(min-width: 1024px) 34vw, 78vw" alt={g.alt} className="h-full w-full object-cover transition-all duration-[1.4s] ease-premium group-hover:scale-110" />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
            </motion.button>
          ))}
        </div>
      </div>

      <Lightbox items={lbItems} index={lbIndex} onChange={setLbIndex} onClose={() => setLbIndex(null)} />
    </section>
  )
}
