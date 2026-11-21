import { site } from '../config/site'
import { asset } from '../lib/asset'

/**
 * LOGO PLACEHOLDER
 * ----------------
 * Set `site.logo.src` (and optionally `site.logo.srcLight`) in
 * src/config/site.ts to show the real logo. Until then a neutral,
 * clearly-marked placeholder box + the company name in type is shown.
 * (No logo is invented.)
 */
export function Logo({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  const src = tone === 'light' ? site.logo.srcLight ?? site.logo.src : site.logo.src
  if (src) return <img src={asset(src)} alt={site.logo.alt} className={`h-10 w-auto ${className}`} />

  const fg = tone === 'light' ? 'text-white' : 'text-ink'
  const border = tone === 'light' ? 'border-white/35' : 'border-ink/30'
  return (
    <span className={`flex items-center gap-3 ${className}`} aria-label={site.name}>
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center border border-dashed ${border} text-[7px] font-semibold uppercase tracking-[0.15em] ${fg} opacity-70`}
        title="Logo placeholder — replace via src/config/site.ts"
        aria-hidden
      >
        Logo
      </span>
      <span className={`flex flex-col leading-none ${fg}`}>
        <span className="font-serif text-[17px] tracking-[0.14em]">TEJAS</span>
        <span className="mt-1 text-[8.5px] font-semibold tracking-[0.34em] opacity-70">CIVIL ASSOCIATES</span>
      </span>
    </span>
  )
}
