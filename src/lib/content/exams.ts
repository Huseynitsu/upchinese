import { officialPaper } from "../exams/papers"
import type { HskLevel, OfficialPaper } from "../types"

export function examForLevel(level: HskLevel, code?: string): OfficialPaper {
  return officialPaper(level, code)
}

export {
  officialPaper,
  allExamItems,
  itemById,
  papersForLevel,
  paperByCode,
  PAPER_CODES,
  allPaperParams,
  paperSummary,
} from "../exams/papers"
