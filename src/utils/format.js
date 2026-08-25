/** "Jamal Osei" -> "JO" */
export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/** Deterministic avatar colour so a given poster always looks the same. */
const AVATAR_COLORS = [
  'bg-mint-200 text-mint-900',
  'bg-ink-200 text-ink-800',
  'bg-[#e6dcc6] text-[#5c4a24]',
  'bg-mint-100 text-mint-800',
  'bg-[#dfe3e8] text-[#39434f]',
  'bg-[#e8dbd6] text-[#6b4438]',
]
export function avatarColor(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

/** ISO string -> "today" / "3 days ago" / "2 weeks ago" */
export function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks === 1) return 'last week'
  if (days < 30) return `${weeks} weeks ago`
  const months = Math.floor(days / 30)
  return months === 1 ? 'last month' : `${months} months ago`
}

/** Sell items show a price; exchanges and giveaways show their intent. */
export function priceLabel(item) {
  if (item.type === 'Giveaway') return 'Free'
  if (item.type === 'Exchange') return 'Swap'
  return item.price != null && item.price !== '' ? `$${item.price}` : 'Ask'
}
