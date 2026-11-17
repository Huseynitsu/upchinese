import type { GrammarLesson, HskLevel } from "../types"

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: "g1-de",
    hskLevel: 1,
    title: "的 for possession",
    explanation:
      "Put 的 between a person and a noun to show possession: 我的书 (my book). After a pronoun, 的 is often kept in HSK 1 sentences.",
    examples: [
      { zh: "这是我的电脑。", pinyin: "Zhè shì wǒ de diànnǎo.", en: "This is my computer." },
      { zh: "她的老师很好。", pinyin: "Tā de lǎoshī hěn hǎo.", en: "Her teacher is very good." },
    ],
  },
  {
    id: "g1-ma",
    hskLevel: 1,
    title: "吗 yes/no questions",
    explanation:
      "Add 吗 at the end of a statement to make a yes/no question. Answer with 是 / 不是 or repeat the verb.",
    examples: [
      { zh: "你是学生吗？", pinyin: "Nǐ shì xuésheng ma?", en: "Are you a student?" },
      { zh: "你喝茶吗？", pinyin: "Nǐ hē chá ma?", en: "Do you drink tea?" },
    ],
  },
  {
    id: "g1-le",
    hskLevel: 1,
    title: "了 for completed action",
    explanation:
      "了 after a verb often marks a completed action. 我吃了米饭 means the eating already happened.",
    examples: [
      { zh: "我买了苹果。", pinyin: "Wǒ mǎi le píngguǒ.", en: "I bought apples." },
      { zh: "他回家了。", pinyin: "Tā huí jiā le.", en: "He went home." },
    ],
  },
  {
    id: "g1-bu-mei",
    hskLevel: 1,
    title: "不 vs 没",
    explanation:
      "不 negates present/future habits and adjectives: 不热. 没 negates 有 and past actions: 没有, 没去.",
    examples: [
      { zh: "今天不冷。", pinyin: "Jīntiān bù lěng.", en: "It is not cold today." },
      { zh: "我没有钱。", pinyin: "Wǒ méi yǒu qián.", en: "I don't have money." },
    ],
  },
  {
    id: "g1-zai",
    hskLevel: 1,
    title: "在 for location",
    explanation:
      "在 + place tells where someone or something is. 书在桌子上。",
    examples: [
      { zh: "我在学校。", pinyin: "Wǒ zài xuéxiào.", en: "I am at school." },
      { zh: "猫在椅子上。", pinyin: "Māo zài yǐzi shàng.", en: "The cat is on the chair." },
    ],
  },
  {
    id: "g2-bi",
    hskLevel: 2,
    title: "比 comparisons",
    explanation:
      "A 比 B + adjective compares two things. Add 很 only if you are not using 比.",
    examples: [
      { zh: "今天比昨天热。", pinyin: "Jīntiān bǐ zuótiān rè.", en: "Today is hotter than yesterday." },
      { zh: "这本书比那本贵。", pinyin: "Zhè běn shū bǐ nà běn guì.", en: "This book is more expensive than that one." },
    ],
  },
  {
    id: "g2-de-manner",
    hskLevel: 2,
    title: "得 for manner",
    explanation:
      "Verb + 得 + adjective describes how well an action is done: 说得很好.",
    examples: [
      { zh: "她写得很快。", pinyin: "Tā xiě de hěn kuài.", en: "She writes very fast." },
      { zh: "你说得对。", pinyin: "Nǐ shuō de duì.", en: "You are right." },
    ],
  },
  {
    id: "g3-ba",
    hskLevel: 3,
    title: "把 sentences",
    explanation:
      "把 moves the object before the verb when the object is affected: 请把门关上.",
    examples: [
      { zh: "请把书放在桌子上。", pinyin: "Qǐng bǎ shū fàng zài zhuōzi shàng.", en: "Please put the book on the table." },
      { zh: "我把衣服洗了。", pinyin: "Wǒ bǎ yīfu xǐ le.", en: "I washed the clothes." },
    ],
  },
  {
    id: "g3-le-change",
    hskLevel: 3,
    title: "了 for change of state",
    explanation:
      "Sentence-final 了 can mark a new situation: 下雨了 (it has started raining).",
    examples: [
      { zh: "他已经是老师了。", pinyin: "Tā yǐjīng shì lǎoshī le.", en: "He is already a teacher." },
      { zh: "我不想去了。", pinyin: "Wǒ bù xiǎng qù le.", en: "I don't want to go anymore." },
    ],
  },
  {
    id: "g4-baifenzhi",
    hskLevel: 4,
    title: "百分之 percentages",
    explanation:
      "百分之 + number means percent. 百分之八十 = 80%.",
    examples: [
      { zh: "百分之九十的学生来了。", pinyin: "Bǎi fēn zhī jiǔshí de xuésheng lái le.", en: "Ninety percent of the students came." },
    ],
  },
  {
    id: "g4-anzhao",
    hskLevel: 4,
    title: "按照 according to",
    explanation:
      "按照 + noun introduces a standard or plan: 按照计划工作.",
    examples: [
      { zh: "按照老师的要求写。", pinyin: "Ànzhào lǎoshī de yāoqiú xiě.", en: "Write according to the teacher's requirements." },
    ],
  },
  {
    id: "g5-把握",
    hskLevel: 5,
    title: "有把握 to be confident",
    explanation:
      "对 + topic + 有把握 means you are confident about that topic.",
    examples: [
      { zh: "我对这次考试很有把握。", pinyin: "Wǒ duì zhè cì kǎoshì hěn yǒu bǎwò.", en: "I am confident about this exam." },
    ],
  },
  {
    id: "g6-aimei",
    hskLevel: 6,
    title: "暧昧 for unclear attitude",
    explanation:
      "暧昧 describes a vague or ambiguous attitude, often in relationships or opinions.",
    examples: [
      { zh: "他的回答很暧昧。", pinyin: "Tā de huídá hěn àimèi.", en: "His answer is ambiguous." },
    ],
  },
  {
    id: "g1-shi",
    hskLevel: 1,
    title: "是 for identity",
    explanation: "A 是 B names what someone or something is: 我是学生.",
    examples: [
      { zh: "我是老师。", pinyin: "Wǒ shì lǎoshī.", en: "I am a teacher." },
      { zh: "这是汉语书。", pinyin: "Zhè shì Hànyǔ shū.", en: "This is a Chinese book." },
    ],
  },
  {
    id: "g1-you",
    hskLevel: 1,
    title: "有 for possession and existence",
    explanation: "有 means have or there is: 我有书. 学校有学生.",
    examples: [
      { zh: "我有一个朋友。", pinyin: "Wǒ yǒu yí ge péngyou.", en: "I have a friend." },
      { zh: "桌子上有一杯茶。", pinyin: "Zhuōzi shàng yǒu yì bēi chá.", en: "There is a cup of tea on the table." },
    ],
  },
  {
    id: "g1-mw",
    hskLevel: 1,
    title: "Number + measure word",
    explanation: "Chinese counts with a measure word: 一个人, 一本书, 一杯水.",
    examples: [
      { zh: "我有三本书。", pinyin: "Wǒ yǒu sān běn shū.", en: "I have three books." },
      { zh: "请给我一杯水。", pinyin: "Qǐng gěi wǒ yì bēi shuǐ.", en: "Please give me a glass of water." },
    ],
  },
  {
    id: "g2-zhe",
    hskLevel: 2,
    title: "着 for an ongoing state",
    explanation: "Verb + 着 shows a continuing state: 他看着窗外.",
    examples: [
      { zh: "门开着。", pinyin: "Mén kāi zhe.", en: "The door is open." },
      { zh: "他看着黑板。", pinyin: "Tā kàn zhe hēibǎn.", en: "He is looking at the blackboard." },
    ],
  },
  {
    id: "g2-guo",
    hskLevel: 2,
    title: "过 for experience",
    explanation: "Verb + 过 means you have done it before: 我去过北京.",
    examples: [
      { zh: "我吃过中国菜。", pinyin: "Wǒ chī guo Zhōngguó cài.", en: "I have eaten Chinese food." },
      { zh: "你去过上海吗？", pinyin: "Nǐ qù guo Shànghǎi ma?", en: "Have you been to Shanghai?" },
    ],
  },
  {
    id: "g2-hen",
    hskLevel: 2,
    title: "很 with adjectives",
    explanation: "HSK 2 often needs 很 before an adjective even if it is not strongly “very”: 我很好.",
    examples: [
      { zh: "今天很热。", pinyin: "Jīntiān hěn rè.", en: "It is hot today." },
      { zh: "这个商店很大。", pinyin: "Zhège shāngdiàn hěn dà.", en: "This shop is big." },
    ],
  },
  {
    id: "g2-yao",
    hskLevel: 2,
    title: "要 for future plans",
    explanation: "要 + verb often marks a plan or intention: 我要去学校.",
    examples: [
      { zh: "明天我要考试。", pinyin: "Míngtiān wǒ yào kǎoshì.", en: "I have an exam tomorrow." },
      { zh: "你要喝茶吗？", pinyin: "Nǐ yào hē chá ma?", en: "Do you want to drink tea?" },
    ],
  },
  {
    id: "g3-suiran",
    hskLevel: 3,
    title: "虽然…可是",
    explanation: "虽然 A，可是 B = although A, B. Both parts stay.",
    examples: [
      { zh: "虽然下雨了，可是我们还去。", pinyin: "Suīrán xià yǔ le, kěshì wǒmen hái qù.", en: "Although it is raining, we still go." },
      { zh: "虽然很难，可是很有意思。", pinyin: "Suīrán hěn nán, kěshì hěn yǒu yìsi.", en: "Although it is hard, it is interesting." },
    ],
  },
  {
    id: "g3-hui",
    hskLevel: 3,
    title: "会 / 能 / 可以",
    explanation: "会 is a learned skill, 能 is ability in the situation, 可以 is permission.",
    examples: [
      { zh: "我会说汉语。", pinyin: "Wǒ huì shuō Hànyǔ.", en: "I can speak Chinese." },
      { zh: "我今天不能去。", pinyin: "Wǒ jīntiān bù néng qù.", en: "I cannot go today." },
      { zh: "你可以进来。", pinyin: "Nǐ kěyǐ jìnlái.", en: "You may come in." },
    ],
  },
  {
    id: "g3-bei",
    hskLevel: 3,
    title: "被 passive",
    explanation: "A 被 B + verb: A is affected by B. 我的包被他拿走了.",
    examples: [
      { zh: "窗户被风关上了。", pinyin: "Chuānghu bèi fēng guān shàng le.", en: "The window was closed by the wind." },
      { zh: "作业被老师看了。", pinyin: "Zuòyè bèi lǎoshī kàn le.", en: "The homework was looked at by the teacher." },
    ],
  },
  {
    id: "g3-ruguo",
    hskLevel: 3,
    title: "如果…就",
    explanation: "如果 A，就 B = if A, then B.",
    examples: [
      { zh: "如果下雨，我就不去公园。", pinyin: "Rúguǒ xià yǔ, wǒ jiù bú qù gōngyuán.", en: "If it rains, I will not go to the park." },
    ],
  },
  {
    id: "g4-bujin",
    hskLevel: 4,
    title: "不仅…而且",
    explanation: "不仅 A，而且 B adds a second, often stronger, point.",
    examples: [
      { zh: "他不仅会汉语，而且会法语。", pinyin: "Tā bùjǐn huì Hànyǔ, érqiě huì Fǎyǔ.", en: "He can speak not only Chinese but also French." },
    ],
  },
  {
    id: "g4-buguan",
    hskLevel: 4,
    title: "不管…都",
    explanation: "不管 + question word，都… = no matter…, still…",
    examples: [
      { zh: "不管天气怎么样，我都去上课。", pinyin: "Bùguǎn tiānqì zěnmeyàng, wǒ dōu qù shàngkè.", en: "No matter what the weather is like, I still go to class." },
    ],
  },
  {
    id: "g4-yue",
    hskLevel: 4,
    title: "越…越…",
    explanation: "越 A 越 B = the more A, the more B.",
    examples: [
      { zh: "他越学越喜欢中文。", pinyin: "Tā yuè xué yuè xǐhuan Zhōngwén.", en: "The more he studies, the more he likes Chinese." },
    ],
  },
  {
    id: "g5-yinwei",
    hskLevel: 5,
    title: "由于 / 因此",
    explanation: "由于 introduces a reason; 因此 states the result in a more formal style.",
    examples: [
      { zh: "由于下雨，比赛取消了。", pinyin: "Yóuyú xià yǔ, bǐsài qǔxiāo le.", en: "Because of the rain, the match was cancelled." },
    ],
  },
  {
    id: "g5-jiushi",
    hskLevel: 5,
    title: "即使…也",
    explanation: "即使 A，也 B = even if A, still B.",
    examples: [
      { zh: "即使很累，我也要完成作业。", pinyin: "Jíshǐ hěn lèi, wǒ yě yào wánchéng zuòyè.", en: "Even if I am tired, I still have to finish the homework." },
    ],
  },
  {
    id: "g6-faner",
    hskLevel: 6,
    title: "反而",
    explanation: "反而 marks a result opposite to what you expected.",
    examples: [
      { zh: "他没生气，反而笑了。", pinyin: "Tā méi shēngqì, fǎn'ér xiào le.", en: "He was not angry; on the contrary, he smiled." },
    ],
  },
  {
    id: "g6-wulun",
    hskLevel: 6,
    title: "无论…都",
    explanation: "无论 is a formal 不管: no matter what, the second clause still holds.",
    examples: [
      { zh: "无论遇到什么困难，他都坚持学习。", pinyin: "Wúlùn yùdào shénme kùnnan, tā dōu jiānchí xuéxí.", en: "No matter what difficulties he meets, he keeps studying." },
    ],
  },
]

export function grammarByLevel(level: HskLevel) {
  return GRAMMAR_LESSONS.filter((lesson) => lesson.hskLevel === level)
}
