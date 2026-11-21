# TEJAS CIVIL ASSOCIATES — Website

Premium, fully responsive website for **TEJAS CIVIL ASSOCIATES**, Real Estate Builders & Construction Company,
Lachit Borphukan Road, Christianpatty/Bir, Nagaon, Assam – 782001.

Built with **React + TypeScript + Vite**, **Tailwind CSS**, **Framer Motion**, **GSAP ScrollTrigger**, **Lenis** smooth scrolling,
**Three.js** (lazy-loaded interactive 3D building) and **Lucide** icons.

```bash
npm install
npm run dev       # local development
npm run build     # production build → dist/
npm run preview   # preview the production build
```

Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, cPanel, etc.).

---

## Where to edit content

Almost everything lives in **`src/config/site.ts`**:

| What | Where |
| --- | --- |
| Logo | `site.logo.src` / `site.logo.srcLight` → put the file in `/public` (e.g. `/logo.svg`). Until set, a clearly marked placeholder is shown. Also replace `public/favicon.svg`. |
| Phone, WhatsApp, email | `site.phone`, `site.whatsapp` (digits only, e.g. `9198xxxxxxxx`), `site.email` — `null` = shown as “to be added”. Setting `whatsapp` enables WhatsApp buttons. |
| Social links | `site.social.*` |
| Services | `services[]` — **proposed categories, not verified**. Edit copy or set `enabled: false`. |
| Projects | `projects[]` — currently **sample visuals**. For a real project, set `sample: false` and fill title, location, image, description. |
| Gallery | `gallery[]` |
| “Why choose us” | `strengths[]` — editable, subject to company confirmation. |
| Live domain | `site.url` + the `example.com` URLs in `index.html`, `public/robots.txt`, `public/sitemap.xml`. |

No phone numbers, emails, project names, testimonials, awards or history have been invented.

## Enquiry form (working backend)

The form posts to **[Web3Forms](https://web3forms.com)** (free, no server needed), which emails each enquiry to the company.

1. Go to web3forms.com, enter the company’s email address, and copy the access key.
2. Create `.env` (see `.env.example`):
   ```
   VITE_WEB3FORMS_ACCESS_KEY=your-key-here
   ```
   On Netlify/Vercel add the same variable in the dashboard, then rebuild.

Behaviour: client-side validation, honeypot spam protection, loading/success/error states.
If no key is set but `site.whatsapp` is, the form opens WhatsApp with the enquiry pre-filled.
If neither is set, it shows a clear “not yet connected” message (it never pretends to send).

## Images

All current images in `public/images` are **computer-generated demonstration renders** produced by
`scripts/render/` (procedural Three.js scenes rendered in headless Chromium). They are labelled on the site as
illustrative/sample visuals and are **not** presented as the company’s completed projects.

To replace with real photographs, export each as `name.webp` (≈1800–2400 px wide) plus `name-sm.webp`
(≈ half width) into `public/images/` using the same names, or change the paths in `site.ts`.

Re-render the demo visuals: `node scripts/render-images.mjs` (requires Playwright + Chromium).

## Performance & accessibility notes

- Hero image is preloaded; all other images are lazy-loaded with responsive `srcset`.
- Three.js (≈135 KB gzipped) is loaded only when the visitor approaches the 3D section, and rendering pauses when it is off-screen.
- Google Map loads on click (faster first load, no third-party requests until needed).
- Self-hosted fonts (Playfair Display, Manrope), semantic landmarks, skip link, keyboard-accessible menus/dialogs, visible focus styles.
- `prefers-reduced-motion` disables smooth scrolling, parallax and pinned animations.
- SEO: title/description, Open Graph & Twitter cards, `GeneralContractor` JSON-LD with address, geo and opening hours, robots.txt, sitemap.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages on every push to `main`
(and the current feature branch), or manually from the **Actions** tab. The site is served at
`https://<owner>.github.io/<repo>/`; asset paths adapt automatically via Vite's `base`.
To send enquiries by email from the live site, add a repository secret `VITE_WEB3FORMS_ACCESS_KEY`
(Settings → Secrets and variables → Actions) and re-run the workflow.
For a custom domain, set it under Settings → Pages and build with `--base=/`.
