import { readFileSync } from "node:fs"
import { join } from "node:path"
import { hskLevelOf } from "@/lib/dictionary/hsk-tag"
import type { DictEntry } from "@/lib/dictionary/types"

type RawRow = [string, string, string, string]

let cached: DictEntry[] | null = null
let bySimplified: Map<string, DictEntry[]> | null = null

function readRows(): RawRow[] {
  const path = join(process.cwd(), "data", "cedict.min.json")
  return JSON.parse(readFileSync(path, "utf8")) as RawRow[]
}

export function loadDictionary(): DictEntry[] {
  if (cached) return cached
  cached = readRows().map(([simplified, traditional, pinyin, english]) => ({
    simplified,
    traditional,
    pinyin,
    english,
    hskLevel: hskLevelOf(simplified),
  }))
  const index = new Map<string, DictEntry[]>()
  for (const entry of cached) {
    const list = index.get(entry.simplified) ?? []
    list.push(entry)
    index.set(entry.simplified, list)
  }
  bySimplified = index
  return cached
}

export function entriesFor(hanzi: string) {
  loadDictionary()
  return bySimplified?.get(hanzi) ?? []
}
