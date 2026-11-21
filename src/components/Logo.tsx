import { site } from '../config/site'
import { asset } from '../lib/asset'

/**
 * Company logo: the circular badge (site.logo.src) plus a typographic
 * wordmark that stays legible at navbar size. Set `wordmark={false}` to show
 * the badge alone. If `site.logo.src` is null a neutral placeholder is shown.
 */
export function Logo({
  tone = 'light',
  className = '',
  size = 44,
  wordmark = true,
}: {
  tone?: 'light' | 'dark'
  className?: string
  size?: number
  wordmark?: boolean
}) {
  const src = tone === 'light' ? site.logo.srcLight ?? site.logo.src : site.logo.src
  const fg = tone === 'light' ? 'text-white' : 'text-navy'
  const sub = tone === 'light' ? 'text-white/70' : 'text-stone'

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      {src ? (
        <img
          src={asset(src)}
          alt={wordmark ? '' : site.logo.alt}
          width={size}
          height={size}
          className="shrink-0 rounded-full shadow-[0_6px_20px_-6px_rgba(0,0,0,0.5)] ring-1 ring-white/20"
          style={{ width: size, height: size }}
          decoding="async"
        />
      ) : (
        <span
          className="grid shrink-0 place-items-center border border-dashed border-current text-[7px] font-semibold uppercase tracking-[0.15em] opacity-70"
          style={{ width: size, height: size }}
          title="Logo placeholder — set site.logo.src in src/config/site.ts"
          aria-hidden
        >
          Logo
        </span>
      )}
      {wordmark && (
        <span className={`flex flex-col leading-none ${fg}`} aria-label={site.name}>
          <span className="font-serif text-[19px] font-bold tracking-[0.12em]">TEJAS</span>
          <span className={`mt-1 flex items-center gap-1.5 text-[8.5px] font-semibold tracking-[0.3em] ${sub}`}>
            <span className="h-px w-2.5 bg-gold" aria-hidden />
            CIVIL ASSOCIATES
            <span className="h-px w-2.5 bg-gold" aria-hidden />
          </span>
        </span>
      )}
    </span>
  )
}
