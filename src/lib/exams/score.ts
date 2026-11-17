import type { ExamItem } from "@/lib/types"

function compact(value: string) {
  return value.replace(/\s+/g, "").replace(/。/g, "").replace(/？/g, "")
}

export function scoreExamItem(item: ExamItem, answer: string | undefined) {
  if (!answer) return 0
  if (item.format === "scramble") {
    const ok =
      compact(answer) === compact(item.correctKey) ||
      (item.acceptedAnswers ?? []).some((value) => compact(value) === compact(answer))
    return ok ? 1 : 0
  }
  if (item.format === "picture-sentence" || item.format === "essay") {
    const text = answer.replace(/\s+/g, "")
    const lengthOk = text.length >= (item.minChars ?? 6)
    const keys = item.keywords?.length ? item.keywords : item.keyword ? [item.keyword] : []
    const hit = keys.length ? keys.some((word) => answer.includes(word)) : true
    return lengthOk && hit ? 1 : 0
  }
  return answer === item.correctKey ? 1 : 0
}
