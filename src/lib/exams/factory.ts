import type { AudioLine, ExamItem, ExamPart, ExamPictureExample, HskLevel, OfficialPaper } from "../types"

export function tf(
  id: string,
  n: number,
  audio: AudioLine[],
  stem: string,
  correct: boolean,
  twice = false
): ExamItem {
  return {
    id,
    number: n,
    format: "true-false",
    audio,
    playTwice: twice,
    stem,
    choices: [
      { key: "T", text: "√" },
      { key: "F", text: "×" },
    ],
    correctKey: correct ? "T" : "F",
  }
}

export function picTf(
  id: string,
  n: number,
  audio: AudioLine[],
  picture: string,
  correct: boolean,
  twice = true
): ExamItem {
  return {
    id,
    number: n,
    format: "true-false",
    audio,
    playTwice: twice,
    picture,
    choices: [
      { key: "T", text: "√" },
      { key: "F", text: "×" },
    ],
    correctKey: correct ? "T" : "F",
  }
}

export function pic(
  id: string,
  n: number,
  audio: AudioLine[] | undefined,
  pics: [string, string, string, string],
  labels: [string, string, string, string],
  correct: "A" | "B" | "C" | "D",
  twice = true
): ExamItem {
  return {
    id,
    number: n,
    format: "picture-mcq",
    audio,
    playTwice: twice,
    choices: [
      { key: "A", text: labels[0], emoji: pics[0] },
      { key: "B", text: labels[1], emoji: pics[1] },
      { key: "C", text: labels[2], emoji: pics[2] },
      { key: "D", text: labels[3], emoji: pics[3] },
    ],
    correctKey: correct,
  }
}

export function mcq(
  id: string,
  n: number,
  audio: AudioLine[] | undefined,
  stem: string,
  options: [string, string, string, string],
  correct: "A" | "B" | "C" | "D",
  twice = false,
  question?: string
): ExamItem {
  return {
    id,
    number: n,
    format: "mcq",
    audio,
    playTwice: twice,
    stem,
    question,
    choices: [
      { key: "A", text: options[0] },
      { key: "B", text: options[1] },
      { key: "C", text: options[2] },
      { key: "D", text: options[3] },
    ],
    correctKey: correct,
  }
}

export function scramble(id: string, n: number, words: string[], sentence: string): ExamItem {
  return {
    id,
    number: n,
    format: "scramble",
    scramble: words,
    correctKey: sentence,
    acceptedAnswers: [sentence, sentence.replace(/[。？]/g, "")],
  }
}

export function essay(id: string, n: number, prompt: string, minChars: number, keywords: string[]): ExamItem {
  return {
    id,
    number: n,
    format: "essay",
    stem: prompt,
    minChars,
    keywords,
    correctKey: keywords[0],
  }
}

export function cloze(
  id: string,
  n: number,
  sentence: string,
  bank: { key: string; text: string }[],
  correct: string
): ExamItem {
  return { id, number: n, format: "cloze", stem: sentence, wordBank: bank, correctKey: correct }
}

export function order(id: string, n: number, segs: [string, string, string], correct: string): ExamItem {
  return {
    id,
    number: n,
    format: "order",
    segments: segs,
    choices: [
      { key: "ABC", text: "A-B-C" },
      { key: "ACB", text: "A-C-B" },
      { key: "BAC", text: "B-A-C" },
      { key: "BCA", text: "B-C-A" },
      { key: "CAB", text: "C-A-B" },
      { key: "CBA", text: "C-B-A" },
    ],
    correctKey: correct,
  }
}

export function picSent(id: string, n: number, keyword: string, picture: string, sample: string): ExamItem {
  return {
    id,
    number: n,
    format: "picture-sentence",
    keyword,
    picture,
    minChars: 6,
    correctKey: sample,
    keywords: [keyword],
    acceptedAnswers: [sample],
  }
}

export function part(
  id: string,
  titleZh: string,
  instructionZh: string,
  items: ExamItem[],
  exampleZh?: string,
  examples?: ExamPictureExample[]
): ExamPart {
  return { id, titleZh, instructionZh, exampleZh, examples, items }
}

export function block(
  skill: "listening" | "reading" | "writing",
  titleZh: string,
  titleEn: string,
  timeMin: number,
  itemCount: number,
  parts: ExamPart[]
) {
  return { skill, titleZh, titleEn, timeMin, itemCount, parts }
}

export function paper(
  hskLevel: HskLevel,
  code: string,
  totalMin: number,
  blocks: OfficialPaper["blocks"],
  notes: string[]
): OfficialPaper {
  return {
    code,
    hskLevel,
    titleZh: "新汉语水平考试",
    titleEn: `HSK (Level ${hskLevel}) Simulated Paper`,
    totalMin,
    passPercent: 60,
    notes,
    blocks,
  }
}

export function slice<T>(bank: T[], variant: number, count: number): T[] {
  const start = variant * count
  if (start + count > bank.length) {
    throw new Error(`Bank too small: need ${start + count}, have ${bank.length}`)
  }
  return bank.slice(start, start + count)
}

export function allExamItems(paper: OfficialPaper): ExamItem[] {
  return paper.blocks.flatMap((examBlock) => examBlock.parts.flatMap((examPart) => examPart.items))
}

export function itemById(paper: OfficialPaper, id: string) {
  return allExamItems(paper).find((item) => item.id === id)
}

export function line(speaker: "男" | "女" | "问" | undefined, text: string): AudioLine {
  return speaker ? { speaker, text } : { text }
}

export function duo(a: string, b: string, q: string): AudioLine[] {
  return [
    { speaker: "女", text: a },
    { speaker: "男", text: b },
    { speaker: "问", text: q },
  ]
}

export function letter(key: string): "A" | "B" | "C" | "D" {
  return key as "A" | "B" | "C" | "D"
}

export function four(a: string, b: string, c: string, d: string): [string, string, string, string] {
  return [a, b, c, d]
}

export function duoM(a: string, b: string, q: string): AudioLine[] {
  return [
    { speaker: "男", text: a },
    { speaker: "女", text: b },
    { speaker: "问", text: q },
  ]
}
