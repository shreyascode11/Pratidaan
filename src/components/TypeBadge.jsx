const SOLID = {
  Sell: 'bg-ink-900 text-white',
  Exchange: 'bg-white/85 text-ink-800 backdrop-blur',
  Giveaway: 'bg-mint-400 text-mint-950',
}

const SOFT = {
  Sell: 'bg-ink-900/90 text-white',
  Exchange: 'bg-white/70 text-ink-700 ring-1 ring-ink-900/10',
  Giveaway: 'bg-mint-200 text-mint-900 ring-1 ring-mint-400/40',
}

const ON_DARK = {
  Sell: 'bg-white text-ink-900',
  Exchange: 'glass-dark text-white',
  Giveaway: 'bg-mint-400 text-mint-950',
}

export default function TypeBadge({ type, tone = 'solid', className = '' }) {
  const map = tone === 'soft' ? SOFT : tone === 'onDark' ? ON_DARK : SOLID
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${map[type] ?? map.Exchange} ${className}`}
    >
      {type}
    </span>
  )
}
