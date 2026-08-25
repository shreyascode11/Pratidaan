# Pratidaan — Presentation Script & Q&A Prep

Live demo: **https://pratidaan.vercel.app/**
Repo: **https://github.com/shreyascode11/Pratidaan**

This doc has two parts: a **spoken pitch** (read it, don't just recite it —
say it like you mean it) and a **Q&A bank** for whatever a judge throws at
you afterward.

---

## Part 1 — The pitch (~3 minutes)

### Opening (15 seconds)

> "Every semester, my hostel corridor turns into a landfill of stuff that's
> perfectly fine but nobody wants — old textbooks, chargers, a mini fridge
> someone's throwing out because they're moving. Meanwhile, someone two doors
> down needs exactly that thing and is about to pay full price for it on
> Amazon. That gap — between what's already on campus and what people think
> they have to buy — is what Pratidaan closes."

### The problem (30 seconds)

> "Students have three very different reasons to hand something off: sell it
> for cash, trade it for something they actually need, or just give it away
> because it's not worth the hassle of listing. Every marketplace app I've
> used treats these as the same transaction with a price tag — 'Add to Cart,'
> checkout, done. That's wrong for a campus. A textbook swap isn't a purchase.
> A free desk lamp doesn't need a cart. Forcing all three into one 'buy now'
> flow is why students default to a WhatsApp group chat instead of an app."

### Why this vertical (20 seconds)

> "I chose student/campus commerce because the persona is so specific it
> writes the product spec for you: broke, busy, on foot, and trading with a
> stranger who shares your campus. That's not abstract — it directly decides
> what the app needs. No shipping addresses, because you meet in person. No
> single price field, because half of what students trade isn't for sale.
> A safety note on every listing, because it's always a real person you're
> about to meet."

### What it does — live walkthrough (90 seconds)

Talk through this **while you click**, don't just describe it:

1. **Land on the gate.** "Nothing's visible until you sign up — no lurking
   before you're part of the community." *(Sign up.)*
2. **Browse.** "Twenty-five real listings, three different transaction types
   sitting side by side — this calculator is for sale, this guitar is a
   giveaway, this textbook is only up for trade. Notice the price area itself
   changes: ₹3,000, or 'Swap,' or 'Free.'"
3. **Open an item, hit the AI button.** "I click Generate, and it writes a
   description using the title, category, and *how* I'm offering it — a swap
   listing gets 'looking to trade for,' a giveaway gets 'free to whoever
   needs it.' If I had an OpenAI key configured it'd call a real model; with
   none configured it drafts locally in under a second, for free, and it
   never leaves me with a blank field."
4. **Open a listing, hit Message.** "There's no second real user in a demo,
   so instead of a dead inbox, the other side actually replies — a short
   typing pause, then something that fits the listing type. A swap gets
   negotiated, a giveaway gets 'come grab it.'"
5. **Add a Sell item to cart, checkout.** "This is clearly labeled a demo
   payment the whole way through — no real card is processed, nothing is
   sent anywhere — but the *validation* is real: card formatting, expiry
   checks, the works. Notice Cart never shows up on the swap or giveaway
   items — you can't 'buy' a trade."
6. **Profile.** "My Listings, so I can edit or pull something I posted. Order
   & Request history, so I can see what I've bought and what I've asked to
   swap or claim."

### The uniqueness (30 seconds)

> "The novelty isn't a feature you can point at — it's that **one field,
> the listing's type, drives the entire app.** The call-to-action, whether
> Cart even appears, what the AI writes, how the chat bot responds, the
> toast you get afterward — all of it branches off that same value. I didn't
> build three separate flows and glue them together; I built one flow that
> reads context and adapts. That's the actual engineering bet of this
> project, and it's why the app doesn't feel like a generic storefront with
> a campus skin on it."

### Close (15 seconds)

> "It's a static frontend — no backend, on purpose — because the goal was to
> prove the *decision-making*, not stand up infrastructure. Thirty-seven
> automated tests and a full accessibility audit back it, which I'm happy to
> walk through if you want to see the receipts instead of just my word for
> it."

---

## Part 2 — Q&A bank

### "Why no backend / database?"

> "Scope discipline. The challenge was to demonstrate smart, context-driven
> decision-making — that logic lives entirely in the frontend regardless of
> where data eventually sits. A backend would have spent my time on CRUD
> boilerplate and auth plumbing instead of the actual assistant logic. Every
> action still runs through real handlers with real validation — `addItem`,
> `updateItem`, `requestItem`, `completeCheckout` — they just persist to
> React state instead of a database. Swapping that for an API is a
> mechanical change, not a redesign, because the state and the UI are
> already cleanly separated."

### "Isn't this just a CRUD app with extra steps?"

> "A CRUD app doesn't know the difference between a sale and a swap. This
> one changes its primary button, hides an entire feature (Cart), rewrites
> what its AI assistant says, and changes how its chatbot responds — all
> from one field on one object. That's a rules engine wearing a marketplace's
> clothes, not the other way around."

### "What's actually 'AI' here, and what's simulated?"

> "Be direct about this if asked — it's a strength, not a gap. The
> description generator is real generative logic: category × type templates
> combined and randomized, so two Electronics-Sell listings don't read
> identically. It optionally calls a real LLM if a key is present. The chat
> replies are the same idea — a matched pool per listing type, not a live
> model — because there's no second user to actually talk to in a demo.
> I'd rather ship an honest simulation than a fake progress bar pretending
> to hit a server that isn't there."

### "How do you know it actually works — did you just eyeball it?"

> "No — `npm test` runs 37 automated checks against a real production build
> in real Chrome: signup, search, posting, editing, checkout, mobile layout,
> zero console errors. I specifically chose browser-level tests over unit
> tests because every real bug I hit during development was a layout bug —
> an image that silently never loaded because it was hidden before it could
> lazy-load, a toast eating clicks meant for the button under it. A unit
> test mounting a component in isolation would never have caught either
> one."

### "What about accessibility?"

> "axe-core running WCAG 2.1 AA across six screens, zero violations. It's
> not just a badge — it caught two real defects I'd missed by eye: the
> wishlist heart buttons had no accessible name at all, and the hidden file
> input behind the Upload button wasn't labeled. Both are fixed now, and the
> audit runs as part of the same `npm test`."

### "Security?"

> "No secrets committed — the one optional API key lives in a gitignored
> `.env.local` and I say plainly in the README why baking a real key into a
> static frontend bundle would be a bad idea. No `dangerouslySetInnerHTML`,
> no `eval`, uploads are validated client-side for type and size. `npm
> audit` is clean, production and dev."

### "Why campus commerce and not [some other vertical]?"

> "Because the persona forces real product decisions instead of cosmetic
> ones. A generic 'local marketplace' could be reskinned for anything —
> campus commerce specifically has three transaction types that behave
> differently, an always-in-person meetup instead of shipping, and users who
> genuinely can't afford a friction-heavy checkout. Every constraint in the
> app traces back to that persona; none of it is decoration."

### "What would you build next if you had more time?"

> "Real persistence first — the in-memory model is a deliberate scope cut,
> not a limitation I'm unaware of. After that: real-time chat once there's
> an actual second user, and a trust/reputation layer, since right now
> seller ratings are honestly-labeled decoration rather than real reviews —
> I'd rather say that upfront than let it be discovered."

### "Walk me through the code quality / structure."

> "One component per screen or reusable unit, all state and cross-cutting
> actions centralized in `App.jsx` so there's a single source of truth and
> no prop-drilling maze. Utilities are pure functions — formatting, the
> description generator, the chat replies — so they're independently
> testable and have no React dependency. Nothing is duplicated across
> screens that shouldn't be; nothing is abstracted before it needed to be."

---

## Cheat sheet — numbers to have ready

| Ask | Answer |
| :--- | :--- |
| Seed listings | 25 — 11 Sell, 5 Exchange, 9 Giveaway |
| Automated tests | 37, `npm test` |
| Accessibility violations | 0 (WCAG 2.1 AA, 6 screens) |
| `npm audit` | 0 vulnerabilities |
| Runtime dependencies | React + React DOM only |
| Bundle size | ~88 KB gzipped JS |
| Repo size | ~350 KB tracked |
| Branches | 1 (`main`) |
