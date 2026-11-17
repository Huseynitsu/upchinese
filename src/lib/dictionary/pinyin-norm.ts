const TONE_MARKS: Record<string, string> = {
  ā: "a",
  á: "a",
  ǎ: "a",
  à: "a",
  ē: "e",
  é: "e",
  ě: "e",
  è: "e",
  ī: "i",
  í: "i",
  ǐ: "i",
  ì: "i",
  ō: "o",
  ó: "o",
  ǒ: "o",
  ò: "o",
  ū: "u",
  ú: "u",
  ǔ: "u",
  ù: "u",
  ǖ: "v",
  ǘ: "v",
  ǚ: "v",
  ǜ: "v",
  ü: "v",
}

export function normalizePinyin(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/u:/g, "v")
    .replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, (char) => TONE_MARKS[char] ?? char)
    .replace(/[1-5]/g, "")
    .replace(/[^a-z]/g, "")
}

export function normalizeHanzi(value: string) {
  return value.replace(/\s+/g, "").trim()
}

export function normalizeEnglish(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()
}

export function englishTokens(value: string) {
  return normalizeEnglish(value)
    .split(" ")
    .filter((token) => token.length >= 2 && !STOP.has(token))
}

const STOP = new Set(["the", "a", "an", "to", "of", "and", "or", "in", "on", "for", "is", "be"])

const VOWEL_TONES: Record<string, string[]> = {
  a: ["a", "ā", "á", "ǎ", "à"],
  e: ["e", "ē", "é", "ě", "è"],
  i: ["i", "ī", "í", "ǐ", "ì"],
  o: ["o", "ō", "ó", "ǒ", "ò"],
  u: ["u", "ū", "ú", "ǔ", "ù"],
  v: ["ü", "ǖ", "ǘ", "ǚ", "ǜ"],
}

export function prettyPinyin(numbered: string) {
  return numbered
    .split(/\s+/)
    .map((syllable) => {
      const match = syllable.match(/^([a-zA-Z:]+)([1-5])$/)
      if (!match) return syllable.replace(/v/g, "ü").replace(/u:/g, "ü")
      const tone = Number(match[2])
      let base = match[1].replace(/u:/g, "v").replace(/ü/g, "v")
      const mark =
        base.includes("a") ? "a" : base.includes("e") ? "e" : base.includes("ou") ? "o" : [...base].reverse().find((ch) => VOWEL_TONES[ch])
      if (!mark) return base.replace(/v/g, "ü")
      return base.replace(mark, VOWEL_TONES[mark][tone === 5 ? 0 : tone]).replace(/v/g, "ü")
    })
    .join(" ")
}
