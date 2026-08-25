import { InboxIcon } from './icons.jsx'

export default function EmptyState({ query, category, onReset }) {
  const what = query
    ? `“${query}”`
    : category !== 'All'
      ? `the ${category} category`
      : 'that'

  return (
    <div className="glass col-span-full flex flex-col items-center rounded-[1.75rem] px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint-200/70">
        <InboxIcon className="h-8 w-8 text-mint-700" />
      </div>
      <h3 className="mt-5 text-xl font-extrabold tracking-tight text-ink-900">
        Nothing matching {what} yet
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
        Try a different search, or clear the filters to see everything students
        have posted.
      </p>
      <button
        onClick={onReset}
        className="glow-ink mt-6 rounded-full bg-ink-900 px-6 py-3 text-sm font-extrabold text-white transition duration-300 hover:-translate-y-0.5"
      >
        Clear filters
      </button>
    </div>
  )
}
