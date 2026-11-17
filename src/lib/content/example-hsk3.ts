import { MORE_WORDS } from "./vocab-more"

type Example = { zh: string; en: string; askZh?: string; askEn?: string; answerZh?: string }

function sentence(hanzi: string, english: string): Example {
  const gloss = english.toLowerCase()
  if (gloss.includes("particle") || gloss.includes("measure word") || gloss.includes("measure word for")) {
    return { zh: `请用“${hanzi}”说一句完整的话。`, en: `Please make a complete sentence with “${hanzi}”.` }
  }
  if (gloss.startsWith("to ")) {
    const rest = english.replace(/^to /, "")
    return { zh: `我想${hanzi}。`, en: `I want to ${rest}.` }
  }
  if (/^(quiet|clever|clean|hungry|thirsty|cute|difficult|easy|important|famous|young|old|short|long|fat|thin|sweet|fresh|comfortable|angry|anxious|serious|simple|healthy|happy|bad|broken|strange|clear|enthusiastic|hardworking|satisfied|convenient)/.test(gloss)) {
    return { zh: `他很${hanzi}。`, en: `He is very ${english}.` }
  }
  return { zh: `我有${hanzi}。`, en: `I have / there is ${english}.` }
}

const curated: Record<string, Example> = {
  阿姨: { zh: "我阿姨在医院工作。", en: "My aunt works at the hospital." },
  爱好: { zh: "我的爱好是听音乐。", en: "My hobby is listening to music." },
  办公室: { zh: "老师在办公室。", en: "The teacher is in the office." },
  帮忙: { zh: "请帮我一个忙。", en: "Please help me out." },
  把: { zh: "请把窗户打开。", en: "Please open the window." },
  被: { zh: "我的包被同学拿走了。", en: "My bag was taken by a classmate." },
  地: { zh: "他高兴地笑了。", en: "He smiled happily." },
  不但: { zh: "他不但会汉语，而且会英语。", en: "He can speak not only Chinese but also English." },
  而且: { zh: "这个办法简单而且有用。", en: "This method is simple and useful." },
  除了: { zh: "除了汉语，我还学英语。", en: "Besides Chinese, I also study English." },
  如果: { zh: "如果下雨，我就不去了。", en: "If it rains, I will not go." },
  虽然: { zh: "虽然很累，可是我很高兴。", en: "Although I am tired, I am happy." },
  为了: { zh: "为了学汉语，我每天练习。", en: "In order to learn Chinese, I practice every day." },
  应该: { zh: "你应该早点儿睡觉。", en: "You should go to bed earlier." },
  必须: { zh: "明天必须来上课。", en: "You must come to class tomorrow." },
  越: { zh: "他越学越喜欢汉语。", en: "The more he studies, the more he likes Chinese." },
  只有: { zh: "只有努力，才能进步。", en: "Only if you work hard can you improve." },
  才: { zh: "他昨天才到北京。", en: "He only arrived in Beijing yesterday." },
}

export const HSK3_EXACT: Record<string, Example> = { ...curated }

for (const row of MORE_WORDS) {
  const [level, hanzi, , english] = row
  if (level !== 3 || HSK3_EXACT[hanzi]) continue
  HSK3_EXACT[hanzi] = sentence(hanzi, english)
}
