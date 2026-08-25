import EmptyState from './EmptyState.jsx'
import ItemCard from './ItemCard.jsx'

/**
 * Bento layout: every tile spans two grid rows, and every 7th spans two
 * columns as a wide feature tile. Uniform row spans plus dense flow means the
 * grid never leaves holes, whatever the filtered count happens to be.
 */
const isFeature = (index) => index % 7 === 0

export default function ItemGrid({ items, onView, newIds, ...emptyProps }) {
  if (items.length === 0) return <EmptyState {...emptyProps} />

  return (
    <div className="stagger grid auto-rows-[180px] grid-flow-row-dense grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, i) => (
        <ItemCard
          key={item.id}
          item={item}
          onView={onView}
          isNew={newIds.has(item.id)}
          variant={isFeature(i) ? 'feature' : 'standard'}
        />
      ))}
    </div>
  )
}
