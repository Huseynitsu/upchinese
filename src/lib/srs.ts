import type { SrsCard } from "./types"

function clampEase(ease: number) {
  return Math.max(1.3, ease)
}

export function createSrsCard(userId: string, vocabId: string): SrsCard {
  return {
    userId,
    vocabId,
    dueAt: new Date().toISOString(),
    interval: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
  }
}

/** Put a vocab word into the review deck without scheduling it for later. */
export function enrollSrsCard(card: SrsCard, quality: number): SrsCard {
  const q = Math.min(5, Math.max(0, quality))
  const next = { ...card }
  if (q < 3) {
    next.reps = 0
    next.interval = 0
    next.lapses += 1
  }
  next.dueAt = new Date().toISOString()
  return next
}

/** SM-2. Quality 0-5. Values under 3 stay due now so they return in review. */
export function reviewSrsCard(card: SrsCard, quality: number): SrsCard {
  const q = Math.min(5, Math.max(0, quality))
  const next = { ...card }

  if (q < 3) {
    next.reps = 0
    next.interval = 0
    next.lapses += 1
    next.dueAt = new Date().toISOString()
    return next
  }

  if (next.reps === 0) next.interval = 1
  else if (next.reps === 1) next.interval = 6
  else next.interval = Math.round(next.interval * next.ease)

  next.reps += 1
  next.ease = clampEase(next.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))

  const due = new Date()
  due.setDate(due.getDate() + Math.max(1, next.interval))
  next.dueAt = due.toISOString()
  return next
}

export function isDue(card: SrsCard, now = new Date()) {
  if (card.interval === 0 || card.reps === 0) return true
  const due = new Date(card.dueAt).getTime()
  if (Number.isNaN(due)) return true
  return due <= now.getTime()
}
