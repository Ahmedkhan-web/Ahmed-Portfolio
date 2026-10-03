import { chromium } from 'playwright-core'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const ROOT = fileURLToPath(new URL('../dist', import.meta.url))
const PORT = 4187
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

const shot = (await page.screenshot({ type: 'png' })).toString('base64')

// Measure the backdrop alone: hide the hero content and toggle the scrim,
// so only the image (+ optionally the scrim) remains and text can't skew
// the numbers. The Backdrop is a direct child of <section>, so it stays
// visible while the content wrapper is hidden.
const grab = async () => (await page.screenshot({ type: 'png' })).toString('base64')

await page.evaluate(() => {
/* Hide the shell's content — the navigation rail and the row holding the card
     and the content column — leaving only the backdrop itself.

      This used to read `section > *:not([aria-hidden])`, which was written when
      the backdrop was a child of the hero section. It moved out to the shell when
      the pinned layout landed, so the selector now matches nothing: the rail and
      all three sections stayed in the frame and their type contaminated every
      number below. The rail in particular is a frosted panel, so it was being
      measured as part of the artwork.

      Nothing here depends on what scrolls. The backdrop is `fixed`, so it covers
      the viewport at scroll position zero whatever the scroller is, and this only
      ever samples the first screen. */
  const shell = document.querySelector('#root > div')
  for (const el of shell.children) {
    if (el.getAttribute('aria-hidden') === 'true') continue
    el.style.visibility = 'hidden'
  }
})
const scrimOn = await grab()
await page.evaluate(() => {
  document.querySelector('.scrim').style.display = 'none'
})
const scrimOff = await grab()

const stats = await page.evaluate(async ({ on, off }) => {
  const analyse = async (b64) => {
    const img = new Image()
    await new Promise((r) => { img.onload = r; img.src = 'data:image/png;base64,' + b64 })
    const cv = document.createElement('canvas')
    cv.width = img.width; cv.height = img.height
    const ctx = cv.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0)
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data
    const lum = []
    let gSum = 0, bSum = 0, rSum = 0, n = 0, emerald = 0
    for (let i = 0; i < d.length; i += 4) {
      const R = d[i], G = d[i + 1], B = d[i + 2]
      lum.push(0.2126 * R + 0.7152 * G + 0.0722 * B)
      rSum += R; gSum += G; bSum += B; n++
      if (G > R + 5 && G > 15) emerald++
    }
    lum.sort((a, b) => a - b)
    const q = (f) => +lum[Math.floor(lum.length * f)].toFixed(1)
    return {
      p05: q(0.05), p50: q(0.5), p95: q(0.95), p99: q(0.99), max: +lum[lum.length - 1].toFixed(1),
      meanR: +(rSum / n).toFixed(1), meanG: +(gSum / n).toFixed(1), meanB: +(bSum / n).toFixed(1),
      greenMinusRed: +((gSum - rSum) / n).toFixed(2),
      emeraldPct: +((emerald / n) * 100).toFixed(2),
    }
  }
  return { on: await analyse(on), off: await analyse(off) }
}, { on: scrimOn, off: scrimOff })

const pad = (s, n) => String(s).padEnd(n)
console.log(pad('metric', 15) + pad('art alone', 14) + 'art + shipped scrim')
for (const k of ['p05', 'p50', 'p95', 'p99', 'max', 'meanR', 'meanG', 'meanB', 'greenMinusRed', 'emeraldPct']) {
  console.log(pad(k, 15) + pad(stats.off[k], 14) + stats.on[k])
}
await browser.close(); server.close()
