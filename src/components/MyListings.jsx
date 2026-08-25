import { useState } from 'react'
import SmartImage from './SmartImage.jsx'
import TypeBadge from './TypeBadge.jsx'
import { ArrowLeftIcon, EditIcon, InboxIcon, TrashIcon } from './icons.jsx'
import { priceLabel, timeAgo } from '../utils/format.js'

export default function MyListings({ items, onView, onEdit, onRemove, onPost, onBack }) {
  const [confirmingId, setConfirmingId] = useState(null)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <button
        onClick={onBack}
        className="glass group mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-ink-700 transition duration-300 hover:-translate-y-0.5 hover:text-ink-900"
      >
        <ArrowLeftIcon className="h-4 w-4 transition group-hover:-translate-x-0.5" />
        Back
      </button>

      <div className="animate-rise">
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-ink-900 sm:text-5xl">
          My Listings
        </h1>
        <p className="mt-3 text-base text-ink-600">
          Items you've posted this session — {items.length}{' '}
          {items.length === 1 ? 'listing' : 'listings'}.
        </p>

        {items.length === 0 ? (
          <div className="glass mt-8 flex flex-col items-center rounded-[2rem] px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-100">
              <InboxIcon className="h-7 w-7 text-mint-600" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-ink-900">
              You haven't posted anything yet
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-ink-500">
              Listings you post will show up here so you can keep track of them.
            </p>
            <button
              onClick={onPost}
              className="glow-mint mt-6 rounded-full bg-mint-500 px-6 py-3 text-sm font-extrabold text-mint-950 transition duration-300 hover:-translate-y-0.5 hover:bg-mint-400"
            >
              Post an Item
            </button>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <button
                  onClick={() => onView(item.id)}
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/70 bg-white/50"
                >
                  <SmartImage
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <TypeBadge type={item.type} tone="soft" />
                    <span className="text-[11px] font-bold uppercase tracking-wide text-ink-400">
                      {item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => onView(item.id)}
                    className="mt-1 block truncate text-left text-sm font-extrabold text-ink-900 hover:text-mint-700"
                  >
                    {item.title}
                  </button>
                  <p className="mt-0.5 text-xs font-medium text-ink-500">
                    {priceLabel(item)} · Posted {timeAgo(item.postedAt)}
                  </p>
                </div>

                {confirmingId === item.id ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-bold text-ink-600">Remove it?</span>
                    <button
                      onClick={() => {
                        onRemove(item.id)
                        setConfirmingId(null)
                      }}
                      className="rounded-full bg-rose-500 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-rose-600"
                    >
                      Yes, remove
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="rounded-full bg-ink-900/6 px-3.5 py-2 text-xs font-extrabold text-ink-700 transition hover:bg-ink-900/10"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => onEdit(item.id)}
                      aria-label="Edit listing"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-900/10 bg-white/55 text-ink-700 transition duration-300 hover:-translate-y-0.5 hover:bg-white/85"
                    >
                      <EditIcon className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => setConfirmingId(item.id)}
                      aria-label="Remove listing"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-500 transition duration-300 hover:-translate-y-0.5 hover:bg-rose-100"
                    >
                      <TrashIcon className="h-4.5 w-4.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
