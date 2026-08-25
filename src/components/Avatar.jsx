import { avatarColor, initials } from '../utils/format.js'

export default function Avatar({ name, size = 'sm', onDark = false }) {
  const sizes = {
    sm: 'h-7 w-7 text-[11px]',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-extrabold ${sizes[size]} ${
        onDark ? 'bg-white/20 text-white backdrop-blur' : avatarColor(name)
      }`}
    >
      {initials(name)}
    </span>
  )
}
