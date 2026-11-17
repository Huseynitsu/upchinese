import { VOCABULARY } from "@/lib/content/vocab"
import type { HskLevel } from "@/lib/types"

const LEVELS = new Map<string, HskLevel>()

for (const item of VOCABULARY) {
  const current = LEVELS.get(item.hanzi)
  if (!current || item.hskLevel < current) LEVELS.set(item.hanzi, item.hskLevel)
}

export function hskLevelOf(hanzi: string): HskLevel | undefined {
  const exact = LEVELS.get(hanzi)
  if (exact) return exact
  if (hanzi.length < 2) return undefined
  let highest: HskLevel | undefined
  for (const ch of hanzi) {
    if (!/[\u4e00-\u9fff]/.test(ch)) continue
    const level = LEVELS.get(ch)
    if (!level) return undefined
    if (!highest || level > highest) highest = level
  }
  return highest
}
