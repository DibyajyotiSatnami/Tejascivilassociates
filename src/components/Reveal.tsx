import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode, ElementType } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

// cache motion components so they aren't recreated on every render
const motionCache = new Map<ElementType, ElementType>()
function motionTag(as: ElementType): ElementType {
  if (!motionCache.has(as)) motionCache.set(as, motion.create(as as 'div'))
  return motionCache.get(as)!
}

/** Fade/slide-up reveal when scrolled into view. */
export function Reveal({ children, delay = 0, y = 32, className = '', as = 'div' }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: ElementType }) {
  const reduce = useReducedMotion()
  const MotionTag = motionTag(as) as typeof motion.div
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </MotionTag>
  )
}

const lineVariants: Variants = {
  hidden: { y: '110%' },
  show: (c: { i: number; d: number }) => ({ y: '0%', transition: { duration: 1.2, ease, delay: c.d + c.i * 0.09 } }),
}

/**
 * Masked line-by-line text reveal. Pass lines as an array; each line slides
 * up from behind a mask.
 */
export function SplitLines({
  lines,
  className = '',
  lineClassName = '',
  as: Tag = 'h2',
  trigger = 'view',
  delay = 0,
  id,
}: {
  id?: string
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  as?: ElementType
  trigger?: 'view' | 'mount'
  delay?: number
}) {
  const reduce = useReducedMotion()
  const animateProps = trigger === 'mount' ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } }
  return (
    <Tag className={className} id={id}>
      <motion.span className="block" initial={reduce ? false : 'hidden'} {...animateProps}>
        {lines.map((l, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <motion.span className={`block ${lineClassName}`} variants={lineVariants} custom={{ i, d: delay }}>
              {l}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
