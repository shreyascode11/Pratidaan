# RExchange

A campus marketplace where students post resources to sell, exchange, or give
away — textbooks, electronics, tickets, notes, skills and freebies.

Single-page React app. No backend, no database: all listings live in React
state, seeded with 15 sample posts.

**Design:** glassmorphic panels over a soft ambient colour field, bento-style
grid with wide feature tiles, mint-green and charcoal on a warm off-white
canvas.

## Run locally

```bash
npm install
npm run dev
```

Open the URL it prints (http://localhost:5173 by default).

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

Requires Node 20.19+ or 22.12+ (Vite 8).

## Deploy to Vercel

**Option A — Git import (recommended)**

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Vite. Confirm the defaults and deploy:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

**Option B — Vercel CLI**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

No `vercel.json` is needed. The app switches views from state rather than a
router, so there are no client-side routes to rewrite.

## Project structure

```
src/
  App.jsx                    state, filtering, view switching
  index.css                  theme tokens + .glass / .glow / .lift utilities
  data/seed.js               15 seed listings + category/type constants
  utils/format.js            initials, avatar colours, relative dates, price labels
  components/
    AmbientBackground.jsx    fixed blurred colour field the glass refracts
    Navbar.jsx               floating glass bar, live search, "Post an Item"
    Hero.jsx                 headline + glass stat tiles
    CategoryFilter.jsx       glass category pills with counts
    ItemGrid.jsx             bento grid (row spans + wide feature tiles)
    ItemCard.jsx             feature (image overlay) + standard (glass body)
    ItemDetail.jsx           detail view + request confirmation
    PostItemForm.jsx         new-listing form with validation
    SmartImage.jsx           image with loading + broken-URL fallback
    EmptyState.jsx           no-results state
    TypeBadge.jsx            Sell / Exchange / Giveaway badge
    Avatar.jsx               initials avatar
    Footer.jsx
    icons.jsx                inline SVG icons
```

## State shape

```js
items       // listing objects, newest first
query       // live search string, matched against title
category    // active category filter, "All" by default
view        // 'browse' | 'post' | 'detail'
selectedId  // listing open in the detail view
requested   // ids the user has requested
newIds      // ids posted this session (drives the "Just posted" badge)
toast       // transient confirmation message
```

A listing looks like:

```js
{
  id, title, category, type,      // type: 'Sell' | 'Exchange' | 'Giveaway'
  price,                          // number for Sell, null otherwise
  condition, description, details,
  image, poster, location, postedAt
}
```

## Design system notes

- **Glass** (`.glass`, `.glass-strong`, `.glass-dark` in `index.css`) is a
  translucent fill + `backdrop-filter` + inset top highlight + layered shadow.
  It only reads as glass because `AmbientBackground` puts colour behind it —
  on a flat fill it looks like a grey box.
- **Bento grid**: every tile spans two grid rows and every 7th spans two
  columns as a wide feature tile. Uniform row spans plus `grid-flow-row-dense`
  means the grid never leaves holes, whatever the filtered count is.
- Motion respects `prefers-reduced-motion`.

## Notes

- State is in memory only — a page refresh restores the original 15 listings.
  Swapping in a real backend means replacing the `useState(SEED_ITEMS)` call in
  `App.jsx` and the `addItem` handler.
- Seed images are hosted on the Unsplash CDN. `SmartImage` falls back to a
  branded placeholder if an image URL is unreachable, so user-submitted URLs
  can't break the layout.
- Seed post dates are relative to now, so listings always read as recent.
