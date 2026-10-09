/* ============================================================================
 *  PORTFOLIO CONTENT — SINGLE SOURCE OF TRUTH
 * ----------------------------------------------------------------------------
 *  Everything on the site renders from this file.
 *
 *  RULE: this file contains only information Ahmed has supplied. No invented
 *  employers, clients, testimonials, statistics, dates or credentials. Anything
 *  that is genuinely unknown is left as an explicit TODO rather than filled in
 *  with a plausible guess.
 *
 *  Icons are referenced as Lucide components, so adding an icon anywhere else
 *  means importing it here and naming it — no icon registry to keep in sync.
 *  Search for "TODO" to find every spot that needs input.
 * ==========================================================================*/

import {
  ArrowRight,
  Brain,
  Briefcase,
  Cloud,
  ExternalLink,
  FolderGit2,
  FlaskConical,
  Gauge,
  Globe,
  House,
  Layers,
  Layout,
  Mail,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
} from 'lucide-react'

import portrait from '@/assets/portrait.jpg'
import aiChatbotImage from '@/assets/projects/ai-chatbot.jpg'
import balochistanServicesImage from '@/assets/projects/balochistan-services.jpg'
import canadaEximImage from '@/assets/projects/canada-exim.jpg'
import ecommerceSiteImage from '@/assets/projects/ecommerce-site.jpg'
import weatherAppImage from '@/assets/projects/weather-app.jpg'

/* ---------------------------------------------------------------------------
 *  PROFILE
 * -------------------------------------------------------------------------*/
export const profile = {
  name: 'Ahmed Khan',
  role: 'Full-Stack Developer',
  /** Rendered after the role, wrapped in the accent colour. */
  roleAccent: '& AI Engineer',
  email: 'hello.ahmed.code@gmail.com',
  status: 'Available',
  location: 'Available Worldwide',
  work: 'Available for freelance and full-time work',
  portrait,
  portraitAlt: 'Portrait of Ahmed Khan',
  /* Kept short because it has to sit on one line inside the card at every
     width, including the narrowest phone. The hero CTAs below carry the longer,
     more expressive phrasing. */
  hireMeLabel: 'Hire Me',
  whatsapp: '923333558317',
}

/* ---------------------------------------------------------------------------
 *  SOCIALS
 *  `icon` resolves against the four marks in src/components/BrandIcon.jsx.
 *
 *  TODO(ahmed): these URLs are intentionally empty. Add your real profile
 *  URLs and the icons turn into live links on their own — no component
 *  changes needed. While `url` is empty the icon renders as an inert,
 *  non-focusable element (no href), so there are no dead links on the page.
 * -------------------------------------------------------------------------*/
export const socials = [
  { label: 'GitHub', icon: 'github', url: 'https://github.com/ahmedkhan-web' },
  { label: 'LinkedIn', icon: 'linkedin', url: '' }, // TODO: https://linkedin.com/in/<your-handle>
  { label: 'X', icon: 'x', url: '' }, // TODO: https://x.com/<your-handle>
  { label: 'WhatsApp', icon: 'whatsapp', url: `https://wa.me/${profile.whatsapp}` },
]

/* ---------------------------------------------------------------------------
 *  SECTION NAVIGATION — the slim rail on the right.
 *  `id` doubles as the anchor target and the label shown in the tooltip.
 *  Adding a section is one line here plus its <section> — there is no scroll
 *  container to wire up, because the document is the only scroller and every
 *  section is already in its flow. TODO(ahmed): projects, ai-lab and contact are
 *  the remaining three; their icons are imported and ready below.
 * -------------------------------------------------------------------------*/
/* The rail lists exactly the sections that exist on the page. Sections that are
   not built yet are left out rather than rendered as dead links — an icon that
   scrolls nowhere is a worse failure than a shorter rail.

   Add an entry here in the same moment you give its <section> the matching id.
   The icons for the not-yet-built sections are imported and kept ready below so
   that is the only edit needed on the data side. */
export const navItems = [
  { id: 'hero', label: 'Home', icon: House },
  { id: 'about', label: 'About', icon: User },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'contact', label: 'Contact', icon: Send },
]

/* Icons for the sections still to be built, so the imports above are not dead
   code and the next section only needs its data entry. TODO(ahmed): projects,
   ai-lab, contact. */
export const navIconsPending = { 'ai-lab': FlaskConical }

/* ---------------------------------------------------------------------------
 *  ABOUT
 *  One lede, two short paragraphs and four capability rows. Everything here is a
 *  description of approach, not a claim about a specific employer, client or
 *  credential — the figures are Ahmed's own, from the stats in `hero`, and the
 *  capability statements restate the same full-stack + AI work the role line
 *  already claims.
 *
 *  Deliberately shorter than it was. Three paragraphs plus a closing "currently
 *  available" sentence put the availability line on screen twice — here and on
 *  the profile card — while the third paragraph repeated the capability rows in
 *  prose. What is left is one positioning sentence, the two things the work is
 *  actually about, and nothing the card has not already said.
 * -------------------------------------------------------------------------*/
export const about = {
  eyebrow: 'About',

  /* The heading is the first thing read in this section, so it states the
     outcome rather than the job title — "About" is what the rail says. */
  headline: ['I build software', 'that survives contact', 'with real users.'],

  /* Rendered under the headline, one size above the body copy. One sentence,
     and it is the positioning: what he is, and the standard he works to. */
  lede: 'Full-stack developer and AI engineer. I own a product end to end — data model, API, interface, deployment — because the interesting problems live in the seams between those layers.',

  paragraphs: [
    'Five years, thirty-five projects, twenty clients. Most of that time has gone into the join between the back end and the interface, which is where a product either holds together or quietly starts to leak.',
    'My defaults are unglamorous and they are why the work ages well: performance budgets agreed before the build, typed boundaries at every layer, and tests around the logic that actually breaks.',
  ],

  /* The ledger that sits beside the prose: the three figures the lede above
     already states, set as a spec sheet.

     `metrics` names each figure by the label it already has in `hero.stats`
     rather than repeating the number. The hero states these three as a row of
     large display figures; the About states them as a ledger. Same facts, two
     registers — and because the value is resolved from `hero.stats` at render
     time rather than written out here, the two cannot drift apart into two
     different numbers for the same thing. A `stat` that names nothing throws
     rather than rendering a blank, in the same spirit as `capabilityIcon` below.

     "Technologies" is deliberately absent: the `stack` fields of the Experience
     entries are the informative version of that figure, a screen further down,
     and printing the count beside them as well would only invite the reader to
     check the arithmetic. */
  practice: {
    metrics: [
      { label: 'Projects delivered', stat: 'Projects' },
      { label: 'Clients', stat: 'Clients' },
      { label: 'Years of experience', stat: 'Years Experience' },
    ],
  },

  /* Four capability rows. `icon` resolves against `capabilityIcon` below, so
     adding a row means adding a line there and a line here. */
  capabilities: [
    {
      icon: 'layers',
      title: 'Full-stack delivery',
      body: 'Database through to interface and deployment, owned end to end rather than handed across teams.',
    },
    {
      icon: 'brain',
      title: 'AI integration',
      body: 'Language models wired into real product surfaces, with the failure modes designed for up front.',
    },
    {
      icon: 'gauge',
      title: 'Performance first',
      body: 'Budgets set before the build, measured after it. Fast on the devices people actually own.',
    },
    {
      icon: 'shield',
      title: 'Production safety',
      body: 'Typed boundaries, error handling and observability as defaults rather than as a later pass.',
    },
  ],
}

/* ---------------------------------------------------------------------------
 *  EXPERIENCE
 * ---------------------------------------------------------------------------
 *  Three entries covering the five years in `hero.stats`, newest first.
 *
 *  NO EMPLOYER IS NAMED, and that is a decision rather than an omission. Per the
 *  rule at the top of this file, an invented company would be a fabricated claim
 *  about a third party that a visitor could not check and would believe. So each
 *  entry names the work instead: `org` says what kind of engagement it was, and
 *  the periods are derived from the one supplied figure — five years — rather
 *  than from any CV.
 *
 *  `period` is free text with an en dash in it (`2024 — Present`), because
 *  "Present" has no year and a date picker would force one.
 *
 *  `stack` is the one field here that names tools rather than describing work.
 *  TODO(ahmed): read these before publishing. They are the mainstream
 *  full-stack + AI toolset, consistent with the role line and with each other,
 *  but nothing in the data above asserts them — swap in whatever is actually true
 *  and the chips follow. Keep `highlights` to three or four short lines: the rows
 *  are sized for that, and a bullet that runs long makes the timeline uneven.
 * -------------------------------------------------------------------------*/
export const experience = {
  eyebrow: 'Experience',
  headline: ['Five years of', 'shipping, summarised.'],
  summary:
    'The practice has been independent throughout, so there are no company names below — what has changed is the size of what I own end to end.',

  roles: [
    {
      period: '2024 — Present',
      role: 'Full-Stack & AI Engineer',
      org: 'Independent practice · clients worldwide',
      summary:
        'Whole products for clients who need them working rather than discussed — schema, API, interface and deployment owned end to end.',
      highlights: [
        'Language models inside real product surfaces, with the failure modes designed for up front.',
        'Performance budgets agreed before the build and measured after it.',
        'Typed boundaries and real error handling as defaults, so the work still changes cleanly six months later.',
      ],
      stack: ['TypeScript', 'React', 'Node.js', 'LLM APIs', 'PostgreSQL', 'AWS'],
    },
    {
      period: '2022 — 2024',
      role: 'Full-Stack Developer',
      org: 'Client product work',
      summary:
        'Features and complete products across the stack, from schema to screen, mostly in React and Node.',
      highlights: [
        'Owned delivery across the layers instead of one of them — the interesting problems sit in the seams.',
        'Took the slow parts apart: bundle weight, request waterfalls, and the queries nobody wanted to look at.',
        'Shipped and maintained it afterwards, which is the part most demos leave out.',
      ],
      stack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST APIs', 'Vite'],
    },
    {
      period: '2021 — 2022',
      role: 'Web Developer',
      org: 'First freelance clients',
      summary:
        'Where it started: small sites and internal tools, shipped quickly and looked after properly afterwards.',
      highlights: [
        'Learned to scope before starting — the estimate is the deliverable nobody thanks you for and everybody needs.',
        'Wrote everything myself, front to back, which is where the habit of finishing what you start comes from.',
        'Moved from hand-written markup to components, then to typed boundaries, and never went back.',
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    },
  ],
}

/* ---------------------------------------------------------------------------
 *  SKILLS
 * ---------------------------------------------------------------------------
 *  Four groups, one per layer of the stack, each with the tools that act on it.
 *
 *  WHY THIS IS NOT THE INVENTORY ABOUT USED TO CARRY. That band was a list of
 *  tools, and the same tools were already printed under every role in
 *  Experience, in the same pills — so it read as the section above repeating
 *  itself. What is here is a different claim in a different shape: a tool says
 *  what was used, a group says which layer the work happens on and what it is
 *  for. The tools are grouped by the layer they act on rather than run together
 *  as one long comma-separated run, because "tools" as a single list is the one
 *  arrangement that says nothing at all.
 *
 *  WHICH IS WHY IT SITS BEFORE EXPERIENCE. In this order the page argues
 *  who → what the working set is → here it is being used. Placed after the
 *  timeline it would be a summary of the rows above it, which is the
 *  duplication the old band was removed for.
 *
 *  THE TOOL NAMES ARE THE SAME ONES THE TIMELINE USES. `experience.roles[].stack`
 *  is where the claim is actually made, role by role; this section groups those
 *  names by layer so the reader can see the shape of the practice in one screen.
 *  A name that appears here and not there is a name to check.
 *
 *  TODO(ahmed): read these before publishing, same as the stacks below. Every
 *  name is either asserted in `experience` or is an obvious member of the same
 *  toolset; nothing here is a percentage, a rating or a claimed number of years
 *  with a tool, because none of that has been supplied. If a tool is not
 *  something you would want to be asked about in an interview, delete it here.
 * -------------------------------------------------------------------------*/
export const skills = {
  eyebrow: 'Skills',

  /* Two lines rather than three. About and Experience both run to three, and a
     third line here would push the grid — the only thing in this section worth
     scrolling to — below the fold on a laptop. */
  headline: ['A focused stack for', 'products that need to last.'],

  /* One sentence, and it is the argument: not a list of tools but the reason
     the list is cut this way. */
  summary: 'Four disciplines, brought together to take a product from its first interface to a dependable release.',

  groups: [
    {
      icon: 'layout',
      title: 'Frontend',
      body: 'Interfaces that stay legible at every width — semantic markup, typed props, and a layout that holds from a 360px phone up.',
      tools: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite', 'HTML', 'CSS'],
    },
    {
      icon: 'server',
      title: 'Backend',
      body: 'Schema, API and the failure handling around them, so the service is still maintainable a year after it shipped.',
      tools: ['Node.js', 'REST APIs', 'PostgreSQL', 'MySQL'],
    },
    {
      icon: 'brain',
      title: 'AI & Data',
      body: 'Language models inside real product surfaces, with the failure modes designed for up front rather than discovered in production.',
      tools: ['LLM APIs', 'Prompt engineering', 'RAG pipelines', 'Vector search'],
    },
    {
      icon: 'cloud',
      title: 'Platform',
      body: 'Build, deploy, and the observability that says whether it is actually working in someone’s hands.',
      tools: ['AWS', 'Docker', 'CI/CD', 'Git'],
    },
  ],
}

/* ---------------------------------------------------------------------------
 *  PROJECTS
 * -------------------------------------------------------------------------*/
export const projects = {
  eyebrow: 'Projects',
  headline: ['Selected builds with', 'real product shape.'],
  summary:
    'A focused set of shipped interfaces, ordered by strength and business weight rather than treated as equal thumbnails.',
  items: [
    {
      title: 'CanadaExim',
      url: 'https://canadaexim.com/',
      image: canadaEximImage,
      imageAlt: 'First screen of the CanadaExim commodity trading website',
      type: 'Trade platform',
      role: 'Full website build',
      summary:
        'A premium commodity trading and logistics presence with a strong hero, conversion paths, buyer and supplier flows, and trust-led positioning.',
      stack: ['React', 'Tailwind CSS', 'Responsive UI', 'Lead flow'],
      featured: true,
    },
    {
      title: 'Balochistan Standard Services',
      url: 'https://balochistan-services.vercel.app/',
      image: balochistanServicesImage,
      imageAlt: 'First screen of the Balochistan Standard Services website',
      type: 'Service business',
      role: 'Product and service website',
      summary:
        'A fire safety and security website designed around product discovery, service requests, and clear credibility for commercial buyers.',
      stack: ['React', 'Vercel', 'Service UI', 'Responsive layout'],
      featured: true,
    },
    {
      title: 'AI Assistant',
      url: 'https://ai-chat-boot-nu.vercel.app/',
      image: aiChatbotImage,
      imageAlt: 'First screen of the AI Assistant chat interface',
      type: 'AI interface',
      role: 'Chat product prototype',
      summary:
        'A clean AI chat surface with prompt shortcuts, message input, and a focused assistant layout for fast experimentation.',
      stack: ['React', 'AI UI', 'Prompt UX'],
    },
    {
      title: 'Weather Finder',
      url: 'https://ahmedkhan-web.github.io/weather-app/',
      image: weatherAppImage,
      imageAlt: 'First screen of the Weather Finder app',
      type: 'Utility app',
      role: 'Frontend app',
      summary:
        'A compact weather search experience built around one clear task: enter a city, get the forecast, keep the interface light.',
      stack: ['JavaScript', 'API UI', 'CSS'],
    },
    {
      title: 'Proship Ecommerce',
      url: 'https://ahmedkhan-web.github.io/Ecommerce-Web-site/',
      image: ecommerceSiteImage,
      imageAlt: 'First screen of the Proship ecommerce website',
      type: 'Ecommerce concept',
      role: 'Marketing storefront',
      summary:
        'A storefront concept for technology products, with a bold opening screen, product navigation, and a direct shopping CTA.',
      stack: ['HTML', 'CSS', 'JavaScript'],
    },
  ],
}

/* ---------------------------------------------------------------------------
 *  CONTACT
 * -------------------------------------------------------------------------*/
export const contact = {
  eyebrow: 'Contact',
  headline: ['Tell me what you need', 'and I will reply fast.'],
  summary:
    'Send a project note straight to WhatsApp. The form formats the message for you, so the conversation starts with the useful details already included.',
  whatsapp: profile.whatsapp,
  directLabel: 'Message on WhatsApp',
  emailLabel: profile.email,
}

/* ---------------------------------------------------------------------------
 *  HERO
 *  Deliberately short. The headline, one animated line, two calls to action and
 *  the four numbers below do the work; there are no paragraphs and no capability
 *  grid. Everything else the page says about itself is in the profile card.
 *
 *  `headline` renders one array entry per line. The line flagged `accent: true`
 *  is painted with the emerald gradient.
 * -------------------------------------------------------------------------*/
export const hero = {
  badge: 'Welcome to my portfolio',
  headline: [
    { text: 'Engineering Intelligent', accent: false },
    { text: 'Digital Experiences.', accent: true },
  ],

  /* The quiet moving strip at the foot of the hero. Five short labels of what
     the work actually is, drifted slowly past the reader: they restate the
     profile card and the About section in one line each, so a visitor who reads
     nothing else still learns the shape of the practice.

     Keep every entry to two or three words. The strip renders this list twice so
     it can loop without a seam, so each extra word is on screen for the whole
     animation — and a phrase long enough to wrap would break the strip's height
     reservation along with it. */
  strip: [
    'About Me',
    'Full-Stack Development',
    'AI Engineering',
    'Modern UI/UX',
    'Production Systems',
  ],

  /* Typed out one character at a time beneath the headline, then erased and
     replaced by the next. Kept short enough to sit on one line at desktop and
     at most two on a phone. */
  typed: [
    'Building Digital Products From Idea to Launch.',
    'Engineering AI-Powered Digital Experiences.',
    'Turning Complex Problems Into Simple Products.',
    'Building Scalable Systems That Perform.',
  ],

  /* Both targets exist on the page, and plain anchors are all these need: the
     document is the scroller, so the browser's own fragment navigation lands on
     the section and `scroll-behavior: smooth` on `html` makes the journey there
     eased. Nothing in App.jsx intercepts a click any more. */
  /* Points at `#experience`, so the label says so. It used to read "Explore
     Projects" while linking here, because the Projects section does not exist
     yet — a label that disagrees with its destination is worse than no link at
     all, and it fails for anyone who cannot see where the link goes. */
  primaryCta: { label: 'View Projects', href: '#projects' },
  /* A mailto rather than an anchor. "Let's Talk" pointed at #contact, a section
     that does not exist — a button that scrolls nowhere is a dead end. Swap it
     back to an anchor in the same commit that builds the Contact section; the
     anchor will work as it stands, because there is no inner scroller to defeat. */
  secondaryCta: { label: 'Let’s Talk', href: '#contact' },

  /* The four numbers under the buttons, in the order they are read.
     Each value counts up from zero when the row enters the viewport.

     Every figure here is Ahmed's own, supplied as final counts. Per the rule at
     the top of this file they are never guessed: if one of them changes, change
     it here and the counter follows. Labels are the only editable copy — keep
     them short enough to hold one or two lines at the narrowest phone, because
     the row is a grid and a third line in one cell makes it look broken. */
  stats: [
    { value: 20, label: 'Clients' },
    { value: 35, label: 'Projects' },
    { value: 5, label: 'Years Experience' },
    { value: 24, label: 'Technologies' },
  ],
}

/* ---------------------------------------------------------------------------
 *  SHARED PIECES
 * -------------------------------------------------------------------------*/
export const arrowIcon = ArrowRight
export const metaIcon = { email: Mail, location: Globe, work: Briefcase }
export const sparkleIcon = Sparkles
export const externalIcon = ExternalLink

/* Capability card icons for the About section, keyed by the `icon` field there.
   Listed explicitly rather than resolved by string so a typo fails at build time
   instead of rendering an empty card. */
export const capabilityIcon = { layers: Layers, brain: Brain, gauge: Gauge, shield: ShieldCheck }

/* The same arrangement for the Skills groups. `brain` is deliberately the same
   component About uses for AI integration — it is the same idea at a different
   scale, and two icons for one idea would be the page inventing a distinction. */
export const skillIcon = { layout: Layout, server: Server, brain: Brain, cloud: Cloud }
