import { CATEGORIES } from '../data/seed.js'

export default function CategoryFilter({ active, onChange, counts }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2.5 sm:w-auto sm:flex-wrap">
        {CATEGORIES.map((cat) => {
          const selected = cat === active
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              aria-pressed={selected}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition duration-300 hover:-translate-y-0.5 ${
                selected
                  ? 'glow-ink bg-ink-900 text-white'
                  : 'glass text-ink-700 hover:text-ink-900'
              }`}
            >
              {cat}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-extrabold tabular-nums ${
                  selected ? 'bg-mint-400 text-mint-950' : 'bg-ink-900/8 text-ink-500'
                }`}
              >
                {counts[cat] ?? 0}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
