import { SparkIcon } from './icons.jsx'

function Stat({ value, label }) {
  return (
    <div className="glass rounded-2xl px-4 py-3.5">
      <p className="text-2xl font-extrabold tracking-tight text-ink-900 tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-ink-500 sm:text-[11px]">
        {label}
      </p>
    </div>
  )
}

export default function Hero({ total, freeCount, swapCount, onPost }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-2 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-ink-700">
            <SparkIcon className="h-3.5 w-3.5 text-mint-600" />
            {total} live listings on campus
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[0.98] tracking-[-0.03em] text-ink-900 sm:text-6xl lg:text-7xl">
            Everything you need
            <span className="block">
              is already <span className="text-mint-600">on campus</span>.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
            Buy it, swap it, or take it off someone&rsquo;s hands for free.
            Textbooks, tickets, notes and skills — traded student to student, no
            middleman.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onPost}
              className="glow-ink rounded-full bg-ink-900 px-7 py-4 text-sm font-extrabold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-ink-800 active:translate-y-0"
            >
              Post an Item
            </button>
            <a
              href="#listings"
              className="glass rounded-full px-6 py-4 text-sm font-extrabold text-ink-800 transition duration-300 hover:-translate-y-0.5"
            >
              Browse {freeCount} freebies &rarr;
            </a>
          </div>
        </div>

        <div className="grid w-full shrink-0 grid-cols-3 gap-3 lg:w-72 lg:grid-cols-1">
          <Stat value={total} label="On the board" />
          <Stat value={freeCount} label="Free to take" />
          <Stat value={swapCount} label="Open to swap" />
        </div>
      </div>
    </section>
  )
}
