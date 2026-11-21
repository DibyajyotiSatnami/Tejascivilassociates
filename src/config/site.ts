/**
 * ============================================================================
 *  TEJAS CIVIL ASSOCIATES — SITE CONTENT & SETTINGS
 * ============================================================================
 *  Almost everything you'll want to change lives in this one file.
 *
 *  ▸ Values set to `null` are PLACEHOLDERS. The site hides them or shows a
 *    neutral "to be confirmed" label until you fill them in.
 *  ▸ Services, strengths and project entries are PROPOSED website content,
 *    not verified company facts. Edit, remove or confirm them with the
 *    company before going live.
 *  ▸ All current images are computer-generated demonstration visuals
 *    (see /scripts/render). Replace them with real photographs by dropping
 *    new files into /public/images and updating the paths below.
 * ============================================================================
 */

export const site = {
  name: 'TEJAS CIVIL ASSOCIATES',
  shortName: 'Tejas Civil Associates',
  category: 'Real Estate Builders & Construction Company',

  /**
   * LOGO — set `src` to the logo file once supplied, e.g. '/logo.svg'
   * (put the file in /public). `srcLight` is an optional version for dark
   * backgrounds. While `src` is null a neutral placeholder is shown.
   */
  logo: {
    src: null as string | null,
    srcLight: null as string | null,
    alt: 'TEJAS CIVIL ASSOCIATES logo',
  },

  address: {
    line1: 'Lachit Borphukan Road',
    line2: 'Christianpatty / Bir',
    city: 'Nagaon',
    state: 'Assam',
    postcode: '782001',
    country: 'India',
  },

  geo: { lat: 26.3523164, lng: 92.6813377 },

  mapsUrl: 'https://www.google.com/maps/place/TEJAS+CIVIL+ASSOCIATES/@26.3523164,92.6813377,17z/',
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=TEJAS%20CIVIL%20ASSOCIATES%2C%20Lachit%20Borphukan%20Road%2C%20Nagaon%2C%20Assam&ll=26.3523164,92.6813377&z=16&output=embed',

  rating: { value: 5.0, count: 1, source: 'Google Maps' },

  hours: {
    label: 'Monday – Saturday',
    time: '9:00 AM – 5:00 PM',
    closed: 'Sunday: Closed',
  },

  /* ---------------------------------------------------------------------- */
  /*  CONTACT PLACEHOLDERS — fill in once confirmed by the company           */
  /* ---------------------------------------------------------------------- */
  /** Display format, e.g. '+91 98xxx xxxxx' */
  phone: null as string | null,
  /** International digits only, no '+' or spaces, e.g. '9198xxxxxxxx'. Enables WhatsApp buttons. */
  whatsapp: null as string | null,
  email: null as string | null,

  social: {
    facebook: null as string | null,
    instagram: null as string | null,
    linkedin: null as string | null,
    youtube: null as string | null,
  },

  /** Public site URL (used for SEO / Open Graph). */
  url: 'https://www.example.com',
}

export const nav = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

/* ------------------------------------------------------------------------ */
/*  SERVICES — PROPOSED categories, not verified company services.           */
/*  Set `enabled: false` to hide a card, or edit the copy.                   */
/* ------------------------------------------------------------------------ */
export const services = [
  {
    id: 'residential',
    enabled: true,
    title: 'Residential Construction',
    text: 'Homes planned around the way you live — from foundation to finishing, with care for materials, light and long-term comfort.',
    image: '/images/service-residential',
  },
  {
    id: 'commercial',
    enabled: true,
    title: 'Commercial Construction',
    text: 'Functional, durable spaces for business — built with attention to structure, circulation and a confident street presence.',
    image: '/images/service-commercial',
  },
  {
    id: 'design',
    enabled: true,
    title: 'Building Design & Planning',
    text: 'Considered layouts and practical planning that turn an idea into a clear, buildable proposal before work begins on site.',
    image: '/images/service-design',
  },
  {
    id: 'civil',
    enabled: true,
    title: 'Civil Engineering Works',
    text: 'Structural and civil works approached methodically, with a focus on soundness, safety and quality of execution.',
    image: '/images/service-civil',
  },
  {
    id: 'renovation',
    enabled: true,
    title: 'Renovation & Development',
    text: 'Giving existing buildings a renewed purpose — upgrades, extensions and redevelopment handled with minimal disruption.',
    image: '/images/service-renovation',
  },
  {
    id: 'consultancy',
    enabled: true,
    title: 'Construction Consultancy',
    text: 'Guidance at the decisions that matter — feasibility, planning and construction approach, explained in plain terms.',
    image: '/images/service-consultancy',
  },
]

/* ------------------------------------------------------------------------ */
/*  PROJECTS — SAMPLE VISUALS ONLY.                                          */
/*  These are computer-generated demonstration images, NOT completed works   */
/*  of the company. Replace with real projects: set `sample: false` and      */
/*  fill in title / location / image / description.                          */
/* ------------------------------------------------------------------------ */
export type ProjectCategory = 'Residential' | 'Commercial' | 'Modern Architecture' | 'Construction Projects'

export const projectCategories: ProjectCategory[] = ['Residential', 'Commercial', 'Modern Architecture', 'Construction Projects']

export const projects: {
  id: string
  sample: boolean
  title: string
  location: string
  category: ProjectCategory
  image: string
  description: string
}[] = [
  {
    id: 'p1',
    sample: true,
    title: 'Project Title — To Be Added',
    location: 'Location to be confirmed',
    category: 'Residential',
    image: '/images/project-residential',
    description: 'Sample visual of a contemporary residence. Actual project photographs and details will replace this placeholder.',
  },
  {
    id: 'p2',
    sample: true,
    title: 'Project Title — To Be Added',
    location: 'Location to be confirmed',
    category: 'Commercial',
    image: '/images/project-commercial',
    description: 'Sample visual of a commercial building. Actual project photographs and details will replace this placeholder.',
  },
  {
    id: 'p3',
    sample: true,
    title: 'Project Title — To Be Added',
    location: 'Location to be confirmed',
    category: 'Modern Architecture',
    image: '/images/project-modern',
    description: 'Sample visual of a modern pavilion-style building. Actual project photographs and details will replace this placeholder.',
  },
  {
    id: 'p4',
    sample: true,
    title: 'Project Title — To Be Added',
    location: 'Location to be confirmed',
    category: 'Construction Projects',
    image: '/images/project-construction',
    description: 'Sample visual of a structure under construction. Actual project photographs and details will replace this placeholder.',
  },
]

/** Gallery strip (sample visuals). */
export const gallery = [
  { src: '/images/hero', alt: 'Sample visual: contemporary residence at dusk' },
  { src: '/images/gallery-interior', alt: 'Sample visual: open-plan living space with garden views' },
  { src: '/images/project-modern', alt: 'Sample visual: modern pavilion beside a reflecting pool' },
  { src: '/images/service-design', alt: 'Sample visual: white architectural massing model' },
  { src: '/images/project-commercial', alt: 'Sample visual: commercial building in golden light' },
  { src: '/images/project-construction', alt: 'Sample visual: concrete frame under construction' },
  { src: '/images/cta', alt: 'Sample visual: commercial building at blue hour' },
]

/* ------------------------------------------------------------------------ */
/*  WHY CHOOSE US — editable, subject to company confirmation.              */
/* ------------------------------------------------------------------------ */
export const strengths = [
  {
    icon: 'gem',
    title: 'Quality-Focused Approach',
    text: 'An emphasis on sound materials, proper workmanship and building it right the first time.',
  },
  {
    icon: 'ruler',
    title: 'Professional Planning',
    text: 'Clear planning before work begins, so decisions are made early and surprises are kept to a minimum.',
  },
  {
    icon: 'scan',
    title: 'Attention to Detail',
    text: 'The junctions, finishes and small decisions that separate an ordinary building from a well-made one.',
  },
  {
    icon: 'users',
    title: 'Client-Centred Solutions',
    text: 'Listening first — shaping each project around the client’s needs, site and budget.',
  },
  {
    icon: 'clock',
    title: 'Commitment to Timely Execution',
    text: 'Working to an agreed programme, with regular communication on progress.',
  },
] as const

export const projectTypes = [
  'Residential Construction',
  'Commercial Construction',
  'Building Design & Planning',
  'Civil Engineering Works',
  'Renovation & Development',
  'Construction Consultancy',
  'Other / Not sure yet',
]

/* ------------------------------------------------------------------------ */
/*  ENQUIRY FORM                                                             */
/*  Submissions are sent through Web3Forms (free) to the company's inbox.   */
/*  1. Get an access key at https://web3forms.com (enter the company email). */
/*  2. Put it in a `.env` file:  VITE_WEB3FORMS_ACCESS_KEY=xxxxxxxx         */
/*  Until a key is set, the form falls back to WhatsApp (if a number is     */
/*  set above) and otherwise shows a clear "not yet connected" message.     */
/* ------------------------------------------------------------------------ */
export const form = {
  web3formsKey: (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined) || null,
  endpoint: 'https://api.web3forms.com/submit',
  subject: 'New website enquiry — TEJAS CIVIL ASSOCIATES',
}

export const fullAddress = `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} – ${site.address.postcode}, ${site.address.country}`

export const whatsappLink = (text: string) => (site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : null)
