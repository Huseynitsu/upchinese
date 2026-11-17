import { entriesFor, loadDictionary } from "@/lib/dictionary/load"
import { normalizeEnglish, normalizeHanzi, normalizePinyin } from "@/lib/dictionary/pinyin-norm"
import type { DictCharCard, DictEntry, DictSearchQuery } from "@/lib/dictionary/types"

function matches(haystack: string, needle: string, mode: DictSearchQuery["match"]) {
  if (!needle) return false
  if (mode === "exact") return haystack === needle
  if (mode === "starts") return haystack.startsWith(needle)
  return haystack.includes(needle)
}

function rank(entry: DictEntry, qHanzi: string, qPinyin: string, qEnglish: string) {
  let score = 0
  if (entry.simplified === qHanzi) score += 80
  else if (qHanzi && entry.simplified.startsWith(qHanzi)) score += 40
  if (qPinyin && normalizePinyin(entry.pinyin) === qPinyin) score += 50
  if (entry.hskLevel) score += 12 - entry.hskLevel
  if (qEnglish && normalizeEnglish(entry.english).startsWith(qEnglish)) score += 20
  return score
}

export function searchDictionary(query: DictSearchQuery): DictEntry[] {
  const q = query.q.trim()
  if (!q) return []
  const field = query.field ?? "all"
  const match = query.match ?? "contains"
  const type = query.type ?? "all"
  const limit = Math.min(Math.max(query.limit ?? 40, 1), 80)
  const qHanzi = normalizeHanzi(q)
  const qPinyin = normalizePinyin(q)
  const qEnglish = normalizeEnglish(q)
  const hasHanzi = /[\u4e00-\u9fff]/.test(q)

  const hits: DictEntry[] = []
  for (const entry of loadDictionary()) {
    if (type === "characters" && entry.simplified.length !== 1) continue
    if (type === "words" && entry.simplified.length < 2) continue
    if (query.hsk === "none" && entry.hskLevel) continue
    if (query.hsk && query.hsk !== "any" && query.hsk !== "none" && String(entry.hskLevel) !== query.hsk) {
      continue
    }

    const hanziHay = entry.simplified + entry.traditional
    const pinHay = normalizePinyin(entry.pinyin)
    const enHay = normalizeEnglish(entry.english)
    const hanziOk = hasHanzi && matches(hanziHay, qHanzi, match)
    const pinyinOk = Boolean(qPinyin) && matches(pinHay, qPinyin, match)
    const englishOk = Boolean(qEnglish) && !hasHanzi && matches(enHay, qEnglish, match)

    const ok =
      field === "hanzi"
        ? hanziOk
        : field === "pinyin"
          ? pinyinOk
          : field === "english"
            ? englishOk
            : hanziOk || pinyinOk || englishOk
    if (!ok) continue
    hits.push(entry)
  }

  return hits
    .sort((a, b) => rank(b, qHanzi, qPinyin, qEnglish) - rank(a, qHanzi, qPinyin, qEnglish))
    .slice(0, limit)
    .map((entry) => ({ ...entry, characters: charactersOf(entry.simplified) }))
}

export function charactersOf(word: string): DictCharCard[] {
  return [...normalizeHanzi(word)]
    .filter((ch) => /[\u4e00-\u9fff]/.test(ch))
    .map((ch) => {
      const best = entriesFor(ch)[0]
      return {
        hanzi: ch,
        pinyin: best?.pinyin ?? "",
        english: best?.english ?? "No dictionary entry.",
        hskLevel: best?.hskLevel,
      }
    })
}

export function explainWord(word: string): { characters: DictCharCard[]; samples: DictEntry[] } {
  const hanzi = normalizeHanzi(word)
  const samples = loadDictionary()
    .filter((entry) => entry.simplified.includes(hanzi) && entry.simplified !== hanzi)
    .slice(0, 8)
  return { characters: charactersOf(word), samples }
}
