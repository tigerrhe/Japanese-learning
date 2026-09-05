import type { Example } from './types'

export interface VocabItem {
  id: string
  word: string
  reading: string
  zh: string
}

export interface GrammarPoint {
  id: string
  title: string
  explanation: string
  examples: Example[]
  linkedStarNodeIds?: string[]
}

export interface LessonNote {
  id: string
  title: string
  content: string
}

export interface Lesson {
  number: number
  title: string
  summary: string
  vocab: VocabItem[]
  grammar: GrammarPoint[]
  notes: LessonNote[]
}

export const lessons: Lesson[] = [
  {
    number: 1,
    title: '自我介绍 · 这是什么',
    summary: '名词判断句「AはBです」、指示代词これ/それ/あれ、疑问句と回答',
    vocab: [
      { id: 'l1-v1', word: 'わたし', reading: 'わたし', zh: '我' },
      { id: 'l1-v2', word: 'あなた', reading: 'あなた', zh: '你' },
      { id: 'l1-v3', word: '先生', reading: 'せんせい', zh: '老师' },
      { id: 'l1-v4', word: '学生', reading: 'がくせい', zh: '学生' },
      { id: 'l1-v5', word: '会社員', reading: 'かいしゃいん', zh: '公司职员' },
      { id: 'l1-v6', word: 'これ', reading: 'これ', zh: '这个（近称）' },
      { id: 'l1-v7', word: 'それ', reading: 'それ', zh: '那个（中称，离对方近）' },
      { id: 'l1-v8', word: 'あれ', reading: 'あれ', zh: '那个（远称，双方都远）' },
      { id: 'l1-v9', word: '本', reading: 'ほん', zh: '书' },
      { id: 'l1-v10', word: '何', reading: 'なん / なに', zh: '什么' },
      { id: 'l1-v11', word: 'そうです', reading: 'そうです', zh: '是的（附和判断句）' },
    ],
    grammar: [
      {
        id: 'l1-g1',
        title: 'AはBです（判断句）',
        explanation: '「は」在这里读作 wa，是提出话题的助词，不是标点符号。整个句型表示"A是B"。',
        examples: [
          { jp: '私は学生です。', reading: 'わたしはがくせいです。', zh: '我是学生。' },
          { jp: '田中さんは先生です。', reading: 'たなかさんはせんせいです。', zh: '田中先生是老师。' },
        ],
        linkedStarNodeIds: ['p-ha'],
      },
      {
        id: 'l1-g2',
        title: 'AはBですか（疑问句）',
        explanation: '句末加「か」变成疑问句，语调上扬。回答用「はい、そうです」或「いいえ、そうじゃありません」。',
        examples: [
          { jp: '田中さんは学生ですか。', reading: 'たなかさんはがくせいですか。', zh: '田中先生是学生吗？' },
          { jp: 'はい、そうです。', reading: 'はい、そうです。', zh: '是的，是这样。' },
        ],
        linkedStarNodeIds: ['p-ka'],
      },
      {
        id: 'l1-g3',
        title: 'これ/それ/あれ',
        explanation: '指示事物的代词，只能指物不能指人。これ指离说话人近的东西，それ指离听话人近的东西，あれ指双方都远的东西。',
        examples: [
          { jp: 'これは本です。', reading: 'これはほんです。', zh: '这是书。' },
          { jp: 'それは辞書ですか。', reading: 'それはじしょですか。', zh: '那是词典吗？' },
        ],
      },
      {
        id: 'l1-g4',
        title: 'Aも（追加）',
        explanation: '「も」表示"也"，替换掉前面的は/が/を使用，不能和它们叠加。',
        examples: [{ jp: '私も学生です。', reading: 'わたしもがくせいです。', zh: '我也是学生。' }],
        linkedStarNodeIds: ['p-mo'],
      },
    ],
    notes: [
      {
        id: 'l1-n1',
        title: 'これ/それ/あれ 不能指人',
        content: '介绍人的时候不能说「これは田中さんです」，要用「こちら」或直接说姓名。这是中国学习者最常见的错误之一，第3课会详细学こちら的用法。',
      },
      {
        id: 'l1-n2',
        title: '绝对不能对自己的名字加さん',
        content: '「さん」是对别人的尊称，介绍自己时只能说「私は田中です」，不能说「私は田中さんです」——这个错误几乎每个初学者都会犯一次。',
      },
      {
        id: 'l1-n3',
        title: '「は」读作 wa',
        content: '作为助词使用时，「は」不读 ha 而读 wa，这是日语里少数"写法和读法不一致"的助词之一（て、へ也有类似现象）。',
      },
    ],
  },
  {
    number: 2,
    title: '指示连体词 · 所属',
    summary: 'この/その/あの+名词、名词の名词（所属/材料）、そうです/ちがいます',
    vocab: [
      { id: 'l2-v1', word: '辞書', reading: 'じしょ', zh: '词典' },
      { id: 'l2-v2', word: '雑誌', reading: 'ざっし', zh: '杂志' },
      { id: 'l2-v3', word: '新聞', reading: 'しんぶん', zh: '报纸' },
      { id: 'l2-v4', word: '傘', reading: 'かさ', zh: '伞' },
      { id: 'l2-v5', word: '鞄', reading: 'かばん', zh: '包' },
      { id: 'l2-v6', word: '机', reading: 'つくえ', zh: '桌子' },
      { id: 'l2-v7', word: '椅子', reading: 'いす', zh: '椅子' },
      { id: 'l2-v8', word: 'チョコレート', reading: 'ちょこれーと', zh: '巧克力' },
      { id: 'l2-v9', word: 'いくら', reading: 'いくら', zh: '多少钱' },
      { id: 'l2-v10', word: '～円', reading: '～えん', zh: '……日元' },
      { id: 'l2-v11', word: '方', reading: 'かた', zh: '位（人的敬称）' },
    ],
    grammar: [
      {
        id: 'l2-g1',
        title: 'この/その/あの + 名词',
        explanation: '和これ/それ/あれ不同，この/その/あの后面必须接名词，不能单独当主语使用。',
        examples: [
          { jp: 'この本は私のです。', reading: 'このほんはわたしのです。', zh: '这本书是我的。' },
          { jp: 'その傘は田中さんのです。', reading: 'そのかさはたなかさんのです。', zh: '那把伞是田中先生的。' },
        ],
      },
      {
        id: 'l2-g2',
        title: '名词の名词（所属/所有者/材料）',
        explanation: '「の」连接两个名词，表示所属、制作者或材料等关系，相当于中文的"的"，但日语里几乎不能省略。',
        examples: [
          { jp: 'これは私の本です。', reading: 'これはわたしのほんです。', zh: '这是我的书。' },
          { jp: 'それは日本語の雑誌です。', reading: 'それはにほんごのざっしです。', zh: '那是日语杂志。' },
        ],
        linkedStarNodeIds: ['p-no'],
      },
      {
        id: 'l2-g3',
        title: 'そうです / ちがいます',
        explanation: '用来附和或否定对方的判断句。「そうです」＝是这样，「ちがいます」＝不是（不对）。只能用于判断句的回答，不能用来回答所有问题。',
        examples: [{ jp: 'いいえ、ちがいます。', reading: 'いいえ、ちがいます。', zh: '不，不是的。' }],
      },
      {
        id: 'l2-g4',
        title: '～も～も（both...and...）',
        explanation: '两个「も」连用，表示"……也……也……"，强调两者都符合。',
        examples: [{ jp: '傘も鞄も私のです。', reading: 'かさもかばんもわたしのです。', zh: '伞和包都是我的。' }],
      },
    ],
    notes: [
      {
        id: 'l2-n1',
        title: 'この/その/あの 后面必须跟名词',
        content: '中国学习者容易把「この本」说成「これ本」，记住これ/それ/あれ可以单独做主语，この/その/あの必须像形容词一样修饰名词。',
      },
      {
        id: 'l2-n2',
        title: '「の」不能省略',
        content: '中文说"我书"不太自然但能懂，日语「私本」是绝对错误的语法，必须说「私の本」。の在这里相当于英语的 \'s 或 of。',
      },
      {
        id: 'l2-n3',
        title: 'そうです 的适用范围',
        content: '「そうです」只能回应判断句（AはBです型），不能用来回答"你喜欢什么"这类特殊疑问句，很多学习者会误用。',
      },
    ],
  },
  {
    number: 3,
    title: '场所与方向 · こちら系',
    summary: 'ここ/そこ/あそこ、こちら/そちら/あちら（礼貌形式+指人方向）、所属机构表达',
    vocab: [
      { id: 'l3-v1', word: 'ここ', reading: 'ここ', zh: '这里' },
      { id: 'l3-v2', word: 'そこ', reading: 'そこ', zh: '那里（近听话人）' },
      { id: 'l3-v3', word: 'あそこ', reading: 'あそこ', zh: '那里（双方都远）' },
      { id: 'l3-v4', word: '教室', reading: 'きょうしつ', zh: '教室' },
      { id: 'l3-v5', word: '事務所', reading: 'じむしょ', zh: '办公室' },
      { id: 'l3-v6', word: '食堂', reading: 'しょくどう', zh: '食堂' },
      { id: 'l3-v7', word: 'エレベーター', reading: 'えれべーたー', zh: '电梯' },
      { id: 'l3-v8', word: 'お手洗い', reading: 'おてあらい', zh: '洗手间' },
      { id: 'l3-v9', word: '～階', reading: '～かい', zh: '……楼' },
      { id: 'l3-v10', word: '電話番号', reading: 'でんわばんごう', zh: '电话号码' },
    ],
    grammar: [
      {
        id: 'l3-g1',
        title: 'ここ/そこ/あそこ（场所指示代词）',
        explanation: 'これ/それ/あれ 的场所版本，规则完全一致：ここ离说话人近，そこ离听话人近，あそこ双方都远。',
        examples: [{ jp: '教室はあそこです。', reading: 'きょうしつはあそこです。', zh: '教室在那边。' }],
      },
      {
        id: 'l3-g2',
        title: 'こちら/そちら/あちら',
        explanation: 'ここ/そこ/あそこ 的礼貌说法，也可以用来指代方向，介绍人的时候用「こちら」代替直呼其名，更礼貌。',
        examples: [
          { jp: 'お手洗いはあちらです。', reading: 'おてあらいはあちらです。', zh: '洗手间在那边。' },
          { jp: 'こちらは田中さんです。', reading: 'こちらはたなかさんです。', zh: '这位是田中先生。' },
        ],
      },
      {
        id: 'l3-g3',
        title: '～の～です（所属机构）',
        explanation: '用「组织名+の+人」的结构说明某人属于哪个机构，相当于"……的人"。',
        examples: [{ jp: '私はABC会社の者です。', reading: 'わたしはABCがいしゃのものです。', zh: '我是ABC公司的人。' }],
        linkedStarNodeIds: ['p-no'],
      },
      {
        id: 'l3-g4',
        title: '何階ですか / 何番ですか',
        explanation: '用疑问词「何」加量词构成"第几楼/几号"的提问句型。',
        examples: [{ jp: '事務所は何階ですか。', reading: 'じむしょはなんがいですか。', zh: '办公室在几楼？' }],
      },
    ],
    notes: [
      {
        id: 'l3-n1',
        title: 'こちら 比 ここ 更礼貌',
        content: '对客户、长辈说话时优先用こちら/そちら/あちら，ここ/そこ/あそこ更随意，用于朋友或熟人之间。',
      },
      {
        id: 'l3-n2',
        title: '介绍人只能用こちら，不能用ここ',
        content: '「こちらは田中さんです」正确，但ここ/そこ/あそこ不能指人，因此不存在「ここは田中さんです」这种用法。',
      },
      {
        id: 'l3-n3',
        title: '电话号码要一个一个读',
        content: '日语读电话号码时数字要逐个念出（例如 090-1234 读作 ぜろきゅうぜろの いち に さん よん），数字"0"通常读作「ゼロ」，也可读作「まる」。',
      },
    ],
  },
  {
    number: 4,
    title: '时间 · 动词ます形入门',
    summary: '今何時ですか、动词ます形四种变化、～から～まで、と（并列）',
    vocab: [
      { id: 'l4-v1', word: '起きます', reading: 'おきます', zh: '起床' },
      { id: 'l4-v2', word: '寝ます', reading: 'ねます', zh: '睡觉' },
      { id: 'l4-v3', word: '勉強します', reading: 'べんきょうします', zh: '学习' },
      { id: 'l4-v4', word: '働きます', reading: 'はたらきます', zh: '工作' },
      { id: 'l4-v5', word: '休みます', reading: 'やすみます', zh: '休息，请假' },
      { id: 'l4-v6', word: '～時', reading: '～じ', zh: '……点' },
      { id: 'l4-v7', word: '～分', reading: '～ふん / ぷん', zh: '……分' },
      { id: 'l4-v8', word: '午前 / 午後', reading: 'ごぜん / ごご', zh: '上午 / 下午' },
      { id: 'l4-v9', word: '毎日', reading: 'まいにち', zh: '每天' },
      { id: 'l4-v10', word: '～曜日', reading: '～ようび', zh: '星期……' },
    ],
    grammar: [
      {
        id: 'l4-g1',
        title: '今何時ですか',
        explanation: '询问现在几点，回答格式为「～時～分です」。注意4時（よじ）、7時（しちじ）、9時（くじ）等特殊读音。',
        examples: [{ jp: '今何時ですか。九時半です。', reading: 'いまなんじですか。くじはんです。', zh: '现在几点？九点半。' }],
      },
      {
        id: 'l4-g2',
        title: '动词ます形（现在时/将来时）',
        explanation: '日语动词礼貌体有四种基本变化：肯定「ます」、否定「ません」、过去「ました」、过去否定「ませんでした」。ます形同时可以表示"现在的习惯"和"将来要做的事"。',
        examples: [
          { jp: '毎日六時に起きます。', reading: 'まいにちろくじにおきます。', zh: '每天六点起床。' },
          { jp: '昨日は勉強しませんでした。', reading: 'きのうはべんきょうしませんでした。', zh: '昨天没有学习。' },
        ],
      },
      {
        id: 'l4-g3',
        title: '～から～まで',
        explanation: '表示时间或场所的起点到终点，"从……到……"。',
        examples: [{ jp: '九時から五時まで働きます。', reading: 'くじからごじまではたらきます。', zh: '从九点工作到五点。' }],
        linkedStarNodeIds: ['p-kara', 'p-made'],
      },
      {
        id: 'l4-g4',
        title: '名词と名词（并列）',
        explanation: '用「と」连接两个或多个名词，表示完整列举，穷举所有提到的事物。',
        examples: [{ jp: '土曜日と日曜日は休みです。', reading: 'どようびとにちようびはやすみです。', zh: '星期六和星期日休息。' }],
        linkedStarNodeIds: ['p-to'],
      },
    ],
    notes: [
      {
        id: 'l4-n1',
        title: 'ます形也能表示"将来"',
        content: '中文思维里"现在时"只表示当下，但日语的ます形（非过去形）同时覆盖"习惯动作"和"未来会发生的事"，比如「明日、勉強します」是"明天要学习"，不是语法错误。',
      },
      {
        id: 'l4-n2',
        title: '相对时间词后面不加に',
        content: '「今日」「明日」「今」等相对时间词后面通常不加「に」：要说「明日行きます」，不能说「明日に行きます」。具体几点、星期几这类"绝对时间点"才加に（这个规则会在后面的课里系统学习）。',
      },
      {
        id: 'l4-n3',
        title: '特殊读音的数字要单独记',
        content: '４時（よじ，不是よんじ）、７時（しちじ）、９時（くじ，不是きゅうじ）这几个读音不规则，需要单独背下来，是初学者最容易读错的地方。',
      },
    ],
  },
  {
    number: 5,
    title: '移动动词 · 邀请句型',
    summary: '行きます/来ます/帰ります+へ、交通手段で、～ませんか/～ましょう',
    vocab: [
      { id: 'l5-v1', word: '行きます', reading: 'いきます', zh: '去' },
      { id: 'l5-v2', word: '来ます', reading: 'きます', zh: '来' },
      { id: 'l5-v3', word: '帰ります', reading: 'かえります', zh: '回去' },
      { id: 'l5-v4', word: '飛行機', reading: 'ひこうき', zh: '飞机' },
      { id: 'l5-v5', word: '電車', reading: 'でんしゃ', zh: '电车' },
      { id: 'l5-v6', word: '地下鉄', reading: 'ちかてつ', zh: '地铁' },
      { id: 'l5-v7', word: '歩いて', reading: 'あるいて', zh: '走着，步行' },
      { id: 'l5-v8', word: '一人で', reading: 'ひとりで', zh: '一个人' },
      { id: 'l5-v9', word: '友達', reading: 'ともだち', zh: '朋友' },
      { id: 'l5-v10', word: '一緒に', reading: 'いっしょに', zh: '一起' },
    ],
    grammar: [
      {
        id: 'l5-g1',
        title: '行きます/来ます/帰ります + へ',
        explanation: '移动动词后接「へ」表示移动的方向或目的地，初学阶段可以和「に」互换使用。',
        examples: [{ jp: '来週、日本へ行きます。', reading: 'らいしゅう、にほんへいきます。', zh: '下周去日本。' }],
        linkedStarNodeIds: ['p-e', 'p-ni'],
      },
      {
        id: 'l5-g2',
        title: '交通手段＋で',
        explanation: '「で」在这里表示使用的交通工具/手段，"坐……"、"用……"。',
        examples: [{ jp: '電車で行きます。', reading: 'でんしゃでいきます。', zh: '坐电车去。' }],
        linkedStarNodeIds: ['p-de'],
      },
      {
        id: 'l5-g3',
        title: '～ませんか（邀请） / ～ましょう（提议）',
        explanation: '「～ませんか」是委婉的邀请，把选择权留给对方；「～ましょう」语气更主动，带有"一起做吧"的假定。',
        examples: [
          { jp: '一緒に映画を見に行きませんか。', reading: 'いっしょにえいがをみにいきませんか。', zh: '要不要一起去看电影？' },
          { jp: 'はい、行きましょう。', reading: 'はい、いきましょう。', zh: '好，一起去吧。' },
        ],
      },
      {
        id: 'l5-g4',
        title: 'いつ／だれと／何で（疑问词组合）',
        explanation: '用「いつ」问时间、「だれと」问同伴、「何で」问交通工具或方式，组合起来可以问出完整的行动细节。',
        examples: [{ jp: 'だれと行きますか。', reading: 'だれといきますか。', zh: '和谁一起去？' }],
      },
    ],
    notes: [
      {
        id: 'l5-n1',
        title: '「歩いて」不是「歩くで」',
        content: '"步行"要用て形「歩いて」表示手段，而不是名词+で的结构，这是初学者常犯的类推错误——记住"歩いて"是固定搭配。',
      },
      {
        id: 'l5-n2',
        title: 'へ 和 に 现阶段可以互换',
        content: '这一课的へ只表示"方向"，和に的方向用法基本通用。但に还有很多へ不能替代的用法（比如时间点、存在场所），后面的课会陆续学到，不要提前把两者完全等同。',
      },
      {
        id: 'l5-n3',
        title: 'ませんか 比 ましょう 更委婉',
        content: '邀请不熟的人或者长辈时优先用「～ませんか」，给对方留拒绝的余地；对关系近的朋友可以直接用「～ましょう」，语气更爽快主动。',
      },
    ],
  },
]

export const lessonByNumber = new Map(lessons.map((l) => [l.number, l]))

export const TOTAL_PLANNED_LESSONS = 50
