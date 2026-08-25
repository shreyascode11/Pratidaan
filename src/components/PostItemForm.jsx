import { useEffect, useRef, useState } from 'react'
import SmartImage from './SmartImage.jsx'
import { ArrowLeftIcon, UploadIcon } from './icons.jsx'
import { CATEGORIES } from '../data/seed.js'
import { generateDescription } from '../utils/generateDescription.js'

const TYPE_OPTIONS = [
  { value: 'Sell', label: 'Sell', hint: 'Set a price' },
  { value: 'Exchange', label: 'Exchange', hint: 'Swap for something' },
  { value: 'Giveaway', label: 'Give away', hint: 'Free to a good home' },
]

const SELECTABLE_CATEGORIES = CATEGORIES.filter((c) => c !== 'All')

const EMPTY = {
  title: '',
  category: '',
  type: 'Sell',
  price: '',
  description: '',
  image: '',
  poster: '',
}

export default function PostItemForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  // Preview lags the input so a half-typed URL isn't fetched on every keystroke.
  const [previewSrc, setPreviewSrc] = useState('')

  useEffect(() => {
    const id = setTimeout(() => setPreviewSrc(form.image.trim()), 500)
    return () => clearTimeout(id)
  }, [form.image])

  const fileInputRef = useRef(null)
  const isUploadedImage = form.image.startsWith('data:')

  const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5MB

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // let the same file be picked again later
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please choose an image file.' }))
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        image: 'That image is too large — try one under 5MB.',
      }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      setForm((f) => ({ ...f, image: dataUrl }))
      setPreviewSrc(dataUrl)
      setErrors((prev) => (prev.image ? { ...prev, image: undefined } : prev))
    }
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, image: 'Couldn’t read that file — try again.' }))
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setForm((f) => ({ ...f, image: '' }))
    setPreviewSrc('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const set = (field) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  // ---- AI description assist ----
  // Optional and non-blocking: the field works fine if this is never touched,
  // and a failed/unavailable AI call falls back to a template rather than
  // leaving the button stuck or the field empty.
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSource, setAiSource] = useState(null) // null | 'ai' | 'template'
  const [aiNotice, setAiNotice] = useState(null)

  function handleDescriptionChange(e) {
    set('description')(e)
    if (aiSource) setAiSource(null) // caption only applies to generated text
  }

  async function handleGenerateDescription() {
    if (!form.title.trim()) {
      setAiNotice('Add a title first so there’s something to describe.')
      return
    }
    setAiNotice(null)
    setAiLoading(true)
    try {
      const { text, source } = await generateDescription({
        title: form.title.trim(),
        category: form.category,
        type: form.type,
      })
      setForm((f) => ({ ...f, description: text }))
      setAiSource(source)
      setErrors((prev) => (prev.description ? { ...prev, description: undefined } : prev))
    } finally {
      setAiLoading(false)
    }
  }

  // Field already shows `error` over `hint`, so this only surfaces once any
  // validation error on the field is cleared.
  const descriptionHint =
    aiNotice ??
    (aiSource === 'ai'
      ? 'Generated with AI — feel free to edit it.'
      : aiSource === 'template'
        ? 'Drafted for you — feel free to edit it.'
        : undefined)

  function validate() {
    const next = {}
    if (!form.title.trim()) next.title = 'Give your listing a title.'
    if (!form.category) next.category = 'Pick a category.'
    if (!form.description.trim()) next.description = 'Add a short description.'
    if (!form.poster.trim()) next.poster = 'Tell people who you are.'
    if (form.type === 'Sell' && form.price !== '' && Number(form.price) < 0)
      next.price = 'Price can’t be negative.'
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    onSubmit({
      title: form.title.trim(),
      category: form.category,
      type: form.type,
      price: form.type === 'Sell' && form.price !== '' ? Number(form.price) : null,
      description: form.description.trim(),
      details: form.description.trim(),
      image: form.image.trim(),
      poster: form.poster.trim(),
      condition: null,
      location: 'On campus',
    })
  }

  const inputBase =
    'w-full rounded-2xl border bg-white/55 px-4 py-3.5 text-sm font-medium text-ink-900 shadow-[inset_0_1px_2px_rgba(16,24,20,0.05)] transition placeholder:text-ink-400 focus:bg-white/90 focus:outline-none'
  const ok = 'border-white/70 focus:border-mint-300 focus:ring-4 focus:ring-mint-400/20'
  const bad = 'border-rose-300/80 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/15'
  const cls = (field) => `${inputBase} ${errors[field] ? bad : ok}`

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <button
        onClick={onCancel}
        className="glass group mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-ink-700 transition duration-300 hover:-translate-y-0.5 hover:text-ink-900"
      >
        <ArrowLeftIcon className="h-4 w-4 transition group-hover:-translate-x-0.5" />
        Back to browse
      </button>

      <div className="animate-rise">
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-ink-900 sm:text-5xl">
          Post an item
        </h1>
        <p className="mt-3 text-base text-ink-600">
          It takes about thirty seconds. Your listing goes straight to the top of
          the board.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="glass mt-8 space-y-6 rounded-[2rem] p-5 sm:p-8"
        >
          <Field label="Title" htmlFor="title" error={errors.title}>
            <input
              id="title"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Campbell Biology, 12th Edition"
              className={cls('title')}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Category" htmlFor="category" error={errors.category}>
              <select
                id="category"
                value={form.category}
                onChange={set('category')}
                className={`${cls('category')} select-chevron`}
              >
                <option value="">Choose a category…</option>
                {SELECTABLE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            {form.type === 'Sell' && (
              <Field
                label="Price"
                htmlFor="price"
                error={errors.price}
                hint="Leave blank for “Ask”"
              >
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-ink-400">
                    $
                  </span>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="decimal"
                    value={form.price}
                    onChange={set('price')}
                    placeholder="25"
                    className={`${cls('price')} pl-8`}
                  />
                </div>
              </Field>
            )}
          </div>

          <Field
            label="Description"
            htmlFor="description"
            error={errors.description}
            hint={descriptionHint}
            labelExtra={
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={aiLoading}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-mint-300/60 bg-mint-100/70 px-3 py-1.5 text-xs font-extrabold text-mint-800 transition duration-300 hover:-translate-y-0.5 hover:bg-mint-200/80 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {aiLoading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-mint-700 border-t-transparent" />
                    Generating…
                  </>
                ) : (
                  <>✨ {form.description.trim() ? 'Regenerate' : 'Generate with AI'}</>
                )}
              </button>
            }
          >
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={handleDescriptionChange}
              placeholder="Condition, why you're posting it, where you can meet…"
              className={`${cls('description')} resize-y`}
            />
          </Field>

          <Field
            label="Image URL"
            htmlFor="image"
            error={errors.image}
            hint={
              isUploadedImage
                ? 'Using your uploaded photo'
                : "Optional — paste a link or upload a photo from your device"
            }
          >
            <div className="flex gap-3">
              <input
                id="image"
                type="url"
                value={isUploadedImage ? '' : form.image}
                onChange={set('image')}
                disabled={isUploadedImage}
                placeholder={
                  isUploadedImage
                    ? 'Remove the upload to paste a URL instead'
                    : 'https://images.unsplash.com/photo-…'
                }
                className={`${cls('image')} flex-1 disabled:cursor-not-allowed disabled:opacity-60`}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-white/70 bg-white/55 px-4 text-xs font-extrabold text-ink-700 transition duration-300 hover:-translate-y-0.5 hover:bg-white/85"
              >
                <UploadIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>

            {previewSrc && (
              <div className="mt-3 flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/70 bg-white/50">
                  <SmartImage
                    src={previewSrc}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs font-bold text-ink-500 transition hover:text-rose-600"
                >
                  Remove image
                </button>
              </div>
            )}
          </Field>

          <fieldset>
            <legend className="mb-2.5 block text-sm font-extrabold text-ink-800">
              How are you offering it?
            </legend>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {TYPE_OPTIONS.map((opt) => {
                const selected = form.type === opt.value
                return (
                  <label
                    key={opt.value}
                    className={`cursor-pointer rounded-2xl border p-3.5 text-center transition duration-300 ${
                      selected
                        ? 'glow-mint border-mint-400 bg-mint-300/60'
                        : 'border-white/70 bg-white/45 hover:bg-white/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={opt.value}
                      checked={selected}
                      onChange={set('type')}
                      className="sr-only"
                    />
                    <span
                      className={`block text-sm font-extrabold ${
                        selected ? 'text-mint-950' : 'text-ink-800'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span
                      className={`mt-0.5 block text-[11px] font-medium ${
                        selected ? 'text-mint-900/70' : 'text-ink-500'
                      }`}
                    >
                      {opt.hint}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <Field label="Your name" htmlFor="poster" error={errors.poster}>
            <input
              id="poster"
              value={form.poster}
              onChange={set('poster')}
              placeholder="e.g. Alex Rivera"
              className={cls('poster')}
            />
          </Field>

          <div className="flex flex-col-reverse gap-3 border-t border-ink-900/8 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full px-6 py-3.5 text-sm font-bold text-ink-600 transition hover:bg-ink-900/6 hover:text-ink-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glow-mint rounded-full bg-mint-500 px-8 py-3.5 text-sm font-extrabold text-mint-950 transition duration-300 hover:-translate-y-0.5 hover:bg-mint-400 active:translate-y-0"
            >
              Publish listing
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, htmlFor, error, hint, labelExtra, children }) {
  return (
    <div>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="block text-sm font-extrabold text-ink-800">
          {label}
        </label>
        {labelExtra}
      </div>
      {children}
      {error ? (
        <p className="mt-2 text-xs font-bold text-rose-600">{error}</p>
      ) : hint ? (
        <p className="mt-2 text-xs font-medium text-ink-400">{hint}</p>
      ) : null}
    </div>
  )
}
