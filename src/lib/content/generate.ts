import { shuffle } from "../shuffle"
import type { HskLevel, Passage, Question, Skill, VocabItem } from "../types"
import { listenDialogue, speakingFields } from "./example-sentences"
import { GRAMMAR_DRILLS } from "./grammar-drills"
import { AUTHORED_PASSAGES, authoredPassageQuestions } from "./passages"
import { VOCABULARY, vocabByLevel } from "./vocab"

const KEYS = ["A", "B", "C", "D"] as const

const EMOJI: Record<string, string> = {
  苹果: "🍎",
  猫: "🐱",
  狗: "🐶",
  书: "📚",
  水: "💧",
  茶: "🍵",
  米饭: "🍚",
  家: "🏠",
  学校: "🏫",
  医院: "🏥",
  飞机: "✈️",
  车: "🚗",
  衣服: "👕",
  电脑: "💻",
  电话: "📱",
  雨: "🌧️",
  太阳: "☀️",
  鱼: "🐟",
  鸟: "🐦",
  咖啡: "☕",
  北京: "🏛️",
  中国: "🇨🇳",
}

function pickDistractors(item: VocabItem, pool: VocabItem[], count: number) {
  return shuffle(
    pool.filter((other) => other.id !== item.id),
    hash(item.id)
  ).slice(0, count)
}

function hash(value: string) {
  let n = 0
  for (let i = 0; i < value.length; i += 1) n = (n * 31 + value.charCodeAt(i)) >>> 0
  return n || 1
}

function toneLess(pinyin: string) {
  return pinyin
    .replace(/[āáǎà]/g, "a")
    .replace(/[ēéěè]/g, "e")
    .replace(/[īíǐì]/g, "i")
    .replace(/[ōóǒò]/g, "o")
    .replace(/[ūúǔù]/g, "u")
    .replace(/[ǖǘǚǜü]/g, "u")
    .toLowerCase()
}

function choicesFrom(correct: VocabItem, distractors: VocabItem[], field: "english" | "pinyin" | "hanzi") {
  const options = shuffle([correct, ...distractors], hash(correct.id + field))
  const mapped = options.map((item, index) => ({
    key: KEYS[index],
    text: item[field],
    emoji: field === "hanzi" ? EMOJI[item.hanzi] : undefined,
  }))
  const correctKey = mapped.find((choice) => choice.text === correct[field])?.key ?? "A"
  return { choices: mapped, correctKey }
}

function explain(item: VocabItem, extra: string) {
  return `${item.hanzi} (${item.pinyin}) = ${item.english}. ${extra}`
}

function clozePrompt(item: VocabItem) {
  if (item.exampleZh.includes(item.hanzi)) {
    return item.exampleZh.replace(item.hanzi, "____")
  }
  return `请选择合适的词：我____${item.english}。`
}

function buildForItem(item: VocabItem, pool: VocabItem[]): Question[] {
  const d3 = pickDistractors(item, pool, 3)
  const meaning = choicesFrom(item, d3, "english")
  const pinyin = choicesFrom(item, d3, "pinyin")
  const hanzi = choicesFrom(item, d3, "hanzi")
  const slot = hash(item.id) % 4
  const questions: Question[] = []

  if (slot === 0 && EMOJI[item.hanzi]) {
    const pics = choicesFrom(item, d3, "hanzi")
    questions.push({
      id: `gen-listen-pic-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "listening",
      kind: "picture",
      prompt: "Listen and choose the matching picture.",
      audioText: item.hanzi,
      layout: "pictures",
      ...pics,
      explanation: explain(item, "Match the spoken word to the picture."),
    })
  } else if (slot === 1) {
    questions.push({
      id: `gen-listen-ex-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "listening",
      kind: "listen-sentence",
      prompt: "Listen to the sentence. What is it mainly about?",
      audioText: item.exampleZh,
      ...meaning,
      explanation: `${item.exampleZh} — ${item.exampleEn} The key word is ${item.hanzi} (${item.pinyin}).`,
    })
  } else if (slot === 2) {
    questions.push({
      id: `gen-listen-dlg-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "listening",
      kind: "listen-dialogue",
      prompt: "Listen to the short dialogue. What do they talk about?",
      audioText: listenDialogue(item).audio,
      ...meaning,
      explanation: explain(item, listenDialogue(item).extra),
    })
  } else {
    questions.push({
      id: `gen-listen-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "listening",
      kind: "listen-word",
      prompt: "Listen and choose the matching meaning.",
      audioText: item.hanzi,
      ...meaning,
      explanation: explain(item, "You heard the word itself."),
    })
  }

  if (slot === 0) {
    questions.push({
      id: `gen-read-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "reading",
      kind: "meaning",
      prompt: `What does ${item.hanzi} mean in this sentence?`,
      promptZh: item.exampleZh,
      ...meaning,
      explanation: explain(item, `In “${item.exampleZh}” it means “${item.english}”.`),
    })
  } else if (slot === 1) {
    questions.push({
      id: `gen-read-gap-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "reading",
      kind: "cloze",
      prompt: `Choose the word that fits the blank.`,
      promptZh: clozePrompt(item),
      ...hanzi,
      explanation: explain(item, `The sentence is about “${item.english}”, so ${item.hanzi} fills the blank.`),
    })
  } else if (slot === 2) {
    const truth = hash(item.id) % 2 === 0
    const wrong = d3[0]?.english ?? "school"
    questions.push({
      id: `gen-read-tf-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "reading",
      kind: "true-false",
      prompt: `True or false: “${item.exampleZh}” means “${truth ? item.exampleEn : `I don't like ${wrong}.`}”`,
      promptZh: item.exampleZh,
      choices: [
        { key: "A", text: "True" },
        { key: "B", text: "False" },
      ],
      correctKey: truth ? "A" : "B",
      explanation: truth
        ? `${item.exampleZh} = ${item.exampleEn}`
        : `Wrong. ${item.exampleZh} actually means “${item.exampleEn}”.`,
    })
  } else {
    questions.push({
      id: `gen-read-order-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "reading",
      kind: "order",
      prompt: "Which order makes a natural two-sentence note?",
      choices: shuffle(
        [
          { key: "A", text: `${item.exampleZh}${item.exampleZh}` },
          { key: "B", text: `${item.exampleZh}我也是学生。` },
          { key: "C", text: `我也是学生。${item.exampleZh}` },
          { key: "D", text: `吗了的在${item.hanzi}` },
        ],
        hash(`${item.id}-order`)
      ).map((choice, index) => ({ ...choice, key: KEYS[index] })),
      correctKey: "C",
      explanation: `Start with a simple introduction, then the content sentence: ${item.exampleZh} (${item.exampleEn}).`,
    })
    const ordered = questions[questions.length - 1]
    const right = ordered.choices?.find((choice) => choice.text.startsWith("我也是学生。"))
    if (right) ordered.correctKey = right.key
  }

  const tonePair = pool.find(
    (other) => other.id !== item.id && toneLess(other.pinyin) === toneLess(item.pinyin) && other.pinyin !== item.pinyin
  )
  if (slot === 0 && tonePair) {
    const toneChoices = choicesFrom(item, [tonePair, ...d3].slice(0, 3), "pinyin")
    questions.push({
      id: `gen-pinyin-tone-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "pinyin",
      kind: "tone",
      prompt: `Same letters, different tone. Choose the pinyin for ${item.hanzi}.`,
      audioText: item.hanzi,
      ...toneChoices,
      explanation: explain(item, `${tonePair.hanzi} is ${tonePair.pinyin} — listen for the tone.`),
    })
  } else if (slot % 2 === 0) {
    questions.push({
      id: `gen-pinyin-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "pinyin",
      kind: "meaning",
      prompt: `Choose the pinyin for ${item.hanzi}.`,
      audioText: item.hanzi,
      ...pinyin,
      explanation: explain(item, "Read the syllables and tones carefully."),
    })
  } else {
    questions.push({
      id: `gen-pinyin-listen-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "pinyin",
      kind: "listen-word",
      prompt: "Listen and choose the pinyin you heard.",
      audioText: item.hanzi,
      ...pinyin,
      explanation: explain(item, "You heard the character; pick its pinyin."),
    })
  }

  if (slot % 2 === 0) {
    questions.push({
      id: `gen-hanzi-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "hanzi",
      kind: "meaning",
      prompt: `Which character means “${item.english}”?`,
      ...hanzi,
      explanation: explain(item, "Match meaning to the written form."),
    })
  } else {
    questions.push({
      id: `gen-hanzi-py-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "hanzi",
      kind: "cloze",
      prompt: "Listen, then choose the matching character.",
      audioText: item.hanzi,
      ...hanzi,
      explanation: explain(item, "You heard the word; pick its written form."),
    })
  }

  if (slot % 2 === 0) {
    questions.push({
      id: `gen-dict-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "dictation",
      prompt: "Type the hanzi or pinyin you hear.",
      audioText: item.hanzi,
      acceptedAnswers: [
        item.hanzi,
        item.pinyin.replace(/\s+/g, ""),
        item.pinyin,
      ],
      explanation: explain(item, "A single-word dictation."),
    })
  } else {
    questions.push({
      id: `gen-dict-sent-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "dictation",
      prompt: "Type the sentence you hear (hanzi is best).",
      audioText: item.exampleZh,
      acceptedAnswers: [item.exampleZh, item.hanzi],
      explanation: `${item.exampleZh} (${item.pinyin}) — ${item.exampleEn}`,
    })
  }

  if (item.hskLevel >= 3) {
    const minChars = item.hskLevel >= 5 ? 24 : item.hskLevel >= 4 ? 16 : 12
    questions.push({
      id: `gen-write-${item.id}`,
      hskLevel: item.hskLevel,
      skill: "writing",
      prompt:
        item.hskLevel >= 5
          ? `Write 3–5 sentences about “${item.english}”. You must use ${item.hanzi}.`
          : item.hskLevel === 4
            ? `Rearrange your ideas into one clear sentence using ${item.hanzi} (${item.english}).`
            : `Complete a short answer using ${item.hanzi} (${item.english}).`,
      instruction:
        item.hskLevel >= 5
          ? `Goal: a short paragraph (${minChars}+ characters). Include ${item.hanzi} and say why it matters.`
          : item.hskLevel === 4
            ? `Goal: one grammatical sentence (${minChars}+ characters). Pattern: subject + ${item.hanzi} + comment.`
            : `Goal: 1–2 sentences (${minChars}+ characters). You can copy the pattern: ${item.exampleZh}`,
      keywords: [item.hanzi],
      minChars,
      modelAnswer: item.exampleZh,
      explanation: `A solid answer uses ${item.hanzi} in a full sentence. Model: ${item.exampleZh} (${item.exampleEn}).`,
    })
  }

  questions.push({
    id: `gen-speak-${item.id}`,
    hskLevel: item.hskLevel,
    skill: "speaking",
    ...speakingFields(item, slot),
  })

  return questions.map((question) => ({ ...question, vocabId: item.id }))
}

const GENERATED_QUESTIONS: Question[] = VOCABULARY.flatMap((item) =>
  buildForItem(item, vocabByLevel(item.hskLevel))
)

const PASSAGE_QUESTIONS = authoredPassageQuestions()

export const GENERATED_PASSAGES: Passage[] = AUTHORED_PASSAGES

export const ALL_QUESTIONS: Question[] = [...GENERATED_QUESTIONS, ...PASSAGE_QUESTIONS]

export function generatedBySkill(level: HskLevel, skill: Skill) {
  if (skill === "grammar") return GRAMMAR_DRILLS.filter((item) => item.hskLevel === level)
  return ALL_QUESTIONS.filter((item) => item.hskLevel === level && item.skill === skill)
}

export function generatedById(id: string) {
  return ALL_QUESTIONS.find((item) => item.id === id) ?? GRAMMAR_DRILLS.find((item) => item.id === id)
}
