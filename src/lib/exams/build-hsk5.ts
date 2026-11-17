import type { OfficialPaper } from "../types"
import { block, cloze, duo, essay, four, letter, mcq, paper, part, scramble } from "./factory"

export const HSK5_CODES = ["H50000", "H51001", "H51002", "H51003", "H51004"] as const

const PACKS = [
  { topic: "考试", place: "图书馆", issue: "灯光太暗", advice: "先休息再准备", job: "研究员" },
  { topic: "搬家", place: "新公寓", issue: "家具还没到", advice: "先住酒店两天", job: "律师" },
  { topic: "创业", place: "共享办公室", issue: "网络不稳定", advice: "换一家运营商", job: "产品经理" },
  { topic: "留学", place: "宿舍", issue: "签证材料不全", advice: "明天一早去补交", job: "奖学金评审" },
  { topic: "环保", place: "社区中心", issue: "分类垃圾桶不够", advice: "先向居委会申请", job: "志愿者" },
]

export function buildHsk5(variant: number): OfficialPaper {
  const code = HSK5_CODES[variant]
  const p = PACKS[variant]
  const id = (k: string, n: number) => `${code}-${k}-${n}`

  const short = Array.from({ length: 20 }, (_, i) => {
    const n = i + 1
    const rows = [
      { a: `我对这次${p.topic}很有把握，但还是先休息一下。`, b: `${p.place}有点问题：${p.issue}。`, q: "男的提到了什么问题？", opts: [p.issue, "他已经结束了", "他没有朋友", "他要放弃"] as [string, string, string, string], key: "A" as const },
      { a: "方案什么时候交？", b: "周五前，晚了来不及修改。", q: "方案什么时候交？", opts: ["周一", "周五前", "下个月", "已经交了"], key: "B" },
      { a: "你怎么看待加班？", b: "偶尔可以，长期对健康不好。", q: "男的态度？", opts: ["必须每天加班", "长期加班不好", "从不加班", "喜欢加班"], key: "B" },
      { a: `${p.place}怎么走？`, b: "地铁二号线，C口出来就是。", q: "怎么去？", opts: ["坐公交", "地铁二号线", "开车一小时", "只能走路"], key: "B" },
    ]
    return rows[i % 4]
  }).map((row, i) =>
    mcq(id("s", i + 1), i + 1, duo(row.a, row.b, row.q), row.q, four(row.opts[0], row.opts[1], row.opts[2], row.opts[3]), letter(row.key))
  )

  const long = Array.from({ length: 25 }, (_, i) => {
    const n = i + 21
    const rows = [
      { a: `关于${p.topic}，专家给的建议是${p.advice}。`, b: `同时要注意${p.issue}，不然效率会下降。`, q: "专家建议什么？", opts: ["立刻放弃", p.advice, "换工作", "不休息"], key: "B" as const },
      { a: `${p.job}需要耐心，也需要和不同的人沟通。`, b: "刚开始很难，做久了就熟悉了。", q: "关于这份工作：", opts: ["不需要沟通", "需要耐心和沟通", "一开始就很容易", "没有压力"], key: "B" },
      { a: "很多人巴不得马上看到结果。", b: "可是真正的进步往往很慢，要允许自己犯错。", q: "这段话强调：", opts: ["必须马上成功", "进步往往很慢", "不要努力", "错误不可原谅"], key: "B" },
      { a: "会议改到下午三点，材料放在三楼。", b: "别拿到仓库去，保安不让进。", q: "材料在哪儿？", opts: ["仓库", "三楼", "门口", "家里"], key: "B" },
      { a: "她拒绝了高薪工作，因为想照顾家人。", b: "她觉得时间比钱更重要。", q: "她为什么拒绝？", opts: ["工资太低", "想照顾家人", "不会做", "公司太远"], key: "B" },
    ]
    const row = rows[i % 5]
    return mcq(id("g", n), n, duo(row.a, row.b, row.q), row.q, four(row.opts[0], row.opts[1], row.opts[2], row.opts[3]), letter(row.key))
  })

  const bank = [
    { key: "A", text: ["把握", "适应", "投资", "申请", "减少"][variant] },
    { key: "B", text: ["安慰", "犹豫", "批准", "呼吁", "维持"][variant] },
    { key: "C", text: ["反而", "居然", "毕竟", "何必", "从而"][variant] },
    { key: "D", text: ["至于", "鉴于", "除非", "以免", "以便"][variant] },
    { key: "E", text: ["迫切", "模糊", "激烈", "谨慎", "巧妙"][variant] },
    { key: "F", text: ["忽视", "暴露", "削弱", "弥补", "促使"][variant] },
  ]

  const clozeByVariant = [
    [
      cloze(id("c", 46), 46, `他对这次${p.topic}很有（ ）。`, bank, "A"),
      cloze(id("c", 47), 47, `朋友（ ）他说，${p.advice}。`, bank, "B"),
      cloze(id("c", 48), 48, "条件不好，（ ）让他更认真。", bank, "C"),
      cloze(id("c", 49), 49, "（ ）时间安排，可以明天再讨论细节。", bank, "D"),
      cloze(id("c", 50), 50, "大家的心情都很（ ），希望尽快有结果。", bank, "E"),
      cloze(id("c", 51), 51, "不要（ ）小问题，它们可能影响全局。", bank, "F"),
      cloze(id("c", 52), 52, "没有（ ），就很难在压力下保持冷静。", bank, "A"),
      cloze(id("c", 53), 53, "失败之后，最需要的是一句（ ）。", bank, "B"),
      cloze(id("c", 54), 54, "他本想放弃，（ ）又坚持了下来。", bank, "C"),
      cloze(id("c", 55), 55, "（ ）安全考虑，活动改到室内。", bank, "D"),
    ],
    [
      cloze(id("c", 46), 46, `到了新环境，要尽快（ ）这里的节奏。`, bank, "A"),
      cloze(id("c", 47), 47, "他（ ）了很久，才决定搬家。", bank, "B"),
      cloze(id("c", 48), 48, "这么简单的问题，他（ ）做错了。", bank, "C"),
      cloze(id("c", 49), 49, "（ ）目前的情况，我们只能等待。", bank, "D"),
      cloze(id("c", 50), 50, "他的回答很（ ），听不太懂。", bank, "E"),
      cloze(id("c", 51), 51, "这个问题把管理上的漏洞（ ）出来了。", bank, "F"),
      cloze(id("c", 52), 52, "想在国外生活，先要（ ）气候和饮食。", bank, "A"),
      cloze(id("c", 53), 53, "别再（ ）了，机会不多。", bank, "B"),
      cloze(id("c", 54), 54, "他（ ）把钥匙锁在车里了。", bank, "C"),
      cloze(id("c", 55), 55, "（ ）经验不足，更要小心。", bank, "D"),
    ],
    [
      cloze(id("c", 46), 46, "这次（ ）风险不小，需要再想想。", bank, "A"),
      cloze(id("c", 47), 47, "申请已经得到（ ），下周可以开工。", bank, "B"),
      cloze(id("c", 48), 48, "争论很（ ），谁也不让步。", bank, "E"),
      cloze(id("c", 49), 49, "（ ）他是负责人，也要听别人的意见。", bank, "C"),
      cloze(id("c", 50), 50, "（ ）有书面同意，否则不能改合同。", bank, "D"),
      cloze(id("c", 51), 51, "长期加班会（ ）团队的热情。", bank, "F"),
      cloze(id("c", 52), 52, "不要盲目（ ），先做调查。", bank, "A"),
      cloze(id("c", 53), 53, "没有（ ），计划就无法执行。", bank, "B"),
      cloze(id("c", 54), 54, "年轻人（ ）也需要休息。", bank, "C"),
      cloze(id("c", 55), 55, "（ ）把问题说清楚，否则会误会。", bank, "D"),
    ],
    [
      cloze(id("c", 46), 46, "请先（ ）奖学金，材料周五截止。", bank, "A"),
      cloze(id("c", 47), 47, "专家（ ）大家关注这个问题。", bank, "B"),
      cloze(id("c", 48), 48, "事情已经过去了，（ ）再生气呢？", bank, "C"),
      cloze(id("c", 49), 49, "提前出发，（ ）错过火车。", bank, "D"),
      cloze(id("c", 50), 50, "在不熟悉的环境里，做事要（ ）。", bank, "E"),
      cloze(id("c", 51), 51, "这次错误可以用新的办法来（ ）。", bank, "F"),
      cloze(id("c", 52), 52, "他决定（ ）换专业。", bank, "A"),
      cloze(id("c", 53), 53, "媒体（ ）保护传统文化。", bank, "B"),
      cloze(id("c", 54), 54, "结果已经出来了，（ ）再争论。", bank, "C"),
      cloze(id("c", 55), 55, "带上地图，（ ）迷路。", bank, "D"),
    ],
    [
      cloze(id("c", 46), 46, "为了健康，应该（ ）塑料袋的使用。", bank, "A"),
      cloze(id("c", 47), 47, "社区需要（ ）现有的分类习惯。", bank, "B"),
      cloze(id("c", 48), 48, "宣传到位，（ ）更多人参与。", bank, "C"),
      cloze(id("c", 49), 49, "把说明写清楚，（ ）邻居理解规则。", bank, "D"),
      cloze(id("c", 50), 50, "这个设计很（ ），占地却很少。", bank, "E"),
      cloze(id("c", 51), 51, "新政策（ ）大家改变出行方式。", bank, "F"),
      cloze(id("c", 52), 52, "先（ ）浪费，再谈别的。", bank, "A"),
      cloze(id("c", 53), 53, "好习惯需要长期（ ）。", bank, "B"),
      cloze(id("c", 54), 54, "分类做好了，（ ）减少污染。", bank, "C"),
      cloze(id("c", 55), 55, "设立路标，（ ）行人找到回收点。", bank, "D"),
    ],
  ]

  const passages = Array.from({ length: 35 }, (_, i) => {
    const n = i + 56
    const texts = [
      { stem: `他对这次${p.topic}很有把握，可是${p.place}里${p.issue}。朋友安慰他说，${p.advice}。`, q: "朋友建议什么？", opts: ["放弃", p.advice, "马上结束", "搬家"] as [string, string, string, string], key: "B" as const },
      { stem: `真正的朋友会在你遇到困难时站出来；无论贫富，都值得信任。`, q: "这段话主要谈：", opts: ["旅行", "友谊", "饮食", "天气"], key: "B" },
      { stem: `科技改变了交流方式。人们更依赖网络，但也需要面对面对话来保持真正的联系。`, q: "作者认为还需要：", opts: ["只发邮件", "面对面对话", "不再上网", "取消电话"], key: "B" },
      { stem: `${p.job}这份工作并不轻松。除了专业能力，还要学会倾听不同的意见。`, q: "除了专业能力，还要：", opts: ["少说话", "学会倾听", "避免开会", "只听领导"], key: "B" },
      { stem: `城市扩张很快，绿地却越来越少。有人呼吁把停车场改成公园。`, q: "有人呼吁什么？", opts: ["多修停车场", "把停车场改成公园", "停止建设", "搬离城市"], key: "B" },
    ]
    const row = texts[i % 5]
    return mcq(id("r", n), n, undefined, row.stem, four(row.opts[0], row.opts[1], row.opts[2], row.opts[3]), letter(row.key), false, row.q)
  })

  const writing1 = [
    scramble(id("w", 91), 91, ["我们", "应该", "保护", "环境"], "我们应该保护环境。"),
    scramble(id("w", 92), 92, ["这个问题", "需要", "认真", "对待"], "这个问题需要认真对待。"),
    scramble(id("w", 93), 93, ["他", "终于", "克服", "了", "困难"], "他终于克服了困难。"),
    scramble(id("w", 94), 94, ["请", "把", "意见", "写", "下来"], "请把意见写下来。"),
    scramble(id("w", 95), 95, ["这次", "经历", "让", "我", "成长"], "这次经历让我成长。"),
    scramble(id("w", 96), 96, ["不要", "轻易", "放弃", "机会"], "不要轻易放弃机会。"),
    scramble(id("w", 97), 97, ["合作", "比", "竞争", "更", "重要"], "合作比竞争更重要。"),
    scramble(id("w", 98), 98, ["把", "计划", "告诉", "大家"], "把计划告诉大家。"),
  ]
  const writing2 = [
    essay(id("w", 99), 99, `用“${bank[0].text}、${bank[1].text}”写一段话，不少于 80 字。围绕${p.topic}。`, 80, [bank[0].text, bank[1].text]),
    essay(id("w", 100), 100, `看图写一段故事：一个人在${p.place}处理“${p.issue}”。不少于 80 字。`, 80, [p.place, "问题"]),
  ]

  return paper(5, code, 125, [
    block("listening", "一、听力", "Listening", 30, 45, [
      part("l1", "第一部分", "第 1–20 题：请选出正确答案。", short),
      part("l2", "第二部分", "第 21–45 题：请选出正确答案。", long),
    ]),
    block("reading", "二、阅读", "Reading", 45, 45, [
      part("r1", "第一部分", "第 46–55 题：选词填空。", clozeByVariant[variant]),
      part("r2", "第二部分", "第 56–90 题：请选出正确答案。", passages),
    ]),
    block("writing", "三、书写", "Writing", 40, 10, [
      part("w1", "第一部分", "第 91–98 题：完成句子。", writing1),
      part("w2", "第二部分", "第 99–100 题：写短文。", writing2),
    ]),
  ], [
    "HSK（五级）听力 45 题约 30 分钟，阅读 45 题 45 分钟，书写 10 题 40 分钟。",
    "听力只播放一遍。内容为原创模拟题。",
  ])
}
