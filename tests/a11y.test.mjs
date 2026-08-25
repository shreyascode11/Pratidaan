import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { BASE_URL, clearLoginGate, createChecker, launch, visibleByXPath, wait } from './helpers.mjs'

/**
 * Accessibility regression guard.
 *
 * Runs axe-core (WCAG 2.1 A + AA) against each major screen. This caught two
 * real critical defects that visual review had missed: the wishlist heart
 * buttons on cards exposed no accessible name at all, and the hidden file
 * input behind the Upload button had no label.
 */

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')

const { check, report } = createChecker()
const { browser, page } = await launch()

async function auditScreen(label) {
  await page.evaluate(axeSource)
  const violations = await page.evaluate(async () => {
    const result = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    })
    return result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      sample: v.nodes[0]?.html.slice(0, 100) ?? '',
    }))
  })
  const summary = violations.map((v) => `${v.id}[${v.impact}]`).join(', ')
  check(`${label}: no WCAG 2.1 AA violations`, violations.length === 0, summary)
  return violations
}

await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
await wait(600)
await auditScreen('login gate')

await clearLoginGate(page, 'Alex Rivera')
await wait(500)
await auditScreen('browse')

const view = await visibleByXPath(page, 'button[normalize-space(.)="View"]')
await view.click()
await wait(700)
await auditScreen('item detail')

const message = await visibleByXPath(page, 'button[contains(., "Message")]')
await message.click()
await wait(600)
await auditScreen('chat panel')
const closeChat = await visibleByXPath(page, 'button[@aria-label="Close chat"]')
await closeChat.click()
await wait(400)

const back = await visibleByXPath(page, 'button[contains(., "Back to browse")]')
await back.click()
await wait(500)
const post = await visibleByXPath(page, 'button[contains(., "Post an Item")]')
await post.click()
await wait(600)
await auditScreen('post an item form')

const account = await visibleByXPath(page, 'button[@aria-label="Account"]')
await account.click()
await wait(500)
await auditScreen('profile')

await browser.close()
process.exit(report('accessibility') > 0 ? 1 : 0)
