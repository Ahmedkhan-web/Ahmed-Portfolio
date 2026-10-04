import { chromium } from 'playwright-core'
import { createServer } from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mkdirSync } from 'node:fs'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const ROOT = fileURLToPath(new URL('../dist', import.meta.url))
const SHOTS = fileURLToPath(new URL('../shots', import.meta.url))
const PORT = 4184
const TARGET = `http://localhost:${PORT}/`

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.txt': 'text/plain', '.json': 'application/json',
}
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p === '/') p = '/index.html'
  try {
    const body = await readFile(join(ROOT, normalize(p).replace(/^([/\\])+/, '')))
    res.writeHead(200, { 'Content-Type': MIME[extname(p)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})
await new Promise((r) => server.listen(PORT, r))
mkdirSync(SHOTS, { recursive: true })

/* Brings the stats row into view if the fold is above it, waits for the counter
   to land on its final figures, then returns the page to the top so the shot
   that follows has the same composition as every other one.

   Expected values are read from `data-stat-value` rather than written out here,
   so this helper cannot disagree with the data file. Returns what the row
   actually rendered, e.g. `20/35/5/24`. */
async function settleStats(page) {
  await page.evaluate(() => document.querySelector('[data-stats]')?.scrollIntoView({ block: 'center' }))
  const read = () =>
    page.evaluate(() => {
      const cells = [...document.querySelectorAll('[data-stat-value]')]
      return {
        shown: cells.map((c) => c.textContent.trim()).join('/'),
        expected: cells.map((c) => c.getAttribute('data-stat-value')).join('/'),
      }
    })

  let row = await read()
  /* 40 x 150ms = 6s, well past the 1.5s count. A row that never settles returns
     whatever it was showing, which is the failure this check exists to catch. */
  for (let i = 0; i < 40 && row.shown !== row.expected; i++) {
    await page.waitForTimeout(150)
    row = await read()
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  return row.shown
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const fails = []
const ok = (label, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  ' + detail : ''}`)
  if (!cond) fails.push(label)
}

// ---- 0. Entrance is viewport-driven, and replays on every return ----------
/* Four claims, and each one fails differently:

   1. AT LOAD, the blocks below the fold must still be hidden. A reveal that
      animates on the mount instead of on arrival finishes its stagger off
      screen, and the section then arrives already still — which looks exactly
      like working, and is the whole defect.
   2. WHILE A BLOCK IS IN VIEW it must be fully visible and untransformed. This
      is sampled per scroll step rather than at the end of the walk, because a
      reveal that never fires leaves content permanently invisible and only the
      walk tells the difference — and because an element that has been *passed*
      is now expected to be hidden again, so an end-of-walk reading of the whole
      page would be measuring the wrong thing.
   3. LEAVING MUST RE-ARM. Scrolled past, a block takes its `data-reveal` off
      again, which is what lets it play a second time. A reveal that stayed
      `done` would pass every other check here while quietly breaking the one
      behaviour the reader is meant to see.
   4. THE SECOND PASS MUST ACTUALLY REPLAY — animations running again while the
      blocks come back into view, rather than the whole page sliding past already
      settled. Read as "did anything animate", not "is anything animating now":
      by the time the walk finishes, nothing should be. */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(TARGET, { waitUntil: 'load' })
  await page.waitForTimeout(2400)

  const belowFold = await page.evaluate(() => {
    /* "Below the fold" is measured against the viewport, which is now also the
       document scroller — so the window's own height is the boundary, and there
       is no box to intersect against. */
    const below = [...document.querySelectorAll('.reveal')].filter((el) => {
      const r = el.getBoundingClientRect()
      return r.top > document.documentElement.clientHeight || r.bottom < 0
    })
    return {
      n: below.length,
      allHidden: below.every((el) => +getComputedStyle(el).opacity === 0),
      heroRunning: document.querySelectorAll('#hero .reveal[data-reveal="done"]').length,
    }
  })
  ok('reveals below the fold are still hidden at load', belowFold.allHidden, `(${belowFold.n} waiting)`)
  ok('above-the-fold reveals have started on the first frame', belowFold.heroRunning > 0, `(${belowFold.heroRunning})`)

  /* Walk down the page the way a reader would — in steps, not one jump — so
     each section's reveals arrive through its own observer rather than all at
     once at the bottom.

     Each step polls rather than sleeping once, for two reasons. A reveal is
     `opacity: 0` for its whole `delay` — the animation's `backwards` fill holds
     the `from` state — so the slowest block in About is invisible for 860ms and
     then rises for 720ms; a single reading has to be taken after all of that,
     or it reports pending blocks as failures. And whether anything is animating
     is only true during the animation, so asking once at the end of the wait
     would always answer "no" and the replay claim would be untestable. */
  const walk = async () =>
    page.evaluate(async () => {
      const d = document.scrollingElement
      const step = Math.round(document.documentElement.clientHeight * 0.5)
      const arrivals = []
      const failures = []
      let peakRunning = 0

      const running = () =>
        [...document.querySelectorAll('.reveal')]
          .flatMap((e) => e.getAnimations())
          .filter((a) => a.playState === 'running').length

      for (let y = 0; y <= d.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' })

        const settle = 1900
        const until = performance.now() + settle
        while (performance.now() < until) {
          peakRunning = Math.max(peakRunning, running())
          await new Promise((r) => setTimeout(r, 80))
        }

        /* Anything wholly on screen has to be showing, which is the invariant
           that catches both directions of the re-arm: a block that animated in
           and was then re-armed while still visible, and a block that was never
           marked because a scroll step jumped it clean over the trigger line. A
           block *partly* off the top is expected to be hidden again — that is
           what passing it did. */
        const h = document.documentElement.clientHeight
        for (const el of document.querySelectorAll('.reveal')) {
          const r = el.getBoundingClientRect()
          if (r.top < 0 || r.bottom > h) continue
          arrivals.push(el)
          const cs = getComputedStyle(el)
          if (+cs.opacity !== 1 || cs.transform !== 'none') {
            failures.push(`${el.tagName}.${String(el.className).split(' ')[0]} o=${cs.opacity} t=${cs.transform}`)
          }
        }
      }
      return { arrived: arrivals.length, failures: failures.slice(0, 4), peakRunning }
    })

  const first = await walk()
  ok(
    'every reveal is fully visible while it is in view',
    first.failures.length === 0,
    first.failures.length ? first.failures.join(' | ') : `(${first.arrived} arrivals checked)`,
  )

  /* Back to the top, where the blocks that were passed are now far below the
     fold again. They should have handed their `data-reveal` back. */
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(500)
  const rearmed = await page.evaluate(() => {
    const passed = [...document.querySelectorAll('#about .reveal, #experience .reveal')].filter(
      (el) => el.getBoundingClientRect().top > 0,
    )
    return {
      n: passed.length,
      armed: passed.filter((el) => el.dataset.reveal === 'done').length,
    }
  })
  ok(
    'a block that has been passed re-arms itself',
    rearmed.n > 0 && rearmed.armed === 0,
    `(${rearmed.armed}/${rearmed.n} still marked done)`,
  )

  const second = await walk()
  ok(
    'the second pass plays the entrances again',
    second.peakRunning > 0 && second.failures.length === 0,
    `(${second.peakRunning} animations at peak)`,
  )
  await page.close()
}

// ---- 1. Entrance: everything must end fully visible -----------------------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(TARGET, { waitUntil: 'load' })
  await page.waitForTimeout(2400) // longest delay (560) + duration (720)

  const vis = await page.evaluate(() => {
    const out = []
    for (const el of document.querySelectorAll('#hero .reveal, aside.reveal')) {
      const cs = getComputedStyle(el)
      out.push({
        t: (el.textContent || '').trim().slice(0, 22),
        o: +cs.opacity,
        tr: cs.transform,
        anim: cs.animationFillMode,
      })
    }
    return out
  })
  ok('all first-screen reveals reached opacity 1', vis.every((v) => v.o === 1), `(${vis.length} elements)`)
  ok('no first-screen reveal left transformed', vis.every((v) => v.tr === 'none'), `sample=${vis[0]?.tr}`)

  // ---- 2. Hover: nothing moves, nothing glows, colour still reacts -------
  // The brief is explicit that the buttons stay fixed on hover — no lift, no
  // press, no sliding arrow — and that they do not light up under the pointer
  // either. So this asserts the absence of both movement and glow rather than
  // their presence, and reads `translate` as well as `transform` because
  // Tailwind v4 emits `-translate-y-*` as the standalone `translate` property.
  // Every CTA is checked, not just the card's: a hover rule is per-variant, and
  // one that passed on the primary would say nothing about the secondary.
  //
  // The glow assertions are the interesting half. "No glow" is a claim about a
  // property that has to be absent, not merely unchanged: a button that merely
  // stopped *animating* its shadow would pass a before/after comparison while
  // still casting one, which is the thing the design brief rules out. So both
  // states are required to be `none`, and the rest state is checked as well as
  // the hovered one.
  //
  // Selected by accessible name, not by href. Both the rail and the hero own a
  // `mailto:` link and a `#contact` link, and the rail is rendered first, so a
  // bare `a[href="#contact"]` query lands on the navigation icon instead of the
  // button the test is actually about. The label also contains a curly
  // apostrophe (U+2019), which a plain-quoted literal would silently miss.
  const read = (locator) =>
    locator.evaluate((el) => {
      const cs = getComputedStyle(el)
      return {
        transform: cs.transform,
        translate: cs.translate,
        boxShadow: cs.boxShadow,
        color: cs.color,
        borderColor: cs.borderTopColor,
        backgroundImage: cs.backgroundImage,
      }
    })
  const hover = async (locator) => {
    /* Park the pointer off the button first, so "before" is a genuine
       no-hover baseline rather than the tail of the previous button's hover. */
    await page.mouse.move(2, 2)
    await page.waitForTimeout(420)
    const before = await read(locator)
    const box = await locator.boundingBox()
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.waitForTimeout(450)
    return [before, await read(locator)]
  }

  /* Name patterns per CTA. The rail renders before the hero and links to the
     same anchors, so each query has to be specific enough to pick one element
     out of the page. */
  const CTAS = [
    { label: 'Hire Me', name: /^Hire Me/, primary: false },
    { label: 'Explore Experience', name: /^Explore Experience/, primary: true },
    { label: 'Let’s Talk', name: /Talk$/, primary: false },
  ]

  for (const { label, name, primary } of CTAS) {
    const cta = page.getByRole('link', { name })
    const count = await cta.count()
    ok(`exactly one "${label}" CTA`, count === 1, `(${count})`)
    if (count !== 1) continue

    const [before, after] = await hover(cta)
    ok(
      `"${label}" does not move on hover`,
      before.transform === after.transform && before.translate === after.translate,
      `transform ${before.transform}->${after.transform} | translate ${before.translate}->${after.translate}`,
    )
    ok(
      `"${label}" still reacts to hover (colour or fill)`,
      before.color !== after.color ||
        before.borderColor !== after.borderColor ||
        before.backgroundImage !== after.backgroundImage,
    )
    ok(
      `"${label}" casts no glow, at rest or hovered`,
      before.boxShadow === 'none' && after.boxShadow === 'none',
      `rest ${before.boxShadow} | hover ${after.boxShadow}`,
    )
    if (primary) {
      await page.screenshot({ path: join(SHOTS, 'hover-primary-cta.png') })
    }
  }
  await page.screenshot({ path: join(SHOTS, 'hover-hire-me.png') })

  // ---- 2b. The trailing arrow holds still too -----------------------------
  // The arrow is a child of the button, so a button that does not move can still
  // slide its own icon — movement by another name. Driven by a real mouse
  // position, since `:hover` is an input state and a synthetic event would not
  // put it in that state at all.
  //
  // Selected by role rather than by href: the primary CTA used to point at
  // #projects and that href is now data-driven, so a selector hard-coded to it
  // fails the moment the anchor changes — which it did when the button was
  // repointed at a section that actually exists.
  const arrow = page.getByRole('link', { name: /^Explore Experience/ }).locator('svg')
  await page.mouse.move(2, 2)
  await page.waitForTimeout(420)
  const arrowBefore = await arrow.evaluate((el) => getComputedStyle(el).transform)
  const primaryBox = await page.getByRole('link', { name: /^Explore Experience/ }).boundingBox()
  await page.mouse.move(primaryBox.x + primaryBox.width / 2, primaryBox.y + primaryBox.height / 2)
  await page.waitForTimeout(450)
  const arrowAfter = await arrow.evaluate((el) => getComputedStyle(el).transform)
  ok('CTA arrow does not translate on hover', arrowBefore === arrowAfter, `${arrowBefore} -> ${arrowAfter}`)

  // ---- 3. The pinned layout, on one natural page scroll -----------------
  /* The brief is that the card, the background image and the rail hold their
     position while the page scrolls as one document. Every part of that is
     measurable, so it is measured rather than assumed:

       - the document must be the scroller and must actually have somewhere to
         go, or "the card stays put" would be true only because nothing moves;
       - no element anywhere may compute `overflow-y: auto|scroll|overlay`. That
         is the nested-scroll-container test in its strongest form: an inner
         scrollport is not merely ugly here, it is what makes a wheel gesture
         dead outside the column and hands the page's scrollbar to a box;
       - the card's, rail's and backdrop's boxes must be identical before and
         after scrolling the document;
       - the backdrop must be fixed, not absolute — an absolute backdrop scrolls
         away with its parent and leaves later sections on flat black, which is
         invisible at rest and obvious in use. */
  const pinned = await page.evaluate(async () => {
    const doc = document.documentElement
    const card = document.querySelector('aside')
    const backdrop = document.querySelector('[aria-hidden="true"].fixed, .fixed[aria-hidden="true"]')
    const rail = document.querySelector('nav[aria-label="Primary"]')

    const box = (el) => {
      const r = el.getBoundingClientRect()
      return { top: r.top, left: r.left }
    }

    const before = { card: box(card), rail: box(rail), backdrop: box(backdrop) }

    window.scrollTo({ top: 700, behavior: 'instant' })
    /* One frame. The scroll is synchronous, so this is enough for layout — it is
       not waiting on an animation, since `behavior: 'instant'` skips it. */
    await new Promise((r) => requestAnimationFrame(r))

    const after = { card: box(card), rail: box(rail), backdrop: box(backdrop) }
    const moved = (k) => Math.abs(after[k].top - before[k].top)

    /* Every scrollport on the page, in one sweep. `html` and `body` are excluded
       because they *are* the document scroller — their initial `overflow-y` is
       `auto` — and including them would report the one scroller the brief asks
       for as the violation. */
    const scrollers = []
    for (const el of document.querySelectorAll('*')) {
      if (el === document.body || el === doc) continue
      const oy = getComputedStyle(el).overflowY
      if (oy === 'auto' || oy === 'scroll' || oy === 'overlay') scrollers.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0] || '—'}`)
    }

    const maxScroll = doc.scrollHeight - doc.clientHeight

    return {
      documentScrolls: doc.scrollHeight > doc.clientHeight + 1,
      scrollers,
      snap: getComputedStyle(doc).scrollSnapType,
      smooth: getComputedStyle(doc).scrollBehavior,
      scrolled: Math.round(window.scrollY),
      cardShift: moved('card'),
      railShift: moved('rail'),
      backdropShift: moved('backdrop'),
      backdropPosition: getComputedStyle(backdrop).position,
      /* Nothing pinned may be mid-animation at any point. The card, the rail and
         the backdrop have no entrance of their own — the card's runs once on
         load and is finished long before this measurement — so an animation
         still running here would mean a scroll handler somewhere is touching
         them. */
      pinnedAnimating: [card, rail, backdrop].flatMap((el) => el.getAnimations())
        .filter((a) => a.playState === 'running').length,
      pinnedTransforms: [card, rail, backdrop].map((el) => getComputedStyle(el).transform),
      rails: document.querySelectorAll('nav[aria-label="Primary"]').length,
      profiles: document.querySelectorAll('aside[aria-label="Profile"]').length,
      sections: ['hero', 'about', 'experience'].map((id) => {
        const el = document.getElementById(id)
        /* Document-absolute top, not `offsetTop`: that is measured against the
           nearest positioned ancestor, which is not the scroller here. */
        const top = el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null
        return {
          id,
          exists: Boolean(el),
          /* Reachable = its top edge is a position the document can actually be
             scrolled to. A section that exists but starts past the maximum scroll
             position would satisfy `exists` and still be partly unreadable. */
          reachable: top !== null && top <= maxScroll + 4,
        }
      }),
      railTargets: [...document.querySelectorAll('nav[aria-label="Primary"] a')].map((a) => {
        const id = a.getAttribute('href').slice(1)
        return { id, exists: Boolean(document.getElementById(id)) }
      }),
    }
  })

  ok('the document is the scrollport', pinned.documentScrolls)
  ok('nothing on the page is an inner scroll container', pinned.scrollers.length === 0, pinned.scrollers.join(', ') || 'none')
  ok('the card holds its position while the page scrolls', pinned.cardShift === 0, `moved ${pinned.cardShift}px`)
  ok('the rail holds its position while the page scrolls', pinned.railShift === 0, `moved ${pinned.railShift}px`)
  ok('the backdrop holds its position while the page scrolls', pinned.backdropShift === 0, `moved ${pinned.backdropShift}px`)
  ok('the backdrop is fixed, so later sections keep the artwork', pinned.backdropPosition === 'fixed', pinned.backdropPosition)
  ok('nothing pinned is transformed or animating', pinned.pinnedAnimating === 0 && pinned.pinnedTransforms.every((t) => t === 'none'), pinned.pinnedTransforms.join(','))
  /* Free scrolling: the page must not pull the reader back onto a section edge
     after a gesture. Anchor links land exactly without it. */
  ok('the page scrolls freely, with no snap', pinned.snap === 'none', pinned.snap)
  ok('the page still scrolls smoothly', pinned.smooth === 'smooth', pinned.smooth)
  ok('there is exactly one navigation rail', pinned.rails === 1, `(${pinned.rails})`)
  ok('there is exactly one profile card', pinned.profiles === 1, `(${pinned.profiles})`)
  ok(
    'hero, about and experience all exist',
    pinned.sections.every((s) => s.exists),
    pinned.sections.map((s) => `${s.id}:${s.exists ? 'yes' : 'MISSING'}`).join(' '),
  )
  ok(
    'every section is reachable by anchor scroll',
    pinned.sections.every((s) => s.reachable),
    pinned.sections.map((s) => `${s.id}:${s.reachable ? 'yes' : 'UNREACHABLE'}`).join(' '),
  )
  ok(
    'every rail link points at a section that exists',
    pinned.railTargets.every((t) => t.exists),
    pinned.railTargets.map((t) => `${t.id}:${t.exists ? 'yes' : 'MISSING'}`).join(' '),
  )

  /* THE WHEEL TEST, and it is the one that matters most. A wheel gesture must
     move the whole page from anywhere on screen — over the pinned card, over the
     gutter, over the rail — with no click first. This is what the old inner
     scrollport broke: the pointer had to be inside the centre column or nothing
     happened at all, so the page looked broken until you hovered the right strip.
     Measured at the left edge, the middle and the right edge. */
  for (const [label, x] of [['left column', 0.12], ['content', 0.5], ['right edge', 0.93]]) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.waitForTimeout(80)
    await page.mouse.move(Math.round(1440 * x), 450)
    await page.mouse.wheel(0, 500)
    await page.waitForTimeout(300)
    const y = await page.evaluate(() => Math.round(window.scrollY))
    ok(`the wheel scrolls the page over the ${label}, with no click first`, y > 0, `scrolled to ${y}px`)
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(120)

  /* Anchor navigation is now the browser's own: there is no scroll container to
     delegate to, so a plain fragment link is all it takes. If this ever needs
     JavaScript again, that is the regression this check exists to catch.

     The landing position is the section's `scroll-margin-top` and not zero: the
     sections carry a gutter-sized scroll margin so an anchor jump cannot tuck a
     heading under the sticky card's gutter line. Asserting `top === 0` would
     fail on correct behaviour, so the expected position is read from the CSS. */
  await page.getByRole('link', { name: 'Experience', exact: true }).click()
  /* Poll until the position stops changing rather than waiting a fixed time.
     `scroll-behavior: smooth` means the browser picks the duration itself — it
     scales with distance and is frame-rate dependent, so any fixed wait is either
     too short (and reads a mid-flight position as a failure) or needlessly slow.
     Settling is the condition worth asserting: the scroll both started and
     finished. */
  const settled = await page.evaluate(async () => {
    const el = document.getElementById('experience')
    const style = getComputedStyle(el)
    const expected = Math.round(parseFloat(style.scrollMarginTop) || 0)
    let last = null
    let stable = 0
    for (let i = 0; i < 80; i++) {
      const top = Math.round(el.getBoundingClientRect().top)
      if (top === last) {
        if (++stable >= 3) return { top, expected, settled: true }
      } else {
        stable = 0
      }
      last = top
      await new Promise((r) => setTimeout(r, 60))
    }
    return { top: last, expected, settled: false }
  })
  ok(
    'a rail link scrolls the page to its section',
    settled.settled && Math.abs(settled.top - settled.expected) < 4,
    `experience top at ${settled.top}px, scroll margin ${settled.expected}px${settled.settled ? '' : ' (never settled)'}`,
  )
  await page.screenshot({ path: join(SHOTS, 'experience-section.png') })

  /* And the active highlight has to follow. */
  const active = await page.evaluate(() =>
    document.querySelector('nav[aria-label="Primary"] a[data-active="true"]')?.getAttribute('href'),
  )
  ok('the rail highlights the section now in view', active === '#experience', String(active))

  /* Keyboard paging, with nothing focused. The old layout had to put a `tabIndex`
     on the scroll column so PageDown had a scrollport to act on; now the document
     is the scroller, so the keyboard works from a cold page with no focus stop
     manufactured for the purpose. Both halves matter: that it scrolls, and that
     the content column is not a tab stop. */
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.activeElement?.blur?.()
  })
  const mainFocus = await page.evaluate(() => {
    const main = document.querySelector('main')
    return { tabIndex: main.tabIndex, label: main.getAttribute('aria-label') }
  })
  ok('the content column is not a manufactured tab stop', mainFocus.tabIndex === -1, `tabIndex ${mainFocus.tabIndex}`)
  ok('the content column still has an accessible name', Boolean(mainFocus.label), String(mainFocus.label))

  const beforeKey = await page.evaluate(() => window.scrollY)
  await page.keyboard.press('PageDown')
  await page.waitForTimeout(700)
  const afterKey = await page.evaluate(() => Math.round(window.scrollY))
  ok('the keyboard scrolls the page with nothing focused', afterKey > beforeKey, `${beforeKey} -> ${afterKey}`)

  // ---- 4. Placeholder socials must not be focusable links -----------------
  const social = await page.evaluate(() => {
    const spans = [...document.querySelectorAll('aside span[title]')]
    return {
      count: spans.length,
      allUnlinked: spans.every((s) => s.tagName === 'SPAN' && !s.closest('a')),
      focusable: spans.filter((s) => s.tabIndex >= 0).length,
    }
  })
  ok('4 social placeholders present', social.count === 4, `(${social.count})`)
  ok('placeholders are inert spans, not links', social.allUnlinked)
  ok('no placeholder is keyboard focusable', social.focusable === 0)

  // ---- 4b. Icon systems: nav is stroked Lucide, socials are filled brands --
  // The social brand marks are hand-carried paths rather than Lucide components,
  // so nothing stops them drifting between the two rendering styles. Assert the
  // rendering style itself rather than the component, so a regression in either
  // file is caught.
  //
  // The socials are filled on purpose. They were stroked to match the nav, and
  // at 18px a stroked octocat / X / WhatsApp outline turns to scribble — the
  // counters close up and none of them reads as its own logo. The nav keeps its
  // Lucide strokes; the two sets are distinguished by the chips instead.
  const icons = await page.evaluate(() => {
    const read = (el) => {
      const cs = getComputedStyle(el)
      return { fill: cs.fill, stroke: cs.stroke }
    }
    const round = (n) => Math.round(n * 10) / 10

    /* Scope to the social list. The card also holds three Lucide meta icons and
       the arrow on the Hire Me button, so a bare `aside svg` query reads eight
       svgs and asserts the wrong thing about most of them. */
    const list = document.querySelector('aside ul[aria-label="Social profiles"]')
    const marks = [...list.querySelectorAll('svg')]
    const chips = [...list.querySelectorAll(':scope > li > *')]

    /* Centring: measure the space either side of the chips, inside the card's
       padded content box. The row's own box spans the full width, so the chips'
       span is what has to be centred. */
    const panel = list.closest('.glass-panel')
    const panelBox = panel.getBoundingClientRect()
    const panelStyle = getComputedStyle(panel)
    const inner = {
      left: panelBox.left + parseFloat(panelStyle.paddingLeft),
      right: panelBox.right - parseFloat(panelStyle.paddingRight),
    }
    const chipBoxes = chips.map((c) => c.getBoundingClientRect())
    const span = { left: chipBoxes[0].left, right: chipBoxes[chipBoxes.length - 1].right }

    return {
      nav: read(document.querySelector('nav[aria-label="Primary"] svg')),
      social: marks.map(read),
      socialCount: marks.length,
      markWidths: marks.map((m) => round(m.getBoundingClientRect().width)),
      chipWidths: chipBoxes.map((b) => round(b.width)),
      chipGaps: {
        left: round(span.left - inner.left),
        right: round(inner.right - span.right),
      },
    }
  })
  const outlined = (i) => i.fill === 'none' && i.stroke !== 'none'
  const filled = (i) => i.fill !== 'none' && i.stroke === 'none'
  ok('nav icons are stroked, not filled', outlined(icons.nav), JSON.stringify(icons.nav))
  ok(
    'all four social marks are filled brand glyphs',
    icons.social.length === 4 && icons.social.every(filled),
    JSON.stringify(icons.social),
  )
  ok(
    'every social chip is the same size',
    Math.max(...icons.chipWidths) - Math.min(...icons.chipWidths) < 0.6,
    icons.chipWidths.join('/'),
  )
  ok(
    'every social mark fills its chip identically',
    Math.max(...icons.markWidths) - Math.min(...icons.markWidths) < 0.6,
    icons.markWidths.join('/'),
  )
  ok(
    'the chip row is centred in the card',
    Math.abs(icons.chipGaps.left - icons.chipGaps.right) < 1,
    `left ${icons.chipGaps.left}px, right ${icons.chipGaps.right}px`,
  )

  // ---- 5. Contact/mailto integrity ---------------------------------------
  const mail = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="mailto:"]')].map((a) => a.getAttribute('href')),
  )
  ok('mailto targets are valid', mail.length > 0 && mail.every((m) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)), mail.join(','))
  await page.close()
}

// ---- 6. Reduced motion: content visible immediately, no stuck opacity ------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await page.goto(TARGET, { waitUntil: 'load' })
  /* Polled rather than sampled once. The point of this check is that nothing is
     ever hidden — including the blocks below the fold, which are normally hidden
     until they arrive — and a single early sample reports a machine that has not
     painted yet as a page that will not reveal. */
  let rm = { allVisible: false, n: 0 }
  for (let i = 0; i < 20; i++) {
    rm = await page.evaluate(() => {
      const els = [...document.querySelectorAll('.reveal')]
      return {
        allVisible: els.length > 0 && els.every((e) => +getComputedStyle(e).opacity === 1),
        anyDelay: els.some((e) => +getComputedStyle(e).animationDelay.replace('s', '') > 0.01),
        n: els.length,
        /* The counters must show their real figures immediately: with the setting
           on there is no counting at all, so a row still reading 0 here would mean
           the observer started regardless of the setting. */
        stats: [...document.querySelectorAll('[data-stat-value]')].map((s) => s.textContent.trim()),
        /* The document is the scroller, so the page's scroll behaviour is read
           off `html` rather than off any element. */
        scrolling: getComputedStyle(document.documentElement).scrollBehavior,
      }
    })
    if (rm.allVisible && rm.stats.join('/') === '20/35/5/24') break
    await page.waitForTimeout(100)
  }
  ok('reduced-motion: all visible without waiting', rm.allVisible, `(${rm.n})`)
  ok('reduced-motion: no residual stagger delay', !rm.anyDelay)
  ok('reduced-motion: stats show final values at once', rm.stats.join('/') === '20/35/5/24', rm.stats.join('/'))
  ok('reduced-motion: the page does not smooth-scroll', rm.scrolling === 'auto', rm.scrolling)
  await page.screenshot({ path: join(SHOTS, 'reduced-motion.png') })
  await page.close()
}

/* ---- 6b. No custom scrollbar UI anywhere --------------------------------
   The brief asks for zero visible scrollbar furniture: no custom scrollbar, no
   scroll track, no progress bar, no scroll-to-top button, nothing drawn by the
   page to stand in for the browser's own control.

   Checked against the built stylesheet rather than the DOM, because the way to
   customise a scrollbar without any element is `::-webkit-scrollbar` or
   `scrollbar-width`/`scrollbar-color` — neither of which appears in markup, and
   the first of which only exists in a rule. The DOM sweep afterwards covers the
   other half: no element that draws scroll furniture. */
{
  const cssFiles = (await readdir(join(ROOT, 'assets'))).filter((f) => f.endsWith('.css'))
  let css = ''
  for (const f of cssFiles) css += await readFile(join(ROOT, 'assets', f), 'utf8')

  const found = []
  for (const needle of ['::-webkit-scrollbar', 'scrollbar-width', 'scrollbar-color', 'scrollbar-gutter']) {
    if (css.includes(needle)) found.push(needle)
  }
  ok('the stylesheet customises no scrollbar', found.length === 0, found.join(', ') || 'none found')

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(TARGET, { waitUntil: 'load' })
  await page.waitForTimeout(600)

  const furniture = await page.evaluate(() => {
    /* Nothing that draws a scroll affordance. `position: fixed|sticky` on its own
       is not scroll UI — the backdrop, the rail and the card are all pinned, and
       that is the layout the brief asks for. What would be scroll UI is a pinned
       element whose own text says otherwise. */
    const words = /(scroll|progress|to top|back to top|page down)/i
    const hits = []
    for (const el of document.querySelectorAll('body *')) {
      const own = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join(' ')
      if (own && words.test(own)) hits.push(`${el.tagName.toLowerCase()}:"${own.slice(0, 24)}"`)
      if (words.test(el.getAttribute('aria-label') || '') || words.test(el.getAttribute('title') || '')) {
        hits.push(`${el.tagName.toLowerCase()}[aria-label/title]`)
      }
    }
    /* And no progress-style element: a fixed bar whose width is a percentage of
       the page is the other common way to draw one without saying "scroll". */
    const bars = [...document.querySelectorAll('body *')].filter((el) => {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed' || cs.width.endsWith('%')) return false
      const h = el.getBoundingClientRect()
      return h.height <= 4 && h.width > 40
    }).length
    return { hits, bars }
  })

  ok('no scroll indicator or scroll button in the markup', furniture.hits.length === 0, furniture.hits.join(', ') || 'none found')
  ok('no fixed progress bar in the markup', furniture.bars === 0, `${furniture.bars} found`)
  await page.close()
}

// ---- 7. Screenshots -------------------------------------------------------
// One per viewport the brief asks to be inspected, plus the two short-window
// stress cases. Saved to shots/ so the nine can be reviewed side by side.
//
// The counters wait for the stats row to enter the viewport, and on the three
// narrowest phones that row sits below the fold — so a shot taken straight after
// load would show a row of zeroes. Each page therefore scrolls the row into
// view, waits for the count to land, and only then returns to the top, which
// keeps the composition of the shot identical to before.
for (const s of [
  { n: '01-desktop-1920x1080', w: 1920, h: 1080 },
  { n: '02-laptop-1440x900', w: 1440, h: 900 },
  { n: '03-laptop-1366x768', w: 1366, h: 768 },
  { n: '04-tablet-1024x768', w: 1024, h: 768 },
  { n: '05-tablet-768x1024', w: 768, h: 1024 },
  { n: '06-mobile-430x932', w: 430, h: 932 },
  { n: '07-mobile-390x844', w: 390, h: 844 },
  { n: '08-mobile-375x812', w: 375, h: 812 },
  { n: '09-mobile-360x800', w: 360, h: 800 },
  { n: '10-stress-1366x660', w: 1366, h: 660 },
  { n: '11-stress-1920x720', w: 1920, h: 720 },
]) {
  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 })
  await page.goto(TARGET, { waitUntil: 'load' })
  await page.waitForTimeout(2400)
  const counted = await settleStats(page)
  ok(`${s.n}: stats settled on their final values`, counted === '20/35/5/24', counted)
  await page.screenshot({ path: join(SHOTS, `${s.n}.png`) })
  await page.close()
  console.log(`shot  ${s.n}`)
}

// ---- 8. Section shots ------------------------------------------------------
/* The eleven viewport shots above are all the first screen. These are the other
   two sections at a desktop and a phone size, taken after scrolling to them so
   their entrances have played — the whole point of the viewport-gated reveal is
   that this is when the section assembles, so a shot of it at scroll position
   zero would only ever show it waiting. */
for (const { viewport: s, ids } of [
  { viewport: { width: 1440, height: 900 }, ids: ['about', 'experience'] },
  { viewport: { width: 390, height: 844 }, ids: ['about', 'experience'] },
]) {
  const page = await browser.newPage({ viewport: s })
  await page.goto(TARGET, { waitUntil: 'load' })
  await page.waitForTimeout(2400)
  for (const id of ids) {
    await page.evaluate((target) => {
      document.getElementById(target).scrollIntoView({ behavior: 'instant' })
    }, id)
    /* The section's own stagger, longest delay plus the rise. */
    await page.waitForTimeout(1800)
    await page.screenshot({ path: join(SHOTS, `section-${id}-${s.width}x${s.height}.png`) })
    console.log(`shot  section-${id}-${s.width}x${s.height}`)
  }
  await page.close()
}

await browser.close()
server.close()
console.log(fails.length ? `\n${fails.length} FAILING: ${fails.join(', ')}` : '\nAll checks passed.')
process.exitCode = fails.length ? 1 : 0
