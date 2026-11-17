import { toPinyin } from "./pinyin-text"

export function normalizeSpeech(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[，。？！、,.?!；;：:\s'"‘’“”]/g, "")
}

function toneLess(value: string) {
  return normalizeSpeech(value)
    .replace(/[āáǎà]/g, "a")
    .replace(/[ēéěè]/g, "e")
    .replace(/[īíǐì]/g, "i")
    .replace(/[ōóǒò]/g, "o")
    .replace(/[ūúǔù]/g, "u")
    .replace(/[ǖǘǚǜü]/g, "u")
}

export function speechScore(expected: string, heard: string) {
  const a = normalizeSpeech(expected)
  const b = normalizeSpeech(heard)
  if (!a || !b) return 0
  if (a === b) return 100
  if (b.includes(a) || a.includes(b)) return 90

  const pa = toneLess(toPinyin(expected))
  const pb = toneLess(toPinyin(heard) || heard)
  if (pa && pb && (pa === pb || pb.includes(pa) || pa.includes(pb))) return 88

  let matches = 0
  let cursor = 0
  for (const ch of a) {
    const found = b.indexOf(ch, cursor)
    if (found >= 0) {
      matches += 1
      cursor = found + 1
    }
  }
  const hanziRatio = matches / a.length
  let pMatches = 0
  let pCursor = 0
  for (const ch of pa) {
    const found = pb.indexOf(ch, pCursor)
    if (found >= 0) {
      pMatches += 1
      pCursor = found + 1
    }
  }
  const pinyinRatio = pa.length ? pMatches / pa.length : 0
  return Math.round(Math.max(hanziRatio, pinyinRatio) * 100)
}

export function bestSpeechScore(accepted: string[], heard: string): number | null {
  if (!heard.trim()) return null
  return accepted.reduce((best, item) => Math.max(best, speechScore(item, heard)), 0)
}

export type SpeechMark = { char: string; ok: boolean }

export function speechDiff(expected: string, heard: string): { expected: SpeechMark[]; heard: SpeechMark[] } {
  const a = [...normalizeSpeech(expected)]
  const b = [...normalizeSpeech(heard)]
  const n = a.length
  const m = b.length
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0))
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= m; j += 1) {
      dp[i][j] = a[i - 1] === b[j - 1] ? (dp[i - 1][j - 1] ?? 0) + 1 : Math.max(dp[i - 1][j] ?? 0, dp[i][j - 1] ?? 0)
    }
  }
  const expectedMarks: SpeechMark[] = []
  const heardMarks: SpeechMark[] = []
  let i = n
  let j = m
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      expectedMarks.push({ char: a[i - 1] ?? "", ok: true })
      heardMarks.push({ char: b[j - 1] ?? "", ok: true })
      i -= 1
      j -= 1
    } else if ((dp[i - 1][j] ?? 0) >= (dp[i][j - 1] ?? 0)) {
      expectedMarks.push({ char: a[i - 1] ?? "", ok: false })
      i -= 1
    } else {
      heardMarks.push({ char: b[j - 1] ?? "", ok: false })
      j -= 1
    }
  }
  while (i > 0) {
    expectedMarks.push({ char: a[i - 1] ?? "", ok: false })
    i -= 1
  }
  while (j > 0) {
    heardMarks.push({ char: b[j - 1] ?? "", ok: false })
    j -= 1
  }
  return { expected: expectedMarks.reverse(), heard: heardMarks.reverse() }
}
