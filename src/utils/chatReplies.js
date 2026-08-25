/**
 * Simulated replies for the chat panel. There's no backend and no other
 * real user on the other end (see README — everything here is in-memory),
 * so a message sent into total silence would just look broken. A short
 * "typing…" pause followed by one of these keeps the thread feeling alive
 * without pretending to be a real, connected messaging system.
 */

const REPLIES = {
  Sell: [
    "Hey! Yep, still available — when works for you to grab it?",
    "Sounds good, I'm usually free on campus after 3pm most days.",
    "Sure thing — cash or Venmo both work for me.",
    "Yeah it's still up for grabs. Where's easiest for you to meet?",
  ],
  Exchange: [
    "I'm open to that — what did you have in mind for a trade?",
    "Sounds fair to me. When's a good time to meet up and swap?",
    "Let's do it — where on campus is easiest for you?",
    "Yeah I'd be into that trade, just let me know when works.",
  ],
  Giveaway: [
    "It's still up for grabs — come by whenever's easiest for you!",
    "Yep, free to whoever wants it, first come first served.",
    "Totally free, no rush at all. Just tell me when works.",
    "Still here! Happy to leave it out if you can't catch me directly.",
  ],
}

export function generateAutoReply(type) {
  const pool = REPLIES[type] ?? REPLIES.Sell
  return pool[Math.floor(Math.random() * pool.length)]
}
