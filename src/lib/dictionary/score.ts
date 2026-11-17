import { englishTokens, normalizePinyin } from "@/lib/dictionary/pinyin-norm"

export function scorePinyin(answer: string, expected: string) {
  const left = normalizePinyin(answer)
  const right = normalizePinyin(expected)
  return Boolean(left) && left === right
}

export function scoreMeaning(answer: string, expected: string) {
  const guess = englishTokens(answer)
  const key = englishTokens(expected)
  if (!guess.length) return false
  return guess.some((token) => key.includes(token) || expected.toLowerCase().includes(token))
}
