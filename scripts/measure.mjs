import { chromium } from 'playwright-core'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const ROOT = fileURLToPath(new URL('../dist', import.meta.url))
const PORT = 4183
const TARGET = `http://localhost:${PORT}/`

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.txt': 'text/plain', '.json': 'application/json',
}

// Minimal static server for the built output, so this script needs no
// separately-managed background process.
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p === '/') p = '/index.html'
  const file = join(ROOT, normalize(p).replace(/^([/\\])+/, ''))
  try {
    const body = await readFile(file)
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})
await new Promise((r) => server.listen(PORT, r))

/* The nine viewports called out in the brief, plus two extra stress cases the
   original table used (a short laptop and a wide-but-short window).

   `heroFits` marks the sizes that are *required* to fit inside 100svh with no
   scrolling. Those are the brief's desktop sizes; phones are always expected to
   scroll, since the mandated copy cannot fit a 360x800 screen.

   The two stress cases were originally excluded because the tall photo forced
   the card narrow, and a narrow card wrapped its own copy, and a wrapped card
   was too tall to fit. A square, fixed-size avatar removed that loop, so both
   now fit too and are back under the requirement. */
const SIZES = [
  { name: 'desktop-hd ', w: 1920, h: 1080, heroFits: true },
  { name: 'laptop    ', w: 1440, h: 900, heroFits: true },
  { name: 'laptop-sm ', w: 1366, h: 768, heroFits: true },
  { name: 'tablet-l  ', w: 1024, h: 768, heroFits: true },
  { name: 'tablet    ', w: 768, h: 1024, heroFits: false },
  { name: 'mobile-lg ', w: 430, h: 932, heroFits: false },
  { name: 'mobile    ', w: 390, h: 844, heroFits: false },
  { name: 'mobile-sm ', w: 375, h: 812, heroFits: false },
  { name: 'mobile-xs ', w: 360, h: 800, heroFits: false },
  { name: 'short-win ', w: 1366, h: 660, heroFits: true },
  { name: 'wide-short', w: 1920, h: 720, heroFits: true },
]

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const rows = []
const fails = []

for (const s of SIZES) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h } })
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(TARGET, { waitUntil: 'load' })
  // let the full stagger finish (last delay 1000ms + 720ms duration)
  await page.waitForTimeout(2200)

  const m = await page.evaluate(() => {
    const aside = document.querySelector('aside')
    const h1 = document.querySelector('h1')
    const rail = document.querySelector('nav[aria-label="Primary"]')
    /* The real portrait. The card stacks two copies of the photograph, so the
       decorative blurred one has to be excluded explicitly — it is `cover` by
       design, and picking it would report a crop that isn't there. */
    const img = document.querySelector('aside img:not([aria-hidden="true"])')
    const doc = document.documentElement

    const r = (el) => {
      if (!el) return null
      const b = el.getBoundingClientRect()
      return { x: b.left, y: b.top, w: b.width, h: b.height, right: b.right, bottom: b.bottom }
    }

    /* ---- Portrait: the crop check ------------------------------------
       A ratio-error check would be meaningless now that the frame is a square
       circle — the frame's shape says nothing about whether the photograph
       inside it is whole. What actually matters is asserted directly:

       1. the frame is square, so `rounded-full` is a true circle;
       2. the photograph is `contain`ed, which by definition cannot crop it;
       3. a blurred filler layer covers the frame, so the few percent of height
          `contain` leaves unused is not an empty band inside the circle. */
    const frame = img?.parentElement
    const frameBox = r(frame)
    const frameRatio = frameBox && frameBox.h ? frameBox.w / frameBox.h : 0
    const squareErr = +(Math.abs(frameRatio - 1) / 1).toFixed(4)
    const filler = frame ? frame.querySelector('img[aria-hidden="true"]') : null
    const fillerBox = r(filler)
    const fillerCovers = Boolean(
      fillerBox && frameBox &&
      fillerBox.w >= frameBox.w - 1 && fillerBox.h >= frameBox.h - 1,
    )

    /* ---- Navigation collision ----------------------------------------
       The rail is fixed, so its rect and the content rects share the same
       coordinate space and can be intersected directly. Anything with a
       positive overlap area is a collision. */
    const railBox = r(rail)
    const overlaps = []
    if (railBox) {
      /* Both grid lists are collision targets. Naming is by document order, which is
       the capabilities list first and the focus list second. */
      const targets = [
        ['card', document.querySelector('aside > div')],
        ['headline', h1],
        ...[...document.querySelectorAll('section p')].map((p, i) => [`p${i}`, p]),
        ...[...document.querySelectorAll('section a, section button')]
          .filter((el) => el.closest('nav') === null)
          .map((el, i) => [`cta${i}`, el]),
        ['stats', document.querySelector('[data-stats]')],
        ['typed', document.querySelector('[data-typed]')],
      ]
      for (const [name, el] of targets) {
        const b = r(el)
        if (!b) continue
        const ox = Math.min(b.right, railBox.right) - Math.max(b.x, railBox.x)
        const oy = Math.min(b.bottom, railBox.bottom) - Math.max(b.y, railBox.y)
        if (ox > 0 && oy > 0) overlaps.push(`${name}(${Math.round(ox)}x${Math.round(oy)})`)
      }
    }

    /* ---- Text overflow ------------------------------------------------
       Elements that are clipped on purpose must not be reported: `.sr-only`,
       which is 1x1 and hidden by definition and only exists to carry text to a
       screen reader, and anything inside the stats row, where a long label is
       allowed to be trimmed by its own box rather than push the grid wider.
       Anything else reporting scrollWidth > clientWidth is a real defect. */
    const clipped = []
    const deliberatelyClipped = (el) =>
      el.closest('.sr-only') !== null || el.closest('[data-stats]') !== null
    for (const el of document.querySelectorAll('section *')) {
      if (el.children.length) continue
      const txt = (el.textContent || '').trim()
      if (!txt) continue
      if (deliberatelyClipped(el)) continue
      if (el.scrollWidth > el.clientWidth + 1) clipped.push(txt.slice(0, 18))
    }

    const lines = [...(h1?.querySelectorAll(':scope > span') ?? [])].map((s) => {
      const b = r(s)
      const fs = parseFloat(getComputedStyle(s).fontSize)
      return { text: s.textContent, w: Math.round(b.w), h: Math.round(b.h), rows: +(b.h / (fs * 1.03)).toFixed(2) }
    })

    /* ---- Composition: shared centre axis ---------------------------------
       Centres of the blocks the brief asks to align, plus the right edge of the
       content column and the x it must stay left of (the reserved rail strip).
       Collected here because it needs the same rect helper.

       The axis, not the left edge: the hero's content column is centred, so the
       blocks have deliberately different widths — the badge is narrower than the
       headline — and comparing their left edges would report a skew that is the
       whole point of the design. What has to hold is that they share a centre. */
    const centerOf = (el) => {
      const b = r(el)
      return b ? Math.round(b.x + b.w / 2) : null
    }
    /* Scope to the content column. A bare `section a` also matches the card's
       mailto/Hire Me links and the rail, which sit outside the column, so their
       centres would be compared against the headline's and the check would
       report a skew that does not exist. */
    const columnEl = document.querySelector('[data-hero-column]')
    const columnBox = r(columnEl)
    const columnAlign = [...(columnEl?.children ?? [])].map((el) => centerOf(el))
    const clearancePx = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-clearance-lg') ||
      getComputedStyle(document.documentElement).getPropertyValue('--nav-clearance'),
    ) || 0

    /* If the app failed to mount, every element above is null. Say so plainly
       rather than throwing an opaque getComputedStyle TypeError that hides the
       real console error. */
    const mounted = Boolean(h1 && aside && img && rail)

    return {
      mounted,
      /* Direct children of the content column: badge, headline, typed line, CTA
         row, stats block. Their centres are the grid the brief asks for. */
      centres: columnAlign.filter((v) => v !== null),
      columnCentre: centerOf(columnEl),
      contentRight: columnBox ? Math.round(columnBox.right) : 0,
      contentLimit: columnBox ? Math.round(doc.clientWidth - clearancePx) : 0,
      asideW: Math.round(r(aside)?.w ?? 0),
      asideH: Math.round(r(aside)?.h ?? 0),
      cardW: Math.round(r(aside?.firstElementChild)?.w ?? 0),
      cardH: Math.round(r(aside?.firstElementChild)?.h ?? 0),
      contentH: Math.round((r(aside?.firstElementChild)?.h ?? 0) - (frameBox?.h ?? 0)),
      portrait: frameBox ? `${Math.round(frameBox.w)}x${Math.round(frameBox.h)}` : '-',
      squareErr,
      objectFit: img ? getComputedStyle(img).objectFit : '-',
      fillerCovers,
      natural: img ? `${img.naturalWidth}x${img.naturalHeight}` : '-',
      rail: railBox ? `${Math.round(railBox.w)}x${Math.round(railBox.h)}` : '-',
      overlaps,
      clipped: [...new Set(clipped)],
      contentW: Math.round(r(h1?.closest('div'))?.w ?? 0),
      heroH: Math.round(r(document.querySelector('section'))?.h ?? 0),
      scrollH: doc.scrollHeight,
      overflowX: doc.scrollWidth > doc.clientWidth + 1,
      fontSize: h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize)) : 0,
      lines,
    }
  })

  /* ---- One scroller, and it is the document ---------------------------
     The architecture this script now guards, at every size rather than only at
     desktop:

       1. nothing on the page is a scrollport — no element computes
          `overflow-y: auto|scroll|overlay`, so no wheel gesture can be trapped
          by a box and no scrollbar belongs to anything but the browser;
       2. the document itself is long enough to scroll, so there is a page to
          scroll rather than a layout that merely looks scrollable;
       3. the profile card holds its viewport position while the document moves,
          which is what the sticky column is for.

     The wheel test is the one that matters most. A wheel gesture over the left
     column used to do nothing at all, because only the centre column scrolled;
     here the pointer is deliberately parked over the card and the gutter, and
     the document still moves. That is the difference between a page and a
     panel, and it is the kind of thing no static reading of the CSS can prove. */
  const scrollportAudit = await page.evaluate(() => {
    const offenders = []
    for (const el of document.querySelectorAll('*')) {
      /* `html` and `body` are excluded, and not as a convenience: `overflow-y`
         on them *is* the document scroller, and their initial value is `auto`.
         Flagging them would flag the one scrollport this page is supposed to
         have. Everything else is a candidate. */
      if (el === document.body || el === document.documentElement) continue
      const oy = getComputedStyle(el).overflowY
      if (oy === 'auto' || oy === 'scroll' || oy === 'overlay') {
        offenders.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${String(el.className).split(' ')[0]}`)
      }
    }
    const d = document.scrollingElement
    return { offenders, scrollH: d.scrollHeight, clientH: d.clientHeight }
  })
  const docScrolls = scrollportAudit.scrollH > scrollportAudit.clientH + 1

  /* Card position across a document scroll. */
  let cardShift = null
  const cardTopBefore = await page.evaluate(() => document.querySelector('aside').getBoundingClientRect().top)
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }))
  await page.waitForTimeout(120)
  const [cardTopAfter, scrolledTo] = await page.evaluate(() => [
    document.querySelector('aside').getBoundingClientRect().top,
    window.scrollY,
  ])
  cardShift = Math.abs(cardTopAfter - cardTopBefore)

  /* And again at the very bottom of the page, which is where a sticky column
     runs out of travel. A sticky element is confined to its containing block, so
     a card whose column is short relative to the content slides up with the last
     of the page — a visible change of layout at exactly the moment the reader
     reaches the end. Measured rather than assumed. */
  let cardShiftAtBottom = null
  if (s.w >= 1024) {
    await page.evaluate(() => window.scrollTo({ top: 1e6, behavior: 'instant' }))
    await page.waitForTimeout(120)
    cardShiftAtBottom = Math.abs(
      (await page.evaluate(() => document.querySelector('aside').getBoundingClientRect().top)) - cardTopBefore,
    )
  }

  /* A wheel gesture over the left column and over the page gutter. Neither is
     the content column any more, and both used to be dead zones at `lg`. */
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(100)
  await page.mouse.move(Math.round(s.w * 0.12), Math.round(s.h * 0.5))
  await page.mouse.wheel(0, 500)
  await page.waitForTimeout(250)
  const wheelOverGutter = await page.evaluate(() => window.scrollY)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(100)
  await page.mouse.move(Math.round(s.w * 0.5), Math.round(s.h * 0.5))
  await page.mouse.wheel(0, 500)
  await page.waitForTimeout(250)
  const wheelOverContent = await page.evaluate(() => window.scrollY)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))

  m.pinned = docScrolls
  m.scrollportOffenders = scrollportAudit.offenders
  m.docScrolls = docScrolls
  m.docScroll = `${scrollportAudit.scrollH} in ${scrollportAudit.clientH}`
  m.cardShift = cardShift
  m.cardShiftAtBottom = cardShiftAtBottom
  m.wheel = { gutter: wheelOverGutter, content: wheelOverContent, scrolledTo }

  rows.push({ ...s, ...m, errors: errors.length })

  /* ---- The scrolling architecture, at every size --------------------
     These are the brief's hard constraints, so they are measured rather than
     assumed: one natural page scroll, no nested scroller, no click needed to
     scroll, and the pinned left column stays put while it happens. */
  if (!m.docScrolls) {
    fails.push(`${s.w}x${s.h}: the document does not scroll (${m.docScroll}) — there is no page to read`)
  }
  if (m.scrollportOffenders.length) {
    fails.push(`${s.w}x${s.h}: inner scroll container(s) present: ${m.scrollportOffenders.join(', ')}`)
  }
  if (m.wheel.gutter <= 0) {
    fails.push(`${s.w}x${s.h}: a wheel gesture over the left column did not scroll the page`)
  }
  if (m.wheel.content <= 0) {
    fails.push(`${s.w}x${s.h}: a wheel gesture over the content did not scroll the page`)
  }
  /* The card's top edge must not move between the two positions, at the sizes
     where it is pinned. Reported because a sticky column that has run out of
     travel sits still for the wrong reason: it would pass this check while never
     having been pinned. The scroll has to have actually happened for the
     comparison to mean anything.

     Only from `lg` up. Below it the brief is a single-column page, and there the
     card is an ordinary block at the top of the flow: it scrolls away with the
     rest of the page, which is the intended mobile behaviour, not a defect. */
  if (s.w >= 1024 && (m.cardShift === null || m.cardShift > 1)) {
    fails.push(`${s.w}x${s.h}: the card moved ${Math.round(m.cardShift ?? 0)}px when the page scrolled`)
  }
  /* The card must still be pinned at the bottom of the page, not sliding up with
     the end of the content. */
  if (s.w >= 1024 && m.cardShiftAtBottom > 1) {
    fails.push(`${s.w}x${s.h}: the card moved ${Math.round(m.cardShiftAtBottom)}px at the bottom of the page — sticky ran out of travel`)
  }

  if (m.overflowX) fails.push(`${s.w}x${s.h}: horizontal overflow`)
  if (!m.mounted) fails.push(`${s.w}x${s.h}: app did not mount (hero/card/portrait/rail missing) — see console errors`)
  if (m.objectFit !== 'contain') fails.push(`${s.w}x${s.h}: portrait is ${m.objectFit}, not contain (would crop)`)
  if (m.squareErr > 0.02) fails.push(`${s.w}x${s.h}: avatar frame is not square (err ${m.squareErr})`)
  if (!m.fillerCovers) fails.push(`${s.w}x${s.h}: avatar filler layer does not cover the frame`)
  if (m.overlaps.length) fails.push(`${s.w}x${s.h}: rail overlaps ${m.overlaps.join(', ')}`)
  if (m.clipped.length) fails.push(`${s.w}x${s.h}: clipped text ${m.clipped.join(', ')}`)
  if (s.heroFits && m.heroH > s.h + 1) fails.push(`${s.w}x${s.h}: hero spills (${m.heroH - s.h}px)`)
  if (errors.length) fails.push(`${s.w}x${s.h}: ${errors.length} console error(s)`)

  /* ---- Composition: one centre axis, and room before the rail ------------
     The brief asks for headline, buttons and stats on one axis and for the dead
     space beside the rail to be reduced. Both are measurable, so they are
     measured rather than eyeballed: every content block must be centred on the
     column, and nothing may reach into the strip --nav-clearance reserves. */
  const centres = m.centres
  const skew = Math.max(...centres.map((c) => Math.abs(c - m.columnCentre)))
  if (skew > 1) fails.push(`${s.w}x${s.h}: content blocks off the centre axis by ${skew}px (${centres.join('/')} vs ${m.columnCentre})`)
  if (m.contentRight > m.contentLimit) {
    fails.push(`${s.w}x${s.h}: content runs ${m.contentRight - m.contentLimit}px into the rail clearance`)
  }

  await page.close()
}

await browser.close()
server.close()

const pad = (v, n) => String(v).padEnd(n)
console.log(
  pad('viewport', 11) + pad('cardW', 7) + pad('cardH', 7) + pad('contentH', 10) + pad('avatar', 11) +
  pad('sqErr', 8) + pad('fit', 5) + pad('rail', 10) + pad('contW', 7) + pad('h1px', 6) +
  pad('lines', 9) + pad('ctrSkew', 9) + pad('pgScrolls', 11) + pad('cardMv', 8) + pad('cardEnd', 9) + pad('inner', 7) +
  pad('wheelL/C', 11) + pad('ovfX', 6) + pad('scrollH', 9) + 'err',
)
for (const r of rows) {
  const maxLine = Math.max(...r.lines.map((l) => l.w))
  const rows_ = r.lines.map((l) => l.rows).join('/')
  const fits = !r.heroFits ? 'n/a' : r.heroH <= r.h + 1 ? 'yes' : `NO+${r.heroH - r.h}`
  const skew = r.columnCentre === null ? 'n/a' : Math.max(...r.centres.map((c) => Math.abs(c - r.columnCentre)))
  console.log(
    pad(`${r.w}x${r.h}`, 11) + pad(r.cardW, 7) + pad(r.cardH, 7) + pad(r.contentH, 10) + pad(r.portrait, 11) +
    pad(r.squareErr, 8) + pad(fits, 5) + pad(r.rail, 10) + pad(r.contentW, 7) + pad(r.fontSize, 6) +
    pad(`${maxLine} ${rows_}`, 9) + pad(skew, 9) +
    pad(r.docScrolls ? 'yes' : 'NO', 11) +
    pad(r.cardShift === 0 ? '0px' : `${Math.round(r.cardShift)}px`, 8) +
    pad(r.cardShiftAtBottom === null ? 'n/a' : r.cardShiftAtBottom === 0 ? '0px' : `${Math.round(r.cardShiftAtBottom)}px`, 9) +    pad(r.scrollportOffenders.length, 7) +
    pad(`${r.wheel.gutter}/${r.wheel.content}`, 11) +
    pad(r.overflowX ? 'YES' : 'no', 6) + pad(r.scrollH, 9) + r.errors,
  )
}

console.log('\n' + (fails.length ? `${fails.length} FAILING:\n  - ` + fails.join('\n  - ') : 'All layout checks passed.'))

// A non-zero exit is what makes `npm run check:layout` usable as a gate.
process.exitCode = fails.length ? 1 : 0
