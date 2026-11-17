import type { HskLevel } from "@/lib/types"

export type DictField = "all" | "hanzi" | "pinyin" | "english"
export type DictMatch = "contains" | "starts" | "exact"
export type DictKind = "all" | "words" | "characters"

export type DictEntry = {
  simplified: string
  traditional: string
  pinyin: string
  english: string
  hskLevel?: HskLevel
  characters?: DictCharCard[]
}

export type DictSearchQuery = {
  q: string
  field?: DictField
  match?: DictMatch
  hsk?: "any" | "none" | `${HskLevel}`
  type?: DictKind
  limit?: number
}

export type DictListWord = {
  hanzi: string
  pinyin: string
  english: string
  hskLevel?: HskLevel
}

export type DictCharCard = {
  hanzi: string
  pinyin: string
  english: string
  hskLevel?: HskLevel
}
