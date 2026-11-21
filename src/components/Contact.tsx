import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId, useState } from 'react'
import { ArrowRight, CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, AlertCircle, ExternalLink } from 'lucide-react'
import { form as formCfg, fullAddress, projectTypes, site, whatsappLink } from '../config/site'
import { PREFILL_EVENT } from '../lib/enquiry'
import { Reveal, SplitLines } from './Reveal'

type Values = { name: string; phone: string; email: string; projectType: string; location: string; message: string }
const empty: Values = { name: '', phone: '', email: '', projectType: '', location: '', message: '' }
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success'; via: 'email' | 'whatsapp' } | { kind: 'error'; message: string }

function validate(v: Values) {
  const e: Partial<Record<keyof Values, string>> = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  const digits = v.phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 13) e.phone = 'Please enter a valid phone number.'
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (!v.projectType) e.projectType = 'Please choose a project type.'
  if (v.message.trim().length < 10) e.message = 'Please tell us a little more (at least 10 characters).'
  return e
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      {children}
      <label htmlFor={id} className="pointer-events-none absolute left-0 top-0 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-err`} className="mt-2 text-xs text-red-300" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Contact() {
  const uid = useId()
  const [v, setV] = useState<Values>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({})
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [bot, setBot] = useState(false)
  const [mapOn, setMapOn] = useState(false)

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const t = (e as CustomEvent<{ projectType: string }>).detail?.projectType
      if (t) setV((prev) => ({ ...prev, projectType: projectTypes.includes(t) ? t : prev.projectType }))
    }
    window.addEventListener(PREFILL_EVENT, onPrefill)
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill)
  }, [])

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...v, [k]: e.target.value }
    setV(next)
    if (touched) setErrors(validate(next))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const errs = validate(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    if (bot) return // honeypot filled: silently ignore

    const summary =
      `New enquiry for ${site.name}\n\n` +
      `Name: ${v.name}\nPhone: ${v.phone}\nEmail: ${v.email || '—'}\nProject type: ${v.projectType}\nLocation: ${v.location || '—'}\n\nMessage:\n${v.message}`

    // 1) Web3Forms (email delivery)
    if (formCfg.web3formsKey) {
      setStatus({ kind: 'sending' })
      try {
        const res = await fetch(formCfg.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: formCfg.web3formsKey,
            subject: formCfg.subject,
            from_name: 'Website Enquiry',
            name: v.name,
            phone: v.phone,
            email: v.email || undefined,
            replyto: v.email || undefined,
            project_type: v.projectType,
            project_location: v.location,
            message: v.message,
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || data.success === false) throw new Error(data.message || `Request failed (${res.status})`)
        setStatus({ kind: 'success', via: 'email' })
        setV(empty)
        setTouched(false)
      } catch (err) {
        const wa = whatsappLink(summary)
        setStatus({
          kind: 'error',
          message: `Sorry — your enquiry couldn't be sent (${err instanceof Error ? err.message : 'network error'}). ${wa ? 'You can try again or send it via WhatsApp.' : 'Please try again in a moment.'}`,
        })
      }
      return
    }

    // 2) WhatsApp fallback (when a number is configured)
    const wa = whatsappLink(summary)
    if (wa) {
      window.open(wa, '_blank', 'noopener,noreferrer')
      setStatus({ kind: 'success', via: 'whatsapp' })
      return
    }

    // 3) Nothing configured yet
    if (import.meta.env.DEV) console.warn('[Contact] No form service configured. Set VITE_WEB3FORMS_ACCESS_KEY or site.whatsapp in src/config/site.ts')
    setStatus({
      kind: 'error',
      message: 'Online enquiries are being set up and are not connected yet. Please visit our office during business hours or find us on Google Maps.',
    })
  }

  const err = (k: keyof Values) => (errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${uid}-${k}-err` } : {})
  const waDirect = whatsappLink('Hello TEJAS CIVIL ASSOCIATES, I would like to discuss a project.')

  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32 lg:py-40" aria-labelledby="contact-title">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden />
      <div className="container-site relative">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow text-gold">Contact</p>
          </Reveal>
          <SplitLines id="contact-title" className="heading-lg mt-6" lines={['Tell us about', <em key="e" className="italic text-gold">your project.</em>]} />
        </div>

        <div className="mt-16 grid gap-16 lg:mt-20 lg:grid-cols-12 lg:gap-20">
          {/* details */}
          <div className="space-y-10 lg:col-span-5">
            <Reveal>
              <h3 className="font-serif text-2xl">{site.name}</h3>
              <p className="mt-1 text-sm text-white/50">{site.category}</p>
            </Reveal>
            <ul className="space-y-7">
              <Reveal as="li" delay={0.05} className="flex gap-5">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Address</p>
                  <address className="mt-2 not-italic leading-relaxed text-white/80">
                    {site.address.line1}, {site.address.line2}
                    <br />
                    {site.address.city}, {site.address.state} – {site.address.postcode}, {site.address.country}
                  </address>
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-gold hover:underline">
                    Open in Google Maps <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Reveal>
              <Reveal as="li" delay={0.1} className="flex gap-5">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Business Hours</p>
                  <p className="mt-2 text-white/80">
                    {site.hours.label}: {site.hours.time}
                  </p>
                  <p className="text-sm text-white/45">{site.hours.closed}</p>
                </div>
              </Reveal>
              <Reveal as="li" delay={0.15} className="flex gap-5">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Phone</p>
                  {site.phone ? (
                    <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="mt-2 block text-white/80 hover:text-gold">
                      {site.phone}
                    </a>
                  ) : (
                    <p className="mt-2 text-white/40">Contact number to be added</p>
                  )}
                  {waDirect && (
                    <a href={waDirect} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-gold hover:underline">
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
              </Reveal>
              <Reveal as="li" delay={0.2} className="flex gap-5">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">Email</p>
                  {site.email ? (
                    <a href={`mailto:${site.email}`} className="mt-2 block text-white/80 hover:text-gold">
                      {site.email}
                    </a>
                  ) : (
                    <p className="mt-2 text-white/40">Email address to be added</p>
                  )}
                </div>
              </Reveal>
            </ul>

            {/* map (click-to-load for performance & privacy) */}
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-2 ring-1 ring-white/10">
                {mapOn ? (
                  <iframe
                    title={`Map showing the location of ${site.name}`}
                    src={site.mapsEmbedUrl}
                    className="absolute inset-0 h-full w-full grayscale-[0.6] invert-[0.92] hue-rotate-180 contrast-[0.9]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                ) : (
                  <button type="button" onClick={() => setMapOn(true)} className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="blueprint-grid absolute inset-0 opacity-70" aria-hidden />
                    <span className="relative grid h-16 w-16 place-items-center rounded-full border border-gold/50 text-gold transition-transform duration-500 group-hover:scale-110">
                      <MapPin className="h-6 w-6" />
                      <span className="absolute inset-0 animate-ping rounded-full border border-gold/30" />
                    </span>
                    <span className="relative text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">Load Interactive Map</span>
                    <span className="relative px-6 text-xs text-white/40">{fullAddress}</span>
                  </button>
                )}
              </div>
            </Reveal>
          </div>

          {/* form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <form onSubmit={onSubmit} noValidate className="relative bg-ink-2/80 p-6 ring-1 ring-white/10 backdrop-blur sm:p-10 lg:p-12" aria-describedby={`${uid}-req`}>
              <h3 className="font-serif text-3xl">Send an enquiry</h3>
              <p id={`${uid}-req`} className="mt-2 text-sm text-white/45">
                Fields marked <span className="text-gold">*</span> are required. We’ll respond during business hours.
              </p>

              <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
                <Field id={`${uid}-name`} label="Full Name" required error={errors.name}>
                  <input id={`${uid}-name`} name="name" autoComplete="name" className="field" placeholder="Full Name" value={v.name} onChange={set('name')} {...err('name')} />
                </Field>
                <Field id={`${uid}-phone`} label="Phone Number" required error={errors.phone}>
                  <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" placeholder="Phone Number" value={v.phone} onChange={set('phone')} {...err('phone')} />
                </Field>
                <Field id={`${uid}-email`} label="Email Address" error={errors.email}>
                  <input id={`${uid}-email`} name="email" type="email" autoComplete="email" className="field" placeholder="Email Address" value={v.email} onChange={set('email')} {...err('email')} />
                </Field>
                <Field id={`${uid}-projectType`} label="Project Type" required error={errors.projectType}>
                  <select id={`${uid}-projectType`} name="projectType" className="field appearance-none bg-[length:12px] bg-[right_center] bg-no-repeat pr-6 [&>option]:bg-ink-2" value={v.projectType} onChange={set('projectType')} {...err('projectType')}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23C5A46D' stroke-width='1.4'/%3E%3C/svg%3E\")" }}>
                    <option value="" disabled>
                      Select a project type
                    </option>
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field id={`${uid}-location`} label="Project Location">
                    <input id={`${uid}-location`} name="location" autoComplete="address-level2" className="field" placeholder="Project Location" value={v.location} onChange={set('location')} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field id={`${uid}-message`} label="Message" required error={errors.message}>
                    <textarea id={`${uid}-message`} name="message" rows={4} className="field resize-none" placeholder="Message" value={v.message} onChange={set('message')} {...err('message')} />
                  </Field>
                </div>
                {/* honeypot */}
                <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" onChange={(e) => setBot(e.target.checked)} aria-hidden />
              </div>

              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" className="btn-gold group w-full disabled:opacity-60 sm:w-auto" disabled={status.kind === 'sending'}>
                  <span className="relative z-10">{status.kind === 'sending' ? 'Sending…' : 'Send Enquiry'}</span>
                  {status.kind === 'sending' ? (
                    <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                  )}
                </button>
                <p className="text-xs text-white/35">Your details are used only to respond to your enquiry.</p>
              </div>

              <div aria-live="polite" className="mt-6">
                <AnimatePresence mode="wait">
                  {status.kind === 'success' && (
                    <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 border-l-2 border-gold bg-gold/10 p-4 text-sm text-white/85">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {status.via === 'email'
                        ? 'Thank you — your enquiry has been sent. We’ll be in touch soon.'
                        : 'WhatsApp has opened with your enquiry pre-filled — just tap send to reach us.'}
                    </motion.p>
                  )}
                  {status.kind === 'error' && (
                    <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 border-l-2 border-red-400 bg-red-400/10 p-4 text-sm text-white/85" role="alert">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                      {status.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
