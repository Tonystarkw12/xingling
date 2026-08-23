import type { CharacterId, BattleForm } from './CardDatabase';

export interface FormInfo {
  name: string;
  desc: string;
}

export interface SkillInfo {
  name: string;
  desc: string;
  icon: string;
}

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  title: string;
  element: string;
  portraitKey: string;
  alePortraitKey?: string;
  starPortraitKey?: string;
  forms: Record<BattleForm, FormInfo>;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  skills: SkillInfo[];
  backstory: string;
}

export const CHARACTER_PROFILES: CharacterProfile[] = [
  {
    id: 'ampere',
    name: '安培尔',
    title: '电磁星灵',
    element: '电磁系',
    portraitKey: 'char_ampere',
    alePortraitKey: 'char_ampere_ale',
    starPortraitKey: 'char_ampere_star',
    forms: {
      BSE: {
        name: 'BSE · 基础形态',
        desc: '稳定的基础战斗形态。攻防均衡，无额外消耗。适合持久战和应对不确定局面。',
      },
      ALE: {
        name: 'ALE · 过载形态',
        desc: '释放电磁权能的极限形态。伤害提升50%，攻击积累星化能量。代价是每回合失去5点生命。',
      },
      STAR: {
        name: '星化 · 终极形态',
        desc: '星化能量满后解锁的终极形态。持续3回合，期间伤害翻倍、免疫一切伤害。3回合后生命归零。',
      },
    },
    stats: {
      hp: 60,
      attack: 6,
      defense: 5,
      speed: 7,
    },
    skills: [
      { name: '打击', desc: '造成6点伤害。基础攻击。', icon: '⚔' },
      { name: '重击', desc: '造成12点伤害。消耗2点能量。', icon: '✹' },
      { name: '电磁弹', desc: '造成8点伤害。安培尔的电磁权能，1回合冷却。', icon: 'ϟ' },
      { name: '防御', desc: '获得5点格挡。', icon: '🛡' },
      { name: '蓄力', desc: '获得1点能量，抽1张牌。2回合冷却。', icon: '✦' },
    ],
    backstory: '星灵纪元最出色的电磁系星灵之一。自幼被收养，对自己的身世一无所知。为了寻找亲生母亲和传说中的星之键，她接受了诺克城的调查任务。性格自信而略带傲气，但内心深处渴望找到属于自己的归属。',
  },
  {
    id: 'iris',
    name: '艾莉丝',
    title: '冰晶星灵',
    element: '冰霜系',
    portraitKey: 'char_iris',
    forms: {
      BSE: {
        name: 'BSE · 冰霜形态',
        desc: '平衡的支援形态。冰晶矛攻击敌人，冰晶屏障保护队友，寒息复苏治疗伤势。控制与支援兼备。',
      },
      ALE: {
        name: 'ALE · 极冰形态',
        desc: '进攻型支援形态。极冰长枪造成高额伤害并削弱敌人，冰封领域对全体敌人施加易伤。代价是失去部分治疗能力。',
      },
      STAR: {
        name: '星化 · 极光形态',
        desc: '终极支援形态。极光守护为全体队友提供大量格挡，星霜圣疗回复全队生命，星霜裁决制裁敌人。持续3回合后生命归零。',
      },
    },
    stats: {
      hp: 52,
      attack: 7,
      defense: 4,
      speed: 6,
    },
    skills: [
      { name: '冰晶矛', desc: '造成7点冰霜伤害。', icon: '❄' },
      { name: '绝对零度', desc: '对全体敌人造成8点伤害。2回合冷却。', icon: '✣' },
      { name: '冰晶屏障', desc: '指定队友获得8点格挡。1回合冷却。', icon: '◇' },
      { name: '寒息复苏', desc: '指定队友恢复6点生命。2回合冷却。', icon: '✚' },
    ],
    backstory: '安培尔的搭档与好友，年轻的冰霜系星灵。性格开朗活泼，总是跟在安培尔身后。虽然看似天真，但她也有自己放不下的过去。冰霜权能让她成为出色的支援型星灵。',
  },
];

export function getCharacterProfile(id: CharacterId): CharacterProfile | undefined {
  return CHARACTER_PROFILES.find((p) => p.id === id);
}
