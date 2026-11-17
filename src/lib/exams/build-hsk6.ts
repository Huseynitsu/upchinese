import type { OfficialPaper } from "../types"
import { block, duo, essay, four, letter, mcq, paper, part } from "./factory"

export const HSK6_CODES = ["H60000", "H61001", "H61002", "H61003", "H61004"] as const

const PACKS = [
  { theme: "法律与媒体", tone: "暧昧", key: "暗示", essay: "科技改变交流方式，人们更依赖网络，但也需要面对面对话来保持真正的友谊。" },
  { theme: "城市与记忆", tone: "复杂", key: "怀旧", essay: "旧街区被改造，有人欢呼便利，有人惋惜消失的烟火气。发展与保护如何平衡。" },
  { theme: "教育与选择", tone: "谨慎", key: "独立", essay: "分数之外，学生更需要判断力。家长的期待有时会削弱孩子的主动性。" },
  { theme: "生态与责任", tone: "紧迫", key: "可持续", essay: "消费越方便，浪费越隐蔽。个人选择看似微小，却会累积成环境代价。" },
  { theme: "人工智能", tone: "矛盾", key: "边界", essay: "机器能完成重复劳动，却无法代替信任。社会需要重新定义工作的意义。" },
]

export function buildHsk6(variant: number): OfficialPaper {
  const code = HSK6_CODES[variant]
  const p = PACKS[variant]
  const id = (k: string, n: number) => `${code}-${k}-${n}`

  const listen = Array.from({ length: 50 }, (_, i) => {
    const n = i + 1
    const rows = [
      { a: `这个${p.theme}的问题并不简单，当事人的态度有些${p.tone}，旁人只能得到${p.key}。`, b: "报道需要更加克制，避免情绪化的结论。", q: "态度如何？", opts: ["清楚直接", `有些${p.tone}`, "非常生气", "完全沉默"] as [string, string, string, string], key: "B" as const },
      { a: "很多人巴不得马上知道结果，但真相仍是一个奥秘。", b: "急于下结论，往往会忽略关键细节。", q: "人们的心情是：", opts: ["不想知道", "迫不及待", "已经知道", "毫不关心"], key: "B" },
      { a: "会议开了三个小时，真正解决问题的只有最后二十分钟。", b: "可见效率比时长更重要。", q: "作者强调：", opts: ["会议越长越好", "效率比时长重要", "不要开会", "只需十分钟"], key: "B" },
      { a: "她拒绝了采访，不是因为心虚，而是不愿被断章取义。", b: "沉默有时也是一种保护。", q: "她拒绝采访是因为：", opts: ["心虚", "不愿被断章取义", "没有时间", "不会说话"], key: "B" },
      { a: "数据看起来漂亮，可是样本太小，结论站不住。", b: "研究要经得起追问。", q: "问题在于：", opts: ["数据造假", "样本太小", "没有数据", "结论太谦虚"], key: "B" },
    ]
    const row = rows[i % 5]
    return mcq(id("l", n), n, duo(row.a, row.b, row.q), row.q, four(row.opts[0], row.opts[1], row.opts[2], row.opts[3]), letter(row.key))
  })

  const reading = Array.from({ length: 50 }, (_, i) => {
    const n = i + 51
    const rows = [
      { stem: `围绕${p.theme}的讨论越来越${p.tone}。与其急于站队，不如先弄清概念的${p.key}。`, q: "作者建议：", opts: ["马上站队", "先弄清概念", "停止讨论", "只看标题"], key: "B" as const },
      { stem: "很多人巴不得马上知道结果，但真相仍是一个奥秘。耐心本身也是一种能力。", q: "人们的心情是：", opts: ["不想知道", "迫不及待", "已经知道", "毫不关心"], key: "B" },
      { stem: "把复杂问题简化成口号，传播很快，却常常误导公众。", q: "口号式传播的问题是：", opts: ["太慢", "常常误导公众", "没有人看", "过于学术"], key: "B" },
      { stem: "真正的专业不是堆砌术语，而是能把关键判断讲清楚，并承认不确定的部分。", q: "专业意味着：", opts: ["多用术语", "讲清判断并承认不确定", "从不承认错误", "只对内行说话"], key: "B" },
      { stem: "一项政策短期有效，长期可能带来新的不平衡。评估不能只看眼前数字。", q: "评估时应该：", opts: ["只看短期", "兼顾长期影响", "忽略数字", "完全凭感觉"], key: "B" },
    ]
    const row = rows[i % 5]
    return mcq(id("r", n), n, undefined, row.stem, four(row.opts[0], row.opts[1], row.opts[2], row.opts[3]), letter(row.key), false, row.q)
  })

  const writing = [
    essay(
      id("w", 101),
      101,
      `阅读下面材料，缩写并加上标题，约 400 字。材料大意：${p.essay}`,
      120,
      p.essay.includes("友谊") ? ["交流", "友谊"] : p.theme.includes("生态") ? ["环境", "责任"] : [p.key, "社会"]
    ),
  ]

  return paper(6, code, 140, [
    block("listening", "一、听力", "Listening", 35, 50, [
      part("l1", "第一部分", "第 1–50 题：请选出正确答案。", listen),
    ]),
    block("reading", "二、阅读", "Reading", 50, 50, [
      part("r1", "第一部分", "第 51–100 题：请选出正确答案。", reading),
    ]),
    block("writing", "三、书写", "Writing", 45, 1, [
      part("w1", "缩写", "第 101 题：缩写。", writing),
    ]),
  ], [
    "HSK（六级）听力 50 题，阅读 50 题，书写 1 题（缩写）。",
    "听力只播放一遍。内容为原创模拟题。",
  ])
}
