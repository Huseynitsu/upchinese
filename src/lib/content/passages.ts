import type { HskLevel, Passage, Question } from "../types"
import { shuffle } from "../shuffle"

const KEYS = ["A", "B", "C", "D"] as const

type MiniPassage = Passage & {
  questions: {
    prompt: string
    correct: string
    distractors: [string, string, string]
    explanation: string
  }[]
}

const MINI: MiniPassage[] = [
  {
    id: "pass-1-home",
    hskLevel: 1,
    title: "At home",
    body: "我叫大卫。我有爸爸、妈妈。我家不大。我很爱我的家。",
    bodyEn: "I am David. I have a dad and a mom. My home is not big. I love my family.",
    questions: [
      {
        prompt: "Who is speaking?",
        correct: "大卫",
        distractors: ["老师", "妈妈", "朋友"],
        explanation: "The first sentence is 我叫大卫, so the speaker is David.",
      },
      {
        prompt: "What does he have?",
        correct: "爸爸和妈妈",
        distractors: ["猫和狗", "很多书", "一个学校"],
        explanation: "我有爸爸、妈妈 means he has a father and a mother.",
      },
    ],
  },
  {
    id: "pass-1-school",
    hskLevel: 1,
    title: "At school",
    body: "今天我去学校。老师很好。我的同学也很好。我们一起学习汉语。",
    bodyEn: "Today I go to school. The teacher is very good. My classmates are also good. We study Chinese together.",
    questions: [
      {
        prompt: "Where does the writer go today?",
        correct: "学校",
        distractors: ["医院", "商店", "饭店"],
        explanation: "今天我去学校 tells you the place is school.",
      },
      {
        prompt: "What do they study?",
        correct: "汉语",
        distractors: ["英语", "音乐", "数学"],
        explanation: "我们一起学习汉语 — they study Chinese.",
      },
    ],
  },
  {
    id: "pass-1-food",
    hskLevel: 1,
    title: "Lunch",
    body: "我喜欢吃饭。中午我喝茶，也吃米饭。米饭不贵，很好吃。",
    bodyEn: "I like eating. At noon I drink tea and eat rice. Rice is not expensive and tastes good.",
    questions: [
      {
        prompt: "What does the writer drink?",
        correct: "茶",
        distractors: ["水", "咖啡", "牛奶"],
        explanation: "中午我喝茶 — they drink tea at noon.",
      },
      {
        prompt: "Is the rice expensive?",
        correct: "不贵",
        distractors: ["很贵", "没有", "太小"],
        explanation: "米饭不贵 means the rice is not expensive.",
      },
    ],
  },
  {
    id: "pass-2-shop",
    hskLevel: 2,
    title: "Shopping",
    body: "昨天下午我去商店买衣服。这件衣服有点儿贵，但是很好看。售货员说可以便宜一点儿。",
    bodyEn: "Yesterday afternoon I went to the shop to buy clothes. This piece is a bit expensive but looks nice. The clerk said it could be a little cheaper.",
    questions: [
      {
        prompt: "When did the writer go shopping?",
        correct: "昨天下午",
        distractors: ["今天早上", "明天晚上", "现在"],
        explanation: "昨天下午 is yesterday afternoon.",
      },
      {
        prompt: "What is the problem with the clothes?",
        correct: "有点儿贵",
        distractors: ["太小", "不好看", "没有颜色"],
        explanation: "这件衣服有点儿贵 — they are a bit expensive.",
      },
    ],
  },
  {
    id: "pass-2-travel",
    hskLevel: 2,
    title: "Travel",
    body: "这个周末我想去北京。我坐火车去。北京比我们的城市大，人也很多。",
    bodyEn: "This weekend I want to go to Beijing. I will take the train. Beijing is bigger than our city, and there are many people.",
    questions: [
      {
        prompt: "How will the writer travel?",
        correct: "坐火车",
        distractors: ["坐飞机", "开车", "走路"],
        explanation: "我坐火车去 means they will go by train.",
      },
      {
        prompt: "Compared with their city, Beijing is…",
        correct: "更大",
        distractors: ["更小", "更冷", "更近"],
        explanation: "北京比我们的城市大 uses 比 to say Beijing is bigger.",
      },
    ],
  },
  {
    id: "pass-3-work",
    hskLevel: 3,
    title: "A busy day",
    body: "我把作业做完了，然后给妈妈打了电话。她让我早点回家。虽然我有点儿累，可是很高兴。",
    bodyEn: "I finished my homework, then called mom. She asked me to go home earlier. Although I am a bit tired, I am happy.",
    questions: [
      {
        prompt: "What did the writer finish first?",
        correct: "作业",
        distractors: ["电话", "晚饭", "考试"],
        explanation: "我把作业做完了 — the 把 sentence shows homework was finished.",
      },
      {
        prompt: "How does the writer feel?",
        correct: "高兴，虽然有点儿累",
        distractors: ["很生气", "不想回家", "没有时间"],
        explanation: "虽然我有点儿累，可是很高兴 — tired but happy.",
      },
    ],
  },
  {
    id: "pass-4-plan",
    hskLevel: 4,
    title: "According to the plan",
    body: "按照公司的计划，我们下个月开始这个项目。百分之八十的同事已经准备好了。只要大家一起努力，就一定能完成。",
    bodyEn: "According to the company plan, we start this project next month. Eighty percent of colleagues are ready. If everyone works hard, we can finish it.",
    questions: [
      {
        prompt: "When does the project start?",
        correct: "下个月",
        distractors: ["昨天", "今天早上", "明年冬天"],
        explanation: "下个月开始这个项目 — next month.",
      },
      {
        prompt: "How many colleagues are ready?",
        correct: "百分之八十",
        distractors: ["所有人", "没有人", "只有两个人"],
        explanation: "百分之八十的同事已经准备好了.",
      },
    ],
  },
  {
    id: "pass-5-exam",
    hskLevel: 5,
    title: "Confidence",
    body: "我对这次考试很有把握，因为我每天都认真复习。即使题目有点儿难，我也会冷静地思考。",
    bodyEn: "I am confident about this exam because I review seriously every day. Even if the questions are a bit hard, I will think calmly.",
    questions: [
      {
        prompt: "Why is the writer confident?",
        correct: "每天认真复习",
        distractors: ["没有复习", "考试很容易", "老师告诉答案"],
        explanation: "因为我每天都认真复习 explains the confidence.",
      },
    ],
  },
  {
    id: "pass-6-answer",
    hskLevel: 6,
    title: "An unclear answer",
    body: "他的回答很暧昧，没有说明真正的态度。我们讨论了很久，还是不知道他到底同不同意。",
    bodyEn: "His answer was ambiguous and did not show a real attitude. After a long discussion we still do not know if he agrees.",
    questions: [
      {
        prompt: "What is the problem with the answer?",
        correct: "态度不清楚",
        distractors: ["声音太小", "语法全错", "时间不够"],
        explanation: "暧昧 here means the attitude is vague.",
      },
    ],
  },
]

function choices(correct: string, distractors: string[], seed: string) {
  const options = shuffle([correct, ...distractors], seed.split("").reduce((n, ch) => n + ch.charCodeAt(0), 1))
  const mapped = options.slice(0, 4).map((text, index) => ({ key: KEYS[index], text }))
  return {
    choices: mapped,
    correctKey: mapped.find((choice) => choice.text === correct)?.key ?? "A",
  }
}

export const AUTHORED_PASSAGES: Passage[] = MINI.map(({ questions: _q, ...passage }) => passage)

export function authoredPassageQuestions(): Question[] {
  return MINI.flatMap((passage) =>
    passage.questions.map((item, index) => ({
      id: `${passage.id}-q${index}`,
      hskLevel: passage.hskLevel,
      skill: "reading" as const,
      kind: "meaning" as const,
      prompt: item.prompt,
      passageId: passage.id,
      explanation: item.explanation,
      ...choices(item.correct, item.distractors, `${passage.id}-${index}`),
    }))
  )
}

export function passageByAuthoredId(id: string) {
  return AUTHORED_PASSAGES.find((item) => item.id === id)
}
