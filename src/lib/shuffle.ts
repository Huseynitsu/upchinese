function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(list: T[], seed = Date.now()): T[] {
  const rng = mulberry32(seed)
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const PRACTICE_SIZE = {
  vocab: 40,
  quiz: 40,
  dictation: 25,
  writing: 8,
  strokes: 20,
  speaking: 8,
} as const

export function practiceSizeFor(
  level: 1 | 2 | 3 | 4 | 5 | 6,
  skill: "listening" | "reading" | "writing" | "quiz"
) {
  if (skill === "quiz") return PRACTICE_SIZE.quiz
  const count = EXAM_COUNTS[level][skill]
  return count || PRACTICE_SIZE.quiz
}

export const EXAM_COUNTS: Record<
  1 | 2 | 3 | 4 | 5 | 6,
  { listening: number; reading: number; writing: number }
> = {
  1: { listening: 20, reading: 20, writing: 0 },
  2: { listening: 35, reading: 25, writing: 0 },
  3: { listening: 40, reading: 30, writing: 10 },
  4: { listening: 45, reading: 40, writing: 15 },
  5: { listening: 45, reading: 45, writing: 10 },
  6: { listening: 50, reading: 50, writing: 4 },
}

export const EXAM_TIME_SEC: Record<
  1 | 2 | 3 | 4 | 5 | 6,
  { listening: number; reading: number; writing: number }
> = {
  1: { listening: 15 * 60, reading: 15 * 60, writing: 0 },
  2: { listening: 25 * 60, reading: 20 * 60, writing: 0 },
  3: { listening: 35 * 60, reading: 25 * 60, writing: 15 * 60 },
  4: { listening: 30 * 60, reading: 40 * 60, writing: 25 * 60 },
  5: { listening: 30 * 60, reading: 45 * 60, writing: 40 * 60 },
  6: { listening: 35 * 60, reading: 50 * 60, writing: 45 * 60 },
}
