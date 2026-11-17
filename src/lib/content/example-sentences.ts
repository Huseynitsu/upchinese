import type { HskLevel, Question, VocabItem } from "../types"
import { HSK3_EXACT } from "./example-hsk3"

export type Example = {
  zh: string
  en: string
  askZh?: string
  askEn?: string
  answerZh?: string
}

const EXACT: Record<string, Example> = {
  爱: { zh: "我爱我的家。", en: "I love my family.", askZh: "你爱你的家吗？", askEn: "Do you love your family?", answerZh: "我爱我的家。" },
  八: { zh: "我有八个苹果。", en: "I have eight apples." },
  爸爸: { zh: "我爸爸是老师。", en: "My dad is a teacher.", askZh: "你爸爸是老师吗？", askEn: "Is your dad a teacher?", answerZh: "我爸爸是老师。" },
  杯子: { zh: "桌子上有一个杯子。", en: "There is a cup on the table." },
  北京: { zh: "我住在北京。", en: "I live in Beijing.", askZh: "你住在北京吗？", askEn: "Do you live in Beijing?", answerZh: "我住在北京。" },
  本: { zh: "我有三本书。", en: "I have three books." },
  不: { zh: "我不是老师。", en: "I am not a teacher." },
  不客气: { zh: "谢谢你。不客气。", en: "Thank you. You're welcome." },
  菜: { zh: "这个菜很好吃。", en: "This dish is delicious.", askZh: "你喜欢中国菜吗？", askEn: "Do you like Chinese food?", answerZh: "我喜欢中国菜。" },
  茶: { zh: "我想喝茶。", en: "I want to drink tea.", askZh: "你喝茶吗？", askEn: "Do you drink tea?", answerZh: "我喝茶。" },
  吃: { zh: "我吃饭。", en: "I eat a meal.", askZh: "你吃饭了吗？", askEn: "Have you eaten?", answerZh: "我吃饭了。" },
  出租车: { zh: "我坐出租车去学校。", en: "I take a taxi to school." },
  打电话: { zh: "我给妈妈打电话。", en: "I call my mom." },
  大: { zh: "这个学校很大。", en: "This school is big." },
  的: { zh: "这是我的书。", en: "This is my book." },
  点: { zh: "现在三点。", en: "It is three o'clock now." },
  电脑: { zh: "我有一台电脑。", en: "I have a computer.", askZh: "你有电脑吗？", askEn: "Do you have a computer?", answerZh: "我有电脑。" },
  电视: { zh: "我晚上看电视。", en: "I watch TV in the evening." },
  电影: { zh: "我喜欢看电影。", en: "I like watching movies.", askZh: "你喜欢看电影吗？", askEn: "Do you like watching movies?", answerZh: "我喜欢看电影。" },
  东西: { zh: "商店里有很多东西。", en: "There are many things in the shop." },
  都: { zh: "我们都是学生。", en: "We are all students." },
  读: { zh: "我每天读书。", en: "I read every day." },
  对不起: { zh: "对不起，我来晚了。", en: "Sorry, I arrived late." },
  多: { zh: "学校里学生很多。", en: "There are many students at school." },
  多少: { zh: "这个多少钱？", en: "How much is this?" },
  儿子: { zh: "他有一个儿子。", en: "He has a son." },
  二: { zh: "我有两个朋友。", en: "I have two friends." },
  饭店: { zh: "我们去饭店吃饭。", en: "We go to a restaurant to eat." },
  飞机: { zh: "我坐飞机去北京。", en: "I take a plane to Beijing." },
  分钟: { zh: "请等五分钟。", en: "Please wait five minutes." },
  高兴: { zh: "今天我很高兴。", en: "I am very happy today.", askZh: "你高兴吗？", askEn: "Are you happy?", answerZh: "我很高兴。" },
  个: { zh: "我有一个苹果。", en: "I have an apple." },
  工作: { zh: "我爸爸在医院工作。", en: "My dad works at a hospital." },
  狗: { zh: "我有一只狗。", en: "I have a dog.", askZh: "你有狗吗？", askEn: "Do you have a dog?", answerZh: "我有一只狗。" },
  汉语: { zh: "我学习汉语。", en: "I study Chinese.", askZh: "你学习汉语吗？", askEn: "Do you study Chinese?", answerZh: "我学习汉语。" },
  好: { zh: "今天天气很好。", en: "The weather is very good today." },
  号: { zh: "今天是五月一号。", en: "Today is May 1st." },
  喝: { zh: "我想喝水。", en: "I want to drink water.", askZh: "你喝水吗？", askEn: "Do you drink water?", answerZh: "我喝水。" },
  和: { zh: "我和妈妈去商店。", en: "Mom and I go to the shop." },
  很: { zh: "这个苹果很好吃。", en: "This apple is delicious." },
  后面: { zh: "学校在商店后面。", en: "The school is behind the shop." },
  回: { zh: "我下午回家。", en: "I go home in the afternoon." },
  会: { zh: "我会说汉语。", en: "I can speak Chinese.", askZh: "你会说汉语吗？", askEn: "Can you speak Chinese?", answerZh: "我会说汉语。" },
  几: { zh: "现在几点？", en: "What time is it now?" },
  家: { zh: "我的家不大。", en: "My home is not big.", askZh: "你家大吗？", askEn: "Is your home big?", answerZh: "我家不大。" },
  叫: { zh: "我叫小明。", en: "My name is Xiaoming.", askZh: "你叫什么名字？", askEn: "What is your name?", answerZh: "我叫小明。" },
  今天: { zh: "今天我去学校。", en: "I go to school today." },
  九: { zh: "现在九点。", en: "It is nine o'clock now." },
  开: { zh: "请开门。", en: "Please open the door." },
  看: { zh: "我喜欢看书。", en: "I like reading books.", askZh: "你喜欢看书吗？", askEn: "Do you like reading?", answerZh: "我喜欢看书。" },
  看见: { zh: "我看见老师了。", en: "I saw the teacher." },
  块: { zh: "这个苹果五块。", en: "This apple is five yuan." },
  来: { zh: "请进来。", en: "Please come in." },
  老师: { zh: "王老师在学校。", en: "Teacher Wang is at school.", askZh: "他是老师吗？", askEn: "Is he a teacher?", answerZh: "他是老师。" },
  了: { zh: "我吃了米饭。", en: "I have eaten the rice." },
  冷: { zh: "今天很冷。", en: "It is very cold today.", askZh: "今天冷吗？", askEn: "Is it cold today?", answerZh: "今天很冷。" },
  里: { zh: "书在包里。", en: "The book is in the bag." },
  六: { zh: "现在六点。", en: "It is six o'clock now." },
  妈妈: { zh: "我妈妈在家。", en: "My mom is at home.", askZh: "你妈妈在家吗？", askEn: "Is your mom at home?", answerZh: "我妈妈在家。" },
  吗: { zh: "你是学生吗？", en: "Are you a student?" },
  买: { zh: "我想买苹果。", en: "I want to buy apples." },
  猫: { zh: "这是一只猫。", en: "This is a cat.", askZh: "你喜欢猫吗？", askEn: "Do you like cats?", answerZh: "我喜欢猫。" },
  没: { zh: "我没有电脑。", en: "I do not have a computer." },
  没关系: { zh: "对不起。没关系。", en: "Sorry. It's all right." },
  米饭: { zh: "我爱吃米饭。", en: "I love eating rice.", askZh: "你吃米饭吗？", askEn: "Do you eat rice?", answerZh: "我吃米饭。" },
  明天: { zh: "明天我去北京。", en: "I will go to Beijing tomorrow." },
  名字: { zh: "你叫什么名字？", en: "What is your name?" },
  哪: { zh: "你是哪国人？", en: "Which country are you from?" },
  哪儿: { zh: "学校在哪儿？", en: "Where is the school?" },
  那: { zh: "那是我的书。", en: "That is my book." },
  呢: { zh: "我很好，你呢？", en: "I am fine, and you?" },
  能: { zh: "我能帮助你。", en: "I can help you." },
  你: { zh: "你是学生。", en: "You are a student." },
  年: { zh: "今年是2026年。", en: "This year is 2026." },
  女儿: { zh: "她有一个女儿。", en: "She has a daughter." },
  朋友: { zh: "他是我的朋友。", en: "He is my friend.", askZh: "他是你的朋友吗？", askEn: "Is he your friend?", answerZh: "他是我的朋友。" },
  漂亮: { zh: "这件衣服很漂亮。", en: "This piece of clothing is pretty." },
  苹果: { zh: "我想吃苹果。", en: "I want to eat an apple.", askZh: "你喜欢吃苹果吗？", askEn: "Do you like apples?", answerZh: "我喜欢吃苹果。" },
  七: { zh: "现在七点。", en: "It is seven o'clock now." },
  钱: { zh: "我没有钱。", en: "I don't have money." },
  前面: { zh: "医院在学校前面。", en: "The hospital is in front of the school." },
  请: { zh: "请坐。", en: "Please sit down." },
  去: { zh: "我去学校。", en: "I go to school.", askZh: "你去学校吗？", askEn: "Are you going to school?", answerZh: "我去学校。" },
  热: { zh: "今天很热。", en: "It is very hot today.", askZh: "今天热吗？", askEn: "Is it hot today?", answerZh: "今天很热。" },
  人: { zh: "家里有三个人。", en: "There are three people at home." },
  认识: { zh: "我认识那个老师。", en: "I know that teacher." },
  三: { zh: "我有三个朋友。", en: "I have three friends." },
  商店: { zh: "我们去商店买东西。", en: "We go to the shop to buy things." },
  上: { zh: "书在桌子上。", en: "The book is on the table." },
  上午: { zh: "上午我去学校。", en: "I go to school in the morning." },
  少: { zh: "我的钱很少。", en: "I have very little money." },
  谁: { zh: "他是谁？", en: "Who is he?" },
  什么: { zh: "这是什么？", en: "What is this?" },
  十: { zh: "现在十点。", en: "It is ten o'clock now." },
  时候: { zh: "现在是什么时候？", en: "What time is it now?" },
  是: { zh: "我是学生。", en: "I am a student.", askZh: "你是学生吗？", askEn: "Are you a student?", answerZh: "我是学生。" },
  书: { zh: "这是一本汉语书。", en: "This is a Chinese book.", askZh: "你有汉语书吗？", askEn: "Do you have a Chinese book?", answerZh: "我有汉语书。" },
  水: { zh: "请喝水。", en: "Please drink some water.", askZh: "你喝水吗？", askEn: "Do you drink water?", answerZh: "我喝水。" },
  水果: { zh: "我爱吃水果。", en: "I love eating fruit." },
  睡觉: { zh: "我晚上十点睡觉。", en: "I go to sleep at ten in the evening." },
  说: { zh: "请说汉语。", en: "Please speak Chinese." },
  四: { zh: "我有四个杯子。", en: "I have four cups." },
  岁: { zh: "我二十岁。", en: "I am twenty years old.", askZh: "你多大了？", askEn: "How old are you?", answerZh: "我二十岁。" },
  他: { zh: "他是我的老师。", en: "He is my teacher." },
  她: { zh: "她是我的同学。", en: "She is my classmate." },
  太: { zh: "这个太贵了。", en: "This is too expensive." },
  天气: { zh: "今天天气很好。", en: "The weather is very good today.", askZh: "今天天气怎么样？", askEn: "How is the weather today?", answerZh: "今天天气很好。" },
  听: { zh: "请听我说。", en: "Please listen to me." },
  同学: { zh: "小明是我的同学。", en: "Xiaoming is my classmate." },
  喂: { zh: "喂，你好！", en: "Hello? Hi!" },
  我: { zh: "我是学生。", en: "I am a student." },
  我们: { zh: "我们去学校。", en: "We go to school." },
  五: { zh: "这个苹果五块。", en: "This apple is five yuan." },
  喜欢: { zh: "我喜欢学汉语。", en: "I like studying Chinese.", askZh: "你喜欢学汉语吗？", askEn: "Do you like studying Chinese?", answerZh: "我喜欢学汉语。" },
  下: { zh: "请坐下。", en: "Please sit down." },
  下午: { zh: "下午我喝茶。", en: "I drink tea in the afternoon." },
  下雨: { zh: "今天下雨。", en: "It is raining today.", askZh: "今天下雨吗？", askEn: "Is it raining today?", answerZh: "今天下雨。" },
  先生: { zh: "王先生是老师。", en: "Mr. Wang is a teacher." },
  现在: { zh: "现在我在家。", en: "I am at home now." },
  想: { zh: "我想喝茶。", en: "I want to drink tea." },
  小: { zh: "我的猫很小。", en: "My cat is very small." },
  小姐: { zh: "李小姐在商店。", en: "Miss Li is at the shop." },
  些: { zh: "我想买一些苹果。", en: "I want to buy some apples." },
  写: { zh: "我写汉字。", en: "I write Chinese characters." },
  谢谢: { zh: "谢谢你帮助我。", en: "Thank you for helping me." },
  星期: { zh: "今天星期一。", en: "Today is Monday." },
  学生: { zh: "我是学生。", en: "I am a student.", askZh: "你是学生吗？", askEn: "Are you a student?", answerZh: "我是学生。" },
  学习: { zh: "我在学校学习汉语。", en: "I study Chinese at school." },
  学校: { zh: "学校很大。", en: "The school is big.", askZh: "学校大吗？", askEn: "Is the school big?", answerZh: "学校很大。" },
  一: { zh: "我有一个朋友。", en: "I have one friend." },
  一点儿: { zh: "请喝一点儿茶。", en: "Please drink a little tea." },
  衣服: { zh: "这件衣服很好看。", en: "This piece of clothing looks nice." },
  医生: { zh: "他是医生。", en: "He is a doctor.", askZh: "他是医生吗？", askEn: "Is he a doctor?", answerZh: "他是医生。" },
  医院: { zh: "妈妈在医院工作。", en: "Mom works at the hospital." },
  椅子: { zh: "请坐这把椅子。", en: "Please sit on this chair." },
  有: { zh: "我有汉语书。", en: "I have a Chinese book.", askZh: "你有汉语书吗？", askEn: "Do you have a Chinese book?", answerZh: "我有汉语书。" },
  月: { zh: "现在是九月。", en: "It is September now." },
  再见: { zh: "明天见，再见！", en: "See you tomorrow, goodbye!" },
  在: { zh: "我在家。", en: "I am at home.", askZh: "你在家吗？", askEn: "Are you at home?", answerZh: "我在家。" },
  怎么: { zh: "这个字怎么写？", en: "How do you write this character?" },
  怎么样: { zh: "今天天气怎么样？", en: "How is the weather today?" },
  这: { zh: "这是我的电脑。", en: "This is my computer." },
  中国: { zh: "我是中国人。", en: "I am Chinese.", askZh: "你是中国人吗？", askEn: "Are you Chinese?", answerZh: "我是中国人。" },
  中午: { zh: "中午我吃饭。", en: "I eat at noon." },
  住: { zh: "我住在北京。", en: "I live in Beijing." },
  桌子: { zh: "杯子在桌子上。", en: "The cup is on the table." },
  字: { zh: "这个字是“人”。", en: 'This character is "person".' },
  昨天: { zh: "昨天我在家。", en: "I was at home yesterday." },
  坐: { zh: "请坐。", en: "Please sit." },
  做: { zh: "我在家做饭。", en: "I cook at home." },

  吧: { zh: "我们走吧。", en: "Let's go." },
  白: { zh: "这件衣服是白色的。", en: "This piece of clothing is white." },
  百: { zh: "这本书一百块。", en: "This book costs one hundred yuan." },
  帮助: { zh: "请帮助我学习汉语。", en: "Please help me study Chinese." },
  报纸: { zh: "爸爸每天看报纸。", en: "Dad reads the newspaper every day." },
  比: { zh: "今天比昨天冷。", en: "Today is colder than yesterday." },
  别: { zh: "请别说话。", en: "Please don't talk." },
  宾馆: { zh: "朋友住在宾馆。", en: "A friend is staying at the hotel." },
  长: { zh: "这条路很长。", en: "This road is very long." },
  唱歌: { zh: "她喜欢唱歌。", en: "She likes singing.", askZh: "你喜欢唱歌吗？", askEn: "Do you like singing?", answerZh: "我喜欢唱歌。" },
  出: { zh: "我从家出来。", en: "I come out of the house." },
  穿: { zh: "今天我穿衣服。", en: "I am wearing clothes today." },
  次: { zh: "我去过北京两次。", en: "I have been to Beijing twice." },
  从: { zh: "我从家去学校。", en: "I go to school from home." },
  错: { zh: "这个问题答错了。", en: "This question was answered wrong." },
  打篮球: { zh: "周末我打篮球。", en: "I play basketball on the weekend." },
  大家: { zh: "大家都来了。", en: "Everyone has arrived." },
  到: { zh: "我到学校了。", en: "I have arrived at school." },
  得: { zh: "他说得很好。", en: "He speaks very well." },
  等: { zh: "请等我一下。", en: "Please wait for me a moment." },
  弟弟: { zh: "我弟弟十岁。", en: "My younger brother is ten." },
  第一: { zh: "他是第一名。", en: "He is first place." },
  懂: { zh: "我懂你的意思。", en: "I understand what you mean." },
  对: { zh: "你说得对。", en: "You are right." },
  房间: { zh: "这个房间很干净。", en: "This room is very clean." },
  非常: { zh: "我非常高兴。", en: "I am extremely happy." },
  服务员: { zh: "服务员，请给我菜单。", en: "Waiter, please give me the menu." },
  高: { zh: "他比我高。", en: "He is taller than me." },
  告诉: { zh: "请告诉我你的名字。", en: "Please tell me your name." },
  哥哥: { zh: "我哥哥在北京工作。", en: "My older brother works in Beijing." },
  给: { zh: "请给我那本书。", en: "Please give me that book." },
  公共汽车: { zh: "我坐公共汽车去公司。", en: "I take the bus to the company." },
  公司: { zh: "我在一家公司工作。", en: "I work at a company." },
  贵: { zh: "这件衣服太贵了。", en: "This piece of clothing is too expensive." },
  过: { zh: "我去过中国。", en: "I have been to China." },
  还: { zh: "我还想喝茶。", en: "I still want to drink tea." },
  孩子: { zh: "那个孩子在看书。", en: "That child is reading." },
  好吃: { zh: "这个菜很好吃。", en: "This dish is delicious.", askZh: "这个菜好吃吗？", askEn: "Is this dish delicious?", answerZh: "这个菜很好吃。" },
  黑: { zh: "他穿着黑色的衣服。", en: "He is wearing black clothes." },
  红: { zh: "我喜欢红色。", en: "I like red." },
  欢迎: { zh: "欢迎来中国。", en: "Welcome to China." },
  回答: { zh: "请回答这个问题。", en: "Please answer this question." },
  机场: { zh: "我们去机场接朋友。", en: "We go to the airport to pick up a friend." },
  鸡蛋: { zh: "早饭我吃鸡蛋。", en: "I eat eggs for breakfast." },
  件: { zh: "我想买一件衣服。", en: "I want to buy a piece of clothing." },
  教室: { zh: "学生在教室里上课。", en: "Students have class in the classroom." },
  姐姐: { zh: "我姐姐是医生。", en: "My older sister is a doctor." },
  介绍: { zh: "请介绍一下你自己。", en: "Please introduce yourself." },
  近: { zh: "商店离学校很近。", en: "The shop is close to the school." },
  进: { zh: "请进教室。", en: "Please enter the classroom." },
  就: { zh: "我吃了饭就去学校。", en: "I go to school right after eating." },
  觉得: { zh: "我觉得汉语很有意思。", en: "I think Chinese is interesting." },
  咖啡: { zh: "早上我想喝咖啡。", en: "I want to drink coffee in the morning.", askZh: "你喝咖啡吗？", askEn: "Do you drink coffee?", answerZh: "我喝咖啡。" },
  开始: { zh: "现在开始上课。", en: "Class is starting now." },
  考试: { zh: "明天有汉语考试。", en: "There is a Chinese exam tomorrow." },
  可能: { zh: "今天可能下雨。", en: "It might rain today." },
  可以: { zh: "我可以坐这儿吗？", en: "May I sit here?" },
  课: { zh: "下午有两节课。", en: "There are two classes in the afternoon." },
  快: { zh: "请说得快一点儿。", en: "Please speak a bit faster." },
  快乐: { zh: "祝你生日快乐！", en: "Happy birthday!" },
  累: { zh: "工作一天，我很累。", en: "After a day of work, I am tired." },
  离: { zh: "我家离学校不远。", en: "My home is not far from school." },
  两: { zh: "我买了两个苹果。", en: "I bought two apples." },
  路: { zh: "这条路去医院。", en: "This road goes to the hospital." },
  旅游: { zh: "我想去北京旅游。", en: "I want to travel to Beijing." },
  卖: { zh: "这家商店卖水果。", en: "This shop sells fruit." },
  慢: { zh: "请说慢一点儿。", en: "Please speak a bit more slowly." },
  忙: { zh: "今天我很忙。", en: "I am very busy today.", askZh: "你忙吗？", askEn: "Are you busy?", answerZh: "我很忙。" },
  每: { zh: "我每天学习汉语。", en: "I study Chinese every day." },
  妹妹: { zh: "我妹妹在上学。", en: "My younger sister is in school." },
  门: { zh: "请关门。", en: "Please close the door." },
  面条: { zh: "中午我想吃面条。", en: "I want to eat noodles at noon.", askZh: "你喜欢吃面条吗？", askEn: "Do you like noodles?", answerZh: "我喜欢吃面条。" },
  男: { zh: "那个男生是我同学。", en: "That boy is my classmate." },
  您: { zh: "您好，请问您贵姓？", en: "Hello, may I ask your surname?" },
  牛奶: { zh: "早上我喝牛奶。", en: "I drink milk in the morning." },
  女: { zh: "那个女生很高兴。", en: "That girl is very happy." },
  旁边: { zh: "银行在学校旁边。", en: "The bank is next to the school." },
  跑步: { zh: "我每天早上跑步。", en: "I run every morning." },
  便宜: { zh: "这些苹果很便宜。", en: "These apples are cheap." },
  票: { zh: "我买了两张电影票。", en: "I bought two movie tickets." },
  妻子: { zh: "他的妻子是老师。", en: "His wife is a teacher." },
  起床: { zh: "我七点起床。", en: "I get up at seven." },
  千: { zh: "这台电脑三千块。", en: "This computer costs three thousand yuan." },
  铅笔: { zh: "请给我一支铅笔。", en: "Please give me a pencil." },
  晴: { zh: "今天天气很晴。", en: "It is sunny today." },
  去年: { zh: "去年我去了中国。", en: "I went to China last year." },
  让: { zh: "老师让我们写汉字。", en: "The teacher had us write characters." },
  日: { zh: "今天是三日。", en: "Today is the 3rd." },
  上班: { zh: "爸爸八点去上班。", en: "Dad goes to work at eight." },
  身体: { zh: "我身体很好。", en: "I am in good health.", askZh: "你身体好吗？", askEn: "Are you in good health?", answerZh: "我身体很好。" },
  生病: { zh: "他生病了，去医院。", en: "He got sick and went to the hospital." },
  生日: { zh: "今天是我的生日。", en: "Today is my birthday." },
  时间: { zh: "我没有时间看电视。", en: "I don't have time to watch TV." },
  事情: { zh: "这件事情很重要。", en: "This matter is very important." },
  手表: { zh: "我的手表在桌子上。", en: "My watch is on the table." },
  手机: { zh: "请给我打手机。", en: "Please call my mobile." },
  说话: { zh: "请不要大声说话。", en: "Please don't speak loudly." },
  送: { zh: "我送朋友去机场。", en: "I see a friend off at the airport." },
  虽然: { zh: "虽然下雨，我还是去学校。", en: "Although it is raining, I still go to school." },
  但是: { zh: "我想去，但是没有时间。", en: "I want to go, but I have no time." },
  它: { zh: "那只猫很可爱，它在睡觉。", en: "That cat is cute; it is sleeping." },
  踢足球: { zh: "周末我们踢足球。", en: "We play football on the weekend." },
  题: { zh: "这道题不难。", en: "This question is not hard." },
  跳舞: { zh: "她晚上喜欢跳舞。", en: "She likes dancing in the evening." },
  外: { zh: "外面在下雨。", en: "It is raining outside." },
  完: { zh: "我写完作业了。", en: "I have finished my homework." },
  玩: { zh: "周末我想出去玩。", en: "I want to go out and play on the weekend." },
  晚上: { zh: "晚上我在家看书。", en: "I read at home in the evening." },
  往: { zh: "一直往前走就到学校。", en: "Go straight ahead and you will reach the school." },
  为什么: { zh: "你为什么学习汉语？", en: "Why do you study Chinese?" },
  问: { zh: "我想问一个问题。", en: "I want to ask a question." },
  问题: { zh: "这个问题很容易。", en: "This question is easy." },
  西瓜: { zh: "夏天我爱吃西瓜。", en: "I love eating watermelon in summer." },
  希望: { zh: "我希望去中国。", en: "I hope to go to China." },
  洗: { zh: "我晚上洗衣服。", en: "I wash clothes in the evening." },
  小时: { zh: "我每天学习两个小时。", en: "I study two hours every day." },
  笑: { zh: "听了这句话，大家都笑了。", en: "After hearing that, everyone laughed." },
  新: { zh: "我买了一件新衣服。", en: "I bought a new piece of clothing." },
  姓: { zh: "我姓王。", en: "My surname is Wang.", askZh: "你姓什么？", askEn: "What is your surname?", answerZh: "我姓王。" },
  休息: { zh: "下午我想休息一下。", en: "I want to rest a bit in the afternoon." },
  雪: { zh: "冬天下雪了。", en: "It snowed in winter." },
  颜色: { zh: "你喜欢什么颜色？", en: "What color do you like?" },
  眼睛: { zh: "她的眼睛很大。", en: "Her eyes are big." },
  羊肉: { zh: "北方人爱吃羊肉。", en: "Northerners love eating mutton." },
  药: { zh: "生病了要吃药。", en: "When you are ill you should take medicine." },
  要: { zh: "我要去商店。", en: "I need to go to the shop." },
  也: { zh: "我也是学生。", en: "I am also a student." },
  一起: { zh: "我们一起去学校。", en: "We go to school together." },
  意思: { zh: "这个词是什么意思？", en: "What does this word mean?" },
  阴: { zh: "今天是阴天。", en: "It is overcast today." },
  因为: { zh: "因为下雨，所以我在家。", en: "Because it is raining, I am at home." },
  所以: { zh: "天气很好，所以我们出去玩。", en: "The weather is nice, so we go out." },
  游泳: { zh: "夏天我喜欢游泳。", en: "I like swimming in summer.", askZh: "你会游泳吗？", askEn: "Can you swim?", answerZh: "我会游泳。" },
  右边: { zh: "医院在学校的右边。", en: "The hospital is to the right of the school." },
  鱼: { zh: "晚饭我们吃鱼。", en: "We eat fish for dinner." },
  远: { zh: "我家离学校很远。", en: "My home is far from school." },
  运动: { zh: "我喜欢运动。", en: "I like sports.", askZh: "你喜欢运动吗？", askEn: "Do you like sports?", answerZh: "我喜欢运动。" },
  再: { zh: "请再说一遍。", en: "Please say it again." },
  早上: { zh: "早上我喝牛奶。", en: "I drink milk in the morning." },
  张: { zh: "请给我一张纸。", en: "Please give me a sheet of paper." },
  找: { zh: "我在找我的手机。", en: "I am looking for my phone." },
  丈夫: { zh: "她的丈夫是医生。", en: "Her husband is a doctor." },
  着: { zh: "他看着窗外。", en: "He is looking out the window." },
  真: { zh: "这道菜真好吃。", en: "This dish is really delicious." },
  正在: { zh: "我正在学习汉语。", en: "I am studying Chinese right now." },
  知道: { zh: "我知道学校在哪儿。", en: "I know where the school is." },
  准备: { zh: "我在准备明天的考试。", en: "I am preparing for tomorrow's exam." },
  走: { zh: "我们走吧。", en: "Let's go." },
  最: { zh: "这是我最喜欢的书。", en: "This is my favorite book." },
  左边: { zh: "商店在银行的左边。", en: "The shop is to the left of the bank." },

  啊: { zh: "今天天气真好啊！", en: "The weather is really nice today!" },
  把: { zh: "请把窗户打开。", en: "Please open the window." },
  被: { zh: "我的包被同学拿走了。", en: "My bag was taken by a classmate." },
  地: { zh: "他高兴地笑了。", en: "He smiled happily." },
  辆: { zh: "门口停着一辆出租车。", en: "A taxi is parked at the door." },
  条: { zh: "这条路很长。", en: "This road is very long." },
  位: { zh: "那位老师是我朋友。", en: "That teacher is my friend." },
  不但: { zh: "他不但会汉语，而且会英语。", en: "He can speak not only Chinese but also English." },
  而且: { zh: "这个办法简单而且有用。", en: "This method is simple and useful." },
  除了: { zh: "除了汉语，我还学英语。", en: "Besides Chinese, I also study English." },
}

function fallbackExample(hanzi: string, english: string, level: HskLevel): Example {
  const gloss = english.toLowerCase()
  if (gloss.includes("particle") || gloss.includes("measure word")) {
    return {
      zh: `请用“${hanzi}”说一句完整的话。`,
      en: `Please make a complete sentence with “${hanzi}”.`,
    }
  }
  if (gloss.startsWith("to ")) {
    const rest = english.replace(/^to /, "")
    if (hanzi.length >= 2) {
      return { zh: `我常常${hanzi}。`, en: `I often ${rest}.` }
    }
    return { zh: `他正在${hanzi}。`, en: `He is ${rest}ing.` }
  }
  if (/(ly|ive|ous|ful|able)\b/.test(gloss) || gloss.split(" ").length === 1) {
    if (level >= 3 && !gloss.startsWith("to ")) {
      return { zh: `这个很${hanzi}。`, en: `This is very ${english}.` }
    }
  }
  if (level <= 2) {
    return { zh: `这是${hanzi}。`, en: `This is ${english}.` }
  }
  if (level <= 4) {
    return { zh: `今天我们用${hanzi}。`, en: `Today we use / talk about ${english}.` }
  }
  return { zh: `这篇文章谈到了${hanzi}。`, en: `This article talks about ${english}.` }
}

export function exampleFor(hanzi: string, english: string, level: HskLevel): Example {
  return EXACT[hanzi] ?? HSK3_EXACT[hanzi] ?? fallbackExample(hanzi, english, level)
}

export function canAskHave(item: VocabItem) {
  const gloss = item.english.toLowerCase()
  if (EXACT[item.hanzi] && !/to |particle|measure|not |how |who|what|where|which/.test(gloss)) {
    return ["dad", "mom", "friend", "book", "computer", "phone", "apple", "cat", "dog", "money", "ticket"].some((word) =>
      gloss.includes(word)
    )
  }
  return (
    !gloss.startsWith("to ") &&
    !gloss.includes("particle") &&
    !gloss.includes("measure") &&
    item.hanzi.length >= 2
  )
}

export function speakingFields(item: VocabItem, variety: number): Pick<
  Question,
  "kind" | "prompt" | "promptZh" | "audioText" | "acceptedAnswers" | "explanation" | "modelAnswer" | "instruction"
> {
  const example = exampleFor(item.hanzi, item.english, item.hskLevel)
  const slot = variety % 4

  if (slot === 1 && example.askZh && example.answerZh) {
    return {
      kind: "speak-answer",
      prompt: `Answer in Chinese: ${example.askEn}`,
      promptZh: example.askZh,
      audioText: example.askZh,
      instruction: `Use a complete sentence. Model: ${example.answerZh}`,
      acceptedAnswers: [example.answerZh, example.zh, item.hanzi],
      modelAnswer: example.answerZh,
      explanation: `${example.askZh} — ${example.askEn} A natural answer is ${example.answerZh} (${example.en}).`,
    }
  }

  if (slot === 2) {
    return {
      kind: "read-aloud",
      prompt: "Listen, then repeat this complete sentence.",
      promptZh: example.zh,
      audioText: example.zh,
      acceptedAnswers: [example.zh, item.hanzi],
      modelAnswer: example.zh,
      explanation: `Repeat: ${example.zh} — ${example.en}`,
    }
  }

  if (slot === 3) {
    return {
      kind: "speak-answer",
      prompt: `Say a complete sentence using “${item.hanzi}” (${item.english}).`,
      promptZh: example.zh,
      audioText: example.zh,
      instruction: "Do not say the word alone. Use the model sentence if you need help.",
      acceptedAnswers: [example.zh, item.hanzi],
      modelAnswer: example.zh,
      explanation: `A complete sentence: ${example.zh} — ${example.en}`,
    }
  }

  return {
    kind: "read-aloud",
    prompt: "Read this complete sentence aloud.",
    promptZh: example.zh,
    audioText: example.zh,
    acceptedAnswers: [example.zh, item.hanzi],
    modelAnswer: example.zh,
    explanation: `Read: ${example.zh} — ${example.en}`,
  }
}

export function listenDialogue(item: VocabItem) {
  if (canAskHave(item)) {
    return {
      audio: `男：你有${item.hanzi}吗？女：有，我很喜欢。`,
      extra: "The man asks if she has it; she says she likes it.",
    }
  }
  return {
    audio: `男：${item.exampleZh}女：对，是这样。`,
    extra: `They talk about this sentence: ${item.exampleZh}`,
  }
}
