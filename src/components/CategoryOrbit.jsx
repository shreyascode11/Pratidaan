import {
  BookIcon,
  GiftIcon,
  GraduationCapIcon,
  LaptopIcon,
  NotebookIcon,
  TicketIcon,
} from './icons.jsx'

/**
 * Angle is measured clockwise from "straight down" (0°) sweeping toward
 * "straight left" (90°) — i.e. the bottom-left quarter of a circle. That
 * quarter is what stays visible once the circle's own center is pinned to
 * the orbit box's top-right corner (see the `orbit` div below): the rest of
 * the circle falls off-canvas above and to the right.
 *
 *   x_offset = -radius * sin(angle)   (grows left as angle increases)
 *   y_offset =  radius * cos(angle)   (shrinks toward 0 as angle increases)
 *
 * radiusPct varies per icon (not one clean ring) for the "satellites at
 * different heights" look the design calls for, and duration/delay stagger
 * the float so six icons never bob in sync.
 */
// Angles kept strictly inside (0°, 90°) — 90° itself sends cos() to 0 and
// anything past it goes negative, pushing an icon above the orbit box's own
// top edge where the section's overflow-hidden silently clips it away.
const ORBIT_ICONS = [
  { category: 'Electronics', Icon: LaptopIcon, angle: 15, radiusPct: 44, duration: 6.5, delay: 0 },
  { category: 'Tickets', Icon: TicketIcon, angle: 30, radiusPct: 34, duration: 5.5, delay: 0.9 },
  { category: 'Skills', Icon: GraduationCapIcon, angle: 44, radiusPct: 47, duration: 7, delay: 0.4 },
  { category: 'Notes', Icon: NotebookIcon, angle: 58, radiusPct: 31, duration: 6, delay: 1.4 },
  { category: 'Freebies', Icon: GiftIcon, angle: 71, radiusPct: 43, duration: 6.8, delay: 0.2 },
  { category: 'Textbooks', Icon: BookIcon, angle: 83, radiusPct: 27, duration: 5.8, delay: 1.1 },
]

const RAD = Math.PI / 180

function OrbitBadge({ Icon, badgeSize = 'h-14 w-14', iconSize = 'h-6 w-6' }) {
  return (
    <span
      className={`glow-mint flex ${badgeSize} items-center justify-center rounded-full bg-ink-900 shadow-lg shadow-ink-950/30 ring-1 ring-white/10`}
    >
      <Icon className={`${iconSize} text-mint-400`} strokeWidth={1.7} />
    </span>
  )
}

export default function CategoryOrbit({ onSelect }) {
  return (
    <>
      {/* Desktop / tablet: icons scattered along a soft arc, upper-right of the hero */}
      <div
        aria-hidden={false}
        className="pointer-events-none absolute right-0 top-0 hidden aspect-square w-140 lg:block xl:w-170"
      >
        {/* the soft blurred ring band itself, sitting behind the icons */}
        <div
          aria-hidden="true"
          className="absolute rounded-full opacity-70 blur-3xl"
          style={{
            right: '-18%',
            top: '-18%',
            width: '85%',
            height: '85%',
            background:
              'conic-gradient(from 200deg, transparent, color-mix(in oklab, var(--color-mint-400) 55%, transparent) 30%, color-mix(in oklab, var(--color-mint-300) 40%, transparent) 55%, transparent 75%)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 90px), #000 calc(100% - 90px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 90px), #000 calc(100% - 90px))',
          }}
        />

        {ORBIT_ICONS.map(({ category, Icon, angle, radiusPct, duration, delay }) => {
          const left = 100 - radiusPct * Math.sin(angle * RAD)
          const top = radiusPct * Math.cos(angle * RAD)
          return (
            // Position (margin-based centering), the float bob, and the hover
            // scale are split across three nested elements on purpose — all
            // three would otherwise fight over the single `transform`
            // property on one element and silently clobber each other.
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              aria-label={`Browse ${category}`}
              title={category}
              // z-20 keeps every badge clickable even where its position
              // happens to land under the hero's headline/stat-tile column
              // (that content is deliberately z-10 for text legibility).
              className="group pointer-events-auto absolute z-20 -mt-7 -ml-7"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <span
                className="orbit-float block"
                style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
              >
                <span className="block transition-transform duration-300 group-hover:scale-110">
                  <OrbitBadge Icon={Icon} />
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Mobile: same six categories, plain floating row — no arc geometry */}
      <div className="mt-8 flex flex-wrap justify-center gap-3 lg:hidden">
        {ORBIT_ICONS.map(({ category, Icon, duration, delay }) => (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            aria-label={`Browse ${category}`}
            className="orbit-float flex flex-col items-center gap-1.5"
            style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
          >
            <OrbitBadge Icon={Icon} badgeSize="h-12 w-12" iconSize="h-5 w-5" />
            <span className="text-[11px] font-bold text-ink-600">{category}</span>
          </button>
        ))}
      </div>
    </>
  )
}
