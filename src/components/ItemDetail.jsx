import Avatar from './Avatar.jsx'
import SmartImage from './SmartImage.jsx'
import TypeBadge from './TypeBadge.jsx'
import { ArrowLeftIcon, ChatIcon, CheckIcon, MapPinIcon, TagIcon, CartIcon, HeartIcon } from './icons.jsx'
import { priceLabel, timeAgo, sellerRating } from '../utils/format.js'

const ACTION_LABEL = {
  Sell: 'Request this item',
  Exchange: 'Propose a swap',
  Giveaway: 'Claim this item',
}

const REQUEST_NOUN = {
  Sell: 'request',
  Exchange: 'swap request',
  Giveaway: 'claim',
}

export default function ItemDetail({ item, requested, onRequest, onBack, onOpenChat, inCart, onToggleCart, inWishlist, onToggleWishlist }) {
  if (!item) return null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <button
        onClick={onBack}
        className="glass group mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-ink-700 transition duration-300 hover:-translate-y-0.5 hover:text-ink-900"
      >
        <ArrowLeftIcon className="h-4 w-4 transition group-hover:-translate-x-0.5" />
        Back to browse
      </button>

      <div className="grid animate-rise gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-8">
        {/* Image */}
        <div className="min-w-0 self-start overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-2 shadow-[0_30px_70px_-35px_rgba(16,24,20,0.5)] backdrop-blur">
          <SmartImage
            src={item.image}
            alt={item.title}
            loading="eager"
            fetchPriority="high"
            className="aspect-[4/3] w-full rounded-[1.6rem] object-cover"
          />
        </div>

        {/* Info */}
        <div className="glass flex min-w-0 flex-col rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={item.type} tone="soft" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900/6 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink-600">
              <TagIcon className="h-3.5 w-3.5" />
              {item.category}
            </span>
            <span className="text-xs font-medium text-ink-400">
              Posted {timeAgo(item.postedAt)}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-ink-900 sm:text-4xl">
            {item.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-mint-700 tabular-nums">
              {priceLabel(item)}
            </span>
            {item.condition && (
              <span className="text-sm font-medium text-ink-500">
                {item.condition}
              </span>
            )}
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
            {item.details || item.description}
          </p>

          {item.location && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500">
              <MapPinIcon className="h-4 w-4 text-mint-600" />
              {item.location}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/50 p-4">
            <Avatar name={item.poster} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-400">
                Posted by
              </p>
              <div className="flex items-center gap-2">
                <p className="truncate text-lg font-extrabold tracking-tight text-ink-900">
                  {item.poster}
                </p>
                <span className="text-xs font-bold text-ink-500 bg-white border border-ink-200 rounded-full px-2 py-0.5 flex items-center gap-1">
                  <span className="text-yellow-500">★</span> {sellerRating(item.poster).rating}
                </span>
              </div>
            </div>
            <button
              onClick={() => onOpenChat(item.id)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-mint-300/60 bg-mint-100/70 px-3.5 py-2 text-xs font-extrabold text-mint-800 transition duration-300 hover:-translate-y-0.5 hover:bg-mint-200/80"
            >
              <ChatIcon className="h-3.5 w-3.5" />
              Message
            </button>
          </div>

          <div className="mt-6">
            {requested ? (
              // Clicking always sends the user back to browse with a toast
              // (see App.jsx's requestItem), so this branch only shows up if
              // they navigate back to an item they'd already requested —
              // not as feedback for the click itself.
              <div
                role="status"
                className="rounded-2xl border border-mint-300/60 bg-mint-100/80 p-4 backdrop-blur"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint-500">
                    <CheckIcon className="h-4 w-4 text-white" strokeWidth={2.6} />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-mint-900">
                      You already sent {item.poster.split(' ')[0]} a{' '}
                      {REQUEST_NOUN[item.type] ?? 'request'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-mint-800/80">
                      They can reply to arrange a pickup at{' '}
                      {item.location || 'a spot on campus'}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => onRequest(item.id)}
                  className="glow-ink flex-1 rounded-2xl bg-ink-900 px-6 py-4.5 text-base font-extrabold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-ink-800 active:translate-y-0"
                >
                  {ACTION_LABEL[item.type] ?? 'Request this item'}
                </button>
                {item.type === 'Sell' && (
                  <button
                    onClick={() => onToggleCart()}
                    className={`flex items-center justify-center rounded-2xl px-6 py-4.5 transition duration-300 hover:-translate-y-0.5 ${inCart ? 'bg-mint-500 text-mint-950 border border-mint-600' : 'bg-white border border-ink-200 text-ink-900 hover:bg-ink-50'}`}
                    aria-label={inCart ? "Remove from cart" : "Add to cart"}
                  >
                    <CartIcon className="h-6 w-6" />
                  </button>
                )}
                <button
                  onClick={() => onToggleWishlist()}
                  className={`flex items-center justify-center rounded-2xl px-6 py-4.5 transition duration-300 hover:-translate-y-0.5 ${inWishlist ? 'bg-red-50 border border-red-200 text-red-500' : 'bg-white border border-ink-200 text-ink-400 hover:text-red-400 hover:bg-red-50'}`}
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <HeartIcon className="h-6 w-6" filled={inWishlist} />
                </button>
              </div>
            )}
            <p className="mt-3 text-center text-xs font-medium text-ink-400">
              Always meet in a public spot on campus.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
