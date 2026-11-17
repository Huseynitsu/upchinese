export function cancelSpeech() {
  if (typeof window === "undefined") return
  window.speechSynthesis?.cancel()
}

function zhVoices() {
  const voices = window.speechSynthesis.getVoices()
  return voices.filter(
    (voice) =>
      voice.lang.toLowerCase().startsWith("zh") ||
      voice.lang.toLowerCase().includes("chinese")
  )
}

function pickVoice(prefer: "male" | "female") {
  const list = zhVoices()
  const byName = list.find((voice) =>
    prefer === "male"
      ? /male|kangkang|yunyang|yunjian/i.test(voice.name)
      : /female|xiaoxiao|xiaoyi|yaoyao|huihui|tingting/i.test(voice.name)
  )
  return byName ?? list[prefer === "male" ? 0 : list.length - 1] ?? list[0]
}

export function speakChinese(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  speakLine(text, "女")
}

export function speakDialogue(
  lines: { speaker?: "男" | "女" | "问"; text: string }[],
  options?: { twice?: boolean; onEnd?: () => void }
) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const queue = options?.twice ? [...lines, { speaker: "问" as const, text: "。" }, ...lines] : lines

  function play(index: number) {
    if (index >= queue.length) {
      options?.onEnd?.()
      return
    }
    const line = queue[index]
    const prefix = line.speaker ? `${line.speaker}：${line.text}` : line.text
    const utterance = speakLine(prefix, line.speaker ?? "女")
    utterance.onend = () => play(index + 1)
  }

  window.speechSynthesis.getVoices()
  play(0)
}

export function speakExamItem(
  item: { number: number; audio?: { speaker?: "男" | "女" | "问"; text: string }[]; playTwice?: boolean },
  options?: { onEnd?: () => void }
) {
  const lines = [
    { speaker: "女" as const, text: `现在开始第${item.number}题。` },
    ...(item.audio ?? []),
  ]
  speakDialogue(lines, { twice: item.playTwice, onEnd: options?.onEnd })
}

export function speakListeningIntro(parts: number, count: number, onEnd?: () => void) {
  speakDialogue(
    [
      { speaker: "女", text: "大家好！欢迎参加汉语水平考试。" },
      { speaker: "女", text: `听力考试分${parts}部分，共${count}题。请大家注意，听力考试现在开始。` },
    ],
    { onEnd }
  )
}

function speakLine(text: string, speaker: "男" | "女" | "问") {
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVoice(speaker === "男" ? "male" : "female")
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang ?? "zh-CN"
  utterance.rate = speaker === "问" ? 0.8 : 0.88
  utterance.pitch = speaker === "男" ? 0.75 : speaker === "问" ? 1 : 1.15
  window.speechSynthesis.speak(utterance)
  return utterance
}
