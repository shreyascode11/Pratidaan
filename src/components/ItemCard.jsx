import Avatar from './Avatar.jsx'
import SmartImage from './SmartImage.jsx'
import TypeBadge from './TypeBadge.jsx'
import { priceLabel, timeAgo, sellerRating } from '../utils/format.js'
import { HeartIcon } from './icons.jsx'

function PriceChip({ item, onDark = false }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-extrabold tabular-nums ${
        onDark ? 'glass-dark text-white' : 'bg-white/85 text-ink-900 backdrop-blur'
      }`}
    >
      {priceLabel(item)}
    </span>
  )
}

/** Wide bento tile: full-bleed image with the copy laid over it. */
function FeatureCard({ item, onView, isNew, inWishlist, onToggleWishlist }) {
  return (
    <article
      onClick={() => onView(item.id)}
      className="lift group relative col-span-1 row-span-2 cursor-pointer overflow-hidden rounded-[1.75rem] border border-white/50 bg-ink-900 shadow-[0_20px_50px_-25px_rgba(16,24,20,0.45)] sm:col-span-2"
    >
      <SmartImage
        src={item.image}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/62 to-ink-950/15" />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <TypeBadge type={item.type} tone="onDark" />
          <PriceChip item={item} onDark />
        </div>

        <div>
          {isNew && (
            <span className="mb-2 inline-block rounded-full bg-mint-400 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-mint-950">
              Just posted
            </span>
          )}
          <div className="flex items-start justify-between">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-mint-300">
              {item.category}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleWishlist(item.id)
              }}
              className={`p-2 rounded-full transition-colors ${inWishlist ? 'text-red-400 bg-white/10' : 'text-white/50 hover:text-white/90 hover:bg-white/10'}`}
            >
              <HeartIcon className="h-5 w-5" filled={inWishlist} />
            </button>
          </div>
          <h3 className="mt-1 max-w-lg text-2xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-3xl">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/80">
            {item.description}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <Avatar name={item.poster} onDark />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{item.poster}</p>
              <p className="text-[11px] text-white/60">{timeAgo(item.postedAt)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onView(item.id)
              }}
              className="rounded-full bg-white px-5 py-2.5 text-xs font-extrabold text-ink-900 transition duration-300 hover:bg-mint-300"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

/** Standard bento tile: image on top, frosted body beneath. */
function StandardCard({ item, onView, isNew, inWishlist, onToggleWishlist }) {
  return (
    <article
      onClick={() => onView(item.id)}
      className="glass lift group col-span-1 row-span-2 flex cursor-pointer flex-col overflow-hidden rounded-[1.75rem]"
    >
      <div className="relative h-[46%] shrink-0 overflow-hidden">
        <SmartImage
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <TypeBadge type={item.type} />
          <PriceChip item={item} />
        </div>
        {isNew && (
          <span className="absolute bottom-3 left-3 rounded-full bg-mint-400 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-mint-950">
            Just posted
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-mint-700">
            {item.category}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleWishlist(item.id)
            }}
            className={`p-1 -mt-1 -mr-1 rounded-full transition-colors ${inWishlist ? 'text-red-500' : 'text-ink-300 hover:text-ink-600'}`}
          >
            <HeartIcon className="h-4.5 w-4.5" filled={inWishlist} />
          </button>
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-base font-extrabold leading-snug tracking-tight text-ink-900 transition group-hover:text-mint-700">
          {item.title}
        </h3>
        <p className="mt-1.5 mb-4 line-clamp-2 text-sm leading-relaxed text-ink-500">
          {item.description}
        </p>

        <div className="mt-auto flex items-center gap-2.5 border-t border-ink-900/8 pt-3.5">
          <Avatar name={item.poster} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-ink-800">{item.poster}</p>
            <p className="text-[10px] font-medium text-ink-500 flex items-center gap-1">
              <span className="text-yellow-500">★</span> {sellerRating(item.poster).rating} • {timeAgo(item.postedAt)}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView(item.id)
            }}
            className="rounded-full bg-ink-900 px-4 py-2 text-xs font-extrabold text-white transition duration-300 group-hover:bg-mint-500 group-hover:text-mint-950"
          >
            View
          </button>
        </div>
      </div>
    </article>
  )
}

export default function ItemCard({ item, onView, isNew = false, variant = 'standard', inWishlist, onToggleWishlist }) {
  const Card = variant === 'feature' ? FeatureCard : StandardCard
  return <Card item={item} onView={onView} isNew={isNew} inWishlist={inWishlist} onToggleWishlist={onToggleWishlist} />
}
