const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.4-3.4" />
    </svg>
  )
}

export function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function ArrowLeftIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
    </svg>
  )
}

export function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  )
}

export function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function MapPinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

export function TagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 12.4V4a1 1 0 0 1 1-1h8.4a2 2 0 0 1 1.4.6l6.6 6.6a2 2 0 0 1 0 2.8l-7.4 7.4a2 2 0 0 1-2.8 0L3.6 13.8a2 2 0 0 1-.6-1.4Z" />
      <circle cx="7.8" cy="7.8" r="1.4" />
    </svg>
  )
}

export function ImageIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <circle cx="8.8" cy="9.6" r="1.6" />
      <path d="m4 17 4.6-4.6a2 2 0 0 1 2.8 0L20 21" />
    </svg>
  )
}

export function InboxIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 13h4l2 3h6l2-3h4" />
      <path d="M5.5 5h13l2.5 8v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4Z" />
    </svg>
  )
}

export function SparkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
    </svg>
  )
}

export function UploadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 16V4M12 4 7 9M12 4l5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}

export function UserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  )
}

export function BookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 17.5Z" />
      <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20" />
    </svg>
  )
}

export function LaptopIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="4" y="4.5" width="16" height="11" rx="1.4" />
      <path d="M2.5 19.5h19M9.5 19.5V16M14.5 19.5V16" />
    </svg>
  )
}

export function TicketIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 8.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.3a1.7 1.7 0 0 0 0 3.4v1.3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.3a1.7 1.7 0 0 0 0-3.4Z" />
      <path d="M14 6.5v11" strokeDasharray="2.2 2.4" />
    </svg>
  )
}

export function NotebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="5" y="3.5" width="14" height="17" rx="1.6" />
      <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4.5" />
    </svg>
  )
}

export function GraduationCapIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m12 4 9.5 4.5L12 13 2.5 8.5Z" />
      <path d="M6.5 10.8v4.4c0 1.3 2.5 3.3 5.5 3.3s5.5-2 5.5-3.3v-4.4M21.5 8.5v6" />
    </svg>
  )
}

export function GiftIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3.5" y="9" width="17" height="4" rx="1" />
      <path d="M5 13h14v7.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z" />
      <path d="M12 9v12.5" />
      <path d="M12 9C9.5 9 8 7.6 8 6.1 8 4.9 8.9 4 10 4c1.6 0 2 2 2 5Z" />
      <path d="M12 9c2.5 0 4-1.4 4-2.9C16 4.9 15.1 4 14 4c-1.6 0-2 2-2 5Z" />
    </svg>
  )
}

export function LogoMark(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="9" fill="#1a1d1c" />
      <path
        d="M10 24.5V11.5h8a3.25 3.25 0 0 1 0 6.5h-8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M20.5 8.5h4.5M22.75 6.25v4.5"
        stroke="#bbebd0"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
