import type { HskLevel, OfficialPaper } from "../types"
import { officialPaper as firstPaper, paperByCode, papersForLevel } from "./catalog"
import { allExamItems, itemById } from "./factory"

export function officialPaper(level: HskLevel, code?: string): OfficialPaper {
  if (!code) return firstPaper(level)
  const paper = paperByCode(level, code)
  if (!paper) throw new Error(`Unknown paper ${code} for HSK ${level}`)
  return paper
}

export { papersForLevel, paperByCode, PAPER_CODES, allPaperParams, paperSummary } from "./catalog"
export { allExamItems, itemById }
