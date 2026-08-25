import {
  BASE_URL,
  clearLoginGate,
  createChecker,
  launch,
  visibleByXPath,
  wait,
} from './helpers.mjs'

const { check, report } = createChecker()
const { browser, page, errors } = await launch()

const cardCount = () => page.$$eval('article', (els) => els.length)

// ---------------------------------------------------------------- auth gate
await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
await wait(500)

const gate = await page.evaluate(() => ({
  hasNavbarSearch: !!document.querySelector('input[type="search"]'),
  cards: document.querySelectorAll('article').length,
  showsSignup: document.body.innerText.includes('Create your account'),
}))
check('gate is the first screen — no navbar', gate.hasNavbarSearch === false)
check('gate hides all listings', gate.cards === 0, `cards=${gate.cards}`)
check('gate shows the signup form', gate.showsSignup)

await page.keyboard.press('Escape')
await wait(250)
check(
  'Escape cannot bypass the gate',
  await page.evaluate(() => document.body.innerText.includes('Create your account')),
)

await clearLoginGate(page, 'Alex Rivera')
const total = await cardCount()
check('signing up lands on the marketplace', total > 0, `cards=${total}`)

// ------------------------------------------------------------ search/filter
await page.type('input[type="search"]', 'calc')
await wait(300)
const searchTitles = await page.$$eval('article h3', (e) => e.map((x) => x.textContent))
check(
  'live search narrows the grid',
  searchTitles.length > 0 && searchTitles.length < total,
  `${searchTitles.length} of ${total}`,
)
check(
  'every search hit actually matches the query',
  searchTitles.every((t) => t.toLowerCase().includes('calc')),
  searchTitles.join(' | '),
)

await page.click('button[aria-label="Clear search"]')
await wait(300)
check('clearing search restores every listing', (await cardCount()) === total)

const electronics = await visibleByXPath(
  page,
  'button[starts-with(normalize-space(.), "Electronics")]',
)
await electronics.click()
await wait(300)
const cats = await page.$$eval('article p.uppercase', (e) => [
  ...new Set(e.map((x) => x.textContent.trim())),
])
check('category filter isolates one category', cats.length === 1 && cats[0] === 'Electronics', cats.join(','))

const all = await visibleByXPath(page, 'button[starts-with(normalize-space(.), "All")]')
await all.click()
await wait(300)

// --------------------------------------------------------- detail + request
const view = await visibleByXPath(page, 'button[normalize-space(.)="View"]')
await view.click()
await wait(500)
const detail = await page.evaluate(() => document.body.innerText)
check('detail view names the poster', detail.includes('Posted by') || detail.includes('POSTED BY'))

const request = await visibleByXPath(
  page,
  'button[contains(., "Request this item") or contains(., "Propose a swap") or contains(., "Claim this item")]',
)
await request.click()
await wait(700)
const afterRequest = await page.evaluate(() => ({
  backOnGrid: document.querySelectorAll('article').length > 0,
  toast: document.querySelector('[role="status"]')?.textContent ?? '',
}))
check('requesting returns to the grid', afterRequest.backOnGrid)
check('requesting confirms with a toast', /sent to/i.test(afterRequest.toast), afterRequest.toast)

// ------------------------------------------------------------ post an item
const post = await visibleByXPath(page, 'button[contains(., "Post an Item")]')
await post.click()
await wait(500)

const submitEmpty = await visibleByXPath(page, 'button[normalize-space(.)="Publish listing"]')
await submitEmpty.click()
await wait(300)
check(
  'empty submit is blocked by validation',
  await page.evaluate(() => document.body.innerText.includes('Give your listing a title')),
)

check(
  'poster name is prefilled from the signed-in user',
  (await page.$eval('#poster', (el) => el.value)) === 'Alex Rivera',
)

await page.type('#title', 'Graphing calculator, barely used', { delay: 2 })
await page.select('#category', 'Electronics')

const aiButton = await visibleByXPath(page, 'button[contains(., "Generate with AI")]')
await aiButton.click()
await wait(600)
const generated = await page.$eval('#description', (el) => el.value)
check('AI assist fills the description', generated.length > 10, `${generated.length} chars`)

await page.evaluate(() => document.querySelector('#description').select())
await page.keyboard.type('Typed over the generated draft.', { delay: 2 })
check(
  'generated text stays editable',
  (await page.$eval('#description', (el) => el.value)) === 'Typed over the generated draft.',
)

const publish = await visibleByXPath(page, 'button[normalize-space(.)="Publish listing"]')
await publish.click()
await wait(700)
check('publishing adds the listing', (await cardCount()) === total + 1)
check(
  'new listing is first in the grid',
  (await page.$eval('article h3', (e) => e.textContent)).includes('Graphing calculator'),
)

// ----------------------------------------------- my listings: edit + remove
const account = await visibleByXPath(page, 'button[@aria-label="Account"]')
await account.click()
await wait(400)
const myListings = await visibleByXPath(page, 'button[contains(., "My Listings")]')
await myListings.click()
await wait(500)
check(
  'posted item appears under My Listings',
  await page.evaluate(() => document.body.innerText.includes('Graphing calculator')),
)

const edit = await visibleByXPath(page, 'button[@aria-label="Edit listing"]')
await edit.click()
await wait(500)
await page.evaluate(() => document.querySelector('#title').select())
await page.keyboard.type('Renamed calculator', { delay: 2 })
const save = await visibleByXPath(page, 'button[normalize-space(.)="Save changes"]')
await save.click()
await wait(600)
check(
  'edits persist back to My Listings',
  await page.evaluate(() => document.body.innerText.includes('Renamed calculator')),
)

const trash = await visibleByXPath(page, 'button[@aria-label="Remove listing"]')
await trash.click()
await wait(300)
check(
  'removal asks for confirmation first',
  await page.evaluate(() => document.body.innerText.includes('Remove it?')),
)
const confirm = await visibleByXPath(page, 'button[normalize-space(.)="Yes, remove"]')
await confirm.click()
await wait(500)
check(
  'confirmed removal empties My Listings',
  await page.evaluate(() => document.body.innerText.includes("haven't posted anything")),
)

// ------------------------------------------------------- cart -> checkout
await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
await clearLoginGate(page, 'Alex Rivera')
const sellItem = await visibleByXPath(page, 'button[normalize-space(.)="View"]')
await sellItem.click()
await wait(500)

const addToCart = await visibleByXPath(page, 'button[@aria-label="Add to cart"]')
if (addToCart) {
  await addToCart.click()
  await wait(300)
  const cartBtn = await visibleByXPath(page, 'button[@aria-label="Cart"]')
  await cartBtn.click()
  await wait(500)
  const checkout = await visibleByXPath(page, 'button[contains(., "Proceed to Checkout")]')
  await checkout.click()
  await wait(500)
  check(
    'checkout is clearly labelled a demo',
    await page.evaluate(() => document.body.innerText.toLowerCase().includes('demo')),
  )

  const payEmpty = await visibleByXPath(page, 'button[contains(., "Pay")]')
  await payEmpty.click()
  await wait(300)
  check(
    'checkout validates the card before paying',
    await page.evaluate(() => document.body.innerText.includes('16 digits')),
  )

  await page.type('#name', 'Alex Rivera', { delay: 2 })
  await page.type('#cardNumber', '4242424242424242', { delay: 2 })
  check(
    'card number is formatted as it is typed',
    (await page.$eval('#cardNumber', (el) => el.value)) === '4242 4242 4242 4242',
  )
  await page.type('#expiry', '1230', { delay: 2 })
  await page.type('#cvv', '123', { delay: 2 })
  const pay = await visibleByXPath(page, 'button[contains(., "Pay")]')
  await pay.click()
  await wait(2400)
  check(
    'payment reaches the simulated success screen',
    await page.evaluate(() => document.body.innerText.includes('Payment simulated successfully')),
  )

  const done = await visibleByXPath(page, 'button[contains(., "Back to browse")]')
  await done.click()
  await wait(700)
  const cartAfter = await visibleByXPath(page, 'button[@aria-label="Cart"]')
  await cartAfter.click()
  await wait(400)
  check(
    'a completed order clears the cart',
    await page.evaluate(() => document.body.innerText.includes('Your cart is empty')),
  )

  const accountAfter = await visibleByXPath(page, 'button[@aria-label="Account"]')
  await accountAfter.click()
  await wait(400)
  const orders = await visibleByXPath(page, 'button[contains(., "Order & Request History")]')
  await orders.click()
  await wait(500)
  check(
    'the order is recorded in history',
    await page.evaluate(() => document.body.innerText.includes('Total paid')),
  )
}

// --------------------------------------------------------------- responsive
await page.setViewport({ width: 390, height: 844 })
await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
await clearLoginGate(page, 'Alex Rivera')
await wait(500)
const mobileOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
)
check('no horizontal overflow at 390px', mobileOverflow <= 0, `${mobileOverflow}px`)

const mobileDetail = await visibleByXPath(page, 'button[normalize-space(.)="View"]')
await mobileDetail.click()
await wait(700)
const detailOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
)
check('no horizontal overflow on item detail at 390px', detailOverflow <= 0, `${detailOverflow}px`)

check('no console or page errors during the run', errors.length === 0, errors.slice(0, 3).join(' || '))

await browser.close()
process.exit(report('end-to-end') > 0 ? 1 : 0)
