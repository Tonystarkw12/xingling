import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Flame, Skull, Shield, Heart, Star, Zap, Flag } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  volume: number;
  icon: string;
  category: 'war' | 'discovery' | 'personal' | 'political' | 'tragedy' | 'hope';
}

const timelineData: TimelineEvent[] = [
  // === 远古时代 ===
  {
    year: '远古时代',
    title: '宇宙起源',
    description: '宇宙始于虚无，虚数空间逐渐投射出实轴的影像。熵增成为万物的根源，宇宙大爆炸的根本推动力源自虚数空间中的奇点能量。每一条可能的现实道路，尽头都是一位温柔而孤独的存在。',
    volume: 1,
    icon: 'star',
    category: 'discovery',
  },
  {
    year: '远古时代',
    title: '星灵文明诞生',
    description: '星灵文明在拉提麦尔星系中兴起，形成了四大种族：安吉拉（羽翼天使）、卡普拉（心形尾巴）、泰坦（体型巨大）、精灵（尖耳神秘）。星灵拥有"权能"——通过星核运转奇点能量的特殊能力。',
    volume: 1,
    icon: 'sparkles',
    category: 'discovery',
  },
  {
    year: '远古时代',
    title: '天命审判庭建立',
    description: '"天命审判庭"成为星灵文明的最高统治机构。"巴别塔计划"三巨头（艾萨克、彼得、娜塔娅）在人类时代携手，试图改变世界。',
    volume: 1,
    icon: 'shield',
    category: 'political',
  },

  // === 第一次圣皇战争 ===
  {
    year: '约1000年前',
    title: '第一次圣皇战争爆发',
    description: '战争起因是紫晶资源的争夺，后因圣星冠的出现而演变成争夺圣星冠的终局之战。各国舰队蜂拥而至，欧米伽级星灵展开激烈冲突。星灵纪元1385年，紫晶资源日益匮乏，国际矛盾加剧，战争规模空前，拉提麦尔星系每个角落都被卷入。',
    volume: 8,
    icon: 'flame',
    category: 'war',
  },
  {
    year: '约1000年前',
    title: '巴别塔计划成员分道扬镳',
    description: '艾萨克、彼得、娜塔娅在第一次圣皇战争中走向对立。彼得成为"天命审判庭"副主席，而艾萨克走上了截然不同的道路。彼得不理解艾萨克的选择，但仍像朋友一样信任他。',
    volume: 1,
    icon: 'heart',
    category: 'tragedy',
  },
  {
    year: '约1000年前',
    title: '圣星冠消失',
    description: '卫星影像显示，星空中突然掀起黑色狂潮，一场毁天灭地的爆炸后，所有参战星灵消失无踪，圣星冠随之失踪。传说圣星冠化作了六把星之键，散落于拉提麦尔星系各处。',
    volume: 1,
    icon: 'star',
    category: 'war',
  },
  {
    year: '约1000年前',
    title: '天命审判庭覆灭',
    description: '星灵文明的统治者"天命审判庭"在第一次圣皇战争的混战中覆灭。',
    volume: 1,
    icon: 'skull',
    category: 'war',
  },
  {
    year: '约1000年前',
    title: '特姆佩斯的罪行',
    description: '特姆佩斯在第一次圣皇战争中犯下罪行，导致卡普拉族在许多地方名声不好，此后长期遭受歧视。吉尔沃夫王子，唯一欧米伽级星灵，亲手带领精锐部队冲入决战包围圈。',
    volume: 1,
    icon: 'skull',
    category: 'war',
  },
  {
    year: '约1000年前',
    title: '艾萨克被封印',
    description: '凯奥斯的前身——艾萨克被封印在由矢量纳米震刚材料制成的石棺中，位于地底最深处。ALE抑制器、液氮循环系统、多重物理限制被设置以防止其苏醒。彼得手动破坏了系统让老朋友继续休眠。',
    volume: 1,
    icon: 'shield',
    category: 'tragedy',
  },
  {
    year: '约1000年前',
    title: '斯托克之死与数字生命',
    description: '斯托克在秋日清晨被星之键"晨曦"撕裂而亡。斯托克工业公司地下第100层的"数字生命计划"将他的记忆、情感与意识数字化，数百年后他以数字化生命形态重新苏醒，誓要向托尼复仇。',
    volume: 12,
    icon: 'zap',
    category: 'discovery',
  },

  // === 战后时代 ===
  {
    year: '战后时代',
    title: '麦克斯特王国建立',
    description: '麦克斯特在塔迪尔星球上建立，拥有"千城之国"美誉。切尔萨特为首都，奥特沃夫为天空之城。路西法·雷恩西斯设计了全部城防系统。',
    volume: 2,
    icon: 'flag',
    category: 'political',
  },
  {
    year: '星灵纪元1210',
    title: '特姆佩斯与瑞贝卡',
    description: '吉尔沃夫王子特姆佩斯与淡蓝色短发少女瑞贝卡在柏比特城相遇。瑞贝卡感染了ALE崩坏病，仍坚持做雇佣兵养活弟弟朗斯特。两人在雨中分离，彼此深爱却无法在一起。',
    volume: 7,
    icon: 'heart',
    category: 'personal',
  },
  {
    year: '星灵纪元1575',
    title: '凤凰计划启动',
    description: '秘密基地中十个培养舱同时运作，"Project Phoenix"激活，目标代码K032被释放。记忆传输过程中发生致命错误，实验体头发从金色变为乌黑，从爆炸的基地中逃离。身后九个培养舱仍在运作，隐藏着惊天秘密。',
    volume: 6,
    icon: 'flame',
    category: 'discovery',
  },
  {
    year: '星灵纪元1903',
    title: '佩托拉公主与森林奇缘',
    description: '莱索米亚王国公主佩托拉在战火纷飞的艾尔登地区生活，心中充满空虚与束缚。她即将出嫁却内心消沉，最终逃离城堡，在森林中踏上寻找自由与真爱的旅途。',
    volume: 6,
    icon: 'heart',
    category: 'personal',
  },
  {
    year: '星灵纪元2000',
    title: 'K的起源——终焉的少女',
    description: '莱索米亚战场上，一名小女孩在爆炸废墟中被"clean"特别行动队队长李所救。她从此以代号"K"生活，在李的严格训练下成长为顶尖雇佣兵。星核受损的她被诊断活不久，但李承诺不让女儿走上自己的路。',
    volume: 10,
    icon: 'skull',
    category: 'tragedy',
  },
  {
    year: '约300年前',
    title: '雷恩西斯加入火凤凰',
    description: '安东尼·雷恩西斯和莉莉娅以爵士身份加入"火凤凰"组织，与戴安策划政变。行动暴露后被残忍处决，死在西斯廷大教堂，被巨大震钢钉穿星核而死。',
    volume: 2,
    icon: 'skull',
    category: 'tragedy',
  },
  {
    year: '约300年前',
    title: '凯伦被收养',
    description: '克莱斯特（化名奥穆尔）隐姓埋名，在工厂做电工抚养凯伦长大。凯伦以为自己是普通矿工，对自己的真实身世一无所知。',
    volume: 2,
    icon: 'heart',
    category: 'personal',
  },

  // === 星灵纪元2275·第一卷 ===
  {
    year: '星灵纪元2275',
    title: '诺克城任务',
    description: '安培尔与艾莉丝伪装成执行官前往卡达列夫诺克城，寻找地底的星之键。在大矿洞遇见矿工领袖费德里科、流浪贵族阿尔基姆和珍妮弗。',
    volume: 1,
    icon: 'sparkles',
    category: 'discovery',
  },
  {
    year: '星灵纪元2275',
    title: '地心之旅',
    description: '安培尔和艾莉丝通过液氮管道深入地心，在石棺中发现了被封印的凯奥斯（艾萨克）。凯奥斯苏醒但失去全部记忆。三人利用石棺作为电磁炮冲出地底。',
    volume: 1,
    icon: 'zap',
    category: 'discovery',
  },
  {
    year: '星灵纪元2275',
    title: '矿脉爆炸',
    description: '执行官卡米拉和研究员德米特里前来调查。执行官小队追击安培尔等人，卡米拉砍断钢缆导致大升降机坠落，引发紫晶矿脉连锁爆炸。',
    volume: 1,
    icon: 'flame',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2275',
    title: '德米特里星逝',
    description: '在矿脉爆炸中，德米特里以肉身替卡米拉挡下致命一击后星逝。卡米拉失去下半身。',
    volume: 1,
    icon: 'skull',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2275',
    title: '彼得的告别',
    description: '在下水道中，彼得认出凯奥斯就是艾萨克，但凯奥斯已失去记忆。彼得身体化作星光消散（星逝），临终前将三人合照缝进凯奥斯的小熊玩偶中。',
    volume: 1,
    icon: 'heart',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2275',
    title: '诺克城大逃亡',
    description: '安培尔、凯奥斯和受伤的艾莉丝在诺克城街道上与执行官展开摩托追逐，最终被下水道中的彼得所救。',
    volume: 1,
    icon: 'zap',
    category: 'personal',
  },
  {
    year: '星灵纪元2275',
    title: '星穹之旅',
    description: '安培尔等人乘坐飞船"露娜"号离开卡达列夫，前往纽斯比特提雅顿托尼的私家别墅。托尼揭示了星之键与圣星冠的真相，以及自己寻找六把星之键的目标。',
    volume: 1,
    icon: 'star',
    category: 'discovery',
  },

  // === 星灵纪元2285·第二卷 ===
  {
    year: '星灵纪元2285',
    title: '寻找第三把星之键·天火',
    description: '十年后，凯奥斯担任安兹华德公司暗部特别行动队队长，与安培尔、艾莉丝、苏尔特尔等人乘坐飞船前往麦克斯特，寻找第三把星之键"天火"。',
    volume: 2,
    icon: 'sparkles',
    category: 'discovery',
  },
  {
    year: '星灵纪元2285',
    title: '麦克斯特入境',
    description: '安培尔团队通过A4E9军事检查站进入麦克斯特。凯奥斯用十万纽斯金贿赂凯迪亚思长官放行。团队伪装为安兹华德公司药物运输队。',
    volume: 2,
    icon: 'shield',
    category: 'personal',
  },
  {
    year: '星灵纪元2285',
    title: '普雷斯顿事件',
    description: '凯伦在普雷斯顿超市遭遇抢劫，左臂被烧毁。审判官凯瑟琳带队调查，黑影敌人袭击审判官小队。凯伦被格蕾雅带到地下火凤凰组织。',
    volume: 2,
    icon: 'flame',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2285',
    title: '凯伦身世揭晓',
    description: '戴安向凯伦揭示真相：他是路西法·雷恩西斯家族第四代继承人，父亲安东尼和母亲莉莉娅为火凤凰牺牲。凯伦拥有破解奥特沃夫城防系统的秘密。',
    volume: 2,
    icon: 'sparkles',
    category: 'discovery',
  },
  {
    year: '星灵纪元2285',
    title: '凯伦加入火凤凰',
    description: '凯伦在得知身世后决定加入火凤凰组织。克莱斯特（奥穆尔）最终选择与戴安合作。"黑蜂"计划正式启动。',
    volume: 2,
    icon: 'flag',
    category: 'hope',
  },
  {
    year: '星灵纪元2285',
    title: '中央会议宣战',
    description: '麦克斯特中央会议上，贵族们主张对柯祖尔宣战。莱茵部长反对但被孤立，女王最终同意宣战。麦克斯特进入战时状态。',
    volume: 2,
    icon: 'flame',
    category: 'political',
  },
  {
    year: '星灵纪元2285',
    title: '圣奥顿塔被毁',
    description: '火凤凰组织摧毁圣奥顿塔，数十名审判官阵亡。奥利弗队长在城防炮击中牺牲。反叛军主力被困在"蛋壳"护罩外。',
    volume: 2,
    icon: 'flame',
    category: 'war',
  },
  {
    year: '星灵纪元2285',
    title: '黑蜂计划成功',
    description: '凯伦将手放到蛋壳外壁上，哈尔西系统检测到雷恩西斯血脉后停止攻击并自动关闭。城防护罩和所有战斗系统纷纷离线。',
    volume: 2,
    icon: 'zap',
    category: 'hope',
  },

  // === 星灵纪元2290·第三卷 ===
  {
    year: '星灵纪元2290',
    title: '靶向药物发布',
    description: '安哲拉在提雅顿城发布革命性药物"5号髓质"，声称能治愈ALE崩坏病。在感染者社区免费投放，实则为"星链计划"的临床试验，背后涉及纽斯比特政府与军方的秘密交易。',
    volume: 3,
    icon: 'shield',
    category: 'political',
  },
  {
    year: '星灵纪元2290',
    title: '实验体1099——安吉丽娜',
    description: '安兹华德公司林肯实验室进行惨无人道的人体实验，精灵族实验体1099被植入ALE力场转移回路。警官阿比盖尔发现真相后潜入实验室试图解救，遭安东尼杀害。女孩坠落时恰好砸在凯奥斯身上。',
    volume: 3,
    icon: 'skull',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2290',
    title: '彼岸天堂之战',
    description: '凯奥斯带安吉丽娜在游乐园躲避追兵。安吉丽娜权能失控，险些杀死凯奥斯。巴尔和瓦加特带队前来抓捕，苏尔特尔姗姗赶到。最终安吉丽娜被带走，凯奥斯认为使命到此结束。',
    volume: 3,
    icon: 'flame',
    category: 'war',
  },
  {
    year: '星灵纪元2290',
    title: '报社大楼屠杀',
    description: '阿加雷斯袭击《提雅顿时报》报社，屠杀职员，毁掉所有证据。诺埃尔被迫成为其"新使命"的工具。灾难控制部门被一并消灭。',
    volume: 3,
    icon: 'skull',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2290',
    title: '托尼夺回公司',
    description: '托尼得知安东尼趁其在艾尔登地区出差时企图夺权，迅速行动重新掌控安兹华德公司。公司创始人格洛丽娅的心血不容染指。',
    volume: 3,
    icon: 'flag',
    category: 'political',
  },

  // === 星灵纪元2293·第四卷 ===
  {
    year: '星灵纪元2293',
    title: '圣诞节的温暖',
    description: '十二月的提雅顿城飘雪，安培尔、艾莉丝和凯奥斯在公寓共度圣诞。凯奥斯脑中闪过苏尔特尔的身影——远方苏尔特尔与女儿共度节日，莉娅一家四口其乐融融。安东尼独自走在街上，回忆与安哲拉曾经的梦想。',
    volume: 4,
    icon: 'heart',
    category: 'personal',
  },
  {
    year: '星灵纪元2293',
    title: '极寒之地——谢尔利奇',
    description: '凯奥斯一行前往卡达列夫阿德尔星寻找星之键"冰霜"。"露娜"号被极端暴风雪击落，迫降在零下十度的千年冻土。远方狙击炮台上，一位娇小少女已瞄准了这艘战舰。',
    volume: 4,
    icon: 'snow',
    category: 'discovery',
  },
  {
    year: '星灵纪元2293',
    title: '冰雪消融',
    description: '在极寒基地中，凯奥斯一行与神秘少女展开交锋与和解。冰雪主题的战斗与情感交织，最终星之键"冰霜"被成功获取。',
    volume: 4,
    icon: 'star',
    category: 'hope',
  },

  // === 星灵纪元2295·第五卷 ===
  {
    year: '星灵纪元2295',
    title: '水族馆的约会',
    description: '艾莉丝牵着埃琳娜的手漫步于卡博雷水族馆，透过玻璃幕墙观赏缤纷珊瑚与海洋生物。两人关系亲密无间，艾莉丝用马卡龙饼干和调皮逗乐驱散了埃琳娜对已故父母的悲伤。',
    volume: 5,
    icon: 'heart',
    category: 'personal',
  },
  {
    year: '星灵纪元2295',
    title: '灯光秀与星空下的叹息',
    description: '夜幕下游轮甲板，无人机灯光秀与烟花绽放。艾莉丝模仿泰坦尼克号经典场景将埃琳娜举起。两人谈及世界的残酷与圣星冠的愿望，凯奥斯所说的"泛·社会性熵增"——初衷越美好结局越残酷。',
    volume: 5,
    icon: 'star',
    category: 'personal',
  },
  {
    year: '星灵纪元2295',
    title: '彼此的手',
    description: '艾莉丝与埃琳娜在彼此的陪伴中找到家的感觉。两人经历了甜蜜与悲伤的交织，最终确认了彼此的心意。安培尔与凯奥斯的感情也在这场旅途中得到了升华。',
    volume: 5,
    icon: 'heart',
    category: 'hope',
  },

  // === 星灵纪元2295·第六卷 ===
  {
    year: '星灵纪元2295',
    title: '精灵族的婚礼',
    description: '佩托拉公主与托尼的爱情故事开花结果。从莱索米亚的逃亡到精灵族的祝福，两人经历重重考验后举办婚礼。森林奇缘的主题贯穿始终——真爱与自由的颂歌。',
    volume: 6,
    icon: 'heart',
    category: 'hope',
  },
  {
    year: '星灵纪元2295',
    title: '星之键的发现',
    description: '在精灵族的神圣森林中，又一把星之键被发现。集齐的星之键越多，圣星冠的真相也越近一步。然而每把星之键都承载着不同的记忆与情感。',
    volume: 6,
    icon: 'sparkles',
    category: 'discovery',
  },

  // === 星灵纪元2296·第七卷 ===
  {
    year: '星灵纪元2296',
    title: '吉尔沃夫的雨',
    description: '淡蓝色短发少女瑞贝卡在雨中拜访弟弟朗斯特，肩上的紫黑斑纹暴露了ALE崩坏病的感染。姐弟彼此深爱却无法表达，门内门外各自泪流。瑞贝卡接下了危险任务。',
    volume: 7,
    icon: 'skull',
    category: 'tragedy',
  },
  {
    year: '星灵纪元1210-1385',
    title: '特姆佩斯的过去',
    description: '吉尔沃夫王子特姆佩斯——冷漠孤僻的王子，脖子上佩戴母亲留下的金项链。他在街头被发现，身份不明。在皇家学院被视为怪胎，内心渴望关怀与爱。与塞西莉娅和瑞贝卡的感情纠葛。',
    volume: 7,
    icon: 'heart',
    category: 'personal',
  },
  {
    year: '星灵纪元2296',
    title: '安培尔与凯奥斯的裂痕',
    description: '凯奥斯逐渐发现自己可能是"杀母仇人"的身份，安培尔内心的动摇与痛苦。多年积累的信任开始崩塌，两人之间那道不可见的屏障变得越来越明显。',
    volume: 7,
    icon: 'skull',
    category: 'tragedy',
  },

  // === 星灵纪元2296·第八卷 ===
  {
    year: '星灵纪元1385-1618',
    title: '第一次圣皇战争全貌',
    description: '紫晶资源匮乏的国际大背景下，第一次圣皇战争全面爆发。特姆佩斯作为唯一欧米伽级星灵带领精锐部队冲入决战。围绕天命审判庭核心区域的激烈争夺，各国舰队逼近核心母舰中的圣星冠。',
    volume: 8,
    icon: 'flame',
    category: 'war',
  },
  {
    year: '星灵纪元1618',
    title: '终局之战——圣星冠争夺',
    description: '所有欧米伽级星灵主导的舰队逼近核心母舰。圣星冠——能实现一切愿望的神器——成为所有势力的目标。最终，一场毁天灭地的爆炸后，所有参战星灵消失，圣星冠化作六把星之键散落星系。',
    volume: 8,
    icon: 'star',
    category: 'war',
  },

  // === 星灵纪元2296·第九卷 ===
  {
    year: '星灵纪元2296',
    title: '亚特兰蒂斯暑假',
    description: '凯奥斯一行前往悉比尼亚亚特兰蒂斯——由水晶构成的海上明珠城市。安培尔穿上泳衣暗自紧张，艾莉丝和埃琳娜兴奋地体验海洋。凯奥斯心中隐隐不安。',
    volume: 9,
    icon: 'sparkles',
    category: 'personal',
  },
  {
    year: '星灵纪元2296',
    title: '拉莱耶宫殿的秘密',
    description: '亚特兰蒂斯海底的拉莱耶宫殿隐藏着古老的秘密。海洋之子的传说与星之键的线索交织，波涛汹涌之下暗流涌动。',
    volume: 9,
    icon: 'zap',
    category: 'discovery',
  },
  {
    year: '星灵纪元2296',
    title: '惊涛骇浪',
    description: '海洋中的战斗与情感高潮。敬畏与恐惧的交织中，每个人都在寻找心中的英雄。安培尔与凯奥斯的关系面临最终考验。',
    volume: 9,
    icon: 'flame',
    category: 'war',
  },

  // === 星灵纪元2296·第十卷 ===
  {
    year: '星灵纪元2296',
    title: 'K的往事',
    description: '深入揭示K的过去——原名库艾艾的战争孤儿，被"clean"队李所救。在军营中成长，星核受损被诊断活不久。李承诺不让亡友崔斯特失望，不让K走上自己的路。",K"成为她新的名字。',
    volume: 10,
    icon: 'heart',
    category: 'personal',
  },
  {
    year: '星灵纪元2296',
    title: '达斯米安与K',
    description: 'K与达斯米安相识相恋的故事。K为达斯米安办了两回葬礼——第一次从卡提雅监狱被救出，第二次是真正的永别。这份感情成为K心中最深的伤痛与力量来源。',
    volume: 10,
    icon: 'skull',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2296',
    title: '托尼的真相',
    description: '托尼的真实身份与目的逐渐揭晓。他与格洛丽娅的关系、他对星之键的执着——一切源于近千年前第一次圣皇战争中失去的一切。',
    volume: 10,
    icon: 'sparkles',
    category: 'discovery',
  },

  // === 星灵纪元2296·第十一卷 ===
  {
    year: '星灵纪元2296',
    title: '卡契拉组织的危机',
    description: '"卡契拉"组织的核心——叶琳娜被纽斯比特特工窃取。叶琳娜掌握着将灵武与星灵相融合的关键技术。塔莉娅召集雅典娜和摩尔，计划潜入安兹华德总部夺回叶琳娜。',
    volume: 11,
    icon: 'shield',
    category: 'political',
  },
  {
    year: '星灵纪元2296',
    title: '群英荟萃',
    description: '各方势力在提雅顿汇聚。安兹华德公司、卡契拉组织、托尼的王牌小队——所有线索交织在一起。星之键的归属成为各方争夺的焦点。',
    volume: 11,
    icon: 'flame',
    category: 'war',
  },
  {
    year: '星灵纪元2296',
    title: '星之键的抉择',
    description: '面对多方势力的争夺，凯奥斯一行必须做出选择——是继续追寻星之键，还是放下这份执念。属于彼此的契约在这一刻被重新定义。',
    volume: 11,
    icon: 'star',
    category: 'hope',
  },

  // === 星灵纪元2300·第十二卷 ===
  {
    year: '星灵纪元2300',
    title: '天堂边境',
    description: 'K一行在卡提雅地下与自称菲尔德的老头同行，前往传说中的"天堂边境"。机械之城的下水道中流淌着不为人知的秘密。',
    volume: 12,
    icon: 'sparkles',
    category: 'discovery',
  },
  {
    year: '星灵纪元2300',
    title: '模仿者机甲与世界之翼',
    description: '模仿者机甲的出现揭示了一个更深层的阴谋。世界之翼的背后隐藏着跨越千年的计划。艾萨克的记忆碎片开始回归凯奥斯的身体。',
    volume: 12,
    icon: 'zap',
    category: 'discovery',
  },
  {
    year: '星灵纪元2300',
    title: '出于爱的背叛',
    description: '团队内部的信任被打破，出于爱的背叛比出于恨的伤害更加致命。凯奥斯面对安培尔离去的事实，心中的裂痕不断扩大。',
    volume: 12,
    icon: 'skull',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2300',
    title: '仇恨与忘却的花海',
    description: '在仇恨与忘却之间，凯奥斯必须做出选择。过去的梦魇纠缠着现在的每一刻，勇敢的心能否承受真相的重量？',
    volume: 12,
    icon: 'heart',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2300',
    title: '夕阳下的诀别',
    description: '安培尔最终离开团队。夕阳下，两人最后的对视中包含了太多无法言说的情感。凯奥斯独自站在黄昏中，身后是长长的影子。',
    volume: 12,
    icon: 'skull',
    category: 'tragedy',
  },

  // === 第十三卷 ===
  {
    year: '星灵纪元2300',
    title: '超算空间——自我的质问',
    description: '凯奥斯陷入超算空间，千百面镜子中的自我不断质问："人，为什么活着？"他渴望母爱般的无条件庇护，却又憎恶这样的自己。安培尔眼中的他勇敢正义，但他自己眼中的自己可悲弱小。',
    volume: 13,
    icon: 'heart',
    category: 'personal',
  },
  {
    year: '星灵纪元2300',
    title: '虚数星神',
    description: '虚数空间深处，卡拉赞达尔摇晃着无数闪烁星光的翅膀。祂见证着凯奥斯的旅途，见证着每一个星灵的命运。虚数星神的本质——宇宙的根本推动力。',
    volume: 13,
    icon: 'star',
    category: 'discovery',
  },
  {
    year: '星灵纪元2300',
    title: '世界真相揭露',
    description: '艾萨克的计划全貌被揭开——12403次轮回，只为创造一个所有人获得幸福的世界。"永恒的摇篮"是最终方案，但代价是牺牲所有星灵的自由意志。',
    volume: 13,
    icon: 'sparkles',
    category: 'discovery',
  },
  {
    year: '星灵纪元2300',
    title: '真正的星之键',
    description: '第六把星之键现世。所有星之键的真正意义被揭示——它们不是武器，而是记忆与情感的载体。集齐六把星之键便能召唤圣星冠。',
    volume: 13,
    icon: 'star',
    category: 'hope',
  },

  // === 第十四卷 ===
  {
    year: '星灵纪元2301',
    title: '久别重逢——安培尔与路易斯',
    description: '安培尔在麦克斯特与儿时玩伴路易斯重逢。上百年未见的两人紧紧相拥。路易斯这些年一直通过寻找娜塔娅的协会来寻找安培尔的下落。',
    volume: 14,
    icon: 'heart',
    category: 'hope',
  },
  {
    year: '星灵纪元2301',
    title: '小熊玩偶的秘密',
    description: '凯奥斯随身携带的破旧小熊玩偶——灼烧痕迹下的刺绣文字——最终揭示了其真正的意义。那是彼得临终前悄悄缝入的三人合照，也是艾萨克记忆的最后锚点。',
    volume: 14,
    icon: 'heart',
    category: 'personal',
  },
  {
    year: '星灵纪元2301',
    title: '六把星之键齐聚',
    description: '六把星之键终于全部集齐。星之键·晨曦、星之键·冰霜、星之键·天火……每一把都承载着一段记忆、一份情感。圣星冠的召唤仪式即将开始。',
    volume: 14,
    icon: 'star',
    category: 'hope',
  },

  // === 第十五卷 ===
  {
    year: '星灵纪元2301',
    title: '终焉降临',
    description: '黑色雾气从凯奥斯体内升腾，ALE力场强度超出量程极限。艾萨克的意识在凯奥斯身体中完全苏醒。"星化"形态释放，黑色流体聚拢成权杖与披风，古老的虚数星神形态重现世间。',
    volume: 15,
    icon: 'skull',
    category: 'war',
  },
  {
    year: '星灵纪元2301',
    title: '记忆尽头',
    description: '凯奥斯的记忆如潮水般回归。愤怒、悲伤、痛苦、迷茫、后悔与孤独——千年前的情感与现在交织。他看到了自己作为艾萨克时的一切。',
    volume: 15,
    icon: 'heart',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2301',
    title: '孤勇者们',
    description: '面对艾萨克的黑色巨物，各国放下嫌隙签署和平协议。"欧米伽星灵权能管控法案"通过，统一联盟军队组建。詹姆士指挥舰队出击，但母舰瞬间被毁。',
    volume: 15,
    icon: 'flame',
    category: 'war',
  },
  {
    year: '星灵纪元2301',
    title: '创世之雨',
    description: '欧米伽级星灵格拉维奇施展"星化：创世之雨"，行星星环被扯向艾萨克。漫天坠落的流星浪漫而壮观，却在接近时被粉碎。单个星灵的全力一击也无法撼动艾萨克分毫。',
    volume: 15,
    icon: 'zap',
    category: 'war',
  },
  {
    year: '星灵纪元2301',
    title: '那一天',
    description: '艾萨克的"绝对熵增"权能全面展开。金色光柱横扫舰队，半数舰队瞬间损伤殆尽。星灵文明面临千年以来最大的生存危机。',
    volume: 15,
    icon: 'skull',
    category: 'war',
  },

  // === 第十六卷 ===
  {
    year: '星灵纪元2301',
    title: '第七把星之键——爱与希望',
    description: '凯奥斯手中的小熊玩偶化作金色巨剑，背后展开光翼——这是最强的第七把星之键："爱与希望"。托尼并肩战斗，两人合力击穿艾萨克的ALE力场防御。',
    volume: 16,
    icon: 'star',
    category: 'hope',
  },
  {
    year: '星灵纪元2301',
    title: '12403次轮回的真相',
    description: '艾萨克为了拯救文明，将世界重置了12403次。每一次都试图创造所有人幸福的未来，但每一次都以失败告终。他是不择手段的英雄，也是至仁至善的魔王。',
    volume: 16,
    icon: 'heart',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2301',
    title: '艾萨克的结局',
    description: '金色巨剑刺穿艾萨克胸膛。他看到的不是剑芒，而是女儿菲奥娜抱着小熊玩偶奔向自己。12403次轮回的记忆在脑海中闪回。"原来ALE崩坏病唯一的解药正是爱与希望！"',
    volume: 16,
    icon: 'skull',
    category: 'tragedy',
  },
  {
    year: '星灵纪元2301',
    title: '永恒的摇篮',
    description: '"永恒的摇篮"被摧毁。艾萨克选择接受死亡，将爱与希望重新注入世界。凯奥斯、托尼、艾萨克三人的记忆与情感融为一体——本我、自我与超我。',
    volume: 16,
    icon: 'star',
    category: 'hope',
  },
  {
    year: '星灵纪元2301',
    title: '再见了，所有的星灵',
    description: '艾萨克孤零零站在空荡的站台中央，列车永远开走了。"人之所以活着，正是为了心中的爱与希望。"凯奥斯、托尼、艾萨克三人消失。故事落幕。',
    volume: 16,
    icon: 'heart',
    category: 'hope',
  },
  {
    year: '战后',
    title: '余波与新生活',
    description: '戴安成为麦克斯特新女王，化解感染者与上层阶级对立。珍妮弗和阿尔基姆婚后甜蜜。凯伦和格蕾雅育有儿子奥穆尔·雷恩西斯。佩托拉生下女儿格洛丽娅，左瞳金色右瞳蓝色。安培尔最终与路易斯喜结连理，生下女儿安吉丽娜。',
    volume: 16,
    icon: 'sparkles',
    category: 'hope',
  },
];

const categoryConfig = {
  war: { color: 'text-red-400', bg: 'bg-red-500', icon: Flame },
  discovery: { color: 'text-nebula-400', bg: 'bg-nebula-500', icon: Sparkles },
  personal: { color: 'text-star-400', bg: 'bg-star-500', icon: Heart },
  political: { color: 'text-amber-400', bg: 'bg-amber-500', icon: Flag },
  tragedy: { color: 'text-gray-400', bg: 'bg-gray-500', icon: Skull },
  hope: { color: 'text-aurora-400', bg: 'bg-aurora-500', icon: Zap },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  sparkles: Sparkles,
  heart: Heart,
  flag: Flag,
  skull: Skull,
  zap: Zap,
  star: Star,
  shield: Shield,
  snow: Sparkles,
};

export function Timeline() {
  // Group events by era
  const eras = [
    { label: '远古时代', events: timelineData.filter((e) => e.year === '远古时代') },
    { label: '第一次圣皇战争（约1000年前）', events: timelineData.filter((e) => e.year === '约1000年前') },
    { label: '战后时代', events: timelineData.filter((e) => e.year === '战后时代' || e.year === '星灵纪元1210' || e.year === '星灵纪元1575' || e.year === '星灵纪元1903' || e.year === '星灵纪元2000') },
    { label: '星灵纪元1210-1385', events: timelineData.filter((e) => e.year === '星灵纪元1210-1385') },
    { label: '星灵纪元1618', events: timelineData.filter((e) => e.year === '星灵纪元1618') },
    { label: '星灵纪元2275 · 第一卷 自行始终', events: timelineData.filter((e) => e.volume === 1) },
    { label: '星灵纪元2285 · 第二卷 风暴突袭', events: timelineData.filter((e) => e.volume === 2) },
    { label: '星灵纪元2290 · 第三卷 靶向药物', events: timelineData.filter((e) => e.volume === 3) },
    { label: '星灵纪元2293 · 第四卷 爱与冰雪', events: timelineData.filter((e) => e.volume === 4) },
    { label: '星灵纪元2295 · 第五卷 家在何方', events: timelineData.filter((e) => e.volume === 5) },
    { label: '星灵纪元2295 · 第六卷 森林奇缘', events: timelineData.filter((e) => e.volume === 6) },
    { label: '星灵纪元2296 · 第七卷 命运之门（上）', events: timelineData.filter((e) => e.volume === 7) },
    { label: '星灵纪元1385-1618 · 第八卷 命运之门（下）', events: timelineData.filter((e) => e.volume === 8) },
    { label: '星灵纪元2296 · 第九卷 暗流涌动', events: timelineData.filter((e) => e.volume === 9) },
    { label: '星灵纪元2296 · 第十卷 往日之影', events: timelineData.filter((e) => e.volume === 10) },
    { label: '星灵纪元2296 · 第十一卷 来势汹汹', events: timelineData.filter((e) => e.volume === 11) },
    { label: '星灵纪元2300 · 第十二卷 分崩离析（上）', events: timelineData.filter((e) => e.volume === 12) },
    { label: '星灵纪元2300 · 第十三卷 分崩离析（下）', events: timelineData.filter((e) => e.volume === 13) },
    { label: '星灵纪元2301 · 第十四卷 久别重逢', events: timelineData.filter((e) => e.volume === 14) },
    { label: '星灵纪元2301 · 第十五卷 长夜孤星（上）', events: timelineData.filter((e) => e.volume === 15) },
    { label: '星灵纪元2301 · 第十六卷 长夜孤星（下）', events: timelineData.filter((e) => e.volume === 16) },
  ];

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 rounded-lg bg-cosmic-700/50 hover:bg-cosmic-600/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">时间线</h1>
          <p className="text-text-secondary text-sm">星灵纪元编年史 — 从宇宙起源到旅途终点</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-8 p-3 rounded-xl bg-cosmic-700/30 border border-cosmic-600/30">
        {Object.entries(categoryConfig).map(([key, { color, bg }]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <div className={`w-2 h-2 rounded-full ${bg}`} />
            <span className={color}>
              {key === 'war' && '战争'}
              {key === 'discovery' && '发现'}
              {key === 'personal' && '个人'}
              {key === 'political' && '政治'}
              {key === 'tragedy' && '悲剧'}
              {key === 'hope' && '希望'}
            </span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mb-8 p-4 rounded-xl bg-cosmic-700/30 border border-cosmic-600/30 text-center">
        <p className="text-text-secondary text-sm">
          跨越 <span className="text-nebula-400 font-bold">16卷</span>，
          收录 <span className="text-aurora-400 font-bold">{timelineData.length}个</span>重大事件，
          时间跨度从 <span className="text-star-400 font-bold">远古时代</span> 到 <span className="text-star-400 font-bold">星灵纪元2301</span>
        </p>
      </div>

      {/* Timeline by Era */}
      {eras.map((era) => (
        era.events.length > 0 && (
          <div key={era.label} className="mb-12">
            <h2 className="text-xl font-bold text-text-accent mb-6 pb-2 border-b border-cosmic-600/30">
              {era.label}
              <span className="ml-2 text-sm text-text-secondary font-normal">({era.events.length}件)</span>
            </h2>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-nebula-500 via-star-500 to-aurora-500" />

              <div className="space-y-6">
                {era.events.map((event, idx) => {
                  const config = categoryConfig[event.category] || categoryConfig.discovery;
                  const IconComponent = iconMap[event.icon] || Sparkles;

                  return (
                    <m.div
                      key={`${event.volume}-${event.year}-${event.title}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex gap-6 relative"
                    >
                      {/* Dot */}
                      <div className="flex-shrink-0 w-12 flex justify-center pt-3">
                        <div className={`w-3 h-3 rounded-full ${config.bg} shadow-lg`} style={{ boxShadow: `0 0 12px currentColor` }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 rounded-xl bg-cosmic-700/30 border border-cosmic-600/30 hover:border-cosmic-500/50 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className={`w-4 h-4 ${config.color}`} />
                          <span className={`text-sm ${config.color} font-medium`}>
                            {event.year}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-cosmic-600/50 text-text-secondary">
                            第{event.volume}卷
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-2">{event.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>
                      </div>
                    </m.div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
}
