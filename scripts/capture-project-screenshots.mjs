import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUT = fileURLToPath(new URL('../src/assets/projects', import.meta.url))

const sites = [
  ['canada-exim', 'https://canadaexim.com/'],
  ['balochistan-services', 'https://balochistan-services.vercel.app/'],
  ['ai-chatbot', 'https://ai-chat-boot-nu.vercel.app/'],
  ['weather-app', 'https://ahmedkhan-web.github.io/weather-app/'],
  ['ecommerce-site', 'https://ahmedkhan-web.github.io/Ecommerce-Web-site/'],
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: CHROME, headless: true })

for (const [name, url] of sites) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 })
  page.setDefaultTimeout(45000)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {})
  await page.waitForTimeout(1800)
  await page.screenshot({
    path: join(OUT, `${name}.jpg`),
    type: 'jpeg',
    quality: 82,
    fullPage: false,
  })
  await page.close()
  console.log(`${name}  ${url}`)
}

await browser.close()
