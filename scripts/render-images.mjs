/**
 * Renders the procedural demonstration visuals in scripts/render/ to
 * public/images/*.webp using headless Chromium.
 *
 *   node scripts/render-images.mjs            # all shots
 *   node scripts/render-images.mjs villa-dusk # one shot
 */
import { createServer } from 'vite'
import { createRequire } from 'node:module'
const { chromium } = createRequire(import.meta.url)('playwright')
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))
const out = path.resolve(root, '../public/images')
mkdirSync(out, { recursive: true })

// name, shot, width, height (final output size; rendered at SS x)
const JOBS = [
  ['hero', 'villa-dusk', 2400, 1350],
  ['about', 'villa-portrait', 1200, 1500],
  ['service-residential', 'villa-day', 1200, 900],
  ['service-commercial', 'tower-night', 1200, 900],
  ['service-design', 'model', 1200, 900],
  ['service-civil', 'frame-detail', 1200, 900],
  ['service-renovation', 'renovation', 1200, 900],
  ['service-consultancy', 'aerial', 1200, 900],
  ['project-residential', 'villa-day', 1800, 1200],
  ['project-commercial', 'tower-gold', 1800, 1200],
  ['project-modern', 'pavilion', 1800, 1200],
  ['project-construction', 'frame-day', 1800, 1200],
  ['gallery-interior', 'interior', 1800, 1200],
  ['cta', 'tower-wide', 2400, 1350],
  ['og', 'villa-dusk', 1200, 630],
]
const SS = Number(process.env.SS ?? 1.5)
const only = process.argv.slice(2)

const server = await createServer({ root: path.join(root, 'render'), server: { port: 5199 }, logLevel: 'error' })
await server.listen()
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
for (const [name, shot, w, h] of JOBS) {
  if (only.length && !only.includes(name) && !only.includes(shot)) continue
  const rw = Math.round(w * SS), rh = Math.round(h * SS)
  const page = await browser.newPage({ viewport: { width: rw, height: rh } })
  page.on('console', (m) => m.type() === 'error' && console.error(name, m.text()))
  const t = Date.now()
  await page.goto(`http://localhost:5199/?shot=${shot}&w=${rw}&h=${rh}`)
  await page.waitForFunction(() => window.__done || window.__error, null, { timeout: 600000 })
  const err = await page.evaluate(() => window.__error)
  if (err) throw new Error(`${name}: ${err}`)
  const data = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/png'))
  const buf = Buffer.from(data.split(',')[1], 'base64')
  const img = sharp(buf).resize(w, h, { kernel: 'lanczos3' })
  if (name === 'og') await img.jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(out, `${name}.jpg`))
  else {
    await img.clone().webp({ quality: 78 }).toFile(path.join(out, `${name}.webp`))
    // small responsive variant for mobile
    if (w > 1000) await sharp(buf).resize(Math.round(w / 2)).webp({ quality: 74 }).toFile(path.join(out, `${name}-sm.webp`))
  }
  console.log(`✓ ${name} (${shot}) ${((Date.now() - t) / 1000).toFixed(1)}s`)
  await page.close()
}
await browser.close()
await server.close()
