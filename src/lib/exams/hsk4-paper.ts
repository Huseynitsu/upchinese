import type { ExamItem, ExamPart, OfficialPaper } from "../types"

function tf(
  n: number,
  audio: ExamItem["audio"],
  stem: string,
  correct: boolean
): ExamItem {
  return {
    id: `h4-l-${n}`,
    number: n,
    format: "true-false",
    audio,
    stem,
    choices: [
      { key: "T", text: "√" },
      { key: "F", text: "×" },
    ],
    correctKey: correct ? "T" : "F",
  }
}

function mcq(
  n: number,
  audio: ExamItem["audio"],
  options: [string, string, string, string],
  correct: "A" | "B" | "C" | "D",
  question?: string
): ExamItem {
  return {
    id: `h4-l-${n}`,
    number: n,
    format: "mcq",
    audio,
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

const listening1: ExamPart = {
  id: "l1",
  titleZh: "第一部分",
  instructionZh: "第 1–10 题：判断对错。",
  exampleZh: "例如：男：下午陪我去邮局寄包裹吧。★ 他打算去邮局。（√）",
  items: [
    tf(1, [{ speaker: "女", text: "地铁还要十五分钟才到。咱们先买杯咖啡吧。" }, { speaker: "男", text: "好，那边人少。" }], "地铁已经到了。", false),
    tf(2, [{ speaker: "男", text: "我不困，今晚继续写报告。" }, { speaker: "女", text: "不行，你得先睡觉，明天再写。" }], "女的让他先休息。", true),
    tf(3, [{ speaker: "女", text: "老板开会时批评了小李，说他最近太粗心。" }], "老板表扬了小李。", false),
    tf(4, [{ speaker: "男", text: "这首歌我第一次听，旋律很熟悉。" }], "他以前听过这首歌。", false),
    tf(5, [{ speaker: "女", text: "设计稿只完成了封面，目录明天再做。" }], "目录还没有做完。", true),
    tf(6, [{ speaker: "男", text: "前台英语说得很流利，比我这个专业的还好。" }], "前台的英语说得不好。", false),
    tf(7, [{ speaker: "女", text: "张医生去年当上了主任，现在更忙了。" }], "张医生现在是主任了。", true),
    tf(8, [{ speaker: "男", text: "办公室太安静了，我想换一个热闹一点儿的位置。" }], "他想找更安静的位置。", false),
    tf(9, [{ speaker: "女", text: "我在超市门口等你，别去错地方。" }], "她在超市。", true),
    tf(10, [{ speaker: "男", text: "这家书店人很少，大家看书都很认真。" }], "书店里非常吵。", false),
  ],
}

const listening2: ExamPart = {
  id: "l2",
  titleZh: "第二部分",
  instructionZh: "第 11–25 题：请选出正确答案。",
  exampleZh: "例如：女：该充电了，附近有插座吗？男：有，你放心。问：男的主要是什么意思？A 没电了 B 快到了 C 电池是满的 D 有插座",
  items: [
    mcq(11, [{ speaker: "女", text: "邮件发不出去。" }, { speaker: "男", text: "网络断了，我去问问前台。" }, { speaker: "问", text: "发生了什么事？" }], ["没纸了", "网络断了", "电脑坏了", "密码错了"], "B"),
    mcq(12, [{ speaker: "男", text: "毕业以后你想做什么？" }, { speaker: "女", text: "我想当护士，一直是这个计划。" }, { speaker: "问", text: "女的想做什么？" }], ["当老师", "当护士", "做生意", "当导游"], "B"),
    mcq(13, [{ speaker: "女", text: "周末去游泳吗？" }, { speaker: "男", text: "泳池人太多，我们跑步吧。" }, { speaker: "问", text: "他们打算做什么？" }], ["游泳", "打球", "跑步", "爬山"], "C"),
    mcq(14, [{ speaker: "男", text: "行李超重了，要再付钱。" }, { speaker: "女", text: "那我把书拿出来一些。" }, { speaker: "问", text: "问题是什么？" }], ["票买错了", "行李超重", "飞机延误", "忘带护照"], "B"),
    mcq(15, [{ speaker: "女", text: "你看起来累了。" }, { speaker: "男", text: "最近加班，睡眠不够。" }, { speaker: "问", text: "男的怎么了？" }], ["在减肥", "睡眠不够", "生病了", "要旅行"], "B"),
    mcq(16, [{ speaker: "男", text: "你妹妹工作了吗？" }, { speaker: "女", text: "还没有，她在实习。" }, { speaker: "问", text: "妹妹现在怎么样？" }], ["已经毕业了", "在实习", "当经理了", "出国了"], "B"),
    mcq(17, [{ speaker: "女", text: "你在楼下做什么？" }, { speaker: "男", text: "等快递，我们一起上楼。" }, { speaker: "问", text: "男的在做什么？" }], ["买菜", "等人", "等快递", "修车"], "C"),
    mcq(18, [{ speaker: "男", text: "他说话很快，可是经常忘带材料。" }, { speaker: "女", text: "就是太马虎了。" }, { speaker: "问", text: "他有什么特点？" }], ["很幽默", "很马虎", "很安静", "很严格"], "B"),
    mcq(19, [{ speaker: "女", text: "这汤太咸了，我喝不了。" }, { speaker: "男", text: "我给你换一份清淡的。" }, { speaker: "问", text: "汤怎么样？" }], ["很甜", "很辣", "很咸", "很酸"], "C"),
    mcq(20, [{ speaker: "男", text: "比赛结束了吗？" }, { speaker: "女", text: "结束了，我们队得了第二名。" }, { speaker: "问", text: "比赛结果如何？" }], ["他们放弃了", "他们得了第二名", "比赛取消了", "他们没参加"], "B"),
    mcq(21, [{ speaker: "女", text: "假期有什么安排？" }, { speaker: "男", text: "我想去海边，顺便看看朋友。" }, { speaker: "问", text: "男的打算做什么？" }], ["学开车", "去海边", "找工作", "搬家"], "B"),
    mcq(22, [{ speaker: "男", text: "你怎么一直打喷嚏？" }, { speaker: "女", text: "可能对花过敏。" }, { speaker: "问", text: "女的怎么了？" }], ["感冒了", "对花过敏", "很饿", "想睡觉"], "B"),
    mcq(23, [{ speaker: "女", text: "申请什么时候交？" }, { speaker: "男", text: "下周一，还有十天。" }, { speaker: "问", text: "申请什么时候交？" }], ["今天", "明天", "下周一", "下个月"], "C"),
    mcq(24, [{ speaker: "男", text: "你是做什么工作的？" }, { speaker: "女", text: "我在博物馆工作，负责讲解。" }, { speaker: "问", text: "女的是做什么的？" }], ["司机", "厨师", "讲解员", "记者"], "C"),
    mcq(25, [{ speaker: "女", text: "这个问题你能再说一遍吗？" }, { speaker: "男", text: "我写在纸上给你，这样更清楚。" }, { speaker: "问", text: "男的是什么意思？" }], ["他不会", "他要写下来", "他要离开", "他很生气"], "B"),
  ],
}

const listening3: ExamPart = {
  id: "l3",
  titleZh: "第三部分",
  instructionZh: "第 26–45 题：请选出正确答案。",
  exampleZh: "例如：较长对话后提问。讨论改到四点。正确答案：C 4:00",
  items: [
    mcq(26, [{ speaker: "男", text: "伞还了吗？" }, { speaker: "女", text: "还了，我刚从办公室回来。" }, { speaker: "男", text: "那我们去食堂吃饭吧。" }, { speaker: "问", text: "女的刚从哪儿回来？" }], ["食堂", "办公室", "图书馆", "车站"], "B"),
    mcq(27, [{ speaker: "女", text: "明天的面试要穿正装吗？" }, { speaker: "男", text: "要，这次很正式。" }, { speaker: "问", text: "面试怎么样？" }], ["很随便", "很正式", "取消了", "在网上"], "B"),
    mcq(28, [{ speaker: "男", text: "路上怎么这么慢？" }, { speaker: "女", text: "前面在修路，大家都绕行。" }, { speaker: "问", text: "路上发生了什么？" }], ["下雨了", "在修路", "撞车了", "停电了"], "B"),
    mcq(29, [{ speaker: "女", text: "我手机打不开了。" }, { speaker: "男", text: "会不会没电了？先充一会儿。" }, { speaker: "问", text: "可能出了什么问题？" }], ["丢了手机", "没电了", "信号不好", "号码错了"], "B"),
    mcq(30, [{ speaker: "男", text: "我们什么时候改计划？" }, { speaker: "女", text: "晚饭以后吧，上午我要开会。" }, { speaker: "问", text: "他们什么时候讨论？" }], ["现在", "午饭时", "晚饭以后", "明天"], "C"),
    mcq(31, [{ speaker: "女", text: "三杯果汁多少钱？" }, { speaker: "男", text: "一杯八元，三杯二十元。" }, { speaker: "问", text: "三杯果汁多少钱？" }], ["八元", "十六元", "二十元", "二十四元"], "C"),
    mcq(32, [{ speaker: "男", text: "你去银行做什么？" }, { speaker: "女", text: "办一张新卡，顺便取一点儿钱。" }, { speaker: "问", text: "女的主要去做什么？" }], ["寄信", "办新卡", "买手机", "交电费"], "B"),
    mcq(33, [{ speaker: "女", text: "眼镜放哪儿了？" }, { speaker: "男", text: "在沙发上的报纸下面。" }, { speaker: "问", text: "他们在找什么？" }], ["钥匙", "报纸", "眼镜", "沙发"], "C"),
    mcq(34, [{ speaker: "男", text: "我们在公交站见吧，商场门口人太多。" }, { speaker: "女", text: "好，我在站牌旁边等你。" }, { speaker: "问", text: "他们在哪儿见面？" }], ["商场", "地铁", "公交站", "公园"], "C"),
    mcq(35, [{ speaker: "女", text: "电梯在哪儿？" }, { speaker: "男", text: "咖啡店旁边，直走就到。" }, { speaker: "问", text: "电梯在什么附近？" }], ["银行", "咖啡店", "出口", "停车场"], "B"),
    mcq(36, [{ speaker: "男", text: "别一直坐在电脑前。" }, { speaker: "女", text: "那我先下楼走走，再回来继续。" }, { speaker: "问", text: "女的先做什么？" }], ["睡觉", "下楼走走", "开会", "做饭"], "B"),
    mcq(37, [{ speaker: "女", text: "压力大的时候你怎么办？" }, { speaker: "男", text: "我听轻音乐。这样很容易放松。" }, { speaker: "问", text: "男的主要想说明什么？" }], ["要多说话", "音乐能放松", "应该加班", "不要听音乐"], "B"),
    mcq(38, [{ speaker: "男", text: "她最近总出差。" }, { speaker: "女", text: "是啊，项目进入关键阶段了。" }, { speaker: "问", text: "可以知道她怎么样？" }], ["在放假", "项目很关键", "已经辞职", "在学习开车"], "B"),
    mcq(39, [{ speaker: "女", text: "教练让他少吃甜食。" }, { speaker: "男", text: "他还说以后每天跑步。" }, { speaker: "问", text: "教练让他不要做什么？" }], ["跑步", "吃甜食", "睡觉", "喝水"], "B"),
    mcq(40, [{ speaker: "男", text: "谁来开会场？" }, { speaker: "女", text: "活动结束后，保安在门口等。" }, { speaker: "问", text: "谁在门口等？" }], ["老师", "保安", "学生", "司机"], "B"),
    mcq(41, [{ speaker: "女", text: "这条河治理以后变清了，两岸也种了树。" }, { speaker: "男", text: "周末散步方便多了。" }, { speaker: "问", text: "关于这条河，可以知道什么？" }], ["变清了", "不能靠近", "没有树", "还在施工"], "A"),
    mcq(42, [{ speaker: "男", text: "我没看成那场话剧，有点可惜。" }, { speaker: "女", text: "别难过，下个月还有一场。" }, { speaker: "问", text: "男的现在什么心情？" }], ["兴奋", "可惜", "生气", "害怕"], "B"),
    mcq(43, [{ speaker: "女", text: "听说他换了工作，还搬到郊区了。" }, { speaker: "男", text: "对，他在研究所，环境更安静。" }, { speaker: "问", text: "关于他，哪项正确？" }], ["还在市中心", "在研究所工作", "没有搬家", "失业了"], "B"),
    mcq(44, [{ speaker: "男", text: "会议名单放哪儿？" }, { speaker: "女", text: "在三楼打印机旁边，别拿到仓库去。" }, { speaker: "问", text: "名单在哪儿？" }], ["仓库", "一楼", "打印机旁边", "门口"], "C"),
    mcq(45, [{ speaker: "女", text: "今晚有空吗？一起看电影。" }, { speaker: "男", text: "我要准备明天的发言，你们先看吧。" }, { speaker: "问", text: "男的今晚做什么？" }], ["看电影", "准备发言", "出差", "开会"], "B"),
  ],
}

function cloze(
  n: number,
  sentence: string,
  bank: { key: string; text: string }[],
  correct: string
): ExamItem {
  return {
    id: `h4-r-${n}`,
    number: n,
    format: "cloze",
    stem: sentence,
    wordBank: bank,
    correctKey: correct,
  }
}

const bankA = [
  { key: "A", text: "积累" },
  { key: "B", text: "预约" },
  { key: "C", text: "春节" },
  { key: "D", text: "保持" },
  { key: "E", text: "收拾" },
  { key: "F", text: "通知" },
]

const bankB = [
  { key: "A", text: "总结" },
  { key: "B", text: "送" },
  { key: "C", text: "湿度" },
  { key: "D", text: "排队" },
  { key: "E", text: "赶得上" },
  { key: "F", text: "也许" },
]

const reading1: ExamPart = {
  id: "r1",
  titleZh: "第一部分",
  instructionZh: "第 46–55 题：选词填空。",
  items: [
    cloze(46, "虽然现在离（ ）还有两个月，可是车站的人已经多起来了。", bankA, "C"),
    cloze(47, "想把汉语说好，就要每天（ ）一些常用的句子。", bankA, "A"),
    cloze(48, "参观需要提前（ ），当天直接去可能进不去。", bankA, "B"),
    cloze(49, "请帮我（ ）一下客厅，客人马上到。", bankA, "E"),
    cloze(50, "会议改到周五了，你记得（ ）全组的人。", bankA, "F"),
    cloze(51, "A：这些数据对吧？ B：我核对过了，（ ）没有问题。", bankB, "F"),
    cloze(52, "A：培训怎么样？ B：不错，大家（ ）了不少经验。", bankB, "A"),
    cloze(53, "A：为什么还没轮到我们？ B：前面的人太多，得（ ）。", bankB, "D"),
    cloze(54, "A：快一点，电影七点开始。 B：现在六点四十，（ ）。", bankB, "E"),
    cloze(55, "A：我（ ）你去机场吧，路上还能聊聊。 B：太好了。", bankB, "B"),
  ],
}

function order(n: number, segs: [string, string, string], correct: string): ExamItem {
  return {
    id: `h4-r-${n}`,
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

const reading2: ExamPart = {
  id: "r2",
  titleZh: "第二部分",
  instructionZh: "第 56–65 题：排列顺序。",
  exampleZh: "例如：A 可是今天起晚了 B 平时我坐地铁上班 C 所以就打车来公司  → B A C",
  items: [
    order(56, ["她很快就成了我们组的核心", "因为她做事认真、也愿意帮助别人", "小周刚来公司的时候谁也不认识"], "CBA"),
    order(57, ["它还代表着一种生活方式", "咖啡不只是一种饮料", "在很多城市的街上都能看到咖啡馆"], "BCA"),
    order(58, ["可惜颜色没有我喜欢的", "周末我和同学去买运动鞋", "我看中了一双很轻的"], "BAC"),
    order(59, ["就能大概了解一个人的习惯", "因为作息往往和性格有关", "观察他几点睡觉、几点起床"], "CBA"),
    order(60, ["所以后来又去了两次", "我第一次去那个小镇是出差", "对那里的老街特别感兴趣"], "BAC"),
    order(61, ["不同地区的人说话也不完全一样", "中国很大", "普通话让大家更容易交流"], "BAC"),
    order(62, ["还是从使用时间上看", "无论从价格方面看", "这台电脑都比较合适"], "BAC"),
    order(63, ["晚上会发出淡淡的光", "这种植物白天看起来很普通", "所以有人叫它“夜灯草”"], "BAC"),
    order(64, ["是一次失败让他开始改变方法", "他现在的演讲很受欢迎", "以前他一上台就紧张"], "BCA"),
    order(65, ["我们仍然经常一起讨论问题", "虽然已经不在同一个城市", "他是我研究生时的同学"], "CBA"),
  ],
}

function readMcq(
  n: number,
  stem: string,
  question: string,
  options: [string, string, string, string],
  correct: "A" | "B" | "C" | "D"
): ExamItem {
  return {
    id: `h4-r-${n}`,
    number: n,
    format: "mcq",
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

const reading3: ExamPart = {
  id: "r3",
  titleZh: "第三部分",
  instructionZh: "第 66–85 题：请选出正确答案。",
  items: [
    readMcq(66, "以前姐姐总说我个子矮。现在我一米七八，已经比她高了，她反而羡慕我。", "根据这段话，现在：", ["姐姐更高", "我比姐姐高", "他们一样高", "我还没长高"], "B"),
    readMcq(67, "我是昨天到上海的。本来想去博物馆，可是客户会议排得很满，恐怕只能下次再去。", "我最可能来上海：", ["旅游", "看病", "出差", "探亲"], "C"),
    readMcq(68, "城市里的树能降低噪音、净化空气。多种树，少开车，对每个人都有好处。", "多种树主要是为了：", ["装饰街道", "改善环境", "增加门票", "减少商店"], "B"),
    readMcq(69, "有的体育馆不让观众自带饮料，人们只能买里面的。不少人觉得贵，因为价格大约是外面的两倍。", "观众对什么不满意？", ["比赛结果", "座位太远", "饮料太贵", "开门太晚"], "C"),
    readMcq(70, "现在很多人用手机发消息，手写明信片的人少了。不过过年时，仍有人喜欢寄一张纸质贺卡。", "过年时有人仍然：", ["不联系朋友", "寄贺卡", "只用电子邮件", "不去旅行"], "B"),
    readMcq(71, "黄河是中国北方重要的河流，从高原流向东部，沿途经过多个省区。", "黄河：", ["只在南方", "流向东部", "没有经过省区", "比所有河都短"], "B"),
    readMcq(72, "如果学生对课堂内容感到好奇，他会主动提问，学习效果也会更好。", "为了提高效果，应该让学生：", ["少提问", "产生好奇", "只听不写", "提前离开"], "B"),
    readMcq(73, "有时候我们需要礼貌地拒绝。直接说“不”可能伤害对方，可以先感谢，再说明原因。", "这段话主要说怎样：", ["拒绝别人", "借钱", "旅行", "写报告"], "A"),
    readMcq(74, "过去日记锁在本子里。现在不少人把每天的记录发到社交软件上，希望得到回复。", "现在许多人写日记：", ["不给别人看", "希望有人回复", "只写一个字", "改成写信"], "B"),
    readMcq(75, "一个不爱说话的人，不一定没有朋友。但一个会倾听的人，常常让人觉得安心。", "会倾听的人：", ["更冷淡", "让人安心", "没有朋友", "只喜欢辩论"], "B"),
    readMcq(76, "怎样才能更快适应新环境？如果语言已经有基础，那么多和当地人交流是很好的办法。", "适应当地生活应该：", ["少出门", "多交流", "不学语言", "只看电视"], "B"),
    readMcq(77, "我回到家才发现客厅灯都开着，桌上还有蛋糕。原来同事们提前过来给我过生日。", "根据这段话，可以知道我：", ["忘了关灯", "不知道今天过生日", "自己买了蛋糕", "同事没来"], "B"),
    readMcq(78, "我对这份工作比较满意：专业对口，同事愿意帮忙，加班也不太多。", "根据这段话，可以知道我：", ["经常加班", "专业对口", "准备辞职", "没有同事"], "B"),
    readMcq(79, "自行车、地铁和共享汽车让城市出行更灵活。选择合适的方式，既能省时间，也能少花钱。", "这段话主要谈：", ["饮食习惯", "出行方式", "住房价格", "学校教育"], "B"),
    readMcq(80, "花园里举行小型音乐会。小鸟负责报幕，松鼠搬椅子，兔子说：“我来发节目单。”狐狸说：“我来维持秩序。”", "谁负责发节目单？", ["小鸟", "松鼠", "兔子", "狐狸"], "C"),
    readMcq(81, "花园里举行小型音乐会。小鸟负责报幕，松鼠搬椅子，兔子说：“我来发节目单。”狐狸说：“我来维持秩序。”", "狐狸负责：", ["唱歌", "维持秩序", "搬椅子", "报幕"], "B"),
    readMcq(82, "可靠的同事会在截止日期前提醒你；在你出错时一起找办法，而不是只批评。", "根据这段话，这样的同事可以帮你：", ["逃避工作", "解决问题", "取消会议", "换专业"], "B"),
    readMcq(83, "可靠的同事会在截止日期前提醒你；在你出错时一起找办法，而不是只批评。", "这段话主要介绍的是：", ["旅游", "合作态度", "饮食", "天气"], "B"),
    readMcq(84, "山区和海边的天气常常不同。当山里开始下雪的时候，海边可能还比较暖和。", "山里下雪的时候，海边：", ["一定更冷", "可能仍较暖", "也会立刻下雪", "没有季节"], "B"),
    readMcq(85, "山区和海边的天气常常不同。当海边风力变大的时候，山里却可能十分平静。", "关于两地天气，可以知道：", ["总是一样", "常常不同", "海边从不下雪", "山里没有风"], "B"),
  ],
}

function scramble(n: number, words: string[], sentence: string): ExamItem {
  return {
    id: `h4-w-${n}`,
    number: n,
    format: "scramble",
    scramble: words,
    correctKey: sentence,
    acceptedAnswers: [sentence, sentence.replace(/。/g, "").replace(/？/g, "")],
  }
}

const writing1: ExamPart = {
  id: "w1",
  titleZh: "第一部分",
  instructionZh: "第 86–95 题：完成句子。",
  exampleZh: "例如：那座楼 50年的 历史 有 了 → 那座楼有50年的历史了。",
  items: [
    scramble(86, ["新闻", "喜欢", "晚上", "他", "看"], "他喜欢晚上看新闻。"),
    scramble(87, ["有用", "这个办法", "对", "学习", "很"], "这个办法对学习很有用。"),
    scramble(88, ["更", "北方", "的", "干燥", "冬天"], "北方的冬天更干燥。"),
    scramble(89, ["自己的", "每家商店", "活动", "都", "有"], "每家商店都有自己的活动。"),
    scramble(90, ["学校", "机会", "安排了", "一次", "参观的"], "学校安排了一次参观的机会。"),
    scramble(91, ["听懂", "能", "她", "中文", "广播"], "她能听懂中文广播。"),
    scramble(92, ["服务", "的", "怎么样", "这家", "餐厅"], "这家餐厅的服务怎么样？"),
    scramble(93, ["标题", "那篇文章", "的", "十分", "清楚"], "那篇文章的标题十分清楚。"),
    scramble(94, ["变化", "注意到", "你", "这两周天气的", "吗", "了"], "你注意到这两周天气的变化了吗？"),
    scramble(95, ["符合", "完全", "这个计划", "不", "实际"], "这个计划完全不符合实际。"),
  ],
}

function picSent(n: number, keyword: string, picture: string, sample: string): ExamItem {
  return {
    id: `h4-w-${n}`,
    number: n,
    format: "picture-sentence",
    keyword,
    picture,
    minChars: 6,
    correctKey: sample,
    keywords: [keyword],
  }
}

const writing2: ExamPart = {
  id: "w2",
  titleZh: "第二部分",
  instructionZh: "第 96–100 题：看图，用词造句。",
  items: [
    picSent(96, "选", "👕🛍️", "她在商店选衣服。"),
    picSent(97, "安静", "📚🤫", "图书馆里很安静。"),
    picSent(98, "迟到", "⏰🏃", "他跑步去公司，因为快迟到了。"),
    picSent(99, "干净", "🪟✨", "窗户擦完以后很干净。"),
    picSent(100, "接", "✈️👨", "他去机场接朋友。"),
  ],
}

export const HSK4_PAPER: OfficialPaper = {
  code: "H40001",
  hskLevel: 4,
  titleZh: "新汉语水平考试",
  titleEn: "HSK (Level 4) Simulated Paper",
  totalMin: 105,
  passPercent: 60,
  notes: [
    "HSK（四级）分三部分：1. 听力（45题，约30分钟）2. 阅读（40题，40分钟）3. 书写（15题，25分钟）。",
    "听力结束后，有 5 分钟填写答案。",
    "全部考试约 105 分钟（含填写个人信息时间 5 分钟）。",
    "听力由系统男/女声朗读，格式对齐官方试卷，内容为原创模拟题。",
  ],
  blocks: [
    {
      skill: "listening",
      titleZh: "一、听力",
      titleEn: "Listening",
      timeMin: 30,
      itemCount: 45,
      parts: [listening1, listening2, listening3],
    },
    {
      skill: "reading",
      titleZh: "二、阅读",
      titleEn: "Reading",
      timeMin: 40,
      itemCount: 40,
      parts: [reading1, reading2, reading3],
    },
    {
      skill: "writing",
      titleZh: "三、书写",
      titleEn: "Writing",
      timeMin: 25,
      itemCount: 15,
      parts: [writing1, writing2],
    },
  ],
}
