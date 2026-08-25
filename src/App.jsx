import { useCallback, useEffect, useMemo, useState } from 'react'
import AmbientBackground from './components/AmbientBackground.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import Checkout from './components/Checkout.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import ItemDetail from './components/ItemDetail.jsx'
import ItemGrid from './components/ItemGrid.jsx'
import LoginPage from './components/LoginPage.jsx'
import Navbar from './components/Navbar.jsx'
import PostItemForm from './components/PostItemForm.jsx'
import { CATEGORIES, SEED_ITEMS } from './data/seed.js'
import { CheckIcon, CloseIcon } from './components/icons.jsx'
import { generateAutoReply } from './utils/chatReplies.js'
import { formatPrice } from './utils/format.js'

const REQUEST_TOAST_VERB = {
  Sell: 'Request',
  Exchange: 'Swap request',
  Giveaway: 'Claim',
}

export default function App() {
  // ---- state -------------------------------------------------------------
  const [items, setItems] = useState(SEED_ITEMS)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [view, setView] = useState('browse') // 'browse' | 'post' | 'detail' | 'login' | 'cart' | 'wishlist' | 'checkout'
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  // Gates the whole app: nothing else renders until the user signs up/logs in.
  const [authed, setAuthed] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [requested, setRequested] = useState([])
  const [newIds, setNewIds] = useState(new Set())
  const [toast, setToast] = useState(null)
  // Chat: which item's thread is open, its messages, and whether the poster
  // is "typing" — all in memory only, same as everything else in this app.
  const [chatItemId, setChatItemId] = useState(null)
  const [conversations, setConversations] = useState({}) // { [itemId]: Message[] }
  const [typingItemId, setTypingItemId] = useState(null)

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

  const chatItem = useMemo(
    () => items.find((i) => i.id === chatItemId) ?? null,
    [items, chatItemId],
  )
  const chatMessages = conversations[chatItemId] ?? []

  const cartItems = useMemo(
    () => cart.map((id) => items.find((i) => i.id === id)).filter(Boolean),
    [cart, items],
  )
  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.price ? Number(item.price) : 0), 0),
    [cartItems],
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
  const openCart = useCallback(() => setView('cart'), [])
  const openWishlist = useCallback(() => setView('wishlist'), [])
  const openCheckout = useCallback(() => setView('checkout'), [])

  // Called once the (simulated) payment succeeds: clear the cart, since the
  // "purchase" is done, and send the user back to browse with a toast — same
  // land-somewhere-with-feedback pattern as posting an item or logging in.
  const completeCheckout = useCallback(() => {
    setCart([])
    goBrowse()
    setToast('Order placed — thanks for shopping on Pratidaan!')
  }, [goBrowse])

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }, [])

  const toggleCart = useCallback((id) => {
    setCart((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }, [])

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

  // Mirrors addItem/submitLogin's pattern: give a toast and actually take the
  // user somewhere, rather than just swapping the button for inline text and
  // leaving them stranded on the same page.
  const requestItem = useCallback(
    (id) => {
      setRequested((prev) => (prev.includes(id) ? prev : [...prev, id]))
      const item = items.find((i) => i.id === id)
      if (item) {
        const verb = REQUEST_TOAST_VERB[item.type] ?? 'Request'
        setToast(`${verb} sent to ${item.poster.split(' ')[0]}!`)
      }
      goBrowse()
    },
    [items, goBrowse],
  )

  const resetFilters = useCallback(() => {
    setQuery('')
    setCategory('All')
  }, [])

  const openChat = useCallback((id) => setChatItemId(id), [])
  const closeChat = useCallback(() => setChatItemId(null), [])

  // Simulates the other side of the conversation: no backend, no other real
  // user, so a message sent into silence would just look broken. A short
  // "typing…" pause and a canned, type-aware reply keeps it feeling alive.
  const sendChatMessage = useCallback(
    (text) => {
      const id = chatItemId
      if (!id) return
      const item = items.find((i) => i.id === id)
      const userMessage = { id: `msg${Date.now()}`, from: 'me', text }
      setConversations((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), userMessage] }))
      setTypingItemId(id)

      const delay = 1100 + Math.random() * 700
      setTimeout(() => {
        const reply = {
          id: `msg${Date.now() + 1}`,
          from: 'them',
          text: generateAutoReply(item?.type),
        }
        setConversations((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), reply] }))
        setTypingItemId((current) => (current === id ? null : current))
      }, delay)
    },
    [chatItemId, items],
  )

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
  // there's nothing to back out to before signing up). Skipped while the
  // chat panel is open so it doesn't fight with the panel's own Escape
  // handler — one press closes the chat, not both the chat and the page.
  useEffect(() => {
    if (view === 'browse' || view === 'login' || chatItemId) return
    const onKey = (e) => e.key === 'Escape' && goBrowse()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, goBrowse, chatItemId])

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
        onCart={openCart}
        onWishlist={openWishlist}
        cartCount={cart.length}
        wishlistCount={wishlist.length}
        onLogin={openLogin}
      />

      <main className="flex-1">
        {view === 'browse' && (
          <>
            <Hero
              total={items.length}
              freeCount={freeCount}
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
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
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
            onOpenChat={openChat}
            inCart={cart.includes(selectedId)}
            onToggleCart={() => toggleCart(selectedId)}
            inWishlist={wishlist.includes(selectedId)}
            onToggleWishlist={() => toggleWishlist(selectedId)}
          />
        )}

        {view === 'cart' && (
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <h2 className="text-3xl font-extrabold text-ink-900 mb-8">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-ink-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map(id => {
                  const item = items.find(i => i.id === id)
                  if (!item) return null
                  return (
                    <div key={id} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-ink-200">
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-xl" />
                      <div className="flex-1">
                        <h3 className="font-extrabold text-lg text-ink-900">{item.title}</h3>
                        <p className="text-sm text-ink-500">{item.price ? formatPrice(item.price) : 'Ask'}</p>
                      </div>
                      <button onClick={() => toggleCart(id)} className="text-sm font-bold text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  )
                })}
                <div className="mt-8 border-t border-ink-200 pt-6 flex justify-between items-center">
                  <span className="text-xl font-bold text-ink-900">Total:</span>
                  <span className="text-2xl font-extrabold text-mint-700">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <button
                  onClick={openCheckout}
                  className="w-full mt-6 bg-mint-500 text-mint-950 font-extrabold py-4 rounded-2xl hover:bg-mint-400 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'checkout' && (
          <Checkout
            items={cartItems}
            total={cartTotal}
            onComplete={completeCheckout}
            onBack={openCart}
          />
        )}

        {view === 'wishlist' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <h2 className="text-3xl font-extrabold text-ink-900 mb-8">Your Wishlist</h2>
            {wishlist.length === 0 ? (
              <p className="text-ink-500">Your wishlist is empty.</p>
            ) : (
              <ItemGrid
                items={items.filter(i => wishlist.includes(i.id))}
                onView={openDetail}
                newIds={newIds}
                query=""
                category="All"
                onReset={() => {}}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
              />
            )}
          </div>
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

      {chatItem && (
        <ChatPanel
          item={chatItem}
          messages={chatMessages}
          isTyping={typingItemId === chatItemId}
          onClose={closeChat}
          onSend={sendChatMessage}
        />
      )}
    </div>
  )
}
