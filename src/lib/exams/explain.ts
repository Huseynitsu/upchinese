import type { ExamItem } from "@/lib/types"
import { scoreExamItem } from "@/lib/exams/score"

function markLabel(key: string) {
  if (key === "T") return "√"
  if (key === "F") return "×"
  return key
}

function choiceOf(item: ExamItem, key: string) {
  return item.choices?.find((choice) => choice.key === key) ?? item.wordBank?.find((choice) => choice.key === key)
}

export function answerLabel(item: ExamItem, key?: string) {
  if (!key) return "No answer"
  if (item.format === "true-false") return markLabel(key)
  const choice = choiceOf(item, key)
  if (choice) return `${choice.key}. ${choice.text}`
  return key
}

export function listeningScript(item: ExamItem) {
  return (
    item.audio
      ?.map((line) => (line.speaker ? `${line.speaker}：${line.text}` : line.text))
      .join(" ")
      .trim() ?? ""
  )
}

export function explainExamItem(item: ExamItem, answer?: string) {
  const correct = scoreExamItem(item, answer) === 1
  const yourLabel = answerLabel(item, answer)
  const correctLabel = answerLabel(item, item.correctKey)
  const heard = listeningScript(item)

  if (item.explanation) {
    return { correct, yourLabel, correctLabel, explanation: item.explanation, heard }
  }

  let explanation = ""
  switch (item.format) {
    case "true-false":
      if (item.picture) {
        explanation =
          item.correctKey === "T"
            ? "The picture matches the sentence you hear, so the mark is √."
            : "The picture does not match the sentence you hear, so the mark is ×."
      } else {
        explanation = item.correctKey === "T" ? "This statement is true." : "This statement is false."
      }
      break
    case "mcq":
    case "picture-mcq":
      explanation = `The correct option is ${correctLabel}.`
      break
    case "cloze":
      explanation = `The blank is filled with ${correctLabel}.`
      break
    case "order":
      explanation = `The correct order is ${correctLabel}.`
      break
    case "scramble":
      explanation = `The correct sentence is ${item.correctKey}.`
      break
    case "picture-sentence":
    case "essay": {
      const keys = item.keywords?.length ? item.keywords : item.keyword ? [item.keyword] : []
      explanation = `Write at least ${item.minChars ?? 6} characters`
      if (keys.length) explanation += ` using ${keys.map((word) => `「${word}」`).join(" / ")}`
      explanation += "."
      break
    }
    default:
      explanation = `Correct answer: ${correctLabel}.`
  }

  if (heard) explanation += ` Listening text: ${heard}`

  return { correct, yourLabel, correctLabel, explanation, heard }
}
