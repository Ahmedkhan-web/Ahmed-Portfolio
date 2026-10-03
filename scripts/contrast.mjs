import { chromium } from 'playwright-core'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const ROOT = fileURLToPath(new URL('../dist', import.meta.url))
const PORT = 4186
const TARGET = `http://localhost:${PORT}/`
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' }
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p === '/') p = '/index.html'
  try {
    const b = await readFile(join(ROOT, normalize(p).replace(/^([/\\])+/, '')))
    res.writeHead(200, { 'Content-Type': MIME[extname(p)] ?? 'application/octet-stream' }); res.end(b)
  } catch { res.writeHead(404).end('nf') }
})
await new Promise((r) => server.listen(PORT, r))

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(TARGET, { waitUntil: 'load' })
await page.waitForTimeout(2400)


/* Sampled in two passes, because the page has two scrollports' worth of content
   at `lg`: the hero is on screen at rest, and About/Experience are below it. One
   screenshot cannot cover both, and measuring a below-the-fold element against
   the hero's pixels reports the hero's background — which is how a contrast
   check can pass while the section it claims to have checked was never sampled.

   So: `group` selects which selectors run, and the caller scrolls the column and
   takes a fresh screenshot before the second pass. */
const sample = async (group) => {
  const b64 = (await page.screenshot({ type: 'png' })).toString('base64')
  return page.evaluate(async ({ b64, group }) => {
  const img = new Image()
  await new Promise((r) => { img.onload = r; img.src = 'data:image/png;base64,' + b64 })
  const cv = document.createElement('canvas')
  cv.width = img.width; cv.height = img.height
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0)

  const srgb = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
  const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
  const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
  const hex = (r, g, b) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

  const measure = (sel, label, opt = {}) => {
    const { index = 0, inset = 0, min } = opt
    const all = [...document.querySelectorAll(sel)]
    const el = all[index]
    if (!el) return { label, missing: true }

    /* Sample the text's own box, not the element's. The element box is not the
       text box when a grid stretches the cell: the timeline's period column is
       `sm:grid-cols-[9rem_1fr]` with stretched rows, so its <p> is as tall as
       the whole entry and the text sits in the first line of it. Measuring the
       element box there samples 150px of empty background and reports a
       contrast of 1.04 for perfectly legible text. A range over the contents
       gives the union of the line boxes the glyphs are actually painted in,
       and the horizontal bounds come from the text too, so a neighbouring
       column cannot contaminate the sample either. */
    const range = document.createRange()
    range.selectNodeContents(el)
    const tr = range.getBoundingClientRect()
    const r = tr.height && tr.width ? tr : el.getBoundingClientRect()

    // `inset` trims the top/bottom of the box so a neighbouring line's
    // descenders don't contaminate the sample.
    const top = r.top + r.height * inset
    const h2 = r.height * (1 - inset * 2)
    const x = Math.max(0, Math.round(r.left)), y = Math.max(0, Math.round(top))
    const w = Math.min(cv.width - x, Math.round(r.width)), h = Math.min(cv.height - y, Math.round(h2))
    if (w < 2 || h < 2) return { label, missing: true }
    const d = ctx.getImageData(x, y, w, h).data

    /* Background = the modal quantised colour. Glyphs cover a small
       minority of a text line's box, so the most common bucket is the
       surface behind the text — this works for gradient-filled text too,
       where getComputedStyle().color is just `transparent`. */
    const hist = new Map()
    const px = []
    for (let i = 0; i < d.length; i += 4) {
      const R = d[i], G = d[i + 1], B = d[i + 2]
      px.push([R, G, B])
      const k = ((R >> 4) << 8) | ((G >> 4) << 4) | (B >> 4)
      hist.set(k, (hist.get(k) ?? 0) + 1)
    }
    const modal = [...hist.entries()].sort((a, b) => b[1] - a[1])[0][0]
    const br = ((modal >> 8) & 15) * 17, bg = ((modal >> 4) & 15) * 17, bb = (modal & 15) * 17
    const bgL = lum(br, bg, bb)

    /* Text reference = the pixel furthest from the background (the glyph
       core), which is representative whether the fill is solid or a
       gradient. */
    let best = null, bestD = -1
    for (const p of px) {
      const dd = lum(p[0], p[1], p[2]) - bgL
      const dist = Math.abs(dd)
      if (dist > bestD) { bestD = dist; best = p }
    }
    return {
      label,
      min: min ?? 4.5,
      bg: hex(br, bg, bb),
      fgSample: hex(best[0], best[1], best[2]),
      coverage: +(1 - hist.get(modal) / px.length).toFixed(3),
      contrast: +ratio(lum(best[0], best[1], best[2]), bgL).toFixed(2),
    }
  }

  /* Selectors are matched against the built DOM, so they have to survive the
     markup changes made since this script was written.

     - The two hero paragraphs are picked by their measure classes rather than
       by `p` index, because the card's role line is also a <p> and sits earlier
       in the document — an index into `p` silently measures the wrong element.
     - The capability and focus lists are both `ul.grid`; the focus list is the
       one carrying the hairline above it.
     - `span.font-medium` no longer exists — the capability label is a
       `font-mono` span inside the capability list. */
  if (group === 'hero') {
    return [
    measure('h1 > span', 'headline "Engineering Intelligent"', { index: 0, inset: 0.25, min: 3 }),
    measure('h1 > span', 'headline "Digital Experiences."', { index: 1, inset: 0.25, min: 3 }),
    /* The badge label, by role rather than by tag: the typed line is a
       font-mono span too and sits later in the document, and the hero badge is
       the first one — but "first font-mono span" is a fragile way to say
       "badge", so it is named. */
    measure('#hero span.font-mono', 'welcome badge label', { min: 4.5 }),
    measure('aside h2', 'card name', { min: 3 }),
    measure('aside p', 'card role'),
    measure('aside a[href^="mailto:"]', 'card email link', { index: 0 }),
    measure('aside a[aria-label^="Hire Me"]', 'Hire Me button label', { min: 4.5 }),
    measure('[data-typed] > span:last-child', 'typed line (rendered chars)', { inset: 0.2 }),
    /* The two halves of a stat: the large figure and its micro-label under it.
       `inset: 0.3` trims the row above, which on the figure is the headline and
       on the label is the figure itself. */
    measure('[data-stat-value]', 'stat figure (Clients)', { index: 0, inset: 0.3 }),
    measure('[data-stats] .font-mono', 'stat label (Clients)', { index: 0, inset: 0.3 }),
    ]
  }

  /* The About and Experience sections reuse the same palette at new sizes and on
     new surfaces — `text-dim` body copy over the backdrop, `text-fg/90` on the
     lede, `text-faint` micro-labels — and the faintest of those is exactly where
     a palette that passes at 18px can still fail at 13px. */
  if (group === 'about') {
    return [
      measure('#about h2 > span', 'about headline line', { index: 0, inset: 0.25, min: 3 }),
      measure('#about h2 > span', 'about headline (accent)', { index: 2, inset: 0.25, min: 3 }),
      measure('#about header span.font-mono', 'about eyebrow', { inset: 0.2, min: 4.5 }),
      /* The lede is the first <p> in the section because it lives in the shared
         heading component, above the two body paragraphs. */
      measure('#about p', 'about lede', { index: 0, inset: 0.2 }),
      measure('#about p', 'about body paragraph', { index: 2, inset: 0.2 }),
      measure('#about h3', 'capability row title', { index: 0, inset: 0.2, min: 3 }),
      measure('#about li p', 'capability row body', { index: 0, inset: 0.2 }),
    ]
  }

  return [
    measure('#experience header span.font-mono', 'experience eyebrow', { inset: 0.2, min: 4.5 }),
    measure('#experience h2 > span', 'experience headline', { index: 0, inset: 0.25, min: 3 }),
    measure('#experience p.font-mono', 'timeline period', { index: 0, inset: 0.2, min: 4.5 }),
    measure('#experience h3', 'timeline role title', { index: 0, inset: 0.2, min: 3 }),
    measure('#experience ol p', 'timeline context line', { index: 1, inset: 0.2 }),
    measure('#experience ol p', 'timeline summary', { index: 2, inset: 0.2 }),
    measure('#experience ol li li', 'timeline responsibility', { index: 0, inset: 0.2 }),
    measure('#experience ol ul[aria-label^="Technologies"] li', 'technology chip', { index: 0, inset: 0.2, min: 4.5 }),
  ]
}, { b64, group })
}

const results = [...(await sample('hero'))]

/* Scroll the centre column to each section, wait for the entrance animation to
   finish so nothing is sampled mid-fade, then sample that section against its
   own pixels. `behavior: 'instant'` because the check wants the end position, not
   a frame of the journey. */
for (const id of ['about', 'experience']) {
  await page.evaluate((target) => {
    document.getElementById(target).scrollIntoView({ behavior: 'instant' })
  }, id)
  /* Wait for the section's entrances to finish rather than for a fixed time.
     Every block is revealed by an observer as it arrives, so a section that has
     just been scrolled to has not started animating yet, and its stagger has not
     been counted      yet either — sampling on a timer would measure whichever frames
     happened to fall inside it. The predicate has to ask about the reveals
     themselves: `getAnimations()` alone is empty for a frame or two after the
     scroll, before the observer callback runs, so it reports "settled" while the
     whole section is still at zero and would go on to measure invisible text.

     Scoped to what is on screen, because scrolling a section to the top of a
     900px column leaves its lower rows below the fold — where, correctly, they
     are still waiting to be revealed. Waiting on those too would time out. */
  await page.waitForFunction(
    (target) => {
      const inView = [...document.querySelectorAll(`#${target} .reveal`)].filter((el) => {
        const r = el.getBoundingClientRect()
        return r.top < window.innerHeight * 0.9 && r.bottom > 0
      })
      return (
        inView.length > 0 &&
        inView.every((el) => el.dataset.reveal === 'done' && +getComputedStyle(el).opacity === 1)
      )
    },
    id,
    { timeout: 8000, polling: 100 },
  )
  await page.waitForTimeout(250)
  results.push(...(await sample(id)))
}

const pad = (s, n) => String(s).padEnd(n)
console.log(pad('element', 33) + pad('bg behind', 11) + pad('text px', 10) + pad('glyph%', 8) + pad('contrast', 10) + 'verdict')

let low = 0
for (const r of results) {
  if (r.missing) { console.log(pad(r.label, 33) + '*** NOT FOUND ***'); low++; continue }
  const v = r.contrast >= 4.5 ? 'AA' : r.contrast >= 3 ? 'AA-large only' : '*** LOW ***'
  if (r.contrast < (r.min ?? 4.5)) low++
  console.log(pad(r.label, 33) + pad(r.bg, 11) + pad(r.fgSample, 10) + pad(r.coverage, 8) + pad(r.contrast, 10) + v)
}
await browser.close(); server.close()

console.log(low ? `\n${low} contrast check(s) below target.` : '\nAll sampled text meets its AA target.')
process.exitCode = low ? 1 : 0
