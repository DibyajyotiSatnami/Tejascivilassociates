import type { ImgHTMLAttributes } from 'react'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  /** Base path without extension, e.g. '/images/hero'. Expects `<base>.webp` and `<base>-sm.webp`. */
  base: string
  /** CSS sizes attribute; defaults to full width */
  sizes?: string
  priority?: boolean
  /** intrinsic size of the large asset, used for layout stability */
  width?: number
  height?: number
}

/**
 * Responsive image: serves a ~half-size variant to small screens.
 * To use a real photograph, export `<name>.webp` (large) and
 * `<name>-sm.webp` (about half the width) into /public/images.
 */
export function Img({ base, sizes = '100vw', priority, alt = '', width = 1800, height = 1200, ...rest }: Props) {
  return (
    <img
      src={`${base}.webp`}
      srcSet={`${base}-sm.webp ${Math.round(width / 2)}w, ${base}.webp ${width}w`}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      draggable={false}
      {...rest}
    />
  )
}
