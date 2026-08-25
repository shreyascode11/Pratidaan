import { useState } from 'react'
import { ImageIcon } from './icons.jsx'

/**
 * <img> that degrades gracefully: a pulsing tint while it loads and a branded
 * placeholder if the URL is broken — user-submitted image URLs often are.
 *
 * Keyed on `src` so a changed URL remounts with fresh state, which avoids
 * resetting state from an effect (that chains nested updates when `src`
 * changes rapidly, e.g. typing into the image field).
 *
 * The loading state is painted as the <img>'s own background rather than a
 * separate element: an image hidden with `display:none` has no layout box, so
 * `loading="lazy"` would never fire and it would never load at all.
 */
export default function SmartImage({ src, ...rest }) {
  return <Img key={src || '__none__'} src={src} {...rest} />
}

function Img({ src, alt, className = '', ...rest }) {
  const [status, setStatus] = useState(src ? 'loading' : 'error')

  if (status === 'error') {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-mint-100 via-white to-[#e8dcc8] ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageIcon className="h-8 w-8 text-mint-500/70" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={() => setStatus('ready')}
      onError={() => setStatus('error')}
      className={`${className} ${status === 'loading' ? 'animate-pulse bg-ink-200/70' : ''}`}
      {...rest}
    />
  )
}
