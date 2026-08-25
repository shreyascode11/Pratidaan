import { useCallback, useEffect, useMemo, useState } from 'react'
import AmbientBackground from './components/AmbientBackground.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import ItemDetail from './components/ItemDetail.jsx'
import ItemGrid from './components/ItemGrid.jsx'
import LoginPage from './components/LoginPage.jsx'
import Navbar from './components/Navbar.jsx'
import PostItemForm from './components/PostItemForm.jsx'
import { CATEGORIES, SEED_ITEMS } from './data/seed.js'
import { CheckIcon, CloseIcon } from './components/icons.jsx'

export default function App() {
  // ---- state -------------------------------------------------------------
  const [items, setItems] = useState(SEED_ITEMS)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [view, setView] = useState('browse') // 'browse' | 'post' | 'detail' | 'login'
  // Gates the whole app: nothing else renders until the user signs up/logs in.
  const [authed, setAuthed] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [requested, setRequested] = useState([])
  const [newIds, setNewIds] = useState(new Set())
  const [toast, setToast] = useState(null)

  // ---- derived -----------------------------------------------------------
  const counts = useMemo(() => {
    const map = { All: items.length }
    for (const c of CATEGORIES) if (c !== 'All') map[c] = 0
    for (const item of items) map[item.category] = (map[item.category] ?? 0) + 1
    return map
  }, [items])

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category
      const matchesQuery = q === '' || item.title.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [items, query, category])

  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId],
  )

  const freeCount = useMemo(
    () => items.filter((i) => i.type === 'Giveaway').length,
    [items],
  )
  const swapCount = useMemo(
    () => items.filter((i) => i.type === 'Exchange').length,
    [items],
  )

  // ---- actions -----------------------------------------------------------
  const goBrowse = useCallback(() => {
    setView('browse')
    setSelectedId(null)
  }, [])

  const openDetail = useCallback((id) => {
    setSelectedId(id)
    setView('detail')
  }, [])

  const openPost = useCallback(() => setView('post'), [])
  const openLogin = useCallback(() => setView('login'), [])

  const addItem = useCallback((draft) => {
    const item = {
      ...draft,
      id: `u${Date.now()}`,
      postedAt: new Date().toISOString(),
    }
    setItems((prev) => [item, ...prev])
    setNewIds((prev) => new Set(prev).add(item.id))
    setQuery('')
    setCategory('All')
    setView('browse')
    setToast(`“${item.title}” is live on the board.`)
  }, [])

  const requestItem = useCallback((id) => {
    setRequested((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const resetFilters = useCallback(() => {
    setQuery('')
    setCategory('All')
  }, [])

  // Orbit icons live up in the hero, away from the grid they filter — so,
  // unlike the category pills that already sit right above the grid, picking
  // one also needs an explicit scroll down to where the result shows up.
  const selectCategoryFromHero = useCallback((cat) => {
    setCategory(cat)
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const submitLogin = useCallback((payload) => {
    setAuthed(true)
    setView('browse')
    setToast(
      payload.mode === 'signup'
        ? `Welcome to Pratidaan, ${payload.name.split(' ')[0]}!`
        : 'Welcome back!',
    )
  }, [])

  // Scroll to top whenever the view changes — feels like real navigation.
  // `authed` is in the deps too: `view` is already 'browse' by the time the
  // gate clears (it never changed while the gate was up), so without this,
  // React bails out of re-running the effect and the freshly-authed user
  // lands wherever the page happened to be scrolled — e.g. mid-form on
  // mobile, where focus scrolls the page as each field is filled in.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view, selectedId, authed])

  // Auto-dismiss the "posted" toast.
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  // Escape backs out of detail / post views (not the login gate itself —
  // there's nothing to back out to before signing up).
  useEffect(() => {
    if (view === 'browse' || view === 'login') return
    const onKey = (e) => e.key === 'Escape' && goBrowse()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, goBrowse])

  // ---- render ------------------------------------------------------------
  if (!authed) {
    return <LoginPage onSubmit={submitLogin} fullScreen />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AmbientBackground />
      <Navbar
        query={query}
        onQueryChange={(value) => {
          setQuery(value)
          if (view !== 'browse') goBrowse()
        }}
        onPost={openPost}
        onHome={goBrowse}
        onLogin={openLogin}
      />

      <main className="flex-1">
        {view === 'browse' && (
          <>
            <Hero
              total={items.length}
              freeCount={freeCount}
              swapCount={swapCount}
              onPost={openPost}
              onSelectCategory={selectCategoryFromHero}
            />

            <section
              id="listings"
              className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
            >
              <CategoryFilter
                active={category}
                onChange={setCategory}
                counts={counts}
              />

              <div className="mt-8 mb-6 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                  {category === 'All' ? 'All listings' : category}
                  <span className="ml-2.5 text-sm font-bold text-ink-400 tabular-nums">
                    {visibleItems.length}{' '}
                    {visibleItems.length === 1 ? 'item' : 'items'}
                  </span>
                </h2>
                {query && (
                  <button
                    onClick={resetFilters}
                    className="text-sm font-bold text-mint-700 transition hover:text-mint-800"
                  >
                    Clear search
                  </button>
                )}
              </div>

              <ItemGrid
                items={visibleItems}
                onView={openDetail}
                newIds={newIds}
                query={query}
                category={category}
                onReset={resetFilters}
              />
            </section>
          </>
        )}

        {view === 'post' && (
          <PostItemForm onSubmit={addItem} onCancel={goBrowse} />
        )}

        {view === 'detail' && (
          <ItemDetail
            item={selectedItem}
            requested={requested.includes(selectedId)}
            onRequest={requestItem}
            onBack={goBrowse}
          />
        )}

        {view === 'login' && (
          <LoginPage onSubmit={submitLogin} onBack={goBrowse} />
        )}
      </main>

      <Footer />

      {/* Toast */}
      {toast && (
        <div
          role="status"
          // pointer-events-none on the container (and none on its passive
          // children) keeps this purely informational — a toast sitting over
          // live form controls, like the type toggle on "Post an Item", must
          // never eat a click meant for what's underneath it. Only the
          // explicit dismiss button opts back in.
          className="animate-pop glow-ink pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-ink-900 px-4 py-4 text-white sm:left-auto sm:right-6 sm:mx-0"
        >
          <span className="pointer-events-none flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-400">
            <CheckIcon className="h-3.5 w-3.5 text-mint-950" strokeWidth={2.6} />
          </span>
          <p className="pointer-events-none min-w-0 flex-1 truncate text-sm font-bold">
            {toast}
          </p>
          <button
            onClick={() => setToast(null)}
            aria-label="Dismiss"
            className="pointer-events-auto shrink-0 rounded-full p-1 text-white/50 transition hover:bg-white/15 hover:text-white"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
