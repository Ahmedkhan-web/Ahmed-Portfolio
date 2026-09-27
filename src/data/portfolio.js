/* ============================================================================
 *  PORTFOLIO CONTENT — SINGLE SOURCE OF TRUTH
 * ----------------------------------------------------------------------------
 *  Everything on the site renders from this file. Swap the placeholder values
 *  below for your real details and the whole site updates.
 *
 *  Search for "TODO" to find every spot that needs your input.
 * ==========================================================================*/

/* ---------------------------------------------------------------------------
 *  PROFILE
 * -------------------------------------------------------------------------*/
export const profile = {
  name: 'Ahmed Khan',
  // TODO: Confirm spelling / add credentials (e.g. "Ahmed Khan, M.S. CS")
  role: 'Full-Stack Developer',
  // Short line that sits under the name, rotating through `taglineRotations`
  tagline: 'I build smart apps —',
  // Rotates in the hero. Keep them short (2–4 words each).
  taglineRotations: ['not just CRUD.', 'shipped end to end.', 'with AI at the core.'],
  // TODO: Rewrite in your own voice. 2–3 sentences max.
  intro:
    "I'm a full-stack developer who treats AI as a first-class part of the stack — not a feature bolted on at the end. I design the architecture, wire the LLM into the data model, and ship the boring parts (auth, queues, databases) that make it actually hold up in production.",
  // TODO: Real values
  location: 'Remote · Worldwide',
  availability: 'Open to new projects',
  availabilityHref: '#contact',
  yearsExperience: 5, // TODO: real number
  projectsShipped: 24, // TODO: real number
  aiSystemsDeployed: 9, // TODO: real number
  email: 'ahmed.code.a@gmail.com', // TODO: replace
  /* Form handling. Leave empty to open the visitor's mail client with the
   * message pre-filled. To post to a real endpoint, paste a form URL here —
   * e.g. Formspree ('https://formspree.io/f/xxxxxxx') or Web3Forms
   * ('https://api.web3forms.com/submit' with a real access_key in the payload). */
  contactEndpoint: '',
  contactAccessKey: '', // TODO: only needed if you use Web3Forms
  projectTypes: ['New project', 'Freelance work', 'Full-time role', 'Collaboration', 'Just saying hi'],
  // TODO: Drop your PDF in /public and point here
  resumeUrl: '/Ahmed-Khan-Resume.pdf',
}

/* ---------------------------------------------------------------------------
 *  SOCIAL LINKS
 *  `icon` must match a key in src/components/Icon.jsx
 * -------------------------------------------------------------------------*/
export const socials = [
  { label: 'GitHub', handle: '@ahmedkhan', icon: 'github', url: 'https://github.com/' }, // TODO
  { label: 'LinkedIn', handle: 'in/ahmedkhan', icon: 'linkedin', url: 'https://linkedin.com/in/' }, // TODO
  { label: 'X', handle: '@ahmedkhan_dev', icon: 'x', url: 'https://x.com/' }, // TODO
  { label: 'Email', handle: profile.email, icon: 'mail', url: `mailto:${profile.email}` },
]

/* ---------------------------------------------------------------------------
 *  NAVIGATION
 * -------------------------------------------------------------------------*/
export const navLinks = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

/* ---------------------------------------------------------------------------
 *  HERO — terminal motif. `lines` render inside a fake shell.
 *  Colors: 'accent' | 'glow' | 'indigo' | 'dim' | 'fg' | 'ok' | 'warn'
 * -------------------------------------------------------------------------*/
export const heroTerminal = {
  title: 'ahmed@dev',
  lines: [
    { text: 'const dev = {', color: 'dim' },
    { text: "  name: 'Ahmed Khan',", color: 'fg' },
    { text: "  role: 'Full-Stack Developer',", color: 'fg' },
    { text: "  focus: 'AI-powered products',", color: 'accent' },
    { text: "  stack: ['React', 'Node', 'Python', 'LLMs'],", color: 'fg' },
    { text: "  currently: 'building',", color: 'indigo' },
    { text: '};', color: 'dim' },
  ],
  footer: 'ship it.',
}

/* ---------------------------------------------------------------------------
 *  ABOUT
 * -------------------------------------------------------------------------*/
export const about = {
  heading: 'The part that',
  headingAccent: 'isn’t in the job description',
  // TODO: rewrite in your own voice
  paragraphs: [
    'I started out building ordinary web apps — forms, dashboards, the usual. Then I noticed the most valuable work I was doing had nothing to do with the framework: it was figuring out *where* a model actually helps, what it costs to run, and what happens when it gets something wrong at 3am.',
    'That changed how I work. I still care about clean schemas and fast pages, but I design for the failure modes too. What happens if the API times out mid-stream? How do we keep a hallucinated answer from reaching a customer? Can a human override the model in one click? Those questions are the actual work now.',
    'Outside of shipping, I’m usually pulling apart open-source LLM tooling to see how it works, over-engineering my own dotfiles, or arguing that most "AI features" would be better as a well-written script.',
  ],
  // Personality touch — the human bit
  aside: {
    label: 'Off the clock',
    items: [
      'Reading papers I definitely won’t finish',
      'Rebuilding my home server for the third time',
      'Strong espresso, weak opinions about tabs vs. spaces',
    ],
  },
  /** Numbers on the right rail. Verify before publishing. */
  facts: [
    { label: 'Years shipping', value: `${profile.yearsExperience}+` },
    { label: 'Projects live', value: `${profile.projectsShipped}+` },
    { label: 'AI systems in prod', value: `${profile.aiSystemsDeployed}+` },
    { label: 'Response time', value: '< 24h' },
  ],
}

/* ---------------------------------------------------------------------------
 *  TECH STACK
 *  `level` is optional — omit it for a neutral chip.
 * -------------------------------------------------------------------------*/
export const skillGroups = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: 'layout',
    blurb: 'Interfaces that stay fast under real data and real users.',
    skills: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'TypeScript', level: 92 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'Zustand', level: 80 },
      { name: 'React Query', level: 85 },
      { name: 'Framer Motion', level: 78 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: 'server',
    blurb: 'APIs, queues, schemas. Boring in the best possible way.',
    skills: [
      { name: 'Node.js', level: 92 },
      { name: 'Python', level: 88 },
      { name: 'FastAPI', level: 85 },
      { name: 'PostgreSQL', level: 90 },
      { name: 'MongoDB', level: 82 },
      { name: 'Redis', level: 80 },
      { name: 'Prisma', level: 85 },
      { name: 'GraphQL', level: 75 },
    ],
  },
  {
    id: 'ai',
    label: 'AI / ML',
    icon: 'sparkle',
    accent: true,
    blurb: 'Retrieval, agents, evals — and the plumbing to keep them honest.',
    skills: [
      { name: 'OpenAI API', level: 92 },
      { name: 'Anthropic Claude API', level: 92 },
      { name: 'LangChain', level: 85 },
      { name: 'RAG pipelines', level: 88 },
      { name: 'Vector DBs', level: 85, note: 'pgvector · Pinecone' },
      { name: 'Prompt engineering', level: 90 },
      { name: 'AI agents / tool use', level: 82 },
      { name: 'Evals & guardrails', level: 78 },
      { name: 'n8n / Zapier', level: 80, note: 'workflow automation' },
      { name: 'Whisper / STT', level: 70 },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps / Tools',
    icon: 'cloud',
    blurb: 'Ship it, watch it, fix it before anyone else notices.',
    skills: [
      { name: 'Git', level: 92 },
      { name: 'Docker', level: 85 },
      { name: 'AWS', level: 80 },
      { name: 'Vercel', level: 88 },
      { name: 'GitHub Actions', level: 85 },
      { name: 'CI/CD', level: 88 },
      { name: 'Linux / Nginx', level: 78 },
      { name: 'Playwright', level: 80 },
    ],
  },
]

/* ---------------------------------------------------------------------------
 *  FEATURED PROJECTS
 *  Each is written as a mini case study. `stats` render as a result row.
 * -------------------------------------------------------------------------*/
export const projects = [
  {
    id: 'atlas',
    title: 'Atlas',
    kicker: 'RAG · Internal knowledge',
    year: '2025',
    featured: true,
    summary: 'Answers questions across 1,400 pages of internal docs — with citations.',
    problem:
      'A 200-person SaaS team had 1,400 pages of internal documentation spread across a wiki, Notion, and stale Confluence pages. Engineers reported losing around three hours a week just searching for answers, and new hires took three weeks to become productive.',
    solution:
      'I built a retrieval pipeline that chunks the source docs, embeds them into a vector store, and serves answers through a streaming chat interface. Every answer links back to the exact source page, and a verification pass strips anything the model can’t attribute to a retrieved passage.',
    tech: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'pgvector', 'LangChain', 'Claude API'],
    ai: {
      label: 'AI component',
      detail:
        'Claude with a retrieval step, reranked by embedding similarity before generation, plus a citation-verification pass that drops unsupported claims. Prompt caching cut per-query cost by roughly 70%.',
    },
    stats: [
      { value: '76%', label: 'less search time' },
      { value: '4 days', label: 'new-hire ramp' },
      { value: '200+', label: 'weekly users' },
    ],
    links: { live: 'https://atlas.example.com', repo: 'https://github.com/' }, // TODO
  },
  {
    id: 'relay',
    title: 'Relay',
    kicker: 'LLM agent · Support ops',
    year: '2024',
    featured: true,
    summary: 'Triages, drafts, and routes support tickets — human stays in the loop.',
    problem:
      'The support team handled about 1,800 tickets a week. Around 40% were one of twelve recurring questions, but agents were spending nearly 20 minutes per ticket just figuring out what it was and who owned it.',
    solution:
      'A background pipeline classifies each incoming ticket, drafts a reply grounded in the help center, and routes it to the right queue. Anything below a confidence threshold or flagged as an escalation goes straight to a human with the reasoning attached.',
    tech: ['Node.js', 'BullMQ', 'Redis', 'PostgreSQL', 'React', 'OpenAI API'],
    ai: {
      label: 'AI component',
      detail:
        'Structured output for classification into a fixed taxonomy, few-shot prompting tuned on 2,000 historical tickets, and retrieval against the help center so replies stay grounded. Confidence gating is the safety rail.',
    },
    stats: [
      { value: '11 min', label: 'median first response' },
      { value: '1,600', label: 'agent-hours saved / yr' },
      { value: '+14%', label: 'CSAT' },
    ],
    links: { live: 'https://relay.example.com', repo: 'https://github.com/' }, // TODO
  },
  {
    id: 'prism',
    title: 'Prism',
    kicker: 'Developer tool · Code review',
    year: '2024',
    featured: true,
    summary: 'A GitHub App that leaves line-level review comments on every PR.',
    problem:
      'Review was the bottleneck in a team’s delivery cycle — median PR sat 19 hours. Feedback quality was inconsistent, and reviewers kept flagging the same classes of mistakes because nothing carried over between pull requests.',
    solution:
      'A GitHub App that reads the diff, retrieves similar changes from previously merged PRs to learn the repo’s conventions, and posts line-level comments. It only comments on lines the PR actually touched, and every suggestion is a suggestion.',
    tech: ['Python', 'FastAPI', 'Docker', 'GitHub Actions', 'PostgreSQL', 'Claude API'],
    ai: {
      label: 'AI component',
      detail:
        'Retrieval over merged diffs supplies repo-specific context, so feedback reflects local conventions rather than generic best practice. Prompt caching and diff-aware batching keep cost under a cent per PR.',
    },
    stats: [
      { value: '19h → 7h', label: 'PR turnaround' },
      { value: '40%', label: 'comments resolved pre-open' },
      { value: '<$0.01', label: 'cost per PR' },
    ],
    links: { live: 'https://prism.example.com', repo: 'https://github.com/' }, // TODO
  },
  {
    id: 'signal',
    title: 'Signal',
    kicker: 'Realtime · Analytics',
    year: '2023',
    featured: true,
    summary: 'Live product analytics you can interrogate in plain English.',
    problem:
      'Product decisions were being made against dashboards that were a day stale, and every new question meant waiting on whoever knew SQL best to pull a report.',
    solution:
      'A realtime dashboard streaming events over WebSockets into a columnar store, with a natural-language query layer on top so anyone can ask "why did signups drop on Tuesday" and get a chart back, no SQL required.',
    tech: ['Next.js', 'Node.js', 'WebSockets', 'ClickHouse', 'D3', 'Claude API'],
    ai: {
      label: 'AI component',
      detail:
        'The NL layer compiles questions into validated queries, runs them, and narrates the result — refusing to answer if it can’t produce a valid query. Anomaly detection runs independently so surprises surface without being asked about.',
    },
    stats: [
      { value: '2.4s', label: 'query to chart' },
      { value: 'Real-time', label: 'event streaming' },
      { value: '0', label: 'SQL tickets filed' },
    ],
    links: { live: 'https://signal.example.com', repo: 'https://github.com/' }, // TODO
  },
  {
    id: 'promptlab',
    title: 'PromptLab',
    kicker: 'Internal tooling · Evals',
    year: '2024',
    featured: false,
    summary: 'Version control and regression testing for prompts.',
    problem:
      'Prompts were living in Notion and Slack threads, which made it impossible to tell whether a change helped or quietly broke something downstream.',
    solution:
      'An internal tool that versions prompts alongside code, runs a dataset against each version, and scores the outputs so you can see the diff before shipping.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Claude API'],
    ai: {
      label: 'AI component',
      detail:
        'LLM-as-judge scoring with pairwise comparison, plus a golden-dataset workflow that makes prompt changes reviewable like code.',
    },
    stats: [{ value: '30+', label: 'prompts tracked' }],
    links: { live: null, repo: 'https://github.com/' },
  },
  {
    id: 'northwind',
    title: 'Northwind',
    kicker: 'Client work · Commerce',
    year: '2023',
    featured: false,
    summary: 'Headless storefront rebuild for a DTC brand — the non-AI side of the job.',
    problem:
      'A DTC brand was running a slow theme-based storefront with a 4.1s LCP and no room to iterate on merchandising.',
    solution:
      'A headless Next.js storefront on the Shopify Storefront API with edge-rendered product pages, a rebuilt checkout flow, and server-side experimentation so merchandising could be tested without deploys.',
    tech: ['Next.js', 'TypeScript', 'Shopify Storefront API', 'Stripe', 'Vercel Edge'],
    ai: null, // No AI in this one — it's here to show range
    stats: [
      { value: '4.1s → 0.9s', label: 'largest contentful paint' },
      { value: '+23%', label: 'conversion rate' },
    ],
    links: { live: 'https://northwind.example.com', repo: null },
  },
]

/* ---------------------------------------------------------------------------
 *  EXPERIENCE / TIMELINE
 * -------------------------------------------------------------------------*/
export const experience = [
  {
    role: 'Independent Full-Stack & AI Developer',
    org: 'Freelance',
    period: '2022 — Present',
    location: 'Remote',
    current: true,
    summary:
      'Building AI-powered products for founders and small teams — usually as the only engineer, from schema to deployment.',
    highlights: [
      'Delivered 9 production LLM systems across support, developer tooling, and internal search.',
      'Built the retrieval and eval infrastructure that made those systems auditable instead of magic.',
      'Standardised on a FastAPI + Next.js default stack, cutting typical project setup from weeks to days.',
    ],
    stack: ['Next.js', 'FastAPI', 'Claude API', 'PostgreSQL', 'AWS'],
  },
  {
    role: 'Full-Stack Engineer',
    org: '[Company Name]', // TODO
    period: '2021 — 2022',
    location: 'Hybrid',
    current: false,
    summary:
      'Owned features end to end across a multi-tenant B2B platform, from Postgres schema through to the React surface.',
    highlights: [
      'Rebuilt the permissions layer around a single policy check, eliminating a recurring class of cross-tenant data bugs.',
      'Introduced CI previews and automated regression tests, taking median review turnaround from two days to a few hours.',
    ],
    stack: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    role: 'Software Developer',
    org: '[Company Name]', // TODO
    period: '2019 — 2021',
    location: 'On-site',
    current: false,
    summary: 'Cut my teeth on CRUD, which is genuinely how you learn what not to build.',
    highlights: [
      'Shipped billing and subscription flows still running in production today.',
      'Automated a manual reporting process that took two days a week down to twenty minutes.',
    ],
    stack: ['JavaScript', 'Laravel', 'MySQL', 'Vue'],
  },
]

/* ---------------------------------------------------------------------------
 *  TESTIMONIALS
 *  TODO: Replace with real quotes. Delete this export to hide the section —
 *  Testimonials.jsx renders nothing when the list is empty.
 * -------------------------------------------------------------------------*/
export const testimonials = [
  {
    quote:
      'Ahmed took a vague idea and a spreadsheet of requirements and returned something we actually use every day. The AI part genuinely works — no demo-ware, no hand-holding, and he documented the failure cases better than our own team would have.',
    name: '[Client Name]', // TODO
    role: 'Founder, [Startup]', // TODO
  },
  {
    quote:
      'What stands out is the engineering judgement. He pushed back on two of my original ideas because they were the wrong shape, and he was right about both. Rare to get that from a contractor.',
    name: '[Colleague / CTO]', // TODO
    role: 'Engineering Lead', // TODO
  },
  {
    quote:
      'We went from "we should probably add AI somewhere" to a working, evaluated feature in six weeks. Ahmed left us with documentation and tests we could maintain ourselves, which is the part I value most.',
    name: '[Client Name]', // TODO
    role: 'Product Lead', // TODO
  },
]

/* ---------------------------------------------------------------------------
 *  MARQUEE — scrolling strip of capabilities
 * -------------------------------------------------------------------------*/
export const marqueeItems = [
  'LLM integrations',
  'RAG pipelines',
  'Full-stack React',
  'Node & Python APIs',
  'AI agents',
  'Workflow automation',
  'Prompt engineering',
  'Vector search',
  'Evals & guardrails',
  'Postgres at scale',
  'CI/CD',
  'Product engineering',
]
