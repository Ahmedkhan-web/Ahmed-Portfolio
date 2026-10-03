import { chromium } from 'playwright-core'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const ROOT = fileURLToPath(new URL('../dist', import.meta.url))
const PORT = 4201
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
    const b = await readFile(join(ROOT, normalize(p).replace(/^([/\\])+/, '')))
    res.writeHead(200, { 'Content-Type': MIME[extname(p)] ?? 'application/octet-stream' })
    res.end(b)
  } catch { res.writeHead(404).end('nf') }
})
await new Promise((r) => server.listen(PORT, r))

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const fails = []
const ok = (label, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  ' + detail : ''}`)
  if (!cond) fails.push(label)
}
const EXPECTED = '20/35/5/24'

/* ---------------------------------------------------------------------------
 *  This file used to check the right-to-left ticker that sat where the stats row
 *  now sits, and it still asserts the opposite of what that ticker did: the four
 *  figures are static, and nothing in the row travels sideways.
 *
 *  The hero has since gained a different moving element — the credibility strip
 *  under the numbers, which drifts left as a single surface. That is motion the
 *  brief asks for by name, so it is allowlisted below with the three animations
 *  that were already expected. Everything else in the hero still has to be
 *  still: an animation in this list is a decision, and one that is not in it is
 *  a regression.
 * -------------------------------------------------------------------------*/

// ---- 1. The row exists, and is still -------------------------------------
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
page.on('pageerror', (e) => errs.push(String(e)))
await page.goto(TARGET, { waitUntil: 'load' })

const structure = await page.evaluate(() => {
  const row = document.querySelector('[data-stats]')
  const cells = [...document.querySelectorAll('[data-stat-value]')]
  return {
    exists: Boolean(row),
    count: cells.length,
    shown: cells.map((c) => c.textContent.trim()),
    expected: cells.map((c) => c.getAttribute('data-stat-value')),
    labels: [...(row?.children ?? [])].map((c) => c.textContent.replace(/\d+/g, '').trim()),
    /* Anything with a running CSS animation on the row or its cells would be a
       leftover of the marquee, or a new movement nobody asked for. */
    animations: [row, ...cells].map((el) => getComputedStyle(el).animationName),
    transforms: [row, ...cells].map((el) => getComputedStyle(el).transform),
    /* The figures are hidden from assistive tech because they change every
       frame; the real values must therefore be readable somewhere. */
    srText: document.querySelector('[data-stats]') ? document.body.textContent : '',
    ariaHidden: cells.every((c) => c.getAttribute('aria-hidden') === 'true'),
  }
})
ok('stats row renders', structure.exists)
ok('exactly four stats', structure.count === 4, `(${structure.count})`)
ok(
  'stats are Clients / Projects / Years Experience / Technologies',
  structure.labels.join('|') === 'Clients|Projects|Years Experience|Technologies',
  structure.labels.join('|'),
)
ok('animating figures are hidden from AT', structure.ariaHidden)
ok(
  'final values are exposed to AT as text',
  structure.expected.every((v, i) => structure.srText.includes(`${v} ${structure.labels[i]}`)),
  structure.srText.match(/\d+ (Clients|Projects|Years Experience|Technologies)/g)?.join(', '),
)

// ---- 2. Nothing translates sideways, ever ---------------------------------
ok(
  'no animation is running on the stats',
  structure.animations.every((a) => a === 'none'),
  structure.animations.join(','),
)
ok(
  'nothing in the row is translated',
  structure.transforms.every((t) => t === 'none'),
  structure.transforms.join(','),
)

/* The old marquee's real defect was motion the visitor never asked for, so the
   check is on the whole hero rather than on the one element that used to
   scroll: any animated transform that is not one of the sanctioned animations
   is a regression. `strip-drift` is the credibility strip's own loop, and it is
   the one intentional piece of continuous motion in the hero. */
const SANCTIONED = new Set(['none', 'reveal-rise', 'caret-blink', 'status-pulse', 'strip-drift'])

const moving = await page.evaluate((sanctioned) => {
  const allowed = new Set(sanctioned)
  const out = []
  for (const el of document.querySelectorAll('#hero *')) {
    const cs = getComputedStyle(el)
    if (!allowed.has(cs.animationName)) {
      out.push(`${el.className || el.tagName}:${cs.animationName}`)
    }
  }
  return out
}, [...SANCTIONED])
ok('the hero runs no unexpected animations', moving.length === 0, moving.join(' | '))

// ---- 3. The count runs 0 -> final when the row enters the viewport --------
/* Sampled rather than asserted from the end state alone: a row that snapped
   straight to its final value would pass a final-value check while being exactly
   the thing the brief did not ask for.

   This runs on its own page, sampled from `commit` — before React has mounted —
   so the whole ramp is captured. Reading the figures on the page used for the
   checks above would start sampling seconds late, by which time the count has
   already finished, and the assertion would be measuring when it was read
   rather than what it did. */
const counter = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await counter.goto(TARGET, { waitUntil: 'commit' })
const growth = await counter.evaluate(async () => {
  const series = []
  for (let i = 0; i < 200; i++) {
    const cells = [...document.querySelectorAll('[data-stat-value]')]
    if (cells.length) {
      const row = document.querySelector('[data-stats]')
      const frame = cells.map((c) => +c.textContent.trim())
      const last = series[series.length - 1]
      /* The block's entrance transform is sampled alongside the figures, so the
         moment the first figure leaves zero can be checked against the moment
         the block stopped moving. */
      const still = getComputedStyle(row.closest('.reveal')).transform
      /* `at` is the poll index, so the wait before the count can be reported in
         approximate milliseconds — the entrance is 560ms of delay plus a 720ms
         rise, so a figure appearing at roughly 1.3s is the sequencing working,
         and one at 0.1s would mean it counted while still rising. */
      if (!last || frame.join('/') !== last.figures.join('/')) series.push({ figures: frame, still, at: i * 30 })
      if (frame.join('/') === '20/35/5/24') break
    }
    await new Promise((r) => setTimeout(r, 30))
  }
  return series
})
await counter.close()

const frames = growth.map((g) => g.figures)
const first = frames[0].join('/')
const last = frames[frames.length - 1].join('/')
const expected = EXPECTED.split('/').map(Number)
ok('the count starts at zero', first === '0/0/0/0', `first sample ${first}`)
ok(
  'the count passes through intermediate values',
  frames.some((s) => s.every((v, j) => v > 0 && v < expected[j])),
  `${frames.length} distinct frames`,
)
ok('every figure only ever climbs', frames.every((s, i) => i === 0 || s.every((v, j) => v >= frames[i - 1][j])))
ok('no figure ever overshoots', frames.every((s) => s.every((v, j) => v <= expected[j])))
ok('the count lands on the final values', last === EXPECTED, `${first} -> ${last}`)

/* The ordering the brief asks for: the row has to be settled before it counts.
   If the count started while the block was still rising, the first non-zero
   frame would carry a transform — this is the assertion that would catch it. */
const moved = growth.filter((g) => g.figures.some((v) => v > 0)).find((g) => g.still !== 'none')
const began = growth.find((g) => g.figures.some((v) => v > 0))?.at
ok(
  'the count does not begin until the row has stopped moving',
  !moved && began > 400,
  moved ? `counting while transform was ${moved.still}` : `began ~${began}ms after mount`,
)

// ---- 4. It waits for the viewport, and only fires once -------------------
/* On a phone the row sits below the fold, which is the only way to see the
   gating behaviour: nothing may count while the row is off-screen, and scrolling
   it into view starts exactly one count. */
const phone = await browser.newPage({ viewport: { width: 360, height: 800 } })
await phone.goto(TARGET, { waitUntil: 'load' })
await phone.waitForTimeout(2200)
const beforeScroll = await phone.evaluate(() =>
  [...document.querySelectorAll('[data-stat-value]')].map((c) => c.textContent.trim()).join('/'),
)
ok('nothing counts while the row is below the fold', beforeScroll === '0/0/0/0', beforeScroll)

await phone.evaluate(() => document.querySelector('[data-stats]').scrollIntoView({ block: 'center' }))
/* The row is given its rise before it is allowed to count, and on a phone that
   rise is over a second long — so any fixed wait here lands mid-count and the
   assertion depends on how long the machine took. Both halves are polled
   instead: scrolling has to start a count, and that count has to finish. */
await phone.waitForFunction(
  () => [...document.querySelectorAll('[data-stat-value]')].some((c) => +c.textContent.trim() > 0),
  null,
  { timeout: 6000, polling: 50 },
)
const startedByScroll = await phone.evaluate(() =>
  [...document.querySelectorAll('[data-stat-value]')].map((c) => c.textContent.trim()).join('/'),
)
ok('scrolling it into view starts the count', startedByScroll !== '0/0/0/0', startedByScroll)

await phone.waitForFunction(
  (exp) => [...document.querySelectorAll('[data-stat-value]')].map((c) => c.textContent.trim()).join('/') === exp,
  EXPECTED,
  { timeout: 6000, polling: 100 },
)
const afterScroll = await phone.evaluate(() =>
  [...document.querySelectorAll('[data-stat-value]')].map((c) => c.textContent.trim()).join('/'),
)
ok('that count runs to the final values', afterScroll === EXPECTED, afterScroll)

/* A second pass must not restart from zero — the observer disconnects after the
   first intersection, so the figures stay put. */
await phone.evaluate(() => window.scrollTo(0, 0))
await phone.waitForTimeout(400)
await phone.evaluate(() => document.querySelector('[data-stats]').scrollIntoView({ block: 'center' }))
await phone.waitForTimeout(700)
const secondPass = await phone.evaluate(() =>
  [...document.querySelectorAll('[data-stat-value]')].map((c) => c.textContent.trim()).join('/'),
)
ok('the count does not restart on a second pass', secondPass === EXPECTED, secondPass)
await phone.close()

// ---- 5. Reduced motion: final values, no counting -------------------------
{
  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await rm.goto(TARGET, { waitUntil: 'load' })
  await rm.waitForTimeout(300)
  const rmShown = await rm.evaluate(() =>
    [...document.querySelectorAll('[data-stat-value]')].map((c) => c.textContent.trim()).join('/'),
  )
  ok('reduced-motion: final values on the first sample', rmShown === EXPECTED, rmShown)
  await rm.close()
}

// ---- 6. Typewriter cycles and is smooth -----------------------------------
const typed = await page.evaluate(async () => {
  const el = document.querySelector('[data-typed]')
  const txt = () => el.textContent.trim()
  const seen = []
  for (let i = 0; i < 40; i++) {
    const t = txt()
    if (!seen.length || seen[seen.length - 1] !== t) seen.push(t)
    await new Promise((r) => setTimeout(r, 400))
  }
  return { distinct: seen.length, frames: seen, complete: seen.filter((s) => s.endsWith('.') && s.length > 25) }
})
ok('typewriter is progressively revealing text', typed.distinct > 8, `${typed.distinct} distinct frames in 16s`)
/* Every frame of the sample is searched, not just the first few: the typewriter
   loops on its own clock, so where in that cycle the sampling happens to begin
   is arbitrary. Testing only the opening frames made this pass or fail on
   timing alone. */
ok('typewriter reaches a full sentence', typed.complete.length > 0, JSON.stringify(typed.complete.slice(0, 2)))

// ---- 7. The typewriter is centred, and still holds the required copy -------
const lines = await page.evaluate(async () => {
  const el = document.querySelector('[data-typed]')
  const sr = [...document.querySelectorAll('.sr-only')].map((s) => s.textContent).join(' ')
  return { sr, centred: getComputedStyle(el).textAlign }
})
for (const sentence of [
  'Building Digital Products From Idea to Launch.',
  'Engineering AI-Powered Digital Experiences.',
  'Turning Complex Problems Into Simple Products.',
  'Building Scalable Systems That Perform.',
]) {
  ok(`typed copy kept: "${sentence}"`, lines.sr.includes(sentence))
}
ok('typed line is centred on the hero axis', lines.centred === 'center', lines.centred)

ok('no page errors', errs.length === 0, errs.join(' | '))

await browser.close(); server.close()
console.log(fails.length ? `\n${fails.length} FAILING: ${fails.join(', ')}` : '\nAll checks passed.')
process.exitCode = fails.length ? 1 : 0