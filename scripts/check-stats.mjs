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
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.json': 'application/json',
}
const EXPECTED = '20/35/5/24'
const EXPECTED_LABELS = 'Clients|Projects|Years Experience|Technologies'
const STATIC_TYPED_LINE = 'Building Digital Products From Idea to Launch.'

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p === '/') p = '/index.html'

  try {
    const b = await readFile(join(ROOT, normalize(p).replace(/^([/\\])+/, '')))
    res.writeHead(200, { 'Content-Type': MIME[extname(p)] ?? 'application/octet-stream' })
    res.end(b)
  } catch {
    res.writeHead(404).end('nf')
  }
})
await new Promise((r) => server.listen(PORT, r))

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const fails = []
const ok = (label, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  ' + detail : ''}`)
  if (!cond) fails.push(label)
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
page.on('pageerror', (e) => errs.push(String(e)))
await page.goto(TARGET, { waitUntil: 'load' })
await page.waitForTimeout(2400)

const structure = await page.evaluate((staticTypedLine) => {
  const row = document.querySelector('[data-stats]')
  const cells = [...document.querySelectorAll('[data-stat-value]')]
  const items = [...(row?.children ?? [])]
  const allowedHeroAnimations = new Set(['none', 'reveal-rise', 'status-pulse', 'strip-drift'])

  return {
    exists: Boolean(row),
    tag: row?.tagName,
    count: cells.length,
    shown: cells.map((c) => c.textContent.trim()).join('/'),
    expected: cells.map((c) => c.getAttribute('data-stat-value')).join('/'),
    labels: items.map((item) => item.querySelector('dt')?.textContent.trim() ?? '').join('|'),
    hasTerms: items.every((item) => item.querySelectorAll('dt').length === 1),
    hasDefinitions: items.every((item) => item.querySelectorAll('dd[data-stat-value]').length === 1),
    ariaHidden: cells.some((c) => c.getAttribute('aria-hidden') === 'true'),
    animations: [row, ...cells].filter(Boolean).map((el) => getComputedStyle(el).animationName),
    transforms: [row, ...cells].filter(Boolean).map((el) => getComputedStyle(el).transform),
    unexpectedHeroAnimations: [...document.querySelectorAll('#hero *')]
      .map((el) => `${el.className || el.tagName}:${getComputedStyle(el).animationName}`)
      .filter((entry) => !allowedHeroAnimations.has(entry.split(':').at(-1))),
    typedLine: [...document.querySelectorAll('#hero p')]
      .map((el) => el.textContent.trim())
      .find((text) => text.includes(staticTypedLine)) ?? '',
    hasTypewriterHook: Boolean(document.querySelector('[data-typed]')),
  }
}, STATIC_TYPED_LINE)

ok('stats row renders', structure.exists)
ok('stats row is a definition list', structure.tag === 'DL', String(structure.tag))
ok('exactly four stats', structure.count === 4, `(${structure.count})`)
ok('stats show their final values immediately', structure.shown === EXPECTED, structure.shown)
ok('data values match rendered values', structure.expected === EXPECTED, structure.expected)
ok('stats are Clients / Projects / Years Experience / Technologies', structure.labels === EXPECTED_LABELS, structure.labels)
ok('each stat has one term', structure.hasTerms)
ok('each stat has one definition', structure.hasDefinitions)
ok('visible stat values are accessible, not hidden from AT', !structure.ariaHidden)
ok('no animation is running on the stats', structure.animations.every((a) => a === 'none'), structure.animations.join(','))
ok('nothing in the stats row is translated', structure.transforms.every((t) => t === 'none'), structure.transforms.join(','))
ok('the hero runs no unexpected animations', structure.unexpectedHeroAnimations.length === 0, structure.unexpectedHeroAnimations.join(' | '))
ok('hero support line is stable and complete', structure.typedLine === STATIC_TYPED_LINE, structure.typedLine)
ok('old typewriter hook is gone', !structure.hasTypewriterHook)

const phone = await browser.newPage({ viewport: { width: 360, height: 800 } })
await phone.goto(TARGET, { waitUntil: 'load' })
await phone.waitForTimeout(600)
const phoneStats = await phone.evaluate(() => ({
  shown: [...document.querySelectorAll('[data-stat-value]')].map((c) => c.textContent.trim()).join('/'),
  doc: document.documentElement.scrollWidth,
  view: document.documentElement.clientWidth,
}))
ok('mobile stats are final without waiting for a count', phoneStats.shown === EXPECTED, phoneStats.shown)
ok('mobile has no horizontal overflow', phoneStats.doc === phoneStats.view, `${phoneStats.doc}/${phoneStats.view}`)
await phone.close()

{
  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await rm.goto(TARGET, { waitUntil: 'load' })
  await rm.waitForTimeout(300)
  const reduced = await rm.evaluate(() => ({
    shown: [...document.querySelectorAll('[data-stat-value]')].map((c) => c.textContent.trim()).join('/'),
    scrolling: getComputedStyle(document.documentElement).scrollBehavior,
  }))
  ok('reduced-motion: final values on the first sample', reduced.shown === EXPECTED, reduced.shown)
  ok('reduced-motion: the page does not smooth-scroll', reduced.scrolling === 'auto', reduced.scrolling)
  await rm.close()
}

ok('no page errors', errs.length === 0, errs.join(' | '))

await browser.close()
server.close()
console.log(fails.length ? `\n${fails.length} FAILING: ${fails.join(', ')}` : '\nAll checks passed.')
process.exitCode = fails.length ? 1 : 0
