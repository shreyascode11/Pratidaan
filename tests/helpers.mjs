import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

/**
 * Shared harness for the end-to-end suites.
 *
 * These tests drive a real Chrome against a real production build, rather
 * than mounting components in isolation — the bugs this project actually hit
 * (a lazy-loaded image that never loaded because it had no layout box, a
 * toast that silently ate clicks meant for the form beneath it, a grid that
 * overflowed only below the `lg` breakpoint) are all layout- and
 * browser-level, and none of them would surface in a JSDOM unit test.
 */

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4173'

function resolveChrome() {
  const found = CHROME_CANDIDATES.find((path) => existsSync(path))
  if (!found) {
    throw new Error(
      'No Chrome binary found. Set CHROME_PATH to your Chrome/Chromium executable.',
    )
  }
  return found
}

export async function launch() {
  const browser = await puppeteer.launch({
    executablePath: resolveChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars'],
  })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + (e.stack || e.message)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('CONSOLE: ' + m.text())
  })
  await page.setViewport({ width: 1280, height: 900 })
  return { browser, page, errors }
}

/** Collects pass/fail results so one suite can report them together. */
export function createChecker() {
  const log = []
  const check = (name, pass, extra = '') =>
    log.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`)
  const report = (suiteName) => {
    const failures = log.filter((l) => l.startsWith('FAIL'))
    console.log(`\n--- ${suiteName} ---`)
    console.log(log.join('\n'))
    console.log(`${failures.length} failures of ${log.length}`)
    return failures.length
  }
  return { check, report }
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/** First element matching an XPath that is actually rendered (non-zero box). */
export async function visibleByXPath(page, xpath) {
  const candidates = await page.$$('xpath///' + xpath)
  for (const c of candidates) {
    if (await c.boundingBox()) return c
  }
  return candidates[0]
}

/**
 * The app is gated behind signup, so nearly every suite has to get past it
 * first. Uses a unique email per run so repeat runs never collide.
 */
export async function clearLoginGate(page, name = 'Test User') {
  await wait(400)
  const gated = await page.evaluate(() =>
    document.body.innerText.includes('Create your account'),
  )
  if (!gated) return
  await page.type('#name', name, { delay: 2 })
  await page.type('#email', `test${Date.now()}@campus.edu`, { delay: 2 })
  await page.type('#password', 'testpass1', { delay: 2 })
  const gender = await visibleByXPath(page, 'button[normalize-space(.)="Male"]')
  await gender.click()
  const submit = await visibleByXPath(
    page,
    'button[normalize-space(.)="Create account"]',
  )
  await submit.click()
  await wait(700)
}
