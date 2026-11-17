import { notFound } from "next/navigation"
import type { HskLevel, ToolId } from "./types"

export const HSK_LEVELS: HskLevel[] = [1, 2, 3, 4, 5, 6]

export const LEVEL_META: Record<
  HskLevel,
  { words: string; focus: string; tone: string }
> = {
  1: {
    words: "150 words",
    focus: "Survival Chinese: greetings, numbers, family, food",
    tone: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
  2: {
    words: "300 words",
    focus: "Daily life: shopping, travel, simple opinions",
    tone: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  },
  3: {
    words: "600 words",
    focus: "Work, study, and short written answers",
    tone: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  },
  4: {
    words: "1,200 words",
    focus: "Discussion, plans, and longer reading",
    tone: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  },
  5: {
    words: "2,500 words",
    focus: "News, essays, and abstract topics",
    tone: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  },
  6: {
    words: "5,000+ words",
    focus: "Near-fluent reading and formal writing",
    tone: "bg-red-500/15 text-red-300 border-red-500/30",
  },
}

export const TOOLS: {
  id: ToolId
  title: string
  description: string
  href: (level: HskLevel) => string
  minLevel?: HskLevel
}[] = [
  {
    id: "vocab",
    title: "Vocabulary",
    description: "Flashcards with hanzi, pinyin, and English.",
    href: (level) => `/hsk/${level}/vocab`,
  },
  {
    id: "hanzi",
    title: "Hanzi",
    description: "Recognize characters and practice stroke order.",
    href: (level) => `/hsk/${level}/hanzi`,
  },
  {
    id: "pinyin",
    title: "Pinyin & tones",
    description: "Hear syllables and lock in the four tones.",
    href: (level) => `/hsk/${level}/pinyin`,
  },
  {
    id: "listening",
    title: "Listening",
    description: "Short audio prompts with exam-style questions.",
    href: (level) => `/hsk/${level}/listening`,
  },
  {
    id: "reading",
    title: "Reading",
    description: "Passages and sentences at your HSK level.",
    href: (level) => `/hsk/${level}/reading`,
  },
  {
    id: "grammar",
    title: "Grammar",
    description: "Clear explanations plus targeted drills.",
    href: (level) => `/hsk/${level}/grammar`,
  },
  {
    id: "dictation",
    title: "Dictation",
    description: "Listen, then write the hanzi or pinyin.",
    href: (level) => `/hsk/${level}/dictation`,
  },
  {
    id: "writing",
    title: "Writing",
    description: "Short written responses for HSK 3 and above, with a model answer.",
    href: (level) => `/hsk/${level}/writing`,
    minLevel: 3,
  },
  {
    id: "speaking",
    title: "Speaking",
    description: "Read aloud or answer, then record and get a recognition score.",
    href: (level) => `/hsk/${level}/speaking`,
  },
  {
    id: "exam",
    title: "Mock exam",
    description: "Five official-style booklets per level, timed Listening, Reading, and Writing.",
    href: (level) => `/hsk/${level}/exam`,
  },
]

export function parseLevel(value: string): HskLevel | null {
  const n = Number(value)
  return HSK_LEVELS.includes(n as HskLevel) ? (n as HskLevel) : null
}

export function requireLevel(value: string): HskLevel {
  const level = parseLevel(value)
  if (!level) notFound()
  return level
}

export function isWritingLevel(level: HskLevel) {
  return level >= 3
}
