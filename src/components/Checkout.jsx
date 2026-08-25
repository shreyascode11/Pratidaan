import { useState } from 'react'
import SmartImage from './SmartImage.jsx'
import { ArrowLeftIcon, CardIcon, CheckIcon, LockIcon, SpinnerIcon } from './icons.jsx'
import { formatPrice } from '../utils/format.js'

/**
 * A fully simulated checkout — this app has no backend (see README), so
 * there is nowhere to actually process a card. Nothing entered here is
 * stored, sent anywhere, or validated against a real payment network; it's
 * a believable-looking flow that ends in a fake "processing" pause and a
 * success screen, clearly labeled throughout as a demo so it's never
 * mistaken for a real checkout.
 */

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export default function Checkout({ items, total, onComplete, onBack }) {
  const [form, setForm] = useState({ name: '', cardNumber: '', expiry: '', cvv: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('form') // 'form' | 'processing' | 'success'

  const set = (field, formatter) => (e) => {
    const value = formatter ? formatter(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Enter the name on the card.'

    const digits = form.cardNumber.replace(/\D/g, '')
    if (digits.length !== 16) next.cardNumber = 'Card number must be 16 digits.'

    const [mm, yy] = form.expiry.split('/')
    if (!mm || !yy || mm.length !== 2 || yy.length !== 2) {
      next.expiry = 'Use MM/YY format.'
    } else if (Number(mm) < 1 || Number(mm) > 12) {
      next.expiry = 'Not a valid month.'
    } else if (new Date(2000 + Number(yy), Number(mm), 0) < new Date()) {
      next.expiry = 'This card has expired.'
    }

    if (!/^\d{3,4}$/.test(form.cvv)) next.cvv = '3-4 digits.'

    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setStatus('processing')
    // Simulated network delay — nothing is actually sent anywhere.
    setTimeout(() => setStatus('success'), 1600)
  }

  const inputBase =
    'w-full rounded-2xl border bg-white/55 px-4 py-3.5 text-sm font-medium text-ink-900 shadow-[inset_0_1px_2px_rgba(16,24,20,0.05)] transition placeholder:text-ink-400 focus:bg-white/90 focus:outline-none'
  const ok = 'border-white/70 focus:border-mint-300 focus:ring-4 focus:ring-mint-400/20'
  const bad = 'border-rose-300/80 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/15'
  const cls = (field) => `${inputBase} ${errors[field] ? bad : ok}`

  if (status === 'success') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <div className="animate-pop glass mx-auto flex flex-col items-center rounded-[2rem] p-8 sm:p-10">
          <span className="glow-mint flex h-16 w-16 items-center justify-center rounded-full bg-mint-500">
            <CheckIcon className="h-8 w-8 text-mint-950" strokeWidth={2.6} />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-ink-900">
            Payment simulated successfully
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            This is a demo checkout — no real charge occurred and no card
            details were sent anywhere. Your cart has been cleared.
          </p>
          <div className="mt-6 w-full rounded-2xl border border-white/70 bg-white/50 p-4 text-left">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-bold text-ink-600">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
              <span className="text-lg font-extrabold text-mint-700 tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
          </div>
          <button
            onClick={onComplete}
            className="glow-ink mt-6 w-full rounded-2xl bg-ink-900 px-6 py-4 text-sm font-extrabold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-ink-800"
          >
            Back to browse
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <button
        onClick={onBack}
        disabled={status === 'processing'}
        className="glass group mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-ink-700 transition duration-300 hover:-translate-y-0.5 hover:text-ink-900 disabled:pointer-events-none disabled:opacity-50"
      >
        <ArrowLeftIcon className="h-4 w-4 transition group-hover:-translate-x-0.5" />
        Back to cart
      </button>

      <div className="animate-rise">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-ink-900 sm:text-5xl">
            Checkout
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-amber-800 ring-1 ring-amber-300/60">
            Demo — no real payment
          </span>
        </div>
        <p className="mt-3 text-base text-ink-600">
          This app has no backend, so this is a simulation. Use any numbers —
          nothing is charged or stored.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="glass min-w-0 space-y-5 rounded-[2rem] p-5 sm:p-8"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-ink-500">
              <LockIcon className="h-4 w-4 text-mint-600" />
              Simulated secure payment
            </div>

            <Field label="Name on card" htmlFor="name" error={errors.name}>
              <input
                id="name"
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. Alex Rivera"
                disabled={status === 'processing'}
                className={cls('name')}
              />
            </Field>

            <Field
              label="Card number"
              htmlFor="cardNumber"
              error={errors.cardNumber}
              hint="Try 4242 4242 4242 4242 — Stripe's well-known test number"
            >
              <div className="relative">
                <CardIcon className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
                <input
                  id="cardNumber"
                  inputMode="numeric"
                  value={form.cardNumber}
                  onChange={set('cardNumber', formatCardNumber)}
                  placeholder="4242 4242 4242 4242"
                  disabled={status === 'processing'}
                  className={`${cls('cardNumber')} pl-11 tabular-nums`}
                />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry" htmlFor="expiry" error={errors.expiry}>
                <input
                  id="expiry"
                  inputMode="numeric"
                  value={form.expiry}
                  onChange={set('expiry', formatExpiry)}
                  placeholder="MM/YY"
                  disabled={status === 'processing'}
                  className={`${cls('expiry')} tabular-nums`}
                />
              </Field>
              <Field label="CVV" htmlFor="cvv" error={errors.cvv}>
                <input
                  id="cvv"
                  type="password"
                  inputMode="numeric"
                  value={form.cvv}
                  onChange={set('cvv', (v) => v.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  disabled={status === 'processing'}
                  className={`${cls('cvv')} tabular-nums`}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={status === 'processing'}
              className="glow-mint flex w-full items-center justify-center gap-2 rounded-2xl bg-mint-500 px-6 py-4 text-base font-extrabold text-mint-950 transition duration-300 hover:-translate-y-0.5 hover:bg-mint-400 disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
            >
              {status === 'processing' ? (
                <>
                  <SpinnerIcon className="h-5 w-5 animate-spin" />
                  Processing…
                </>
              ) : (
                `Pay ${formatPrice(total)} (Demo)`
              )}
            </button>
          </form>

          {/* Order summary */}
          <div className="glass h-fit min-w-0 rounded-[2rem] p-5 sm:p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink-500">
              Order summary
            </h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/70 bg-white/50">
                    <SmartImage
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="min-w-0 flex-1 truncate text-sm font-bold text-ink-800">
                    {item.title}
                  </p>
                  <p className="shrink-0 text-sm font-bold text-ink-600 tabular-nums">
                    {item.price ? formatPrice(item.price) : 'Ask'}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-baseline justify-between border-t border-ink-900/8 pt-4">
              <span className="text-sm font-bold text-ink-600">Total</span>
              <span className="text-xl font-extrabold text-mint-700 tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-extrabold text-ink-800">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-bold text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs font-medium text-ink-400">{hint}</p>
      ) : null}
    </div>
  )
}
