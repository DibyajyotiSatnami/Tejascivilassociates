import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { lockScroll } from '../lib/scroll'
import { asset } from '../lib/asset'

export type LightboxItem = { src: string; alt: string; title?: string; meta?: string; note?: string }

export function Lightbox({ items, index, onChange, onClose }: { items: LightboxItem[]; index: number | null; onChange: (i: number) => void; onClose: () => void }) {
  const open = index !== null
  const prev = useCallback(() => index !== null && onChange((index - 1 + items.length) % items.length), [index, items.length, onChange])
  const next = useCallback(() => index !== null && onChange((index + 1) % items.length), [index, items.length, onChange])

  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, prev, next])

  const item = index !== null ? items[index] : null

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95 text-white backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title ?? item.alt}
          data-lenis-prevent
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <span className="font-serif text-sm text-white/60 tabular-nums">
              {String(index! + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center transition-colors hover:text-gold" aria-label="Close viewer">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-20">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={item.src}
                src={asset(`${item.src}.webp`)}
                alt={item.alt}
                className="max-h-full max-w-full object-contain shadow-2xl"
                initial={{ opacity: 0, scale: 0.96, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -40 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) next()
                  else if (info.offset.x > 60) prev()
                }}
              />
            </AnimatePresence>
            {items.length > 1 && (
              <>
                <button type="button" onClick={prev} className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/15 bg-ink/60 transition-colors hover:border-gold hover:text-gold sm:left-6" aria-label="Previous image">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={next} className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-white/15 bg-ink/60 transition-colors hover:border-gold hover:text-gold sm:right-6" aria-label="Next image">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          <div className="px-5 pb-6 pt-4 text-center sm:px-8">
            {item.title && <p className="font-serif text-xl">{item.title}</p>}
            {item.meta && <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">{item.meta}</p>}
            <p className="mx-auto mt-2 max-w-2xl text-sm text-white/55">{item.note ?? item.alt}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
