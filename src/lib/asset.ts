/**
 * Prefix a root-relative public path ('/images/x') with Vite's base URL so the
 * site works both at a domain root and under a sub-path (e.g. GitHub Pages).
 */
export const asset = (path: string) => (path.startsWith('/') ? import.meta.env.BASE_URL.replace(/\/$/, '') + path : path)
