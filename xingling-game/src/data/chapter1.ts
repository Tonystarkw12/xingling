import { type DialogueEntry } from '../scenes/BaseChapterScene';

/**
 * Chapter 1: 为何而来
 * Voice lines mapped to ArcReel audio files
 */
export const chapter1Dialogues: DialogueEntry[] = [
  // ── S01: Prologue ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story01' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '多年后凯奥斯穿越时空回到千年前第一次圣皇战争时期，当他拉住命悬一线的安培尔的手时，准会想起最初的时候安培尔向自己伸出的那只手，那是一切的开端，指尖所触碰到的温暖是记忆中的第一个光点。',
    voiceKey: 'voice_E01S01_silent',
  },
  { type: 'wait', duration: 800 },

  // ── S02: 母亲的睡前故事 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story02' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '"该睡觉了，宝贝。"母亲温柔的声音催促着躺在床上扭着身子的孩子。',
    voiceKey: 'voice_E01S02_00',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '"妈妈，我想听你给我讲个睡前故事，我想要一个全新的、精彩的、非凡的、不可思议的故事！"',
    voiceKey: 'voice_E01S02_01',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '她从不知何处取出一本古旧的日记，缓缓启齿："这是一个关于星灵的故事……"',
    voiceKey: 'voice_E01S02_02',
  },

  // ── S03: 标题卡 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story03' } },
  { type: 'wait', duration: 1200 },

  // ── S04: 飞船内 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story04' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '星灵纪元2275年，卡达列夫，诺克城。',
    voiceKey: 'voice_E01S03_silent',
  },
  { type: 'character', action: 'enter', characterId: 'iris', position: 'left' },
  { type: 'character', action: 'enter', characterId: 'ampere', position: 'right' },
  {
    type: 'text',
    speaker: 'iris',
    text: '安姐，你快看啊！从这么高的地方俯瞰，诺克城就像一朵在雪原上盛放的白莲花，巍然耸立在这冰天雪地里。',
    voiceKey: 'voice_E01S04_03',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '怎么？你从未见过下雪吗，看你这副兴奋的模样。',
    voiceKey: 'voice_E01S04_04',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '安培尔莞尔一笑，端起热巧克力轻啜，身后那对修长的白色羽翼也跟着微微颤动。',
    voiceKey: 'voice_E01S04_05',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '哎呀，什么都看不清了。',
    voiceKey: 'voice_E01S04_06',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '艾莉丝把脸蛋贴在舷窗上，热气在玻璃上凝结。她气得撅起小嘴。',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '那个……我还是有些担心。',
    voiceKey: 'voice_E01S04_07',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '别怕，有我在。这次任务只要找到地底的星之键就好。托尼对星之键的感应历来准确无误，别多想了。',
    voiceKey: 'voice_E01S05_08',
  },

  // ── S05: 降落 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story05' } },
  {
    type: 'text',
    speaker: 'iris',
    text: '可是……这可是卡达列夫的首都诺克城，真的一点问题都没有吗？',
    voiceKey: 'voice_E01S05_09',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '行动越隐秘越好，两个人行动也不会太招摇。相信我，这任务不会出什么差错。',
    voiceKey: 'voice_E01S06_10',
  },

  // ── S06: 漫步 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story06' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '诺克城素以一片圣洁著称。所有建筑纯白似雪，与漫天风雪浑然一体。',
    voiceKey: 'voice_E01S06_11',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '安培尔张开白色翅膀稳稳降落在地面。',
    voiceKey: 'voice_E01S06_12',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '啊！',
    voiceKey: 'voice_E01S07_13',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '被烫到了吧？这里的街道下设有地脉，输送地热为居民采暖。别大惊小怪的，快跟上。',
    voiceKey: 'voice_E01S07_14',
  },

  // ── S07: 红场 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story07' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '不多时，两人来到了一处广场。正中央立着一座巨大的冰雕。',
    voiceKey: 'voice_E01S07_15',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '哇，安姐你快看！这雕像好漂亮！',
    voiceKey: 'voice_E01S08_16',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '那是诺克城红场最著名的冰雕，纪念"冰之女皇"，传说她的权能是绝对零度。',
    voiceKey: 'voice_E01S08_17',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '嘁，不过如此。比起她，我的电磁系权能可实用多了。',
    voiceKey: 'voice_E01S08_18',
  },

  // ── S08-S09: 追问 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story09' } },
  {
    type: 'text',
    speaker: 'iris',
    text: '安姐，执行任务前我能不能问你一个问题？你为什么这么执着于寻找星之键？',
    voiceKey: 'voice_E01S09_19',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '安培尔脚步一顿，神色一沉。',
    voiceKey: 'voice_E01S09_20',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '对不起，是我太冲动，不该问……',
    voiceKey: 'voice_E01S09_21',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '这不怪你。或许我只是为了一个虚幻的梦吧。',
    voiceKey: 'voice_E01S11_22',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '可我依旧渴望弄清自己的身世，找到自己的亲生母亲。',
    voiceKey: 'voice_E01S11_23',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '当然，更现实些——我的工资真的很高。',
    voiceKey: 'voice_E01S11_24',
  },

  // ── S10: 选择 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story10' } },
  {
    type: 'choice',
    id: 'empathy_choice',
    prompt: '看着安培尔的神情，你想说什么？',
    options: [
      { text: '「安姐，我一定会帮你找到答案的。」' },
      { text: '「……其实我也一样，有放不下的人。」' },
      { text: '（默默跟在身后，什么都不说）' },
    ],
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '你呢？没有什么放不下的执念吗？',
    voiceKey: 'voice_E01S12_25',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '艾莉丝看着漫天雪花纷飞，似乎想起了某段往事。',
    voiceKey: 'voice_E01S12_26',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '……有的。只是不知道还来不来得及。',
    voiceKey: 'voice_E01S13_27',
  },
  { type: 'wait', duration: 1000 },

  // ── S11-S12: 彼得 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story11' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '雪花纷飞中，街头突然传来骚动。',
    voiceKey: 'voice_E01S14_28',
  },
  { type: 'character', action: 'exit', characterId: 'iris' },
  { type: 'character', action: 'exit', characterId: 'ampere' },
  { type: 'wait', duration: 500 },

  { type: 'event', action: 'set_background', data: { key: 'bg_story12' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '一个衣衫褴褛的神秘老者突然出现。',
    voiceKey: 'voice_E01S14_29',
  },
  { type: 'character', action: 'enter', characterId: 'peter', position: 'center' },
  {
    type: 'text',
    speaker: 'peter',
    text: '安培尔……你可知道，你寻找的星之键，与你自身的命运紧密相连。',
    voiceKey: 'voice_E01S14_30',
  },

  // ── S13: 揭秘 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story13' } },
  {
    type: 'text',
    speaker: 'peter',
    text: '千年前的第一次圣皇战争中，有一个孩子被托付给了未来。那个孩子……就是你。',
    voiceKey: 'voice_E01S14_31',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '安培尔的瞳孔骤然收缩。',
  },

  // ── S14: 尾声 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story14' } },
  { type: 'character', action: 'exit', characterId: 'peter' },
  { type: 'wait', duration: 800 },
  {
    type: 'text',
    speaker: 'narrator',
    text: '老者化作星光消散在风雪中。泪水从安培尔的眼角滑落。',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '前方等待她们的，是改变命运的邂逅。',
  },
  { type: 'wait', duration: 1500 },
  {
    type: 'text',
    speaker: 'narrator',
    text: '—— 第一章 · 完 ——',
  },
];
