import CategoryOrbit from './CategoryOrbit.jsx'
import { SparkIcon } from './icons.jsx'

export default function Hero({ total, freeCount, onPost, onSelectCategory }) {
  return (
    // overflow-hidden here (not on the inner max-w-7xl column) so the orbit
    // can be positioned relative to the section's full edge-to-edge width
    // without ever causing horizontal page scroll.
    <section className="relative overflow-hidden">
      <CategoryOrbit onSelect={onSelectCategory} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-2 pt-10 sm:px-6 sm:pt-14 lg:px-8">
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
      </div>
    </section>
  )
}
