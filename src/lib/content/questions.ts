import type { HskLevel, Skill } from "../types"
import { ALL_QUESTIONS, GENERATED_PASSAGES, generatedById, generatedBySkill } from "./generate"

export const PASSAGES = GENERATED_PASSAGES
export const QUESTIONS = ALL_QUESTIONS

export function questionsBySkill(level: HskLevel, skill: Skill) {
  return generatedBySkill(level, skill)
}

export function questionById(id: string) {
  return generatedById(id)
}

export function passageById(id: string) {
  return PASSAGES.find((item) => item.id === id)
}

export function examQuestionIds(level: HskLevel) {
  return {
    listening: questionsBySkill(level, "listening").map((item) => item.id),
    reading: questionsBySkill(level, "reading").map((item) => item.id),
    writing: questionsBySkill(level, "writing").map((item) => item.id),
  }
}
