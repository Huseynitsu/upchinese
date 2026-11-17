export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6

export type ToolId =
  | "vocab"
  | "srs"
  | "hanzi"
  | "pinyin"
  | "listening"
  | "reading"
  | "grammar"
  | "dictation"
  | "writing"
  | "speaking"
  | "exam"

export type Skill =
  | "listening"
  | "reading"
  | "grammar"
  | "exam"
  | "pinyin"
  | "dictation"
  | "writing"
  | "hanzi"
  | "speaking"

export type QuestionKind =
  | "meaning"
  | "cloze"
  | "true-false"
  | "order"
  | "picture"
  | "tone"
  | "listen-word"
  | "listen-sentence"
  | "listen-dialogue"
  | "read-aloud"
  | "speak-answer"

export type VocabItem = {
  id: string
  hskLevel: HskLevel
  hanzi: string
  pinyin: string
  english: string
  exampleZh: string
  exampleEn: string
}

export type GrammarLesson = {
  id: string
  hskLevel: HskLevel
  title: string
  explanation: string
  examples: { zh: string; pinyin: string; en: string }[]
}

export type Passage = {
  id: string
  hskLevel: HskLevel
  title: string
  body: string
  bodyEn?: string
}

export type Choice = {
  key: string
  text: string
  emoji?: string
}

export type Question = {
  id: string
  hskLevel: HskLevel
  skill: Skill
  kind?: QuestionKind
  prompt: string
  promptZh?: string
  passageId?: string
  audioText?: string
  layout?: "list" | "pictures"
  choices?: Choice[]
  correctKey?: string
  acceptedAnswers?: string[]
  keywords?: string[]
  minChars?: number
  explanation?: string
  instruction?: string
  modelAnswer?: string
  vocabId?: string
}

export type AudioLine = {
  speaker?: "男" | "女" | "问"
  text: string
}

export type ExamFormat =
  | "true-false"
  | "mcq"
  | "picture-mcq"
  | "cloze"
  | "order"
  | "scramble"
  | "picture-sentence"
  | "essay"

export type ExamItem = {
  id: string
  number: number
  format: ExamFormat
  stem?: string
  question?: string
  audio?: AudioLine[]
  playTwice?: boolean
  wordBank?: Choice[]
  segments?: string[]
  scramble?: string[]
  picture?: string
  keyword?: string
  keywords?: string[]
  acceptedAnswers?: string[]
  choices?: Choice[]
  correctKey: string
  minChars?: number
  explanation?: string
}

export type ExamPictureExample = {
  picture: string
  mark: "T" | "F"
}

export type ExamPart = {
  id: string
  titleZh: string
  instructionZh: string
  exampleZh?: string
  examples?: ExamPictureExample[]
  items: ExamItem[]
}

export type ExamBlock = {
  skill: "listening" | "reading" | "writing"
  titleZh: string
  titleEn: string
  timeMin: number
  itemCount: number
  parts: ExamPart[]
}

export type OfficialPaper = {
  code: string
  hskLevel: HskLevel
  titleZh: string
  titleEn: string
  totalMin: number
  passPercent: number
  notes: string[]
  blocks: ExamBlock[]
}

export type Membership = "free" | "vip" | "premium"

export type UiLocale = "az" | "en"

export type Profile = {
  id: string
  email: string
  displayName: string
  currentHskLevel: HskLevel
  membership: Membership
  locale: UiLocale
}

export type MistakeItem = {
  userId: string
  vocabId: string
  skill: string
  prompt: string
  times: number
  lastWrongAt: string
}

export type SessionUser = Profile

export type PracticeResult = {
  id: string
  userId: string
  hskLevel: HskLevel
  tool: ToolId
  score: number
  total: number
  payload: Record<string, unknown>
  createdAt: string
}

export type ExamAttempt = {
  id: string
  userId: string
  hskLevel: HskLevel
  examId: string
  sectionScores: Record<string, { score: number; total: number }>
  totalScore: number
  totalPossible: number
  passed: boolean
  durationSec: number
  answers: Record<string, string>
  createdAt: string
}

export type SrsCard = {
  userId: string
  vocabId: string
  dueAt: string
  interval: number
  ease: number
  reps: number
  lapses: number
}
