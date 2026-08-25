import { LogoMark } from './icons.jsx'

export default function Footer() {
  return (
    <footer className="mx-auto mt-20 w-full max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
      <div className="glass flex flex-col items-center gap-3 rounded-[1.75rem] px-6 py-7 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-7 text-mint-500" />
          <span className="text-sm font-extrabold tracking-tight text-ink-900">
            Prati<span className="text-mint-600">daan</span>
          </span>
        </div>
        <p className="text-center text-xs font-medium text-ink-500 sm:text-right">
          Built by students, for students. Meet in public spaces on campus.
        </p>
      </div>
    </footer>
  )
}
