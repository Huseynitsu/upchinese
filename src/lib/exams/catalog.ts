import type { HskLevel, OfficialPaper } from "../types"
import { HSK_LEVELS } from "../levels"
import { buildHsk1, HSK1_CODES } from "./build-hsk1"
import { buildHsk2, HSK2_CODES } from "./build-hsk2"
import { buildHsk3, HSK3_CODES } from "./build-hsk3"
import { buildHsk4, HSK4_CODES } from "./build-hsk4"
import { buildHsk5, HSK5_CODES } from "./build-hsk5"
import { buildHsk6, HSK6_CODES } from "./build-hsk6"
import { allExamItems } from "./factory"

export const PAPER_CODES: Record<HskLevel, readonly string[]> = {
  1: HSK1_CODES,
  2: HSK2_CODES,
  3: HSK3_CODES,
  4: HSK4_CODES,
  5: HSK5_CODES,
  6: HSK6_CODES,
}

const BUILDERS: Record<HskLevel, (variant: number) => OfficialPaper> = {
  1: buildHsk1,
  2: buildHsk2,
  3: buildHsk3,
  4: buildHsk4,
  5: buildHsk5,
  6: buildHsk6,
}

export function papersForLevel(level: HskLevel): OfficialPaper[] {
  return PAPER_CODES[level].map((_, variant) => BUILDERS[level](variant))
}

export function paperByCode(level: HskLevel, code: string): OfficialPaper | null {
  const variant = PAPER_CODES[level].indexOf(code)
  if (variant < 0) return null
  return BUILDERS[level](variant)
}

export function officialPaper(level: HskLevel): OfficialPaper {
  return BUILDERS[level](0)
}

export function allPaperParams() {
  return HSK_LEVELS.flatMap((level) =>
    PAPER_CODES[level].map((code) => ({ level: String(level), code }))
  )
}

export function paperSummary(paper: OfficialPaper) {
  return {
    code: paper.code,
    hskLevel: paper.hskLevel,
    totalMin: paper.totalMin,
    itemCount: allExamItems(paper).length,
    titleEn: paper.titleEn,
  }
}
