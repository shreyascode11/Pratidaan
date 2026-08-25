import Avatar from './Avatar.jsx'
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  ListIcon,
  LogOutIcon,
  PackageIcon,
} from './icons.jsx'

export default function Profile({
  user,
  listingCount,
  orderCount,
  requestCount,
  onOpenMyListings,
  onOpenOrders,
  onSignOut,
  onBack,
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <button
        onClick={onBack}
        className="glass group mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-ink-700 transition duration-300 hover:-translate-y-0.5 hover:text-ink-900"
      >
        <ArrowLeftIcon className="h-4 w-4 transition group-hover:-translate-x-0.5" />
        Back to browse
      </button>

      <div className="animate-rise glass rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight text-ink-900">
              {user.name}
            </h1>
            <p className="truncate text-sm font-medium text-ink-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <NavRow
            icon={<ListIcon className="h-5 w-5" />}
            label="My Listings"
            hint={`${listingCount} posted this session`}
            onClick={onOpenMyListings}
          />
          <NavRow
            icon={<PackageIcon className="h-5 w-5" />}
            label="Order & Request History"
            hint={`${orderCount} order${orderCount === 1 ? '' : 's'} · ${requestCount} request${requestCount === 1 ? '' : 's'}`}
            onClick={onOpenOrders}
          />
        </div>

        <button
          onClick={onSignOut}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-3.5 text-sm font-extrabold text-rose-600 transition duration-300 hover:-translate-y-0.5 hover:bg-rose-100"
        >
          <LogOutIcon className="h-4.5 w-4.5" />
          Sign out
        </button>
      </div>
    </div>
  )
}

function NavRow({ icon, label, hint, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 rounded-2xl border border-white/70 bg-white/50 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:bg-white/80"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mint-100 text-mint-700">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-ink-900">{label}</p>
        <p className="text-xs font-medium text-ink-500">{hint}</p>
      </div>
      <ChevronRightIcon className="h-4.5 w-4.5 shrink-0 text-ink-400" />
    </button>
  )
}
