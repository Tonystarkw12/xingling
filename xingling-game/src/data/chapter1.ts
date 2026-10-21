import { type DialogueEntry } from '../scenes/BaseChapterScene';

/**
 * Chapter 1: 为何而来
 * Voice lines mapped to ArcReel audio files.
 * 台词文本以原著《星灵》第一章为准，并与每个配音文件的实际内容逐句对齐。
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
    text: '“该睡觉了，宝贝。”',
    voiceKey: 'voice_E01S02_00',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '母亲温柔的声音催促着躺在床上扭着身子的孩子。',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '“妈妈，我想听你给我讲个睡前故事，我已经看过很多故事了，我想要一个全新的、精彩的、非凡的、不可思议的故事！”',
    voiceKey: 'voice_E01S02_01',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '她从不知何处取出一本古旧的日记，小心翼翼地翻开陈旧的扉页，缓缓启齿：',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '“这是一个关于星灵的故事……”',
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
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '艾莉丝走到舷窗前，把脸蛋贴在透明的玻璃上，热气在玻璃外表面迅速凝结。',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '哎呀，什么都看不清了。',
    voiceKey: 'voice_E01S04_05',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '那个……我还是有些担心。',
    voiceKey: 'voice_E01S04_06',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '别怕，有我在，这次任务只要找到地底的星之键就好。托尼对星之键的感应历来准确无误，别多想了。',
    voiceKey: 'voice_E01S04_07',
  },

  // ── S05: 降落 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story05' } },
  {
    type: 'text',
    speaker: 'iris',
    text: '可是……这可是卡达列夫的首都诺克城，真的一点问题都没有吗？',
    voiceKey: 'voice_E01S05_08',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '行动越隐秘越好，两个人行动也不会太招摇。我知道你的担忧，但相信我，这任务不会出什么差错。',
    voiceKey: 'voice_E01S05_09',
  },

  // ── S06: 漫步 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story06' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '诺克城素以一片圣洁著称，所有建筑纯白似雪，与漫天风雪浑然一体。',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '好了，下去吧。',
    voiceKey: 'voice_E01S06_10',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '安培尔拉着艾莉丝的手轻轻一拽，两人自高处跳下。安培尔张开白色翅膀稳稳降落在地面。',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '啊！',
    voiceKey: 'voice_E01S06_11',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '被烫到了吧？这里的街道下设有地脉，每个井盖附近都输送地热，为这里的居民提供采暖。别大惊小怪的，快跟上，我们还得去找费德里科。',
    voiceKey: 'voice_E01S06_12',
  },

  // ── S07: 红场 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story07' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '不多时，两人来到了一处广场，正中央立着一座巨大冰雕，那是一位仪态雍容的女子雕像。',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '哇，安姐你快看！这雕像好漂亮！',
    voiceKey: 'voice_E01S07_13',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '那个嘛，便是诺克城红场最著名的冰雕，据说是纪念他们的女王——叶卡捷琳娜·斯卡蒂，也就是大家口中的“冰之女皇”，传说她的权能是绝对零度。',
    voiceKey: 'voice_E01S07_14',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '嘁，不过如此。比起她，我的电磁系权能可实用多了。',
    voiceKey: 'voice_E01S07_15',
  },

  // ── S08-S09: 追问 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story09' } },
  {
    type: 'text',
    speaker: 'iris',
    text: '安姐，执行任务前我能不能问你一个问题？你为什么这么执着于寻找星之键？',
    voiceKey: 'voice_E01S08_16',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '安培尔脚步一顿，神色一沉。',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '对不起，是我太冲动，不该问……',
    voiceKey: 'voice_E01S08_17',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '这不怪你。或许我只是为了一个虚幻的梦吧。到现在我也分不清我执着星之键，是为了某个人，还是为了追寻千年前的一个幻影。可我依旧渴望弄清自己的身世，找到自己的亲生母亲，对我而言，那是一种释怀。当然，更现实些——我的工资真的很高。',
    voiceKey: 'voice_E01S08_18',
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
    text: '你呢？没有什么放不下的执念、非见不可的人、或非得拿到的东西吗？',
    voiceKey: 'voice_E01S09_19',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '艾莉丝看着漫天雪花纷飞，似乎想起了某段往事，眼眶略显通红。',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '我……我想见一个人，可我明白自己再也见不到他了。',
    voiceKey: 'voice_E01S09_20',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '万一哪天圣星冠真能复活他也说不定呢，毕竟是传说中能够实现任何愿望的神器嘛。',
    voiceKey: 'voice_E01S09_21',
  },
  { type: 'wait', duration: 800 },

  // ── S11: 街头冲突 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story11' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '艾莉丝一时走神，撞上一个膀大腰圆的安吉拉汉子，厚实的棉衣顿时散开，露出了一条卡普拉一族特有的心形尖尾巴。',
  },
  {
    type: 'text',
    speaker: '安吉拉大汉',
    text: '哪来的卡普拉？没长眼吗！',
    voiceKey: 'voice_E01S11_22',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '对、对不起，我听不懂这边的语言……',
    voiceKey: 'voice_E01S11_23',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '跟他道什么歉？还有你们，看什么看！',
    voiceKey: 'voice_E01S11_24',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '安培尔霎时抽出腰间的灵武“雷影”，紫色电光在周身流转，吓得围观者纷纷退让。',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '安姐，这里人多眼杂，你怎么能拔灵武呢？万一被执行官卫队盯上……？',
    voiceKey: 'voice_E01S12_25',
  },
  {
    type: 'text',
    speaker: 'ampere',
    text: '没事，只要不真动手，他们不会大动干戈的。就算真被通缉，我也有法子脱身。你还是先把尾巴藏好吧。自从第一次圣皇战争后，特姆佩斯当年犯下的罪行让卡普拉族在很多地方名声都不好，虽然时代变了，但人心难改。',
    voiceKey: 'voice_E01S12_26',
  },

  // ── S12: 彼得 ──
  { type: 'character', action: 'exit', characterId: 'iris' },
  { type: 'character', action: 'exit', characterId: 'ampere' },
  { type: 'wait', duration: 500 },
  { type: 'event', action: 'set_background', data: { key: 'bg_story12' } },
  {
    type: 'text',
    speaker: 'narrator',
    text: '走过街角，两人瞥见一个衣衫褴褛的老头蜷缩在墙边。老头突然伸手抓住了安培尔的手腕，像是在她脸上寻找什么。',
  },
  { type: 'character', action: 'enter', characterId: 'peter', position: 'center' },
  // 以下三句共用同一段配音（voice_E01S13_27，约 42 秒）
  {
    type: 'text',
    speaker: 'peter',
    text: '哦——原来如此，你是她的女儿吧？没错没错，当初见到你时，你还那么小，我还抱过你呢。安培尔，对吧？这些年过去了多少岁月？',
    voiceKey: 'voice_E01S13_27',
  },
  {
    type: 'text',
    speaker: 'peter',
    text: '自打人类时代结束后，我这把老骨头早已跟不上你们星灵的脚步。曾经的伙伴们物是人非，过于漫长的寿命让我们彻底忘却死亡，也迷失了自我。',
  },
  {
    type: 'text',
    speaker: 'peter',
    text: '我呀，是个懦夫，既没能阻止老友的错行，也没能保护我挚爱之人，如今沦落至此正是自作自受。',
  },

  // ── S13: 造化弄人 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story13' } },
  {
    type: 'text',
    speaker: 'ampere',
    text: '你说什么？你怎么会知道我的名字？',
    voiceKey: 'voice_E01S14_28',
  },
  {
    type: 'text',
    speaker: 'iris',
    text: '安姐，别理这个疯老头，我们快走吧。',
    voiceKey: 'voice_E01S14_29',
  },
  {
    type: 'text',
    speaker: 'peter',
    text: '造化弄人哪。若能看见你健康成长，你母亲一定会欣慰不已……',
    voiceKey: 'voice_E01S14_30',
  },
  { type: 'character', action: 'exit', characterId: 'peter' },
  { type: 'wait', duration: 600 },
  {
    type: 'text',
    speaker: 'narrator',
    text: '再回头，人却不见了。',
  },

  // ── S14: 尾声 ──
  { type: 'event', action: 'set_background', data: { key: 'bg_story14' } },
  { type: 'character', action: 'enter', characterId: 'iris', position: 'left' },
  { type: 'character', action: 'enter', characterId: 'ampere', position: 'right' },
  {
    type: 'text',
    speaker: 'iris',
    text: '安姐，你……怎么哭了？',
    voiceKey: 'voice_E01S14_31',
  },
  {
    type: 'text',
    speaker: 'narrator',
    text: '安培尔这才意识到，两行泪珠已然滑下脸颊，在凛冽寒风中凝成冰痕。',
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
