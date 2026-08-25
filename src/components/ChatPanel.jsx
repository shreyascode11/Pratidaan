import { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar.jsx'
import { ChatIcon, CloseIcon, SendIcon } from './icons.jsx'

export default function ChatPanel({ item, messages, isTyping, onClose, onSend }) {
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)

  // Keep the thread pinned to the latest message as it grows.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!item) return null

  function handleSend(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }

  const firstName = item.poster.split(' ')[0]

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`Chat with ${firstName}`}>
      {/* Backdrop — click to dismiss */}
      <button
        aria-label="Close chat"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/35 backdrop-blur-sm"
      />

      <div className="animate-slide-in-right absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl sm:inset-y-3 sm:right-3 sm:rounded-[2rem]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-ink-900/8 p-4 sm:rounded-t-[2rem] sm:p-5">
          <Avatar name={item.poster} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-ink-900">{item.poster}</p>
            <p className="truncate text-xs font-medium text-ink-500">{item.title}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="shrink-0 rounded-full p-2 text-ink-400 transition hover:bg-ink-900/6 hover:text-ink-700"
          >
            <CloseIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
          {messages.length === 0 && !isTyping && (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint-100">
                <ChatIcon className="h-6 w-6 text-mint-600" />
              </span>
              <p className="mt-3 text-sm font-bold text-ink-700">
                Say hi to {firstName}
              </p>
              <p className="mt-1 text-sm text-ink-500">
                Ask about condition, timing, or where to meet on campus.
              </p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === 'me'
                    ? 'rounded-br-md bg-mint-500 text-mint-950'
                    : 'rounded-bl-md bg-white text-ink-800 shadow-sm ring-1 ring-ink-900/6'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-ink-900/6">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-400" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-400 [animation-delay:0.15s]" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-400 [animation-delay:0.3s]" />
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 border-t border-ink-900/8 p-3 sm:rounded-b-[2rem] sm:p-4"
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(e)
              }
            }}
            rows={1}
            placeholder={`Message ${firstName}…`}
            className="max-h-28 flex-1 resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-medium text-ink-900 shadow-[inset_0_1px_2px_rgba(16,24,20,0.05)] transition placeholder:text-ink-400 focus:border-mint-300 focus:bg-white focus:ring-4 focus:ring-mint-400/20 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
            className="glow-mint flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint-500 text-mint-950 transition duration-300 hover:-translate-y-0.5 hover:bg-mint-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <SendIcon className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  )
}
