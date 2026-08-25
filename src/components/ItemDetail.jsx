import Avatar from './Avatar.jsx'
import SmartImage from './SmartImage.jsx'
import TypeBadge from './TypeBadge.jsx'
import { ArrowLeftIcon, CheckIcon, MapPinIcon, TagIcon } from './icons.jsx'
import { priceLabel, timeAgo } from '../utils/format.js'

const ACTION_LABEL = {
  Sell: 'Request this item',
  Exchange: 'Propose a swap',
  Giveaway: 'Claim this item',
}

export default function ItemDetail({ item, requested, onRequest, onBack }) {
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
        <div className="self-start overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-2 shadow-[0_30px_70px_-35px_rgba(16,24,20,0.5)] backdrop-blur">
          <SmartImage
            src={item.image}
            alt={item.title}
            loading="eager"
            fetchPriority="high"
            className="aspect-[4/3] w-full rounded-[1.6rem] object-cover"
          />
        </div>

        {/* Info */}
        <div className="glass flex flex-col rounded-[2rem] p-6 sm:p-8">
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
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-400">
                Posted by
              </p>
              <p className="truncate text-lg font-extrabold tracking-tight text-ink-900">
                {item.poster}
              </p>
            </div>
          </div>

          <div className="mt-6">
            {requested ? (
              <div
                role="status"
                className="animate-pop rounded-2xl border border-mint-300/60 bg-mint-100/80 p-4 backdrop-blur"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint-500">
                    <CheckIcon className="h-4 w-4 text-white" strokeWidth={2.6} />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-mint-900">
                      Request sent to {item.poster.split(' ')[0]}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-mint-800/80">
                      They&rsquo;ll get a notification and can reply to arrange a
                      pickup at {item.location || 'a spot on campus'}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onRequest(item.id)}
                className="glow-ink w-full rounded-2xl bg-ink-900 px-6 py-4.5 text-base font-extrabold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-ink-800 active:translate-y-0"
              >
                {ACTION_LABEL[item.type] ?? 'Request this item'}
              </button>
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
