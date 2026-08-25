import { useState } from 'react'
import Mascot from './Mascot.jsx'
import { ArrowLeftIcon, LogoMark, SparkIcon } from './icons.jsx'

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

const CAPTIONS = {
  neutral: 'A soft, abstract presence that greets you every time you trade. Pick a side below to make it yours.',
  male: 'Broad and grounded, cooler tones — that’s your Pratidaan self.',
  female: 'Tall and curved, warmer tones — that’s your Pratidaan self.',
}

/**
 * `fullScreen` drives the pre-auth gate: no "back to browse" (there's nothing
 * to go back to yet) and a bigger, viewport-filling stage. The same component
 * is reused, embedded and smaller, for a signed-in user revisiting the page.
 */
export default function LoginPage({ onSubmit, onBack, fullScreen = false }) {
  const [mode, setMode] = useState('signup') // 'signup' | 'login'
  const [gender, setGender] = useState('neutral') // 'neutral' | 'male' | 'female'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const isSignup = mode === 'signup'

  const set = (field) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  function validate() {
    const next = {}
    if (isSignup && !form.name.trim()) next.name = 'Tell us what to call you.'
    if (!form.email.trim()) next.email = 'Enter your email.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      next.email = 'That email doesn’t look right.'
    if (!form.password) next.password = 'Enter a password.'
    else if (form.password.length < 6)
      next.password = 'At least 6 characters, please.'
    if (isSignup && gender === 'neutral')
      next.gender = 'Pick one to personalize your avatar.'
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      mode,
      name: form.name.trim(),
      email: form.email.trim(),
      gender,
    })
  }

  function switchMode() {
    setMode((m) => (m === 'signup' ? 'login' : 'signup'))
    setErrors({})
  }

  const inputBase =
    'w-full rounded-2xl border bg-white/8 px-4 py-3.5 text-sm font-medium text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] transition placeholder:text-white/35 focus:bg-white/12 focus:outline-none'
  const ok = 'border-white/15 focus:border-mint-400/60 focus:ring-4 focus:ring-mint-400/15'
  const bad = 'border-rose-400/60 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/15'
  const cls = (field) => `${inputBase} ${errors[field] ? bad : ok}`

  return (
    <div
      className={
        fullScreen
          ? 'flex min-h-screen flex-col items-center justify-center bg-ink-950 px-4 py-10 sm:px-6 lg:px-8'
          : 'mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8'
      }
    >
      {fullScreen ? (
        <div className="mb-6 flex items-center gap-2.5">
          <LogoMark className="h-9 w-9 text-mint-400 drop-shadow-sm" />
          <span className="text-xl font-extrabold tracking-tight text-white">
            Prati<span className="text-mint-400">daan</span>
          </span>
        </div>
      ) : (
        <button
          onClick={onBack}
          className="glass group mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-ink-700 transition duration-300 hover:-translate-y-0.5 hover:text-ink-900"
        >
          <ArrowLeftIcon className="h-4 w-4 transition group-hover:-translate-x-0.5" />
          Back to browse
        </button>
      )}

      <div
        className={`animate-rise relative isolate w-full overflow-hidden rounded-[2.5rem] bg-ink-950 p-6 sm:p-10 lg:p-16 ${
          fullScreen ? 'max-w-6xl' : ''
        }`}
      >
        {/* Dark ambient stage — scoped to this card, not the whole page. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1c2823_0%,transparent_60%),linear-gradient(160deg,#0e100f_0%,#161c18_55%,#0a0c0b_100%)]" />
          <div className="absolute -left-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-mint-500/25 blur-[110px]" />
          <div className="absolute -right-20 bottom-0 h-[28rem] w-[28rem] rounded-full bg-mint-400/15 blur-[130px]" />
          <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-mint-300/10 blur-[100px]" />
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          {/* Mascot side */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="glass-night inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-mint-200">
              <SparkIcon className="h-3.5 w-3.5 text-mint-300" />
              Your Pratidaan avatar
            </span>

            <Mascot gender={gender} className="mt-6 w-60 sm:w-80 lg:w-88" />

            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60 lg:max-w-sm">
              {CAPTIONS[gender]}
            </p>
          </div>

          {/* Form side */}
          <div className="glass-night rounded-[2rem] p-6 sm:p-8">
            <div className="mb-6 flex gap-1 rounded-full bg-white/6 p-1">
              {[
                { key: 'signup', label: 'Sign up' },
                { key: 'login', label: 'Log in' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setMode(tab.key)}
                  className={`flex-1 rounded-full py-2.5 text-sm font-extrabold transition duration-300 ${
                    mode === tab.key
                      ? 'bg-mint-400 text-mint-950'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-1.5 text-sm text-white/50">
              {isSignup
                ? 'Takes thirty seconds — no card, no catch.'
                : 'Good to see you again.'}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              {isSignup && (
                <Field label="Name" htmlFor="name" error={errors.name}>
                  <input
                    id="name"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="e.g. Alex Rivera"
                    className={cls('name')}
                  />
                </Field>
              )}

              <Field label="Email" htmlFor="email" error={errors.email}>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@university.edu"
                  className={cls('email')}
                />
              </Field>

              <Field label="Password" htmlFor="password" error={errors.password}>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  className={cls('password')}
                />
              </Field>

              {isSignup && (
                <div>
                  <span className="mb-2.5 block text-sm font-extrabold text-white/85">
                    How should we shape your avatar?
                  </span>
                  <div className="flex gap-3">
                    {GENDER_OPTIONS.map((opt) => {
                      const selected = gender === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setGender(opt.value)
                            setErrors((prev) =>
                              prev.gender ? { ...prev, gender: undefined } : prev,
                            )
                          }}
                          aria-pressed={selected}
                          className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-extrabold transition duration-300 ${
                            selected
                              ? 'glow-mint border-mint-400 bg-mint-400 text-mint-950'
                              : 'border-white/15 bg-white/6 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                  {errors.gender ? (
                    <p className="mt-2 text-xs font-bold text-rose-400">
                      {errors.gender}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-white/40">
                      Subtle and just for fun — shifts your avatar's silhouette and accent.
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="glow-mint w-full rounded-2xl bg-mint-500 px-6 py-4 text-base font-extrabold text-mint-950 transition duration-300 hover:-translate-y-0.5 hover:bg-mint-400 active:translate-y-0"
              >
                {isSignup ? 'Create account' : 'Log in'}
              </button>
            </form>

            <button
              type="button"
              onClick={switchMode}
              className="mt-5 w-full text-center text-sm font-bold text-white/50 transition hover:text-mint-300"
            >
              {isSignup
                ? 'Already on Pratidaan? Log in'
                : 'New here? Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-extrabold text-white/85">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs font-bold text-rose-400">{error}</p>}
    </div>
  )
}
