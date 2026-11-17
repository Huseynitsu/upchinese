import type { HskLevel, VocabItem } from "../types"
import { exampleFor } from "./example-sentences"
import { MORE_WORDS } from "./vocab-more"
import { RAW_WORDS } from "./vocab-raw"

function toItem(row: (typeof RAW_WORDS)[number]): VocabItem {
  const [hskLevel, hanzi, pinyin, english] = row
  const examples = exampleFor(hanzi, english, hskLevel)
  return {
    id: `v${hskLevel}-${hanzi}`,
    hskLevel,
    hanzi,
    pinyin,
    english,
    exampleZh: examples.zh,
    exampleEn: examples.en,
  }
}

const merged = [...RAW_WORDS, ...MORE_WORDS]
const seen = new Set<string>()

export const VOCABULARY: VocabItem[] = merged
  .map(toItem)
  .filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })

export function vocabByLevel(level: HskLevel) {
  return VOCABULARY.filter((item) => item.hskLevel === level)
}

export function vocabById(id: string) {
  return VOCABULARY.find((item) => item.id === id)
}

export function strokeSafeVocab(level: HskLevel) {
  return vocabByLevel(level).filter(
    (item) => /^[\u4e00-\u9fff]+$/.test(item.hanzi) && item.hanzi.length <= 2
  )
}

export function contentStats() {
  const byLevel = [1, 2, 3, 4, 5, 6].map((level) => ({
    level: level as HskLevel,
    words: vocabByLevel(level as HskLevel).length,
  }))
  return { total: VOCABULARY.length, byLevel }
}
