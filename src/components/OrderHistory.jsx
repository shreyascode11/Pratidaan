import SmartImage from './SmartImage.jsx'
import TypeBadge from './TypeBadge.jsx'
import { ArrowLeftIcon, InboxIcon, PackageIcon } from './icons.jsx'
import { formatPrice, timeAgo } from '../utils/format.js'

const REQUEST_NOUN = {
  Sell: 'Request sent',
  Exchange: 'Swap request sent',
  Giveaway: 'Claim sent',
}

export default function OrderHistory({ orders, requestedItems, onView, onBack }) {
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
          Order &amp; Request History
        </h1>

        {/* Orders */}
        <section className="mt-10">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink-500">
            Orders
          </h2>

          {orders.length === 0 ? (
            <EmptyRow
              icon={<PackageIcon className="h-6 w-6 text-mint-600" />}
              text="No orders yet — checkout completions will show up here."
            />
          ) : (
            <div className="mt-3 space-y-3">
              {orders
                .slice()
                .reverse()
                .map((order) => (
                  <div key={order.id} className="glass rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-extrabold text-ink-900">
                        {order.items.length}{' '}
                        {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-xs font-medium text-ink-500">
                        {timeAgo(order.completedAt)}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => onView(item.id)}
                          title={item.title}
                          className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/70 bg-white/50"
                        >
                          <SmartImage
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-ink-900/8 pt-3">
                      <span className="text-xs font-bold text-ink-500">Total paid</span>
                      <span className="text-base font-extrabold text-mint-700 tabular-nums">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* Requests sent */}
        <section className="mt-10">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink-500">
            Requests sent
          </h2>

          {requestedItems.length === 0 ? (
            <EmptyRow
              icon={<InboxIcon className="h-6 w-6 text-mint-600" />}
              text="No requests yet — items you request, swap, or claim will show up here."
            />
          ) : (
            <div className="mt-3 space-y-3">
              {requestedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onView(item.id)}
                  className="glass flex w-full items-center gap-4 rounded-2xl p-4 text-left transition duration-300 hover:-translate-y-0.5"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/70 bg-white/50">
                    <SmartImage
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <TypeBadge type={item.type} tone="soft" />
                      <span className="text-xs font-bold text-mint-700">
                        {REQUEST_NOUN[item.type] ?? 'Request sent'}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-extrabold text-ink-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs font-medium text-ink-500">
                      to {item.poster}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function EmptyRow({ icon, text }) {
  return (
    <div className="glass mt-3 flex items-center gap-3.5 rounded-2xl p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mint-100">
        {icon}
      </span>
      <p className="text-sm font-medium text-ink-500">{text}</p>
    </div>
  )
}
