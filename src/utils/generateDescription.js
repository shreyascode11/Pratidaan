/**
 * Description generator for the "✨ Generate with AI" button.
 *
 * This app has no backend (static frontend, in-memory state — see README), so
 * there's nowhere safe to hold a real LLM API key: anything baked into the
 * client bundle is visible to anyone who opens devtools. Given that, this
 * only attempts a live API call when `VITE_OPENAI_API_KEY` is explicitly set
 * (e.g. in a local, gitignored `.env.local` for personal experimentation) —
 * it is never on by default, and it must never be a real key in a public
 * deployment. Whenever that call is unavailable or fails for any reason
 * (no key, network error, rate limit, timeout), this silently falls back to
 * the template generator below so the button always produces something and
 * never blocks the form.
 */

const AI_ENDPOINT = 'https://api.openai.com/v1/chat/completions'
const AI_MODEL = 'gpt-4o-mini'
const AI_TIMEOUT_MS = 8000

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

/**
 * @returns {Promise<{ text: string, source: 'ai' | 'template' }>}
 */
export async function generateDescription({ title, category, type }) {
  if (apiKey) {
    try {
      const text = await generateWithOpenAI({ title, category, type })
      if (text) return { text, source: 'ai' }
    } catch {
      // Fall through to the template generator — the user should never see
      // this fail outright, just get a slightly less tailored result.
    }
  }
  return { text: generateFromTemplate({ title, category, type }), source: 'template' }
}

async function generateWithOpenAI({ title, category, type }) {
  const offer =
    type === 'Giveaway' ? 'giving away for free' : type === 'Exchange' ? 'offering to trade' : 'selling'

  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      temperature: 0.8,
      max_tokens: 90,
      messages: [
        {
          role: 'system',
          content:
            'You write short, natural listing descriptions for a college campus marketplace app. Sound like a real student wrote it: casual, specific, warm. One to two sentences. No hashtags, no emoji, no markdown, no quotation marks around the output.',
        },
        {
          role: 'user',
          content: `Write a 1-2 sentence description for this listing.\nTitle: ${title}\nCategory: ${category || 'general item'}\nThey are ${offer} it.`,
        },
      ],
    }),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
  })

  if (!res.ok) throw new Error(`OpenAI request failed with ${res.status}`)

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content?.trim()
  return text ? stripWrappingQuotes(text) : null
}

function stripWrappingQuotes(text) {
  return text.replace(/^["“]|["”]$/g, '').trim()
}

// ---- template fallback ----------------------------------------------------

const CONDITIONS = ['barely used', 'in great shape', 'still works perfectly', 'gently used', 'like new']

const REASONS = [
  "just don't have space for it anymore",
  'upgraded and no longer need it',
  "it's been sitting in my closet",
  "I'm moving out and can't take it with me",
  "finished the course and don't need it anymore",
]

const CLOSERS = {
  Sell: [
    'Priced to move, message me and we can figure out pickup.',
    'Happy to negotiate a bit if you meet me on campus.',
    'Cash or Venmo both work, easy meetup near campus.',
  ],
  Exchange: [
    "Open to a fair trade — let me know what you've got.",
    "Would rather swap than sell, so make me an offer.",
    'Looking to trade for something I actually need this semester.',
  ],
  Giveaway: [
    'Free to whoever needs it — first come, first served.',
    'Just want it to go to a good home, no strings attached.',
    'Yours if you can grab it soon, no charge.',
  ],
}

const CATEGORY_HOOKS = {
  Textbooks: [
    'Used it for a full semester and it held up well',
    'No major highlighting, just some light notes in the margins',
    "Covers everything you'll need for the course",
  ],
  Electronics: [
    'Battery still holds a charge and everything works as it should',
    'Comes with the original cable, no accessories missing',
    "Tested it before listing, so you know it's working",
  ],
  Tickets: [
    "Can't make it anymore so passing these along",
    'Great seats, grabbed them the day they dropped',
    'Digital transfer, so it only takes a minute',
  ],
  Notes: [
    'Typed up and organized by week, saved me before finals',
    'Covers every lecture plus the practice problems',
    "Wish I'd had these earlier in the semester",
  ],
  Skills: [
    'Happy to work around your schedule',
    "No experience needed, we'll start from the basics",
    "Done this for a few people already and it's gone well",
  ],
  Freebies: [
    'Still in working order, just needs a new home',
    'Cleaned it up and it looks pretty much like new',
    "Would rather someone use it than see it go to waste",
  ],
}

const GENERIC_HOOKS = [
  'Kept it in good condition the whole time I had it',
  'Exactly as described, happy to answer questions',
  "Been meaning to pass this along for a while",
]

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function generateFromTemplate({ category, type }) {
  const hook = pick(CATEGORY_HOOKS[category] ?? GENERIC_HOOKS)
  const condition = pick(CONDITIONS)
  const closer = pick(CLOSERS[type] ?? CLOSERS.Sell)

  // Two independent opener shapes rather than splicing hook + condition
  // together — combining them risked contradictions like "held up well,
  // barely used". Each shape reads as one clean, self-contained sentence.
  const opener =
    Math.random() < 0.5
      ? `${capitalize(hook)}.`
      : `${capitalize(condition)} — ${pick(REASONS)}.`

  return `${opener} ${closer}`
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
