import type { DictListWord } from "@/lib/dictionary/types"

const KEY = "upchinese.dictionaryList"

function canUseStorage() {
  return typeof window !== "undefined"
}

export function readDictionaryList(): DictListWord[] {
  if (!canUseStorage()) return []
  try {
    const raw = window.localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as DictListWord[]) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeDictionaryList(words: DictListWord[]) {
  window.localStorage.setItem(KEY, JSON.stringify(words))
}

export function isInDictionaryList(hanzi: string) {
  return readDictionaryList().some((item) => item.hanzi === hanzi)
}

export function toggleDictionaryWord(word: DictListWord) {
  const current = readDictionaryList()
  const exists = current.some((item) => item.hanzi === word.hanzi)
  const next = exists ? current.filter((item) => item.hanzi !== word.hanzi) : [...current, word]
  writeDictionaryList(next)
  return next
}

export function clearDictionaryList() {
  writeDictionaryList([])
}
