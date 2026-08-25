import { LogoMark, PlusIcon, SearchIcon, CloseIcon, UserIcon, CartIcon, HeartIcon } from "./icons.jsx";

export default function Navbar({ query, onQueryChange, onPost, onHome, onLogin, onCart, onWishlist, cartCount = 0, wishlistCount = 0 }) {
  return (
    <div className="sticky top-0 z-40">
      {/* Blurred strip so page content scrolling past doesn't peek above the
          floating bar. Masked to fade out rather than end on a hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%+1.25rem)] backdrop-blur-lg [mask-image:linear-gradient(to_bottom,black_0,black_62%,transparent_100%)]"
      />
      <div className="relative px-3 pt-3 sm:px-5 sm:pt-4">
        <header className="glass-strong mx-auto max-w-7xl rounded-2xl sm:rounded-[1.75rem]">
          <div className="flex h-16 items-center gap-3 px-3 sm:gap-6 sm:px-5">
            <button
              onClick={onHome}
              className="flex shrink-0 items-center gap-2.5 rounded-2xl transition hover:opacity-70"
              aria-label="Pratidaan home"
            >
              <LogoMark className="h-9 w-9 text-mint-500 drop-shadow-sm" />
              <span className="text-xl font-extrabold tracking-tight text-ink-900">
                Prati<span className="text-mint-600">daan</span>
              </span>
            </button>

            {/* Search — inline from sm up */}
            <div className="relative hidden flex-1 sm:block">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search listings by title…"
                aria-label="Search listings by title"
                className="w-full rounded-full border border-white/70 bg-white/55 py-3 pl-11 pr-10 text-sm font-medium text-ink-900 shadow-[inset_0_1px_2px_rgba(16,24,20,0.06)] transition placeholder:text-ink-400 focus:border-mint-300 focus:bg-white/85 focus:ring-4 focus:ring-mint-400/20 focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => onQueryChange("")}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-400 transition hover:bg-ink-900/10 hover:text-ink-700"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-3">
              <button
                onClick={onWishlist}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 bg-white/55 text-ink-800 transition duration-300 hover:-translate-y-0.5 hover:bg-white/85 sm:h-10 sm:w-10"
                aria-label="Wishlist"
              >
                <HeartIcon className="h-4.5 w-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-mint-500 text-[9px] font-bold text-mint-950">
                    {wishlistCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={onCart}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 bg-white/55 text-ink-800 transition duration-300 hover:-translate-y-0.5 hover:bg-white/85 sm:h-10 sm:w-10"
                aria-label="Cart"
              >
                <CartIcon className="h-4.5 w-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-mint-500 text-[9px] font-bold text-mint-950">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={onLogin}
                className="inline-flex h-9 w-9 items-center justify-center gap-1.5 rounded-full border border-ink-900/10 bg-white/55 text-sm font-extrabold text-ink-800 transition duration-300 hover:-translate-y-0.5 hover:bg-white/85 sm:h-auto sm:w-auto sm:px-5 sm:py-3"
              >
                <UserIcon className="h-4 w-4" strokeWidth={2.2} />
                <span className="hidden sm:inline">Log in</span>
              </button>
              
              <button
                onClick={onPost}
                className="glow-mint inline-flex items-center gap-1.5 rounded-full bg-mint-500 px-4 py-3 text-sm font-extrabold text-mint-950 transition duration-300 hover:-translate-y-0.5 hover:bg-mint-400 active:translate-y-0 sm:px-5"
              >
                <PlusIcon className="h-4 w-4" strokeWidth={2.4} />
                <span className="hidden sm:inline">Post an Item</span>
                <span className="sm:hidden">Post</span>
              </button>
            </div>
          </div>

          {/* Search — own row on mobile */}
          <div className="relative px-3 pb-3 sm:hidden">
            <SearchIcon className="pointer-events-none absolute left-6 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search listings…"
              aria-label="Search listings by title"
              className="w-full rounded-full border border-white/70 bg-white/55 py-3 pl-11 pr-4 text-sm font-medium text-ink-900 transition placeholder:text-ink-400 focus:border-mint-300 focus:bg-white/85 focus:ring-4 focus:ring-mint-400/20 focus:outline-none"
            />
          </div>
        </header>
      </div>
    </div>
  );
}
